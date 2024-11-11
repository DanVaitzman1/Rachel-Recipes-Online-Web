<template>
  <div>
    <!-- RecipePreviewList component to display a list of meal recipes -->
    <RecipePreviewList
      title="My Meal"
      :recipes="mealRecipes"
      :meal="true"
      @update:recipes="updateMealRecipes"
    />
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue"; // Import the RecipePreviewList component
import { getRecipesInMyMeal } from "@/services/user.js"; // Import service function to get meal recipes
import { getRecipeFullPage } from "@/services/recipes.js"; // Import service function to get full recipe details

export default {
  data() {
    return {
      mealRecipes: [], // State to store the meal recipes
    };
  },
  components: {
    RecipePreviewList, // Registration of the RecipePreviewList component
  },
  async mounted() {
    await this.fetchMealRecipes(); // Fetch meal recipes on component mount
  },
  methods: {
    async fetchMealRecipes() {
      const recipes_in_mymeal = await getRecipesInMyMeal(); // Fetch meal recipes from user service
      for (const recipe of recipes_in_mymeal) {
        const response = await getRecipeFullPage(recipe.id); // Fetch full recipe details for each recipe
        const {
          instructions,
          extendedIngredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title,
          vegetarian,
          vegan,
          glutenFree,
          servings,
          id,
        } = response.data;

        const recipeInMeal = {
          instructions,
          extendedIngredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title,
          vegetarian,
          vegan,
          glutenFree,
          servings,
          id,
        };

        this.mealRecipes.push(recipeInMeal); // Add each recipe to the mealRecipes array
      }
    },

    updateMealRecipes(updatedRecipes) {
      this.mealRecipes = updatedRecipes; // Update the meal recipes state
      this.$emit("update:recipes", updatedRecipes); // Re-emit updated recipes to the parent component
    },
  },
};
</script>

<style lang="scss" scoped></style>
