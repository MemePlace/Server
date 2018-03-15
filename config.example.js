module.exports = {
    port: 3000,
    db: {
        dialect: 'sqlite',
        storage: 'db.sqlite',
        database: 'memeplace',
    },
    session: {
        secret: '',
        saveUninitialized: true,
        resave: true,
        cookie: {},
    },
};
