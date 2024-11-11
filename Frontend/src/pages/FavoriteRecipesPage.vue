<template>
  <div>
    <!-- RecipePreviewList component displays a list of favorite recipes -->
    <RecipePreviewList
      title="My Favorites"
      :recipes="favRecipes"
      @likedChanged="handleLikedChanged"
    ></RecipePreviewList>
  </div>
</template>

<script>
// Import the RecipePreviewList component and necessary services
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import {
  getRecipeInFavorites,
  markAsFavorite,
  unMarkAsFavorite,
} from "../services/user.js";

export default {
  components: {
    RecipePreviewList, // Register RecipePreviewList component
  },
  data() {
    return {
      favRecipes: [], // Array to store favorite recipes
    };
  },
  mounted() {
    this.fetchFavoriteRecipes(); // Fetch favorite recipes when component mounts
  },
  methods: {
    async fetchFavoriteRecipes() {
      try {
        this.favRecipes = await getRecipeInFavorites(); // Load favorite recipes from service
      } catch (error) {
        console.error("Error fetching favorite recipes:", error); // Log any errors
      }
    },
    async handleLikedChanged(recipeId, isLiked) {
      try {
        // console.log("Event Triggered At Favorites");
        if (!isLiked) {
          await unMarkAsFavorite(recipeId); // Remove recipe from favorites
          this.favRecipes = this.favRecipes.filter(
            (recipe) => recipe.id !== recipeId
          );
        } else {
          await markAsFavorite(recipeId); // Add recipe to favorites
          this.favRecipes = await getRecipeInFavorites(); // Refresh the favorites list
        }
      } catch (error) {
        console.error("Error handling liked changed:", error); // Log any errors
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
