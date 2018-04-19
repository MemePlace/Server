const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('./config.js');
const models = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
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
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    } else if (config.ensureOrigin) {
        res.status(400).json({error: 'Invalid request origin'});
    } else {
        next();
    }
});

config.session.store = new SequelizeStore({
    db: models.sequelize,
    disableTouch: true
});

app.use(session(config.session));
app.use('/api/v1', APIv1);

let key, cert;

if (config.https && config.https.enable) {
    key  = fs.readFileSync(config.https.privateKey, 'utf8');
    cert = fs.readFileSync(config.https.certificate, 'utf8');
}

// Ensure DB schema
models.sequelize.sync().then(() => {
    if ((config.http && config.http.enable) || config.port) {
        const port = (config.http && config.http.port) || config.port;

        http.createServer(app).listen(port);
        console.log(`HTTP Server listening on port ${port}`)
    }
    if (config.https && config.https.enable) {
        https.createServer({key, cert}, app).listen(config.https.port);
        console.log(`HTTPS Server listening on port ${config.https.port}`)
    }
});
