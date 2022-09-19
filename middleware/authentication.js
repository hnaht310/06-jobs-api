const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 'Bearer' without the empty space will work just fine because we're going to split the header anyway
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // DECODE the token with the secret in the .env file
    //  console.log(payload); //{  userId: somenumberhere, name: 'john', iat: 1662983437, exp: 1665575437 }
    // attach user to the job router
    req.user = { userId: payload.userId, name: payload.name };
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
