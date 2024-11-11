<template>
  <!-- Button that toggles the like status of a recipe, showing different icons based on the state -->
  <b-button
    @click="toggleLike"
    class="custom-button"
    :class="{ hovered: isHovered }"
  >
    <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
  </b-button>
</template>

<script>
import {
  isRecipeInFavorites,
  markAsFavorite,
  unMarkAsFavorite,
} from "../services/user.js";
import { BButton } from "bootstrap-vue";

export default {
  components: {
    BButton,
  },
  async mounted() {
    // When component is mounted, check if the recipe is in user's favorites
    await this.fetchFavioritesStatus();
  },
  props: {
    recipe: {
      type: Object,
      required: true, // Recipe object must be passed to the component
    },
    isHovered: {
      type: Boolean,
      default: false, // Tracks if the button is hovered to change its style
    },
  },
  data() {
    return {
      isLiked: false, // Boolean indicating if the recipe is currently liked by the user
    };
  },
  watch: {
    // Watch for changes in the recipe prop to fetch the like status again
    recipe: {
      handler() {
        this.fetchFavioritesStatus(); // Refetch the like status when the recipe changes
      },
      immediate: true,
    },
  },
  methods: {
    async fetchFavioritesStatus() {
      try {
        const check = await isRecipeInFavorites(this.recipe.id);
        // console.log("recipe like - 2.1 - line 56 check is liked = ", check);
        this.isLiked = await isRecipeInFavorites(this.recipe.id);
      } catch (error) {
        console.error(
          `Failed to check if recipe ${this.recipe.id} is in favorites:`,
          error
        );
      }
    },
    async toggleLike() {
      // Toggles the like state of the recipe and updates it on the server
      try {
        if (!this.isLiked) {
          // If the recipe is not liked, mark it as favorite
          await markAsFavorite({ recipeId: this.recipe.id });
        } else {
          // If the recipe is liked, remove it from favorites
          await unMarkAsFavorite({ recipeId: this.recipe.id });
        }
        this.isLiked = !this.isLiked; // Toggle the local like state
        this.$emit("likedChanged", this.recipe.id, this.isLiked); // Emit an event to notify parent components of the change
      } catch (err) {
        console.error("Error toggling the like state of the recipe:", err);
        this.isLiked = false; // Reset like state on error
      }
    },
  },
};
</script>

<style scoped>
/* Styles for the custom button that triggers the like functionality */
.custom-button {
  background-color: white; /* Set the background color to white */
  border-color: white; /* Match the border color with the background */
  padding: 0; /* Remove padding to minimize the button size */
  min-width: 18px; /* Minimum width to ensure the icon is visible */
  min-height: 15px; /* Minimum height to match the icon's size */
  display: flex; /* Use flexbox for centering content */
}

/* Style definitions for heart icons within the button */
.custom-button .bi-heart,
.custom-button .bi-heart-fill {
  color: #ff0000; /* Red color for the heart icons to signify 'like' action */
}

/* Override Bootstrap's default hover, focus, and active states for a cleaner look */
.btn.custom-button.btn-secondary:hover,
.btn.custom-button.btn-secondary:focus,
.btn.custom-button.btn-secondary:active {
  border: none; /* Remove border on hover/focus/active states */
  background-color: transparent; /* Set background to transparent to avoid color shift */
  box-shadow: none; /* Remove box shadow for a flat design */
  outline: none; /* Remove outline on focus for a cleaner look */
  border-color: rgba(241, 240, 240);
}

/* Specific style when the button is hovered to show a different background */
.hovered .bi-heart,
.hovered .bi-heart-fill {
  background-color: rgba(241, 240, 240);
  border-color: rgba(241, 240, 240);
  /* Light grey background on hover to highlight the icon */
}
</style>
