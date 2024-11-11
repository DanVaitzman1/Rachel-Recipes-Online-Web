require("dotenv").config(); // Load environment variables from a .env file

//#region express configures
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("client-sessions");
const DButils = require("./routes/utils/DButils");
var cors = require("cors");

var app = express();

// Use morgan for logging requests to the console
app.use(logger("dev")); // Logger middleware

// Configure express to parse JSON bodies
app.use(express.json()); // Parse application/json

// Set up session management
app.use(
  session({
    cookieName: "session", // Name of the session cookie
    secret: "template", // Encryption key for session data
    duration: 24 * 60 * 60 * 1000, // Session duration in milliseconds (1 day)
    activeDuration: 1000 * 60 * 5, // Extends session by 5 minutes if active
    cookie: {
      httpOnly: false, // Allow client-side access to the cookie (e.g., in JS)
    },
  })
);

// Configure express to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded

// Serve static files such as images, CSS files, and JavaScript files
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory
//local :
// Serve static files for the local environment
// app.use(express.static(path.join(__dirname, "dist"))); // Serve static files from the 'dist' directory for local development
// remote :
app.use(express.static(path.join(__dirname, "../assignment2-1-318940913_207577875_209384783/dist")));

// Serve the index.html file on the root path
app.get("/", function (req, res) {
  //remote:
  res.sendFile(path.join(__dirname,"../assignment2-1-318940913_207577875_209384783/dist/index.html"));
  // Local environment:
  // res.sendFile(__dirname + "/index.html");
});

// Set up CORS configuration
const corsConfig = {
  origin: true, // Allow all origins
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

// Apply CORS middleware to allow cross-origin requests
app.use(cors(corsConfig));
app.options("*", cors(corsConfig)); // Handle preflight requests for all routes

// Define the port for the server to listen on (default: 80)
var port = process.env.PORT || "80"; // Local = 3000, Remote = 80
//#endregion

// Import route handlers
const user = require("./routes/user");
const recipes = require("./routes/recipes");
const auth = require("./routes/auth");

//#region cookie middleware
app.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    // If session exists, verify user_id in session matches a valid user
    DButils.execQuery("SELECT user_id FROM Users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id; // Attach user_id to request
        }
        next(); // Proceed to the next middleware or route
      })
      .catch((error) => next()); // Handle errors gracefully
  } else {
    next(); // No session, proceed without user_id
  }
});
//#endregion

// Health check route to verify that the server is running
app.get("/alive", (req, res) => res.send("I'm alive"));

// Define route handlers
app.use("/users", user); // User-related routes
app.use("/recipes", recipes); // Recipe-related routes
app.use(auth); // Authentication routes

// Default error handler for handling unexpected errors
app.use(function (err, req, res, next) {
  console.error(err); // Log error details
  res.status(err.status || 500).send({ message: err.message, success: false }); // Send error response
});

// Start the server and listen on the specified port
// const server = app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// // Gracefully handle server shutdown on interrupt signal (SIGINT)
// process.on("SIGINT", function () {
//   if (server) {
//     server.close(() => console.log("Server closed")); // Close server and log message
//   }
//   process.exit(); // Exit the process
// });

module.exports = app; // Export the Express app instance