require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// connect DB
const connectDB = require('./db/connect');
// routers
const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
// mount authRouter and jobRouter to specific paths
app.use('/api/v1/auth', authRouter); // domain/api/v1/auth/register and domain/api/v1/auth/login
app.use('/api/v1/jobs', jobRouter); //domain/api/v1/jobs and domain/api/v1/jobs/id:

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
