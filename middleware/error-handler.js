const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later.',
  };
  // we no longer need CustomAPIError here
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  // ValidationError
  if (err.name === 'ValidationError') {
    // console.log(err);
    // console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = 400;
  }
  // Duplicate error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  // Cast error: when the syntax does not match what the schema is looking for
  if (err.name === 'CastError') {
    customError.msg = `No job with id ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

module.exports = errorHandlerMiddleware;

// error returned in Postman if a user uses an email that is already associated with an existing account
// {
//   "err": {
//       "driver": true,
//       "name": "MongoError",
//       "index": 0,
//       "code": 11000,
//       "keyPattern": {
//           "email": 1
//       },
//       "keyValue": {
//           "email": "peter8@email.com"
//       }
//   }
// }

// Validation error looks like this
// {
//   "err": {
//       "errors": {
//           "password": {
//               "name": "ValidatorError",
//               "message": "Please provide password",
//               "properties": {
//                   "message": "Please provide password",
//                   "type": "required",
//                   "path": "password"
//               },
//               "kind": "required",
//               "path": "password"
//           },
//           "email": {
//               "name": "ValidatorError",
//               "message": "Please provide email",
//               "properties": {
//                   "message": "Please provide email",
//                   "type": "required",
//                   "path": "email"
//               },
//               "kind": "required",
//               "path": "email"
//           }
//       },
//       "_message": "User validation failed",
//       "name": "ValidationError",
//       "message": "User validation failed: password: Please provide password, email: Please provide email"
//   }
// }

// Cast error
// {
//   "err": {
//       "stringValue": "\"632937fa7f4556037e7984356\"",
//       "valueType": "string",
//       "kind": "ObjectId",
//       "value": "632937fa7f4556037e7984356",
//       "path": "_id",
//       "reason": {},
//       "name": "CastError",
//       "message": "Cast to ObjectId failed for value \"632937fa7f4556037e7984356\" (type string) at path \"_id\" for model \"Job\""
//   }
// }
