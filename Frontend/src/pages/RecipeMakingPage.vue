<template>
  <div class="container mt-4">
    <div v-if="recipe" class="card">
      <div class="card-header text-center">
        <h5>{{ recipe.title }}</h5>
        <!-- Display the recipe title -->
      </div>
      <img :src="recipe.image" class="card-img-top" alt="Recipe Image" />
      <!-- Display the recipe image -->
      <div class="card-body">
        <div class="text-left mb-3">
          <div class="d-inline-block mr-3">
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} Minutes
            <!-- Display preparation time -->
          </div>
          <div class="d-inline-block mr-3">
            <i class="fas fa-utensils"></i> {{ recipe.servings }} Servings
            <!-- Display number of servings -->
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <h5>Ingredients</h5>
            <ul class="list-group list-group-flush ingredients-list">
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
                class="list-group-item"
              >
                {{ calculateAdjustedAmount(r) }} {{ r.unit }}
                {{ r.originalName }}
                <!-- List ingredients with amounts adjusted for servings -->
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5>Instructions</h5>
            <ol class="list-group list-group-flush instructions-list">
              <li
                v-for="(s, index) in recipe.instructions"
                :key="index"
                class="list-instruction-item"
              >
                <input
                  type="checkbox"
                  v-model="checkedInstructions[index]"
                  class="instruction-checkbox"
                />
                <!-- Checkbox for marking the instruction as done -->
                <span :class="{ 'checked-text': checkedInstructions[index] }">{{
                  s
                }}</span>
                <!-- Instruction text with strikethrough if checked -->
              </li>
            </ol>
            <div class="mt-1">
              <b-button
                class="mr-1"
                size="sm"
                variant=""
                @click="resetAllRecipeProgress"
                style="border-radius: 5px;"
                >Clear</b-button
              >
              <!-- Button to clear all checked instructions -->
              <b-button
                size="sm"
                variant="success"
                @click="markAsDone"
                style="border-radius: 5px;"
                >Mark As Done</b-button
              >
              <!-- Button to mark all instructions as done -->
            </div>
            <div class="mt-3">
              <h5>Recipe Progress</h5>
              <b-progress
                :value="checkedCount"
                :max="recipe.instructions.length"
                variant="success"
                animated
                show-progress
              >
                <b-progress-bar :value="checkedCount">
                  <strong
                    >{{ checkedCount }} /
                    {{ recipe.instructions.length }}</strong
                  >
                </b-progress-bar>
              </b-progress>
              <!-- Progress bar showing the completion rate of the recipe -->
            </div>
            <div class="mt-3">
              Choose Serving Amount:
              <br />
              <b-form-spinbutton
                id="sb-inline"
                v-model="recipe.servings"
                inline
                @change="handleServingsChange"
              ></b-form-spinbutton>
              <!-- Spin button to adjust the number of servings -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockGetRecipeFullDetails } from "../services/recipes.js";
import { getRecipeFullPage } from "@/services/recipes.js";
import { getRecipeProgress, setRecipeProgress } from "@/services/user.js";

