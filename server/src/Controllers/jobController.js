const asyncHandler = require("express-async-handler");
const Jobs = require("../Models/Jobs");
const { clerkClient } = require("@clerk/express"); // Import clerkClient

// Fetch a specific category of jobs
const fetchSpecificJobs = asyncHandler(async (req, res) => {
  const { category } = req.query;

  // Get the authenticated user's ID from Clerk
  const userId = req.auth.userId; // Assuming Clerk middleware gives you access to `req.auth`

  // Find jobs in the specific category
  const jobs = await Jobs.find({ category });

  if (jobs) {
    // Filter out jobs where the user is already part of the 'joinedUsers' array
    const filteredJobs = jobs.filter(
      (job) => !job.joinedUsers.includes(userId),
    );

    // Respond with the filtered list of jobs
    res.status(200).json(filteredJobs);
  } else {
    res.status(404).json({ message: `No ${category} jobs found` });
  }
});

// Fetch a specific job
const fetchJob = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  const job = await Jobs.findOne({ _id });

  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404).json({ message: `No job with ${_id} found` });
  }
});

// Add a new volunteer job
const addVolunteerJob = asyncHandler(async (req, res) => {
  const {
    category,
    title,
    description,
    type,
    participantCount,
    skills,
    responsibilities,
    duration,
    startDate,
    location,
  } = req.body;

  // Access the authenticated user's ID from req.auth
  const { userId } = req.auth;

  // Fetch user details using clerkClient
  const organizer = await clerkClient.users.getUser(userId);

  // Create a new job with organizer information
  const newJob = new Jobs({
    organizer: {
      id: organizer.id,
      email: organizer.emailAddresses[0].emailAddress,
      name: `${organizer.firstName} ${organizer.lastName}`,
    }, // Store organizer's ID or any relevant info
    category,
    title,
    description,
    type,
    joinedUsers: [organizer.id],
    skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
    responsibilities: responsibilities
      ? responsibilities.split(",").map((resp) => resp.trim())
      : [],
    duration,
    participantCount,
    startDate,
    location,
    category: "volunteer",
  });

  // Save to the database
  const savedJob = await newJob.save();

  if (savedJob) {
    res.status(201).json(savedJob);
  } else {
    res.status(400);
    throw new Error("Invalid job data");
  }
});

// Join a specific job
const joinVolunteer = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Find the job by ID
  const job = await Jobs.findOne({ _id });

  if (!job) {
    return res.status(404).json({ message: `No job with ID: ${_id} found` });
  }

  // Access the authenticated user's ID from req.auth
  const { userId } = req.auth;

  // Check if the user has already joined
  if (job.joinedUsers.includes(userId)) {
    return res
      .status(400)
      .json({ message: "You have already joined this job." });
  }

  // Check if the job is full
  if (job.joinedUsers.length >= job.participantCount) {
    return res.status(400).json({
      message: "This job is full and cannot accept more participants.",
    });
  }

  // Fetch user details using clerkClient (if needed)
  const user = await clerkClient.users.getUser(userId);

  // Add the user's ID to the joinedUsers array
  job.joinedUsers.push(userId);

  // Save the updated job
  await job.save();

  // Respond with the updated job data
  res.status(200).json({ message: "Successfully joined the job", job });
});

// Leave a specific job
const leaveVolunteer = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Find the job by ID
  const job = await Jobs.findOne({ _id });

  if (!job) {
    return res.status(404).json({ message: `No job with ID: ${_id} found` });
  }

  // Access the authenticated user's ID from req.auth
  const { userId } = req.auth;

  // Check if the user is not already joined
  if (!job.joinedUsers.includes(userId)) {
    return res
      .status(400)
      .json({ message: "You are not a participant of this job." });
  }

  // Remove the user's ID from the joinedUsers array
  job.joinedUsers = job.joinedUsers.filter((id) => id !== userId);

  // Save the updated job
  await job.save();

  // Respond with the updated job data
  res.status(200).json({ message: "Successfully left the job", job });
});

module.exports = {
  fetchSpecificJobs,
  fetchJob,
  addVolunteerJob,
  joinVolunteer,
  leaveVolunteer,
};
