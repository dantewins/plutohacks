const { Schema, model, Types } = require("mongoose");

module.exports = model(
  "jobs",
  new Schema({
    category: {
      type: String,
      required: true,
      enum: ["volunteer", "donation"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    participantCount: Number,
    joinedUsers: {
      type: [{ type: String }], // Array of user IDs
      default: [],
    },
    skills: [String], // List of skills
    responsibilities: [String], // List of responsibilities
    duration: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    location: String,
    organizer: {}, // You might want to specify organizer details as well, such as a user reference
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }),
);
