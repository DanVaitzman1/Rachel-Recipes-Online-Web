var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

/**
 * Register a new user.
 */
router.post("/Register", async (req, res, next) => {
  try {
    // Extract user details from the request body
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
    };

    // Validate that all fields are provided
    if (
      !user_details.username ||
      !user_details.firstname ||
      !user_details.lastname ||
      !user_details.country ||
      !user_details.password ||
      !user_details.email
    ) {
      throw { status: 400, message: "All fields are required." };
    }

    // Validate username: must be 3-8 characters and contain only alphabetic characters
    if (!/^[a-zA-Z]{3,8}$/.test(user_details.username)) {
      throw {
        status: 400,
        message:
          "Username length should be between 3-8 characters long and only contain alphabetic characters.",
      };
    }

    // Validate first name: must contain only alphabetic characters
    if (!/^[a-zA-Z]+$/.test(user_details.firstname)) {
      throw {
        status: 400,
        message: "First name must only contain alphabetic characters.",
      };
    }

    // Validate last name: must contain only alphabetic characters
    if (!/^[a-zA-Z]+$/.test(user_details.lastname)) {
      throw {
        status: 400,
        message: "Last name must only contain alphabetic characters.",
      };
    }

    // Validate email: must be in a valid format
    if (!/^\S+@\S+\.\S+$/.test(user_details.email)) {
      throw {
        status: 400,
        message: "Email must be valid.",
      };
    }

    // Validate country: must be provided
    if (!user_details.country) {
      throw { status: 400, message: "Country is required." };
    }

    // Validate password: must be 5-10 characters, contain at least one number and one special character
    if (
      user_details.password.length < 5 ||
      user_details.password.length > 10 ||
      !/\d/.test(user_details.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(user_details.password)
    ) {
      throw {
        status: 400,
        message:
          "Password must be between 5-10 characters long and contain at least one number and one special character.",
      };
    }

    // Check if username already exists in the database
    let users = await DButils.execQuery("SELECT user_name from users");
    if (users.find((x) => x.user_name === user_details.username))
      throw { status: 409, message: "Username already exists." };

    // Hash the password
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );

    // Insert the new user into the database
    await DButils.execQuery(
      `INSERT INTO users (user_name, first_name, last_name, country, password, email) VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}')`
    );

    // Send success response
    res
      .status(201)
      .send({ message: "User successfully registered.", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * Log in an existing user.
 */
router.post("/Login", async (req, res, next) => {
  try {
    // Validate that both username and password are provided
    if (!req.body.username || !req.body.password)
      throw { status: 400, message: "All fields are required." };

    // Check if the user is already logged in
    if (req.session.user_id)
      throw { status: 409, message: "User already logged in" };

    // Check if the username exists in the database
    const users = await DButils.execQuery(`SELECT user_name FROM users`);
    if (!users.find((x) => x.user_name === req.body.username))
      throw {
        status: 401,
        message: "Invalid input, username or password is invalid.",
      };

    // Fetch user details from the database
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE user_name = '${req.body.username}'`
      )
    )[0];

    // Validate the provided password with the stored hashed password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set session for the user
    req.session.user_id = user.user_id;

    // Send success response with cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * Log out the current user.
 */
router.post("/Logout", function (req, res, next) {
  try {
    if (req.session.user_id) {
      req.session.reset(); // Reset session info
      res.send({ success: true, message: "Logout succeeded." });
    } else {
      throw { status: 409, message: "You are not logged in." };
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;