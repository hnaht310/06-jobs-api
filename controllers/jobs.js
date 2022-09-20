const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// we can access to req.user because next() was called in authentication.js
// app.use('/api/v1/jobs', authenticateUser, jobRouter); //domain/api/v1/jobs and domain/api/v1/jobs/id:
// read more notes below

const createJob = async (req, res) => {
  // we can access to req.user because next() was called in authentication.js
  // res.send(req.user)
  // console.log(req.user); // { userId: '6328f11bc5225a9d6283c17d', name: 'anna' }
  // console.log(req.body); // { company: 'Google', position: 'intern' }
  req.body.createdBy = req.user.userId; // we have to add createdBy because it's set as required in the User schema
  const job = await Job.create(req.body);
  // console.log(job); // prints:
  //   {
  //     "job": {
  //         "status": "pending",
  //         "_id": "63290e58a7035ed498af96ca",
  //         "company": "Google",
  //         "position": "intern",
  //         "createdBy": "6328f11bc5225a9d6283c17d",
  //         "createdAt": "2022-09-20T00:50:32.158Z", // this is created by timestamps property in the schema
  //         "updatedAt": "2022-09-20T00:50:32.158Z", // this is created by timestamps property in the schema
  //         "__v": 0
  //     }
  // }
  res.status(StatusCodes.CREATED).json({ job });
};

// shorter way to createJob
// const createJob = async (req, res) => {
//   const job = await Job.create({ ...req.body, createdBy: req.user.userId });
//   res.status(StatusCodes.CREATED).json({ job });
// };

// we have to add Authorization to Headers in Postman to get all jobs (We will create a global variable in Postman to get set the token automatically later=> it will then add Authorization to headers automatically). Authorization includes Bearer token => need this to get authenticated before user can make a request to get all jobs
// find all jobs by userId
const getAllJobs = async (req, res) => {
  // after the user is authenticated, user property is added to the request object with user info such as userId and name
  // console.log(req.user); // { userId: '6328f11bc5225a9d6283c17d', name: 'anna' }
  // find jobs by the userId attached in the req.user (this is to make sure the user can only find jobs associated with his userId)
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, counts: jobs.length });
};

const getJob = async (req, res) => {
  res.send('Get a job');
};

const updateJob = async (req, res) => {
  res.send('Update a job');
};

const deleteJob = async (req, res) => {
  res.send('Delete a job');
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };

// NOTE: in the schema, we have a function createJWT which create a token which has info about userId, and username
// UserSchema.methods.createJWT = function () {
//   return jwt.sign(
//     { userId: this._id, name: this.name },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_LIFETIME,
//     }
//   );
// };

// after login then being authenticated, we add USER property to REQUEST object (    req.user = { userId: payload.userId, name: payload.name })

// TO SET TOKEN DYNAMICALLY IN POSTMAN:
// In LOGIN and REGISTER requests, uncheck authorization in the Headers that we set manually before
// click on Tests tab, add the following:
// const jsonData = pm.response.json();
// pm.globals.set("accessToken", jsonData.token);

// In Auth tab, select Bearer Token type then set Token to {{accessToken}} => This will automatically add Authorization to Headers
// For other requests, uncheck authorization in headers then go to Auth tab to set the token to {{accessToken}}
