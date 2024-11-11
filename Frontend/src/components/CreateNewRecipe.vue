<template>
  <b-modal v-model="modalActive" @hide="close" size="lg" hide-footer>
    <!-- title="Come on, let's add a new recipe" -->
    <template #modal-header>
      <div class="custom-modal-header">
        <h5 class="modal-title">Come on, let's add a new recipe</h5>
        <b-button
          size="sm"
          variant="link"
          @click="close"
          aria-label="Close"
          class="close-button"
        >
          ✕
        </b-button>
      </div>
    </template>
    <!-- Main container for modal content -->
    <div class="modal-inner">
      <div class="modal-body">
        <!-- Left Column: Input fields for recipe details -->
        <div class="left-column">
          <h1>Recipe Details</h1>
          <input
            type="text"
            placeholder="Recipe Name"
            required
            v-model="title"
            :class="{ 'input-error': isFormSubmitted && !title }"
            class="input-style"
          />

          <!-- Container for selecting cooking time and number of servings -->
          <div class="time-servings-container">
            <div class="field-readyInMinutes">
              <select
                v-model.number="readyInMinutes"
                required
                class="styled-select"
                :class="{ 'input-error': isFormSubmitted && !readyInMinutes }"
              >
                <option disabled value="" class="placeholder"
                  >Cooking Time</option
                >
                <option v-for="time in cookingTimes" :key="time" :value="time"
                  >{{ time }} minutes</option
                >
              </select>
            </div>
            <div class="field-servings">
              <select
                v-model.number="servings"
                required
                class="styled-select"
                :class="{ 'input-error': isFormSubmitted && !servings }"
              >
                <option disabled value="">Number of diners</option>
                <option
                  v-for="serving in servingsOptions"
                  :key="serving"
                  :value="serving"
                  >{{ serving }} diners</option
                >
              </select>
            </div>
          </div>

          <!-- Textarea for recipe description -->
          <textarea
            id="summary"
            class="summary-textarea"
            placeholder="Description"
            v-model="summary"
            maxlength="100"
            required
            :class="{ 'input-error': isFormSubmitted && !summary }"
          ></textarea>

          <!-- Checkboxes for dietary preferences -->
          <div class="form-check">
            <b-form-checkbox
              v-model="vegan"
              id="inlineCheckbox1"
              name="inline-checkbox"
              switch
              style="margin-bottom: 10px;"
            >
              Vegan
            </b-form-checkbox>
          </div>
          <div class="form-check">
            <b-form-checkbox
              v-model="vegetarian"
              id="inlineCheckbox2"
              name="inline-checkbox"
              switch
              style="margin-bottom: 10px;"
            >
              Vegetarian
            </b-form-checkbox>
          </div>
          <div class="form-check">
            <b-form-checkbox
              v-model="isGlutenFree"
              id="inlineCheckbox3"
              name="inline-checkbox"
              switch
              style="margin-bottom: 15px;"
            >
              Gluten Free
            </b-form-checkbox>
          </div>

          <!-- Image URL input field -->
          <div class="image-form">
            <b-form-group
              label="Image URL"
              label-for="recipe-image"
              class="form-group"
            >
              <b-form-input
                id="recipe-image"
                v-model="image"
                required
                placeholder="Enter image URL"
                :class="{ 'input-error': isFormSubmitted && !image }"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>

        <!-- Right Column: Inputs for ingredients and instructions -->
        <div class="right-column">
          <h1>Ingredients:</h1>
          <!-- List each ingredient input group dynamically -->
          <div class="ingredients-container">
            <div
              v-for="(ingredient, index) in ingredients"
              :key="index"
              class="ingredients-group"
            >
              <input
                type="text"
                :placeholder="'Ingredient...'"
                v-model="ingredient.name"
                required
                :class="{ 'input-error': isFormSubmitted && !ingredient.name }"
              />
              <input
                type="number"
                :placeholder="'Quantity...'"
                step="0.5"
                min="0.5"
                v-model="ingredient.quantity"
                required
                :class="{
                  'input-error': isFormSubmitted && !ingredient.quantity,
                }"
              />
              <select
                v-model="ingredient.unit"
                class="select-unit"
                required
                :class="{ 'input-error': isFormSubmitted && !ingredient.unit }"
              >
                <option value="" disabled selected>Unit</option>
                <option v-for="unit in units" :key="unit" :value="unit">{{
                  unit
                }}</option>
              </select>
              <b-icon
                variant="danger"
                icon="dash"
                @click="removeIngredient(index)"
                :class="{ 'disabled-icon': ingredients.length == 1 }"
                style="margin-top: 5px;"
              ></b-icon>
            </div>
          </div>
          <b-icon variant="success" icon="plus" @click="addIngredient"></b-icon>

          <h1>Instructions</h1>
          <!-- List each instruction input group dynamically -->
          <div class="instructions-container">
            <div
              v-for="(instruction, index) in instructions"
              :key="index"
              class="instructions-group"
            >
              <input
                type="text"
                :placeholder="'Enter instruction...'"
                v-model="instruction.name"
                required
                :class="{ 'input-error': isFormSubmitted && !instruction.name }"
              />
              <b-icon
                variant="danger"
                icon="dash"
                @click="removeInstruction(index)"
                :class="{ 'disabled-icon': instructions.length === 1 }"
              ></b-icon>
            </div>
          </div>
          <b-icon
            variant="success"
            icon="plus"
            @click="addInstruction"
          ></b-icon>
        </div>
      </div>
    </div>

    <!-- Buttons for resetting fields or submitting the form -->
    <div class="buttons-group">
      <button @click="resetFields" type="button" class="reset-button">
        Clear
      </button>
      <button @click="submitForm">Create</button>
    </div>
  </b-modal>
