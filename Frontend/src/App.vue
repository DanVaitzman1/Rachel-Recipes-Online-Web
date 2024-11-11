<template>
  <!-- Main application wrapper -->
  <div id="app">
    <!-- Navigation bar -->
    <b-navbar toggleable="lg" type="dark" id="nav" fixed="top">
      <!-- Logo and Brand Text -->
      <img src="@/assets/Rachel.png" alt="Logo" class="navbar-logo" @click="moveToMain" />
      <span class="brand-text">Rachel's Recipes</span>
      
      <!-- Collapsible navigation menu -->
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="defaultNav">
          <!-- Navigation links -->
          <b-nav-item :to="{ name: 'main' }">Main</b-nav-item> 
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item> 
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item> 
          <!-- Conditional link to add a new recipe if the user is logged in -->
          <b-nav-item v-if="$root.store.username" @click="openModal">Add Recipe

          </b-nav-item>
        </b-navbar-nav>
        
        <!-- Search bar and button -->
        <!-- <b-navbar-nav>
          <b-form-input v-model="searchText" placeholder="Search..." @keyup.enter="handleSearch" />
          <b-nav-item :to="{ name: 'search' }" size="sm" @click="handleSearch">Search</b-nav-item>
        </b-navbar-nav> -->
        <b-form inline class="search-bar-form">
          <b-input-group>
            <b-form-input v-model="searchText" placeholder="Search..." @keyup.enter="handleSearch" />
            <b-input-group-append>
              <b-button @click="handleSearch">Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form>

        <!-- User section, shown when user is not logged in -->
        <b-navbar-nav class="ml-auto User-section" v-if="!$root.store.username">
          <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
          <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
        </b-navbar-nav>

        <!-- User section, shown when user is logged in -->
        <b-navbar-nav class="ml-auto User-section" v-else>
          <b-nav-item :to="{ name: 'MealMaking' }">
            <!-- Displays the number of recipes in the user's meal plan -->
            My Meal ({{ mealLength }})
          </b-nav-item>

          <!-- Dropdown menu for user actions -->
          <b-nav-item-dropdown right class="custom-dropdown position-static">
            <template #button-content>
              Hello {{ $root.store.username }}
            </template>
            <b-dropdown-item :to="{ name: 'FavoriteRecipes' }">Favorite Recipes</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'MyRecipes' }">My Recipes </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'FamilyRecipes' }">Family Recipes</b-dropdown-item>
            <b-dropdown-item @click="Logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <CreateNewRecipe  :modalActive="isModalOpen" @close="closeModal"></CreateNewRecipe>

    <!-- Router view to display different components based on the current route -->
    <router-view @update:recipes="updateMealLength" />
  </div>
</template>


<script>
import CreateNewRecipe from '@/components/CreateNewRecipe.vue'; // Component to create a new recipe
import { logOutServer } from "@/services/auth"; // Service for handling logout
import { getRecipesInMyMeal } from "@/services/user.js"; // Service to get recipes in the user's meal
import { ref } from "vue"; // Vue composition API for reactive references

export default {
  components: {
    CreateNewRecipe, // Registering the CreateNewRecipe component
  },
  data() {
    return {
      showDropdown: false, // Controls the visibility of the user dropdown
      searchText: '', // Stores the user's search input
      mealRecipes: [], // Stores the list of recipes in the user's meal
      isModalOpen: false,
    };
  },

  computed: {
    // Computed property to get the number of recipes in the meal
    mealLength() {
      return this.mealRecipes.length;
    },
  },
  async mounted() {
    // Fetch the meal recipes when the component is mounted
    await this.fetchMealRecipes();
  },
  // setup() {
  //   // Setup function using the Composition API
  //   const modalActive = ref(false); // Reactive reference for controlling the modal's visibility
  //   const toggleModal = () => {
  //     modalActive.value = !modalActive.value; // Function to toggle the modal's state
  //   };

  //   return { modalActive, toggleModal }; // Return reactive properties
  // },
  methods: {
    // Method to fetch the recipes in the user's meal
    async fetchMealRecipes() {
      try {
        const recipes = await getRecipesInMyMeal(); // Fetch the recipes asynchronously
        this.mealRecipes = recipes; // Set the fetched recipes in the data property
      } catch (error) {
        console.error("Failed to fetch recipes in meal:", error);
      }
    },
    // Method to update the meal length when the recipe list changes
    async updateMealLength(updatedRecipes = null) {
      console.log("updateMealLength called", updatedRecipes);
      if(!updatedRecipes)
      {
        await this.fetchMealRecipes();
      } else {
        this.mealRecipes = updatedRecipes;
      }
    },
    // Method to log out the user
    async Logout() {
      try {
        const response = await logOutServer(); // Log out the user via the server
        this.$root.store.logout(); // Update the global store to reflect logout
        this.$root.toast("Logout", "User logged out successfully", "success"); // Show success toast message
        this.$router.push("/").catch(() => {
          this.$forceUpdate(); // Force component to update in case of navigation failure
        });
      } catch (error) {
        this.$root.toast("Logout Error", "Failed to log out. Please try again.", "danger"); // Show error toast message
      }
    },
    // Method to handle search action when the user presses enter or clicks the search button
    handleSearch() {
      this.$router.push({ name: 'search', query: { q: this.searchText } });
    },
    // Method to navigate to the main page if the current route is not 'main'
    moveToMain() {
      if (this.$route.name !== 'main') {
        this.$router.push({ name: 'main' });
      }
    },
    openModal()
    {
      this.isModalOpen = true;
    },
    closeModal()
    {
      this.isModalOpen = false;
    },
  },
};
</script>


