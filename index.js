const config = require('./config.js');
const models = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const APIv1 = require('./routes/api/v1');
const app = express();

if (!config.session.secret) {
    throw new Error('You must fill in the session secret in the config')
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    config.session.cookie.secure = true;

    // Defaults ensureOrigin to true
    if (config.ensureOrigin === false) {
        console.error('Warning: Origin checking should not be disabled in production');
    }
    else {
        config.ensureOrigin = true;
    }
}
else {
    config.ensureOrigin = config.ensureOrigin || false;
}

app.use(bodyParser.json());
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({error: 'Invalid request body structure'});
    } else {
        next();
    }
});
app.use((req, res, next) => {
    const origin = req.get('origin');

    if (!origin || (config.allowedOrigins || []).indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    } else if (config.ensureOrigin) {
        res.status(400).json({error: 'Invalid request origin'});
    } else {
        next();
    }
});
app.use(session(config.session));
app.use('/api/v1', APIv1);

const port = config.port || 3000;

// Ensure DB schema
models.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
