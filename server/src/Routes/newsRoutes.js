const express = require("express");
const router = express.Router();

const newsController = require("../Controllers/newsController");
const limiter = require("../Middleware/limiter");

router.route("/").get(limiter, jobController.fetchSpecificJobs);

module.exports = router;
