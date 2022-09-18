const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth');

// this will be mounted at domain/api/v1/auth/ => full path: domain/api/v1/auth/register
router.post('/register', register);
//this will be mounted at domain/api/v1/auth/ => full path: domain/api/v1/auth/login
router.post('/login', login);

// router.route('/register').post(register);
// router.route('/login').post(login);

module.exports = router;