// Utility function to debounce a function call
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default {
  name: "RecipeMaking",
  data() {
    return {
      recipe: null, // Holds the recipe data
      recipeId: this.$route.params.recipeId, // ID from route parameter
      checkedInstructions: [], // Array to track checked instructions
      originalServings: 0, // Store original servings to adjust ingredient amounts
    };
  },
  computed: {
    checkedCount() {
      return this.checkedInstructions.filter(Boolean).length; // Compute the number of checked instructions
    },
  },
  methods: {
    markAsDone() {
      this.checkedInstructions = this.checkedInstructions.map(() => true); // Mark all instructions as done
      this.saveProgress(); // Save progress after marking
    },
    calculateAdjustedAmount(ingredient) {
      return ingredient.amount * (this.recipe.servings / this.originalServings); // Calculate ingredient amount based on servings
    },
    async fetchRecipeDetails() {
      try {
        const response = await getRecipeFullPage(this.recipeId); // Fetch recipe details from server
        // Destructure and assign data to recipe object
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
        this.recipe = {
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
        this.originalServings = this.recipe.servings; // Set original servings

        // Initialize or load progress
        this.checkedInstructions =
          (await getRecipeProgress(this.recipe.id)) ||
          this.recipe.instructions.map(() => false);
      } catch (error) {
        console.error(error);
        this.$router.replace("/NotFound");
      }
    },
    handleServingsChange() {
      this.recipe.extendedIngredients.forEach((ingredient) => {
        // Adjust ingredient amounts when servings change
        this.$set(
          ingredient,
          "adjustedAmount",
          this.calculateAdjustedAmount(ingredient)
        );
      });
    },
    resetAllRecipeProgress() {
      this.checkedInstructions = this.checkedInstructions.map(() => false); // Reset all instructions to unchecked
      this.saveProgress(); // Save the reset progress
    },
    // Debounced saveProgress method to save recipe progress
    saveProgress: debounce(async function() {
      await setRecipeProgress({
        recipeId: this.recipeId,
        recipe_progress: this.checkedInstructions,
      });
    }, 300),
  },
  watch: {
    // Watch changes in checkedInstructions and debounce the save function
    checkedInstructions: {
      handler: debounce(async function() {
        await setRecipeProgress({
          recipeId: this.recipeId,
          recipe_progress: this.checkedInstructions,
        });
      }, 300),
      deep: true, // Ensure deep watching for array elements
    },
  },
  async created() {
    await this.fetchRecipeDetails(); // Fetch recipe details on component creation
  },
};
</script>

<style lang="scss" scoped>
/* Styles are defined here specific to the RecipeMaking component */
.card-img-top {
  max-height: 400px;
  object-fit: cover; /* Ensures the image fits well */
}

.list-group-item {
  border: none; /* Remove border from list items for a clean look */
  padding-left: 0; /* Adjust padding for alignment */
  margin-left: 20px; /* Space items for better readability */
  position: relative; /* Set position for before pseudo-elements */
}

.list-instruction-item {
  border: none; /* Remove border from instruction items */
  padding-left: 0; /* Adjust padding for alignment */
  position: relative; /* Set position for before pseudo-elements */
}

.ingredients-list {
  list-style-type: none; /* Remove default list style */
  padding-left: 0; /* Remove padding to align with other content */
}

.ingredients-list li:before {
  content: "\2022"; /* Add custom bullet points */
  color: #00ff00; /* Green color for bullet points */
  font-size: 1.5em; /* Larger bullet points for visibility */
  margin-right: 5px; /* Space between bullet points and text */
  position: absolute; /* Position bullet points absolutely within the li */
  left: -20px; /* Position to the left of the text */
  top: 5px; /* Align vertically with text */
}

.instructions-list {
  list-style-type: none; /* Remove default list style */
  padding-left: 0; /* Remove padding to align with other content */
}

.instructions-list li:before {
  font-size: 1.5em; /* Styling for instruction list markers */
  margin-right: 5px; /* Space between markers and text */
  position: absolute; /* Absolute positioning inside li */
  left: -20px; /* Position marker to the left of the text */
  top: 5px; /* Align marker vertically with text */
}

.instruction-checkbox {
  margin-right: 10px; /* Space checkbox from text */
}

.fas {
  margin-right: 5px; /* Space icons from text */
}

.d-inline-block.ml-auto {
  display: flex; /* Flex display for alignment */
  justify-content: flex-end; /* Align items to the right */
  align-items: center; /* Center items vertically */
}

.checked-text {
  text-decoration: line-through; /* Strikethrough style for checked items */
}

[data-toggle="tooltip"] {
  cursor: default; /* Default cursor for tooltip elements */
}

#override h5 {
  font-size: 18px; /* Specific font size for headings */
  color: #333; /* Dark grey color for text */
  margin-bottom: 5px; /* Space below headings */
  border-bottom: 2px solid #42b983; /* Green underline for emphasis */
  padding-bottom: 10px; /* Padding below text for visual separation */
}
</style>
