<template>
  <div>
    <!-- Embeds a RecipePreview component, passing the recipe data and a meal indicator -->
    <RecipePreview :recipe="recipe" :meal="true"></RecipePreview>
    <!-- Progress bar showing how many recipe instructions have been checked off -->
    <div class="recipe-preview mt-1">
      <b-progress
        :value="checkedCount"
        :max="recipe.instructions.length"
        variant="success"
        animated
        show-progress
      >
        <b-progress-bar :value="checkedCount">
          <strong>{{ checkedCount }} / {{ recipe.instructions.length }}</strong>
        </b-progress-bar>
      </b-progress>
    </div>
  </div>
</template>

<script>
import { getRecipeProgress } from "@/services/user.js"; // Imports a service to fetch recipe progress
import RecipePreview from "./RecipePreview.vue"; // Imports RecipePreview component for reuse

export default {
  name: "RecipeInMealPreview",
  extends: RecipePreview, // Extends RecipePreview to inherit its properties and methods
  components: {
    RecipePreview,
  },
  props: {
    recipe: {
      type: Object,
      required: true, // Expects a recipe object to be passed as a prop
    },
  },
  data() {
    return {
      checkedInstructions: [], // Array to track which instructions are checked off
    };
  },
  computed: {
    checkedCount() {
      // Computed property to count checked instructions
      return this.checkedInstructions.filter(Boolean).length;
    },
  },
  async mounted() {
    // Lifecycle hook to initialize the component
    this.checkedInstructions =
      (await getRecipeProgress(this.recipe.id)) || // Tries to fetch saved progress
      this.recipe.instructions.map(() => false); // Defaults to false for each instruction if no progress saved
    if (this.checkedInstructions.length === 0)
      this.checkedInstructions = this.recipe.instructions.map(() => false); // Ensures all instructions are accounted for even if none are saved
  },
};
</script>

<style lang="scss" scoped>
.recipe-preview {
  max-height: 340px;
  max-width: 340px;
}
</style>
