module.exports = {
    db: {
        dialect: 'sqlite',
        storage: 'db.sqlite',
        database: 'memeplace',
    },
    session: {
        secret: '',
        saveUninitialized: false,
        resave: false,
    },
    bcrypt: {
        saltRounds: 10,
    },
    http: {
        enable: true,
        port: 3000,
    },
    https: {
        enable: false,
        port: 443,
        privateKey: 'key.pem',
        certificate: 'cert.pem',
    },
    allowedOrigins: ['http://localhost:4200', 'http://meme.place'],
    ensureOrigin: false, // Ensure origin is in allowedOrigins
                         // (default DEV false, PROD true)
};
