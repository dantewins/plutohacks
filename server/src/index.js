const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const hpp = require("hpp");
const {
  createClerkClient,
  clerkMiddleware,
  requireAuth,
} = require("@clerk/express"); // Import auth middleware from @clerk/express

const corsOptions = require("./Configs/corsOptions");
const connectDB = require("./Configs/dbConn");

const { logger, logEvents } = require("./Middleware/logger");
const errorHandler = require("./Middleware/errorHandler");
const sanitize = require("./Middleware/sanitize");

const jobRoutes = require("./Routes/jobRoutes");
const newsRoutes = require("./Routes/newsRoutes");

require("dotenv").config();

const app = express();
const PORT = 3001;

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(mongoSanitize());
app.use(sanitize);
app.use(hpp());
app.use(cookieParser()); // Make sure cookie-parser is used before auth middleware
app.use(clerkMiddleware({ clerkClient }));

app.use("/v1/jobs", jobRoutes);
app.use("/v1/news", newsRoutes);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Loaded database!");
  app.listen(PORT, () => {
    console.log(`Server initialized on port: http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log",
  );
});
