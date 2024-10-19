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

// Fetch all active jobs under a user
const fetchActiveJobs = asyncHandler(async (req, res) => {
  const { userId } = req.auth; // Assuming you have userId in req.auth from your auth middleware

  try {
    // Find jobs where the userId exists in the joinedUsers array
    const jobs = await Jobs.find({
      joinedUsers: { $in: [userId] },
    });

    if (jobs.length > 0) {
      res.status(200).json(jobs);
    } else {
      res
        .status(404)
        .json({ message: `No active jobs found for user ${userId}` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
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

// Add a new donation job
const addDonationJob = asyncHandler(async (req, res) => {
  const { title, type, description, duration, startDate, goal } = req.body;
  const { userId } = req.auth;

  const organizer = await clerkClient.users.getUser(userId);

  const newJob = new Jobs({
    organizer: {
      id: organizer.id,
      email: organizer.emailAddresses[0].emailAddress,
      name: `${organizer.firstName} ${organizer.lastName}`,
    },
    title,
    description,
    type,
    duration,
    startDate,
    goal,
    joinedUsers: [organizer.id],
    category: "donation",
  });

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

// Donate to a specific fundraiser
const donate = asyncHandler(async (req, res) => {
  const { _id, amount } = req.body;

  // fetch user ID from Clerk
  const userId = req.auth.userId;

  // find the job by ID
  const job = await Jobs.findOne({ _id });

  // validate job existence
  if (!job) {
    return res.status(404).json({ message: `No job with ID: ${_id} found` });
  }

  // validate job category
  if (job.category !== "donation") {
    return res.status(400).json({ message: "This is not a donation job." });
  }

  // validate donation amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid donation amount." });
  }

  // fetch user details
  const donor = await clerkClient.users.getUser(userId);

  // current amount validation and update
  job.currentAmount = (job.currentAmount || 0) + amount;

  // check if user donates
  if (!job.joinedUsers.some((d) => d.userId === userId)) {
    // if not, push them to array
    job.joinedUsers.push({
      userId: donor.id,
      name: `${donor.firstName} ${donor.lastName}`,
      email: donor.emailAddresses[0].emailAddress,
      amount,
      date: new Date(),
    });
  } else {
    // update amount if already donated
    const donorIndex = job.joinedUsers.findIndex((d) => d.userId === userId);
    job.joinedUsers[donorIndex].amount += amount;
  }

  // save updated job
  const updatedJob = await job.save();

  // respond with data
  res.status(200).json({ message: "Donation successful", job: updatedJob });
});

module.exports = {
  fetchSpecificJobs,
  fetchActiveJobs,
  fetchJob,
  addVolunteerJob,
  addDonationJob,
  joinVolunteer,
  leaveVolunteer,
  donate,
};
