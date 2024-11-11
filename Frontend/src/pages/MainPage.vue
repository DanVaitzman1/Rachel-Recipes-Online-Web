<template>
  <div class="table">
    <!-- Layout for the entire page containing two columns -->
    <b-row class="row-container">
      <!-- Left Column - Display random recipes -->
      <b-col cols="12" md="6" lg="6">
        <div class="random-column">
          <div class="recipe-preview-container">
            <!-- Header for the random recipes section -->
            <h3 class="mb-4">Discover New Culinary Adventures</h3>
            <!-- First Row: Display up to two random recipes -->
            <b-row v-if="randomRecipes.length >= 3">
              <b-col v-for="recipe in firstRowRecipes" :key="recipe.id" lg="6">
                <!-- Component to preview a recipe -->
                <RecipePreview :recipe="recipe" />
              </b-col>
            </b-row>
            <!-- Second Row: Display the next two random recipes -->
            <b-row v-if="randomRecipes.length >= 4">
              <b-col
                v-for="recipe in randomRecipes.slice(2, 4)"
                :key="recipe.id"
                lg="6"
                class="recipe-row-two"
              >
                <RecipePreview :recipe="recipe" />
              </b-col>
            </b-row>
          </div>
          <!-- Button to randomize recipes -->
          <div class="random-button-container">
            <b-button
              id="random-button"
              @click="handleRandomize"
              variant="primary"
              class="random-button"
              ><i class="bi bi-shuffle"></i> Explore More Recipes</b-button
            >
          </div>
        </div>
      </b-col>
      <!-- Right Column - Display last viewed recipes or login page -->
      <b-col cols="12" md="6" lg="6">
        <div class="login-last-viewed">
          <div v-if="$root.store.username" class="container-user">
            <!-- Header for the last viewed recipes section -->
            <h3 class="mb-4">Recipes You've Recently Seen</h3>
            <!-- Display the last viewed recipes for logged-in users -->
            <b-row v-if="lastUserRecipes.length >= 1">
              <b-col
                v-for="recipe in firstRowRecipesUser"
                :key="recipe.id"
                lg="6"
              >
                <RecipePreview :recipe="recipe" />
              </b-col>
            </b-row>
            <b-row v-if="lastUserRecipes.length >= 3">
              <b-col
                v-for="recipe in lastUserRecipes.slice(2, 4)"
                :key="recipe.id"
                lg="6"
                class="recipe-row-two"
              >
                <RecipePreview :recipe="recipe" />
              </b-col>
            </b-row>
          </div>
          <!-- Display the login page if the user is not logged in -->
          <div v-else class="login-container">
            <LoginPage />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  fetchRandomRecipesFromServer,
  fetchLastViewedRecipesFromServer,
} from "@/services/recipes";
import RecipePreview from "@/components/RecipePreview.vue";
import LoginPage from "@/pages/LoginPage.vue";

export default {
  data() {
    return {
      randomRecipes: [],
      lastUserRecipes: [],
    };
  },
  components: {
    RecipePreview,
    LoginPage,
  },
  mounted() {
    this.fetchRandomRecipes();
    if (this.$root.store.username) {
      this.fetchLastViewedRecipes();
    }
  },
  watch: {
    "$root.store.username": function(newVal) {
      if (newVal) {
        this.fetchLastViewedRecipes();
      }
    },
  },
  methods: {
    async fetchRandomRecipes() {
      try {
        const response = await fetchRandomRecipesFromServer();
        this.randomRecipes = response.data.recipes;
      } catch (error) {
        console.error("Error fetching random recipes:", error);
      }
    },
    async fetchLastViewedRecipes() {
      if (this.$root.store.username) {
        try {
          const response = await fetchLastViewedRecipesFromServer();
          this.lastUserRecipes = response.data.recipes;
        } catch (error) {
          console.error("Error fetching last viewed recipes:", error);
        }
      }
    },
    handleRandomize() {
      this.fetchRandomRecipes();
    },
  },
  computed: {
    firstRowRecipes() {
      return this.randomRecipes.slice(0, 2);
    },
    firstRowRecipesUser() {
      return this.lastUserRecipes.slice(0, 2);
    },
  },
};
</script>

<style scoped>
.random-button-container {
  margin-top: 20px;
}

.login-container {
  padding: 20px;
  text-align: center;
}

.bi-shuffle {
  font-size: 1.4rem;
}

.mb-4 {
  font-weight: bold;
  font-size: 1.8rem;
  display: inline-block;
  border-bottom: 2px solid #42b983;
  text-align: center;
  width: 100%;
  margin: 0 auto;
}

.random-button {
  font-size: 1.6rem;
  margin-left: 180px;
}
</style>
