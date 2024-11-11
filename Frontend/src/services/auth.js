import axios from 'axios';
import store from '../store.js';
const API_URL = store.server_domain;


/**
 * Performs a login operation by sending the user's credentials to the server.
 * @param {Object} credentials - The login credentials, typically including username and password.
 * @returns {Promise} - A promise that resolves with the server's response data.
 */
export async function logInServer(credentials) {
  try {
    const response = await axios.post(`${API_URL}/Login`, credentials, {
      withCredentials: true // Ensures that cookies are sent along with the request
    });
    return response.data; // Return the data from the server's response
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Performs a logout operation by sending a request to the server to end the user session.
 * @returns {Promise} - A promise that resolves with the server's response data.
 */
export async function logOutServer() {
  try {
    const response = await axios.post(`${API_URL}/Logout`);
    return response.data; // Return the data from the server's response
  } catch (error) {
    console.error('Error logging out:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Registers a new user by sending their information to the server.
 * @param {Object} user_info - Details of the user to register.
 * @returns {Promise} - A promise that resolves with the server's response.
 */
export async function registerServer(user_info) {
  try {
    const response = await axios.post(`${API_URL}/Register`, {
      username: user_info.username,
      firstname: user_info.firstName,
      lastname: user_info.lastName,
      country: user_info.country,
      password: user_info.password,
      email: user_info.email
    });
    return response; // Return the server's response to the registration request
  } catch (error) {
    console.error('Error register:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
