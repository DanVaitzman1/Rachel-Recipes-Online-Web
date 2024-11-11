<template>
  <!-- Container with hover effects that toggle the isHovered state -->
  <div
    class="recipe-preview-container"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Link to specific recipe making or viewing page based on whether it's part of a meal plan -->
    <router-link
      v-if="meal"
      :to="{ name: 'RecipeMaking', params: { recipeId: recipe.id } }"
      class="recipe-preview"
    >
      <div class="recipe-image-container">
        <!-- Displays recipe image if it has successfully loaded -->
        <b-card
          v-if="image_load"
          :img-src="recipe.image"
          img-alt="Recipe Image"
          tag="article"
          class="recipe-image"
        ></b-card>
      </div>
      <div class="recipe-footer">
        <!-- Displays recipe title and conditionally styles if recipe has been viewed -->
        <div class="recipe-title" :class="{ viewed: hasViewedRecipe }">
          {{ recipe.title }}
        </div>
        <!-- Displays recipe details like cooking time and likes -->
        <ul class="recipe-overview">
          <li>
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} minutes
          </li>
          <li>
            <i class="bi bi-heart-fill"></i> {{ recipe.aggregateLikes }} likes
          </li>
        </ul>
      </div>
    </router-link>
    <router-link
      v-else
      :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      class="recipe-preview"
    >
      <div class="recipe-image-container">
        <b-card
          v-if="image_load"
          :img-src="recipe.image"
          img-alt="Recipe Image"
          tag="article"
          class="recipe-image"
        ></b-card>
      </div>
      <div class="recipe-footer">
        <div class="recipe-title" :class="{ viewed: hasViewedRecipe }">
          {{ recipe.title }}
        </div>
        <ul class="recipe-overview">
          <li>
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} minutes
          </li>
          <li>
            <!-- <i class="bi bi-heart-fill"></i> {{ recipe.aggregateLikes }} likes -->
            <i class="fas fa-heart"></i> {{ recipe.aggregateLikes }} likes

          </li>
        </ul>
      </div>
    </router-link>
    <!-- Displays additional icons for dietary preferences if applicable -->
    <div class="recipe-type-Like">
      <ul class="d-flex align-items-center list-unstyled mb-0">
        <!-- RecipeLike component handles liking functionality, passing hover state and handling liked changes -->
        <li class="like-container" v-if="$root.store.username">
          <RecipeLike
            :recipe="recipe"
            :is-hovered="isHovered"
            @likedChanged="handleLikedChanged"
          ></RecipeLike>
        </li>
        <li v-if="recipe.vegetarian" v-b-tooltip.hover title="Vegetarian">
          <i class="fas fa-seedling text-success"></i>
        </li>
        <li v-if="recipe.vegan" v-b-tooltip.hover title="Vegan">
          <i class="fas fa-leaf text-success"></i>
        </li>
        <li v-if="recipe.glutenFree" v-b-tooltip.hover title="Gluten Free">
          <i class="fas fa-bread-slice"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import RecipeLike from "@/components/RecipeLike.vue"; // Component for like functionality
import { checkLastViewedRecipesFromServer } from '../services/recipes.js';

// import '@fortawesome/fontawesome-free/css/all.min.css';


export default {
  components: {
    RecipeLike,
  },
  data() {
    return {
      image_load: true, // Flag to check if image is loaded
      isLiked: false, // State to track if the recipe is liked
      hasViewedRecipe: false, // State to track if the recipe has been viewed
      isHovered: false, // State to track if the recipe preview is being hovered
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true, // Recipe object must be provided
    },
    meal: {
      type: Boolean,
      default: false, // Indicates if the recipe is part of a meal
    },
  },
  mounted() {
    this.checkIfViewed(); // Check if the recipe has been viewed on mount
  },
  watch: {
    // "$root.store.username": function(newVal,oldVal) {
      "$root.store.username": function() {
      this.checkIfViewed(); // Re-check viewed state when username changes
    },
  },
  methods: {
    handleLikedChanged(recipeId,isLiked) {
      // Handles liked state changes, emits an event for parent handling
      this.$emit("likedChanged", recipeId,isLiked);
    },
    async checkIfViewed() {
      // Checks if the recipe has been viewed by the current user
      if (this.$root.store.username) {
        const response = await checkLastViewedRecipesFromServer(this.recipe.id);
        this.hasViewedRecipe = response;
      }
    },
  },
};
</script>

<style scoped>
/* Container styling for the recipe preview, including borders, shadow, and sizing */
/* Container styling for the recipe preview */
.recipe-preview-container {
  width: 340px; /* Fixed width for consistency */
  padding: 10px; /* Padding around the content */
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 20px; /* Space below each recipe preview */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  height: 350px; /* Fixed height for the container */
  overflow: hidden; /* Ensure content does not overflow */
  background-color: white; /* White background for better contrast */
  display: flex; /* Flexbox to align items within the container */
  flex-direction: column; /* Arrange children vertically */
  justify-content: space-between; /* Space out items evenly */
}

.recipe-preview-container:hover {
  background-color: rgba(241, 240, 240); /* Light gray background on hover */
}

.recipe-preview {
  display: block;
  text-decoration: none;
  color: inherit;
}

.recipe-image-container {
  width: 100%;
  height: 200px; /* Fixed height for the image container */
  overflow: hidden;
  border-radius: 8px; /* Rounded corners for the image */
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the container without distortion */
}

.recipe-footer {
  padding: 10px 0; /* Padding for spacing */
  flex-grow: 1; /* Allows the footer to grow within the container */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  align-items: center; /* Center content horizontally */
}

.recipe-title {
  font-size: 16px; /* Font size for the title */
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center; /* Center the title text */
  color: #333; /* Darker text for better readability */
}

.recipe-title.viewed {
  color: rgb(134, 129, 134); /* Grey color for viewed recipes */
}

.recipe-overview {
  display: flex;
  justify-content: center; /* Center items */
  gap: 20px; /* Space between items */
  margin: 0;
  padding: 0;
  list-style-type: none; /* Remove bullet points */
  font-size: 14px; /* Smaller font size */
}

.recipe-overview li {
  display: flex;
  align-items: center;
  gap: 4px; /* Space between icon and text */
}

.recipe-type-Like {
  margin-top: 5px; /* Space above the container */
  display: flex;
  justify-content: center; /* Center items */
  align-items: center;
}

.recipe-type-Like ul {
  display: flex;
  align-items: center;
  list-style-type: none; /* Remove bullet points */
  padding: 0;
  margin: 0;
}

.recipe-type-Like li {
  margin: 0 5px; /* Space between icons */
}

.like-container {
  display: flex;
  align-items: center;
}

.recipe-type-Like i {
  font-size: 16px; /* Icon size */
  color: #42b983; /* Consistent color for dietary icons */
}

.card-body {
  margin: 0;
  padding: 0;
}
</style>