</template>

<script>
import { BFormFile, BFormCheckbox, BModal, BToast } from "bootstrap-vue";
import { createNewRecipe } from "../services/user.js";

export default {
  components: { BFormFile, BFormCheckbox, BModal, BToast },
  props: {
    modalActive: Boolean, // Receives the state of the modal (open or closed) from the parent component
  },
  data() {
    return {
      title: "", // Holds the title of the recipe
      image: "", // Holds the URL of the recipe image
      readyInMinutes: "", // Holds the cooking time in minutes
      summary: "", // Holds a brief description of the recipe
      servings: "", // Holds the number of servings
      vegan: false, // Boolean indicating if the recipe is vegan
      vegetarian: false, // Boolean indicating if the recipe is vegetarian
      isGlutenFree: false, // Boolean indicating if the recipe is gluten-free
      ingredients: [{ name: "", quantity: "", unit: "" }], // Array to store ingredients with their details
      instructions: [{ name: "" }], // Array to store cooking instructions
      cookingTimes: [
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        75,
        90,
        105,
        120,
        135,
        150,
        165,
        180,
        210,
        240,
        270,
        300,
        330,
        360,
      ], // Predefined cooking times for selection
      servingsOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // Predefined serving options for selection
      units: [
        "Milligram",
        "Gram",
        "Kilogram",
        "Milliliter",
        "Liter",
        "Curt",
        "Tablespoon",
        "Teaspoon",
        "Spoon",
        "Cup",
      ], // Units of measurement for ingredients
      isFormSubmitted: false, // Flag to indicate if the form has been submitted (for validation purposes)
    };
  },
  methods: {
    close() {
      this.$emit("close"); // Emits an event to close the modal, handled by the parent component
    },
    addIngredient() {
      // Adds a new ingredient to the ingredients array if the last ingredient details are filled
      if (this.canAddIngredient) {
        this.ingredients.push({ name: "", quantity: "", unit: "" });
      }
    },
    removeIngredient(index) {
      // Removes an ingredient from the ingredients array if more than one ingredient exists
      if (this.ingredients.length > 1) {
        this.ingredients.splice(index, 1);
      }
    },
    addInstruction() {
      // Adds a new instruction to the instructions array if the last instruction is not empty
      if (this.canAddInstruction) {
        this.instructions.push({ name: "" });
      }
    },
    removeInstruction(index) {
      // Removes an instruction from the instructions array if more than one instruction exists
      if (this.instructions.length > 1) {
        this.instructions.splice(index, 1);
      }
    },
    resetFields(confirmed = false) {
      // Resets all form fields to their default values
      if (confirmed) {
        this.title = "";
        this.readyInMinutes = "";
        this.summary = "";
        this.servings = "";
        this.vegan = false;
        this.vegetarian = false;
        this.isGlutenFree = false;
        this.ingredients = [{ name: "", quantity: "", unit: "" }];
        this.instructions = [{ name: "" }];
        this.image = null;
        this.isFormSubmitted = false;
      } else {
        if (confirm("Are tou sure you want to delete ? ")) {
          this.title = "";
          this.readyInMinutes = "";
          this.summary = "";
          this.servings = "";
          this.vegan = false;
          this.vegetarian = false;
          this.isGlutenFree = false;
          this.ingredients = [{ name: "", quantity: "", unit: "" }];
          this.instructions = [{ name: "" }];
          this.image = null;
          this.isFormSubmitted = false;
        }
      }
    },
    async submitForm() {
      // Submits the form data to create a new recipe after validating the form
      this.isFormSubmitted = true;
      if (this.isFormValid()) {
        const recipeContent = {
          title: this.title,
          image: this.image,
          ready_in_minutes: this.readyInMinutes,
          summary: this.summary,
          servings: this.servings,
          vegan: this.vegan,
          vegetarian: this.vegetarian,
          is_gluten_free: this.isGlutenFree,
          ingredients: this.ingredients,
          instructions: this.instructions,
        };
        const response = await createNewRecipe(recipeContent);
        if (response.status === 201 && response.data.success) {
          this.$root.$bvToast.toast("Recipe added successfully.", {
            title: "Success!",
            variant: "success",
            toaster: "b-toaster-top-right",
            solid: true,
            autoHideDelay: 2000,
            appendToast: true,
          });
          this.$emit("close");
          this.resetFields(true);
        } else {
          this.$root.$bvToast.toast(
            "Failed to add the recipe. Please try again.",
            {
              title: "Failed!",
              variant: "danger",
              toaster: "b-toaster-top-right",
              solid: true,
              autoHideDelay: 2000,
              appendToast: true,
            }
          );
        }
      }
    },
    isFormValid() {
      // Validates the form data to ensure all fields are correctly filled
      return (
        this.title &&
        this.image &&
        this.readyInMinutes &&
        this.summary &&
        this.servings &&
        this.ingredients.every(
          (ingredient) =>
            ingredient.name && ingredient.quantity && ingredient.unit
        ) &&
        this.instructions.every((instruction) => instruction.name)
      );
    },
  },
  computed: {
    canAddIngredient() {
      // Checks if the last ingredient is fully specified to allow adding a new one
      const lastIngredient = this.ingredients[this.ingredients.length - 1];
      return (
        lastIngredient.name && lastIngredient.quantity && lastIngredient.unit
      );
    },
    canAddInstruction() {
      // Checks if the last instruction is not empty to allow adding a new one
      const lastInstruction = this.instructions[this.instructions.length - 1];
      return !!(lastInstruction && lastInstruction.name.trim());
    },
  },
};
</script>