<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Karla:wght@300;400&display=swap"); // Import a custom Google Font

/* Global reset and font settings */
* {
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  font-family: "Karla", sans-serif; /* Set the custom font for all elements */
}

/* Main application styles */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif; /* Fallback font family for the app */
  -webkit-font-smoothing: antialiased; /* Improves text rendering in WebKit (Safari) browsers */
  -moz-osx-font-smoothing: grayscale; /* Improves text rendering in Firefox on macOS */
  color: #2c3e50; /* Set a dark gray color for the app's text */
  min-height: 100vh; /* Make the app at least the full height of the viewport */
  padding-top: 60px; /* Add top padding to prevent overlap with a fixed navbar */
  margin-top: 10px; /* Add some margin above the app */
  

}

/* Navbar styles */
#nav {
  height: 50px; /* Set a fixed height for the navbar */
  padding: 20px; /* Add padding inside the navbar for spacing */
  display: flex; /* Use flexbox to align children elements */
  align-items: center; /* Center-align the children elements vertically */
  background-color: #2f2626; /* Set a dark background color for the navbar */
  color: white; /* Set the text color to white */
}

/* Logo styles in the navigation bar */
.navbar-logo {
  width: 50px; /* Set a fixed width for the logo */
  height: auto; /* Make the height of the logo fill its container */
  // object-fit: cover; /* Ensure the logo covers its container without distortion */
  margin-right: 25px; /* Add space to the right of the logo */
  margin-left: 10px; /* Add space to the left of the logo */
  border-radius: 8px; /* Round the corners of the logo */
}

.navbar-logo:hover {
  cursor: pointer; /* Change cursor to a pointer on hover */
}

/* Brand text styles */
.brand-text {
  font-weight: bold; /* Make the brand text bold */
}

/* Default navigation styles */
.defaultNav {
  display: flex; /* Use flexbox to display nav items inline */
  gap: 25px; /* Space between navigation items */
  margin: auto; /* Center the navigation items */
}

/* User section styles for logged-in or logged-out states */
.User-section {
  align-items: center; /* Center-align items vertically */
  position: relative; /* Position relative to allow absolute positioning of child elements */
  gap: 25px; /* Space between user section items */
  margin-right: 15px; /* Add space to the right of the user section */
}

/* Styles for navigation links */
#nav a {
  font-weight: bold; /* Make all navigation links bold */
  color: white; /* Set link color to white */
}

/* Styles for active navigation links */
#nav a.router-link-exact-active {
  color: #42b983; /* Highlight the active link in green */
}

/* Meal logo styles */
.meals-logo {
  width: 40px; /* Set a fixed width for the meal logo */
  height: 25px; /* Set a fixed height for the meal logo */
  object-fit: cover; /* Ensure the logo covers its container without distortion */
  margin-right: 5px; /* Add space to the right of the meal logo */
  margin-left: 15px; /* Add space to the left of the meal logo */
  border-radius: 8px; /* Round the corners of the meal logo */
}
.search-bar-form {
  margin-left: auto;
  margin-right: auto;
  padding-right: 15px; /* Adjust padding to move the search bar left */
  max-width: 350px; /* Optional: Set a max width for the search bar */
}
.custom-dropdown .dropdown-menu{
  background-color: #2f2626;
  color: white;
  border:none;

  min-width: 190px;
  max-width: 200px;
  overflow: auto;
  white-space: nowrap;
  right:auto ;
  left:0 ;
  transform: translateX(45%);
}
.custom-dropdown .dropdown-item
{
  color:white;
  background-color: #2f2626;
  border:none;
}
.custom-dropdown .dropdown-item:hover
{
  background-color: #42b983;
  color:white;

}
</style>
