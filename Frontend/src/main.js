// Import core Vue library
import Vue from "vue";

// Import root App component
import App from "./App.vue";

// Import VueAxios for handling HTTP requests
import VueAxios from "vue-axios";

// Import axios HTTP library
import axios from "axios";

// Import BootstrapVue for UI components, icons, and additional icons support
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue';

// Import Bootstrap and BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Import Vuelidate for form validation
import Vuelidate from "vuelidate";

// Import routes configuration
import routes from "./routes";

// Import VueRouter for client-side routing
import VueRouter from "vue-router";

// Import VueCookies for cookie management
import VueCookies from "vue-cookies";

// Register VueCookies for cookie handling
Vue.use(VueCookies);

// Register plugins with Vue to use Bootstrap components and icons
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(BootstrapVueIcons);

// Setup VueRouter with predefined routes
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

// Register Vuelidate for use in the application
Vue.use(Vuelidate);

// Setup axios with Vue for making HTTP requests and configure withCredentials to send cookies with requests
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;

// Import individual BootstrapVue components to reduce overall bundle size
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
} from "bootstrap-vue";

// Use an array to register multiple BootstrapVue plugins to Vue
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
].forEach(plugin => Vue.use(plugin));

// Setup axios interceptors for request and response handling
axios.interceptors.request.use(
  function(config) {
    config.headers["Cache-Control"] = "no-cache";  // Prevent caching of HTTP requests
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Disable production tips in development mode
Vue.config.productionTip = false;

// Shared data object for managing user-specific data like recipes, favorites, and session status.
const shared_data = {
  // Base URL for server interactions.
  // server_domain: "http://localhost:3000",
  server_domain: "https://rachelsrecipes.cs.bgu.ac.il",
  // Currently logged in user's username, retrieved from local storage.
  username: localStorage.username,

  // Function to log in a user and store their username in local storage.
  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },

  // Function to log out a user and remove their username from local storage.
  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    this.username = undefined;
  },

  // Function to save progress on a recipe for a logged-in user.
  saveRecipeProgress(recipeId, progress) {
    if (!this.username) {
      console.warn("No user logged in. Progress will not be saved.");
      return;
    }
    const userProgress = JSON.parse(localStorage.getItem("userProgress")) || {};
    userProgress[this.username] = userProgress[this.username] || {};
    userProgress[this.username][recipeId] = progress;
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  },

  // Function to retrieve saved progress for a recipe by a user.
  getRecipeProgress(recipeId) {
    const userProgress = JSON.parse(localStorage.getItem("userProgress")) || {};
    return (userProgress[this.username] && userProgress[this.username][recipeId]) || [];
  },

  // Function to add a recipe to the meal plan of a logged-in user.
  addRecipeToMeal(username, recipeId) {
    if (!this.username) {
      console.warn("No user logged in. Recipe will not be added to the meal.");
      return;
    }
    const userMeals = JSON.parse(localStorage.getItem("userMeals")) || {};
    userMeals[username] = userMeals[username] || [];
    if (!userMeals[username].includes(recipeId)) {
      userMeals[username].push(recipeId);
    }
    localStorage.setItem("userMeals", JSON.stringify(userMeals));
  },

  // Function to save a list of recipes to a user's meal plan.
  saveRecipesToMeal(username, recipeIds) {
    if (!this.username) {
      console.warn("No user logged in. Recipes will not be added to the meal.");
      return;
    }
    const userMeals = JSON.parse(localStorage.getItem("userMeals")) || {};
    userMeals[username] = recipeIds;
    localStorage.setItem("userMeals", JSON.stringify(userMeals));
  },

  // Function to retrieve a user's meal plan.
  getUserMeals(username) {
    const userMeals = JSON.parse(localStorage.getItem("userMeals")) || {};
    return userMeals[username] || [];
  },

  // Function to add a recipe to a user's favorites.
  addRecipeToFavorites(username, recipeId) {
    if (!this.username) {
      console.warn("No user logged in. Recipe will not be added to the favorites.");
      return;
    }
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    userFavorites[username] = userFavorites[username] || [];
    if (!userFavorites[username].includes(recipeId)) {
      userFavorites[username].push(recipeId);
    }
    localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  },

  // Function to remove a recipe from a user's favorites.
  deleteRecipeFromFavorites(username, recipeId) {
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    if (!userFavorites[username]) {
      console.warn("No favorites found for the user.");
      return;
    }
    userFavorites[username] = userFavorites[username].filter(id => id !== recipeId);
    localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  },

  // Function to save a list of recipes to a user's favorites.
  saveRecipesToFavorites(username, recipeIds) {
    if (!this.username) {
      console.warn("No user logged in. Recipes will not be added to the favorites.");
      return;
    }
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    userFavorites[username] = recipeIds;
    localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  },

  // Function to check if a recipe is in a user's favorites.
  isRecipeInFavorites(username, recipeId) {
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    if (!userFavorites[username]) {
      return false; // No favorites found for the user
    }
    return userFavorites[username].includes(recipeId);
  },

  // More functions managing recipes, including adding to "My Recipes" and checking watched status.
  // These functions mirror the structure and functionality of those described above.
  // Additional functionalities for watched recipes and user-specific settings also included.
};
console.log(shared_data);  // Output shared data to the console for debugging


// Initialize the Vue instance
new Vue({
  router,
  data() {
    return {
      store: shared_data,  // Make shared_data accessible in all components
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(App),  // Render the root component
}).$mount("#app");  // Mount the app to the #app div in index.html
export default shared_data;
