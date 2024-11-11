<template>
  <!-- Container for the recipe list with responsive handling -->
  <b-container class="title-container">
    <!-- Displays the title if provided -->
    <h3 v-if="title" class="title mb-2">{{ title }}</h3>
    <b-row>
      <!-- Draggable component allows for drag-and-drop functionality -->
      <draggable
        v-if="meal"
        v-model="localRecipes"
        tag="div"
        class="row"
        group="recipesGroup"
        @end="onDragEnd"
      >
        <!-- Iterates over localRecipes to display each recipe -->
        <b-col
          v-for="(recipe, index) in localRecipes"
          :key="recipe.id"
          class="recipe-col"
        >
          <div class="recipe-wrapper">
            <!-- Clickable icon for removing a recipe from the meal -->
            <div @click="removeRecipe(index)" class="icon-container">
              <i class="bi bi-trash mb-1 icon-shadow"></i>
            </div>
            <!-- Component for previewing the recipe in a meal context -->
            <RecipeInMealPreview
              class="recipePreview"
              :recipe="recipe"
              @likedChanged="handleLikedChanged"
            />
          </div>
        </b-col>
        <!-- Message displayed if no recipes are added to the meal -->
        <b-col v-if="localRecipes.length === 0">
          <p>No recipes added to the meal.</p>
        </b-col>
      </draggable>
      <!-- Displays recipes without draggable functionality when not part of a meal -->
      <template v-else>
        <b-col
          v-for="recipe in localRecipes"
          :key="recipe.id"
          cols="12"
          md="6"
          lg="4"
          class="recipe-col"
        >
          <RecipePreview
            class="recipePreview"
            :recipe="recipe"
            @likedChanged="handleLikedChanged"
          />
        </b-col>
      </template>
    </b-row>
    <!-- Button to clear all recipes from the meal -->
    <div v-if="meal" class="clearMeal">
      <b-button
        v-if="localRecipes.length > 0"
        variant="danger"
        @click="clearMeal"
        >Clear Meal</b-button
      >
    </div>
  </b-container>
</template>

<script>
import draggable from "vuedraggable"; // Import draggable for handling drag-and-drop functionality
import RecipePreview from "./RecipePreview.vue"; // Import RecipePreview component
import RecipeInMealPreview from "./RecipeInMealPreview.vue"; // Import RecipeInMealPreview for meal-specific previews
import { updateRecipesOrder, removeFromMyMeal } from "@/services/user.js"; // Import service functions for recipe management

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
    RecipeInMealPreview,
    draggable,
  },
  props: {
    title: {
      type: String,
      required: false, // Optional title for the recipe list
    },
    recipes: {
      type: Array,
      required: true, // Array of recipes to display
    },
    meal: {
      type: Boolean,
      required: false,
      default: false, // Flag to indicate if the recipes are part of a meal plan
    },
  },
  data() {
    return {
      localRecipes: [...this.recipes], // Initializes local copy of recipes for reactivity
    };
  },
  watch: {
    recipes(newRecipes) {
      // Updates localRecipes when the prop changes to ensure UI consistency
      this.localRecipes = [...newRecipes];
    },
  },
  methods: {
    handleLikedChanged(recipeId, isLiked) {
      // Handles liked state changes from child components
      this.$emit("likedChanged", recipeId, isLiked);
    },
    async onDragEnd(event) {
      // Handles the end of a drag event by updating the order of recipes
      const newOrderRecipeIds = this.localRecipes.map((recipe) => recipe.id);
      await updateRecipesOrder({ recipes_order_id: newOrderRecipeIds });
      this.$emit("update:recipes", [...this.localRecipes]);
    },
    async removeRecipe(index) {
      // Removes a recipe from the meal
      const recipe_to_remove = this.localRecipes[index];
      await removeFromMyMeal(recipe_to_remove.id);
      this.localRecipes.splice(index, 1);
      this.$emit("update:recipes", [...this.localRecipes]);
    },
    async clearMeal() {
      // Clears all recipes from the meal
      for (const recipe of this.localRecipes) {
        await removeFromMyMeal(recipe.id);
      }
      this.localRecipes = [];
      this.$emit("update:recipes", []);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Styling for recipe preview rows */
.row {
  margin-bottom: 20px; /* Adds space between rows */
}

/* Styling for individual recipe columns */
.recipe-col {
  margin-bottom: 20px; /* Adds space below each recipe */
  flex-grow: 1; /* Allows columns to grow and fill available space */
}

/* General wrapper for each recipe, organizing content vertically */
.recipe-wrapper {
  display: flex;
  flex-direction: column; /* Stacks children elements vertically */
  align-items: center; /* Centers children horizontally */
}

/* Container for the delete icon, making it clickable */
.icon-container {
  margin-bottom: 10px; /* Space below the icon */
  cursor: pointer; /* Changes cursor to indicate interactiveness */
}

/* Adds a shadow effect to icons on hover */
.icon-shadow {
  transition: text-shadow 0.3s ease; /* Smooth transition for shadow */
}

/* Enhances shadow when hovering over the icon */
.icon-shadow:hover {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Shadow properties for a raised effect */
}

/* Custom styling for the title */
.title {
  font-size: 2.5em; /* Large font size for prominence */
  background: linear-gradient(to right, #855e41, #855e41); /* Gradient effect */
  color: transparent;
  -webkit-background-clip: text; /* Clips the background to the text */
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Soft shadow for depth */
  padding: 10px 20px; /* Padding for visual spacing */
  border-radius: 10px; /* Rounded corners */
  display: inline-block; /* Aligns title inline with other elements */
}

/* Styling for the container that allows clearing the meal */
.clearMeal {
  text-align: left; /* Aligns the clear meal button to the left */
}
</style>