<style lang="scss" scoped>
/* General styles for the modal form, with specific focus on the layout and functionality of the input fields and the modal itself. */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between columns */
  padding: 0.5rem;
  max-height: 80vh;
  overflow-y: auto;
}
.custom-modal-headr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #e62721;
  position: relative;
}
.modal-inner {
  display: flex;
  flex-direction: column; /* Arrange columns vertically on smaller screens */
  gap: 15px;
  width: 100%;
  max-width: 100%; /* Allow the modal to expand to full width on smaller screens */
}
.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #080808;
  margin: 0;
  padding-left: 10px; /* Adjust padding if needed */
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  gap: 10px; /* Space between form elements */
  width: 100%;
}
@media (min-width: 768px) {
  /* Styles for medium and larger screens */
  .modal-inner {
    flex-direction: row; /* Arrange columns side by side on larger screens */
    align-items: flex-start;
    gap: 20px;
  }
  .right-column .left-column {
    width: 50%;
    flex: 1;
  }
}

.input-style,
.summary-textarea,
.styled-select {
  width: 100%; /* Full width within column */
  padding: 10px;
  border: 1px solid #ccc; /* Consistent border styling */
  border-radius: 5px; /* Rounded borders */
  margin-bottom: 10px; /* Space below each input */
  box-sizing: border-box;
}

.input-error {
  border-color: red; /* Highlight inputs with errors */
}

.buttons-group {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* Space between buttons */
  margin-top: 10px;
  flex-wrap: wrap;
}
.reset-button,
button {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #42b983; /* Green background for primary action */
  color: white;
  flex: 1;
  margin-bottom: 5px;
  &:hover {
    background-color: #36a372; /* Darker green on hover */
  }
}

.reset-button {
  background-color: grey; /* Grey background for reset button */
  &:hover {
    background-color: #4f4c4c; /* Darker grey on hover */
  }
}
/* Align ingredient fields in a single row */
.ingredients-group {
  display: flex;
  gap: 5px; /* Space between ingredient fields */
  align-items: center; /* Align items vertically in the center */
}

.ingredients-group input[type="text"],
.ingredients-group input[type="number"],
.ingredients-group select {
  flex: 1; /* Allow each field to take equal space */
  min-width: 0; /* Prevent fields from growing too large */
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
  font-size: 1.2rem;
  color: #6c7277;
  line-height: 1;
  border: none;
  background-color: transparent;
}

.close-button:hover {
  color: #dc3545; /* Color on hover for better accessibility */
  background-color: #080808;
  text-decoration: none;
}
</style>
