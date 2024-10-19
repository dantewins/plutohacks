const express = require("express");
const router = express.Router();

const jobController = require("../Controllers/jobController");
const limiter = require("../Middleware/limiter");

router.route("/").get(limiter, jobController.fetchSpecificJobs);
router.route("/active").get(limiter, jobController.fetchActiveJobs);
router.route("/one").get(limiter, jobController.fetchJob);
router.route("/join").post(limiter, jobController.joinVolunteer);
router.route("/leave").post(limiter, jobController.leaveVolunteer);
router.route("/donate").post(limiter, jobController.donate);
router.route("/volunteer").post(limiter, jobController.addVolunteerJob);
router.route("/donation").post(limiter, jobController.addDonationJob);

module.exports = router;
