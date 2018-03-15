module.exports = {
    port: 3000,
    db: {
        dialect: 'sqlite',
        storage: 'db.sqlite',
        database: 'memeplace',
    },
    session: {
        secret: '',
        saveUninitialized: false,
        resave: false
    },
    bcrypt: {
        saltRounds: 10,
    },
};
