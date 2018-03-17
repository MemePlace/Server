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
}

app.use(bodyParser.json());
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({error: 'Invalid request body structure'});
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
