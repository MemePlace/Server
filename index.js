const config = require('./config.js');
const models = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const APIv1 = require('./routes/api/v1');
const app = express();

app.use(bodyParser.json());
app.use('/api/v1', APIv1);

const port = config.port || 3000;

// Ensure DB schema
models.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
