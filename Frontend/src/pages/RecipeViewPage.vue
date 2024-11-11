<template>
  <div class="container mt-4">
    <div v-if="recipe" class="card">
      <!-- Card header with the recipe title -->
      <div class="card-header text-center">
        <h1 class="card-title">{{ recipe.title }}</h1>
      </div>
      <!-- Recipe image -->
      <img :src="recipe.image" class="card-img-top" alt="Recipe Image" />
      <div class="card-body">
        <!-- Recipe metadata (time, likes, servings, dietary preferences) -->
        <div class="text-left mb-3">
          <div class="d-inline-block mr-3">
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} Minutes
          </div>
          <div class="d-inline-block mr-3">
            <i class="fas fa-heart red"></i> {{ recipe.aggregateLikes }} Likes
          </div>
          <div class="d-inline-block mr-3">
            <i class="fas fa-utensils"></i> {{ recipe.servings }} Servings
          </div>
          <div class="d-inline-block ml-auto">
            <!-- Icons for dietary preferences with tooltips -->
            <span
              v-if="recipe.vegetarian"
              class="mr-2 green"
              data-toggle="tooltip"
              title="Vegetarian"
            >
              <i class="fas fa-seedling text-success"></i>
            </span>
            <span
              v-if="recipe.vegan"
              class="mr-2"
              data-toggle="tooltip"
              title="Vegan"
            >
              <i class="fas fa-leaf text-success"></i>
            </span>
            <span
              v-if="recipe.glutenFree"
              class="mr-2 brown"
              data-toggle="tooltip"
              title="Gluten Free"
            >
              <i class="fas fa-bread-slice"></i>
            </span>
          </div>
        </div>
        <!-- Ingredient and instruction lists -->
        <div class="row mb-3">
          <div class="col-md-6">
            <h5>Ingredients</h5>
            <ul class="list-group list-group-flush custom-list">
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
                class="list-group-item"
              >
                {{ r.originalName }} {{ r.amount }} {{ r.unit }}
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5>Instructions</h5>
            <ol class="list-group list-group-flush custom-list">
              <li
                v-for="(s, index) in recipe.instructions"
                :key="index"
                class="list-group-item"
              >
                {{ s }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <!-- Action buttons to start cooking or add the recipe to a meal -->
    <div class="text-center mt-4">
      <b-button
        variant="success"
        @click="makeRecipe"
        class="btn btn-primary mt-2"
        style="border-radius: 5px;"
        >Let's Start Cooking This Recipe</b-button
      >
      <br />
      <b-button
        variant="success"
        @click="addToMeal"
        class="btn btn-primary mt-2"
        :disabled="!$root.store.username"
        style="border-radius: 5px;"
        >Add To My Meal</b-button
      >
    </div>
    <br />
  </div>
</template>

<script>
import { addToMyMeal, getRecipesInMyMeal, updateLastViewedRecipesServer } from "@/services/user.js";
// import { addToMyMeal } from "../services/user.js";
import { getRecipeFullPage } from "@/services/recipes.js";

export default {
  name: "recipe",
  data() {
    return {
      recipe: null,
      recipeId: this.$route.params.recipeId,
    };
  },
  async created() {
    try {
      const response = await getRecipeFullPage(this.recipeId);
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
    } catch (error) {
      console.error("Error fetching recipe:", error.message);
      this.$router.replace("/NotFound");
    }
  },
  mounted() {
    this.addUserWatched(); // Track user's recipe viewing activity
  },
  methods: {
    async addToMeal() {
      try {
        await addToMyMeal({ recipeId: this.recipeId });
        const recipes = await getRecipesInMyMeal();
        this.$emit("update:recipes", [...recipes]);
        // console.log("update:recipes event emitted", recipes);
      } catch (error) {
        console.error("Error handling add recipe to my meal:", error);
      }
    },
    async makeRecipe() {
      try {
        await addToMyMeal({ recipeId: this.recipeId });
        const recipes = await getRecipesInMyMeal();
        this.$emit("update:recipes", [...recipes]);
        // console.log("update:recipes event emitted", recipes);
        this.$router.push({
          name: "RecipeMaking",
          params: { recipeId: this.recipeId },
        });
      } catch (error) {
        console.error("Error handling add recipe to my meal:", error);
      }
    },
    async addUserWatched() {
      if (this.$root.store.username) {
        await updateLastViewedRecipesServer(this.recipeId);
      }
    },
  },
};
</script>

<style scoped>
.card-img-top {
  max-height: 400px;
  object-fit: cover;
}

.list-group-item {
  border: none;
  padding-left: 0;
  margin-left: 20px; /* Consistent margin for text alignment */
  position: relative;
}

.custom-list {
  list-style-type: none;
  padding-left: 0; /* Custom padding */
}

.custom-list li:before {
  content: "\2022"; /* Unicode character for bullet (•) */
  color: #00ff00; /* Custom color */
  font-size: 1.5em; /* Adjust size */
  margin-right: 5px; /* Space between bullet and text */
  position: absolute;
  left: -20px; /* Adjust based on design */
  top: 5px;
}

.fas {
  margin-right: 5px;
}

.d-inline-block.ml-auto {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.brown {
  color: rgb(184, 168, 147);
}

.red {
  color: red;
}

[data-toggle="tooltip"] {
  cursor: default;
}
</style>
