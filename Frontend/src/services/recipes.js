import axios from 'axios';
import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import multiple_recipes_full_view from "../assets/mocks/multiple_recipes_full_view.json";
import multiple_recipe_preview from "../assets/mocks/multiple_recipe_preview.json";
import family_recipes_full_view from "../assets/mocks/family_recipes_full_view.json";

import store from '../store.js';
const API_URL = store.server_domain;
 
/**
 * Fetch a specific number of recipe previews.
 * @param {number} amount - Number of recipes to fetch.
 * @returns {Object} - Object containing an array of recipe previews.
 */
export function mockGetRecipesPreview(amount = 1) {
  return { data: { recipes: multiple_recipe_preview.slice(0, amount) } };
}

/**
 * Fetch all available recipe previews.
 * @returns {Object} - Object containing an array of all recipe previews.
 */
export function mockGetAllRecipesPreview() {
  return { data: { recipes: [...multiple_recipe_preview] } };
}

/**
 * Fetch all family recipes.
 * @returns {Object} - Object containing an array of family recipes.
 */
export function mockGetFamilyRecipes() {
  return { data: { recipes: [...family_recipes_full_view] } };
}

/**
 * Fetch a recipe preview by its ID.
 * @param {string} id - Recipe ID.
 * @returns {Object} - Object containing the recipe preview if found.
 */
export function mockGetRecipePreviewById(id) {
  const recipe = multiple_recipe_preview.find(recipe => recipe.id === id);
  return { data: { recipe } };
}

/**
 * Fetch full details of a recipe, optionally in test mode.
 * @param {string} recipeId - The ID of the recipe.
 * @param {boolean} testMode - Flag to indicate whether to use test data.
 * @returns {Object} - Object containing the full details of the recipe or an error message if not found.
 */
export function mockGetRecipeFullDetails(recipeId, testMode = false) {
  if (testMode) {
    return { status: 200, data: { recipe: recipe_full_view } };
  }
  const recipe = multiple_recipes_full_view.find(r => r.id === recipeId);
  return recipe ? { status: 200, data: { recipe } } : { status: 404, data: { message: "Recipe not found" } };
}

/**
 * Fetch random recipes from the server.
 * @returns {Promise} - Promise object that resolves to the server's response.
 */
export async function fetchRandomRecipesFromServer() {
  try {
    const response = await axios.get(`${API_URL}/recipes/random`, { params: { number: 4 }, withCredentials: true });
    return { status: 200, data: { recipes: response.data } };
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
}

/**
 * Fetch the last viewed recipes from the server.
 * @returns {Promise} - Promise object that resolves to the server's response.
 */
export async function fetchLastViewedRecipesFromServer() {
  try {
    const response = await axios.get(`${API_URL}/users/LastViewedRecipes`);
    // console.log("2-1 services recipes.js check response.data = " , response.data);
    return { status: 200, data: { recipes: response.data } };
  } catch (error) {
    console.error('Error fetching last viewed recipes:', error);
    throw error;
  }
}

/**
 * Check if a recipe is the last viewed recipe by the user.
 * @param {string} recipeID - The ID of the recipe to check.
 * @returns {Promise} - Promise object that resolves to whether the recipe is the last viewed.
 */
export async function checkLastViewedRecipesFromServer(recipeID) {
  try {
    const response = await axios.get(`${API_URL}/users/IsLastViewedRecipe`, { params: { recipeId: recipeID } });
    return response.data.isLastViewed;
  } catch (error) {
    console.error('Error checking last viewed recipes:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Fetch full details of a specific recipe by its ID.
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise} - Promise object that resolves to the full details of the recipe.
 */
export async function getRecipeFullPage(recipeId) {
  try {
    const response = await axios.get(`${API_URL}/recipes/recipe/${recipeId}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching recipe: ${error.response ? error.response.data : error.message}`);
  }
}

/**
 * Perform a search for recipes based on various filters.
 * @param {string} recipeName - Name of the recipe to search for.
 * @param {string} cuisines - Filter by cuisines.
 * @param {string} diets - Filter by dietary restrictions.
 * @param {string} intolerances - Filter by intolerances.
 * @param {number} number - Number of recipes to return.
 * @param {string} sortBy - Criteria to sort the recipes.
 * @returns {Promise} - Promise object that resolves to the search results.
 */
export async function getSearchResultsFromServer(recipeName, cuisines, diets, intolerances, number, sortBy) {
  try {
    const response = await axios.get(`${API_URL}/recipes/search`, {
      params: {
        recipeName, cuisine: cuisines, diet: diets, intolerance: intolerances, number, sort: sortBy
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error while trying to search:', error.response ? error.response.data : error.message);
    throw error;
  }
}
