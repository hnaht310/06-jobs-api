const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'], // possible values for status
      default: 'pending',
    },
    createdBy: {
      // every job is tied to a user
      type: mongoose.Types.ObjectId,
      ref: 'User', // which model we are referencing => tie the job to the User model
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
