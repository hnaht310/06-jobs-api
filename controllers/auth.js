const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

// StatusCodes.CREATED: 201 code => request has been successfully completed and new resources being created
const register = async (req, res) => {
  const user = await USER.create({ ...req.body });
  console.log(user);
  res.status(StatusCodes.CREATED).json(req.body);
};

const login = async (req, res) => {
  res.send('login user');
};

module.exports = { register, login };
