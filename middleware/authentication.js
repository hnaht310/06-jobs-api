const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

// AUTHENTICATE token after login
// This step happens AFTER the user login info is verified, they have a token (like a badge) to use whenever they want to do something (eg: make a request to get some info or to create, delete something, etc). => We need to authenticate the token (check their badge) before allowing the user to do such activities

const auth = async (req, res, next) => {
  // check header: header includes Authorization which has a bearer token(which is issued after user's successfully logged in)
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 'Bearer' without the empty space will work just fine because we're going to split the header anyway
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // DECODE the token with the secret in the .env file? Remember there's a signature part in the token
    //  console.log(payload); //{  userId: somenumberhere, name: 'john', iat: 1662983437, exp: 1665575437 }
    // attach user to the job router
    req.user = { userId: payload.userId, name: payload.name };

    // Some people write code like this to add user to the request. In this case, their token includes an id of a user so that they can find the user by its ID. We don't do it in this project
    // select('-password'): don't include the password in the user variable
    // const user = User.findById({payload.userId}).select('-password');
    // req.user = user;
    next(); // pass it to next middleware
  } catch (error) {
    // error example: token might be expired
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
// NOTE: when we define the schema, we assign createJWT function to the methods object of the schema. It returns jwt.sign() which signs a token with {userId: this._id, name: this.name}
//jwt.sign({ userId: this._id, name: this.name },process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_LIFETIME});

// in the login part we send back the token. Now since we have multiple users and each of them has their own token, we want to check

// 1) whether the token is still valid

// 2) who is the user, since we don't want "peter" to access "john's" jobs.

// AUTHENTICATE token after login
// This step happens AFTER the user login info is verified, they have a token (like a badge) to use whenever they want to do something (eg: make a request to get some info or to create, delete something, etc). => We need to authenticate the token (check their badge) before allowing the user to do such activities
