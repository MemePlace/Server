const config = require('./config.js');
const express = require('express');
const APIv1 = require('./routes/api.v1');
const app = express();

app.use('/api/v1', APIv1);

const port = config.port || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
