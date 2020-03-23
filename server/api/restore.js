const config = require('../config/db');
const express = require('express');
const router = express.Router();
// const mongodbRestore = require('mongodb-restore');
const terminal = require('child_process').exec;
const restore = require('../restoreFunction');

router.post('/', async (q, a) => {
    await restore(q.body.name);
    a.json({ msg: 'Restored Data' });
});

module.exports = router;
