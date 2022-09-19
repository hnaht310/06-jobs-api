const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
// const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../errors'); // since there's an index.js file in the errors folder, it will pull BadRequestError from there -> we don't need to specify index.js file here. Since we use Mongoose to validate the input (name, email, password), we won't use BadRequestError for register
// const bcrypt = require('bcryptjs'); // use this library for password hashing

// StatusCodes.CREATED: 201 code => request has been successfully completed and new resources being created

// create a user in the DB
const register = async (req, res) => {
  // console.log(req.body); // prints { name: 'tpham', email: 'tpham@email.com', password: 'secret' }
  // user is a document (which is an instance of model User)
  const user = await User.create({ ...req.body }); // same as await User.create(req.body) but we use spread operator to create a shallow copy of req.body -> safer?
  // OPTION 1: USING BCRYPT with PRE HOOK in the Schema and use create JWT function from the schema:
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });

  // const token = jwt.sign({ userId: user._id, name: user.name }, 'jwtSecret', {
  //   expiresIn: '30d',
  // });
  // since user is a document (an instance of User model), it inherits the getName function from the schema

  // OPTION 2: using bcrypt directly in the controller instead of using pre hook on the schema
  // const { name, email, password } = req.body;

  // const salt = await bcrypt.genSalt(10); // create a salt using 10 as number of rounds
  // const hashedPassword = await bcrypt.hash(password, salt); // hash the password with the salt we created

  // const tempUser = { name, email, password: hashedPassword }; // {name: name, email: email, password: hashedPassword} => shorthand
  // const user = await User.create({ ...tempUser }); // create a shallow copy of tempUser object
  // res.status(StatusCodes.CREATED).json({ user });

  // NOTE: option 3:
  // // WE CAN DO ERROR CHECKING in the controllers instead of using Mongoose. But in  Mongoose, we already set up the required field in the Schema
  // const { name, email, password } = req.body;
  //const user = await User.create({ ...req.body }); // ...req.body: create a shallow copy of req.body. It's good practice to do so instead of passing the req.body directly to the response
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email, and password');
  // }
};

const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email }); //same as findOne({ email: email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  const match = await user.comparePassword(password);
  if (!match) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  // res.send('login user');
};

module.exports = { register, login };
