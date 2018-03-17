const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Main APIv1 Page');
});

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));

module.exports = router;
