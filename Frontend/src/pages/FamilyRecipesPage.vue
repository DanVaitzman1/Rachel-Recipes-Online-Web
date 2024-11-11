<template>
  <div class="mt-3">
    <b-tabs content-class="mt-3" align="center" class="custom-tabs">
      <b-tab
        align="center"
        v-for="(recipe, index) in familyRecipes"
        :key="index"
        :title="recipe.title"
        :active="index === 0"
      >
        <b-card
          no-body
          class="custom-card"
          style="max-width: 90%; margin: 0 auto;"
        >
          <b-card-body>
            <b-card-title>{{ recipe.title }}</b-card-title>
            <b-card-sub-title class="mb-2">
              Made By {{ recipe.owner }}</b-card-sub-title
            >
            <b-card-sub-title class="mb-2">
              Usually Made On {{ recipe.FavoriteTime }}</b-card-sub-title
            >
            <div class="d-flex justify-content-center">
              <!-- Center the image wrapper -->
              <img
                :src="recipe.image"
                alt="Image"
                class="card-img-top same-width"
              />
            </div>
          </b-card-body>

          <div class="d-flex justify-content-center">
            <!-- Center the lists -->
            <div class="same-width d-flex justify-content-center">
              <b-list-group horizontal>
                <b-list-group-item>
                  <b-card-footer>Ingredients</b-card-footer>
                  <b-list-group flush>
                    <b-list-group-item
                      v-for="(ingredient,
                      ingIndex) in recipe.extendedIngredients"
                      :key="ingIndex"
                    >
                      {{ ingredient.amount }} {{ ingredient.unit }}
                      {{ ingredient.originalName }}
                    </b-list-group-item>
                  </b-list-group>
                </b-list-group-item>

                <b-list-group-item>
                  <b-card-footer>Instructions</b-card-footer>
                  <b-list-group flush>
                    <b-list-group-item
                      v-for="(instruction, insIndex) in recipe.instructions"
                      :key="insIndex"
                    >
                      {{ insIndex + 1 }}. {{ instruction }}
                    </b-list-group-item>
                  </b-list-group>
                </b-list-group-item>
              </b-list-group>
            </div>
          </div>
        </b-card>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import { mockGetFamilyRecipes } from "../services/recipes.js";

export default {
  data() {
    return {
      familyRecipes: [],
    };
  },
  components: {
    RecipePreviewList,
  },
  mounted() {
    this.fetchFavoriteRecipes();
  },
  methods: {
    async fetchFavoriteRecipes() {
      this.familyRecipes = mockGetFamilyRecipes().data.recipes;
    },
  },
};
</script>

<style scoped>
.custom-tabs >>> .nav-item .nav-link {
  background-color: #f8f9fa !important; /* Change to desired color */
  color: #000 !important; /* Change to desired text color */
  border: none !important; /* Remove any borders */
  box-shadow: none !important; /* Remove any box shadows */
}

.custom-tabs >>> .nav-item .nav-link.active {
  background-color: #2f2626 !important; /* Active tab background color */
  color: #fff !important; /* Active tab text color */
  border: none !important; /* Remove any borders */
  box-shadow: none !important; /* Remove any box shadows */
}

.custom-card >>> .card-img-top {
  height: auto; /* Maintain aspect ratio */
  max-height: 300px; /* Set the maximum height */
  object-fit: cover; /* Cover the container while maintaining aspect ratio */
}

.same-width {
  width: 800px; /* Set the desired width */
  max-width: 70%; /* Ensure the max width */
  margin: 0 auto; /* Center align */
}
</style>
