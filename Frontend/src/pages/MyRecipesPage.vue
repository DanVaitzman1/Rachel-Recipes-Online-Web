<template>
  <div>
    <!-- RecipePreviewList component is used to display a list of recipes owned by the user -->
    <RecipePreviewList
      title="My Recipes"
      :recipes="myRecipes"
      @addedNewRecipe="handleAddedNewRecipe"
    ></RecipePreviewList>
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue"; // Import the RecipePreviewList component
import { getRecipeInMyRecipes } from "../services/user.js"; // Import function to fetch user's recipes

export default {
  data() {
    return {
      myRecipes: [], // Data property to hold the list of user's recipes
    };
  },
  components: {
    RecipePreviewList, // Register RecipePreviewList as a component
  },
  mounted() {
    this.fetchFavoriteRecipes(); // Call fetchFavoriteRecipes when component mounts
  },
  methods: {
    async fetchFavoriteRecipes() {
      try {
        this.myRecipes = await getRecipeInMyRecipes(); // Fetch recipes and update myRecipes array
      } catch (error) {
        console.error("Error fetching my recipes:", error); // Log errors if fetch fails
      }
    },
    async handleAddedNewRecipe() {
      await this.fetchFavoriteRecipes(); // Refetch recipes when a new recipe is added
    },
  },
};
</script>

<style lang="scss" scoped></style>
