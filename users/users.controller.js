const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const client = require('../_helpers/client');

// routes
router.get('/', authenticate);
router.put('/', authenticateAndUpdate);

module.exports = router;

function authenticate(req, res, next) {
    client.increment('getUser.counter');
    const timer = new Date();
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');


    userService.authenticate({ username, password })
        .then(user => user ? client.timing('getUser.timer', timer).then(res.json(user)) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
function authenticateAndUpdate(req, res, next) {
    const timer = new Date();
    client.increment('updateUser.counter');
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    userService.authenticate({ username, password })
        .then(user => user ? userService.update(req.body, { username }, timer, res) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
