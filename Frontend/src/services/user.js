import axios from "axios";
import store from '../store.js';
const API_URL = store.server_domain;




/**
 * Sends a POST request to add a new recipe to the server.
 * @param {Object} credentials - Recipe data to be added.
 * @returns {Promise} - Axios response object.
 */
export async function createNewRecipe(credentials) {
  try {
    const response = await axios.post(API_URL +`/users/addNewRecipe`, credentials, { withCredentials: true });
    return response;
  } catch (error) {
    console.error("Error creating new recipe: ", error);
    throw error;
  }
}

/**
 * Fetches recipes that belong to the authenticated user.
 * @returns {Promise<Array>} - An array of recipes if successful, otherwise an empty array.
 */
export async function getRecipeInMyRecipes() {
  try {
    const response = await axios.get(`${API_URL}/users/MyRecipes`);
    if (response.status !== 200) return [];
    return response.data;
  } catch (error) {
    console.error("Error fetching user's recipes: ", error);
    throw error;
  }
}

/**
 * Retrieves the user's favorite recipes, optionally with previews.
 * @param {boolean} with_preview - If true, fetches previews for the recipes.
 * @returns {Promise<Array>} - An array of favorite recipes or their previews.
 */
export async function getRecipeInFavorites(with_preview = true) {
  try {
    const response = await axios.get(`${API_URL}/users/FavoritesRecipes`);
    if (response.status !== 200) return [];

    if (with_preview) {
      const credentials = { recipes_id: response.data };
      const preview_response = await axios.post(`${API_URL}/recipes/RecipesPreview`, credentials, { withCredentials: true });
      return preview_response.data;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    throw error;
  }
}

/**
 * Checks if a recipe is in the user's favorites.
 * @param {string} recipe_id - ID of the recipe to check.
 * @returns {Promise<boolean>} - True if the recipe is a favorite, false otherwise.
 */
export async function isRecipeInFavorites(recipe_id) {
  try {
    const favorites = await getRecipeInFavorites(false);
    return favorites.some((recipeId) => recipeId === String(recipe_id) || recipeId === Number(recipe_id));
  } catch (error) {
    console.error("Error checking if recipe is favorite: ", error);
    throw error;
  }
}

/**
 * Marks a recipe as favorite.
 * @param {Object} credentials - Recipe information to mark as favorite.
 * @returns {Promise<Object>} - The server response.
 */
export async function markAsFavorite(credentials) {
  try {
    const existiInFaviorites = await isRecipeInFavorites(credentials.recipeId);
    if (existiInFaviorites)
    {
      // console.log("Recipe is already in favorites.");
      return;
    }
    const response = await axios.post(`${API_URL}/users/FavoritesRecipes`, credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error marking recipe as favorite: ", error);
    throw error;
  }
}

/**
 * Removes a recipe from favorites.
 * @param {string} recipe_id - ID of the recipe to remove.
 * @returns {Promise<Object>} - The server response.
 */
export async function unMarkAsFavorite(credentials) {
  try {
    // console.log("credentials = ",credentials);
    const response = await axios.delete(`${API_URL}/users/FavoritesRecipes`, { data: credentials, withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error unmarking recipe as favorite: ", error);
    throw error;
  }
}

/**
 * Updates the last viewed recipes by the user.
 * @param {string} recipe_Id - ID of the last viewed recipe.
 * @returns {Promise} - The response from the server.
 */
export async function updateLastViewedRecipesServer(recipe_Id) {
  try {
    const response = await axios.post(`${API_URL}/users/LastViewedRecipes`, { recipeId: recipe_Id }, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error updating last viewed recipes:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Adds a recipe to the user's meal.
 * @param {Object} credentials - Recipe information.
 * @returns {Promise<Object>} - The server response.
 */
export async function addToMyMeal(credentials) {
  try {
    const response = await axios.post(`${API_URL}/users/MyMeal`, credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error adding recipe to my meal: ", error);
    throw error;
  }
}

/**
 * Removes a recipe from the user's meal.
 * @param {string} recipe_id - ID of the recipe to remove.
 * @returns {Promise<Object>} - The server response.
 */
export async function removeFromMyMeal(recipe_id) {
  try {
    const response = await axios.delete(`${API_URL}/users/MyMeal`, { data: { recipeId: recipe_id }, withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error removing recipe from my meal: ", error);
    throw error;
  }
}

/**
 * Retrieves all recipes currently included in the user's meal.
 * @returns {Promise<Array>} - An array of recipes in the meal.
 */
export async function getRecipesInMyMeal() {
  try {
    const response = await axios.get(`${API_URL}/users/MyMeal`);
    if (response.status !== 200) return [];
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes in meal: ", error);
    throw error;
  }
}

/**
 * Retrieves the progress of a recipe that the user is making.
 * @param {string} recipeId - ID of the recipe for which progress is sought.
 * @returns {Promise<Object>} - The recipe progress data.
 */
export async function getRecipeProgress(recipeId) {
  try {
    const response = await axios.get(`${API_URL}/users/RecipeMakingProgress/${recipeId}`);
    return response.data.recipe_progress;
  } catch (error) {
    throw new Error(`Error fetching recipe progress: ${error.response ? error.response.data : error.message}`);
  }
};

/**
 * Updates the progress of a recipe that the user is making.
 * @param {Object} credentials - Contains the recipe ID and its new progress data.
 * @returns {Promise<Object>} - The server response indicating success or failure.
 */
export async function setRecipeProgress(credentials) {
  try {
    const response = await axios.put(`${API_URL}/users/RecipeMaking`, credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error setting recipe progress: ", error);
    throw error;
  }
}

/**
 * Updates the order of recipes within a user's meal.
 * @param {Object} credentials - Contains the new order of recipe IDs.
 * @returns {Promise<Object>} - The server response indicating success or failure.
 */
export async function updateRecipesOrder(credentials) {
  try {
    const response = await axios.put(`${API_URL}/users/MyMeal`, credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error reordering recipes in meal: ", error);
    throw error;
  }
}

/**
 * Mock function to simulate adding a recipe as a favorite.
 * @param {string} recipeId - The ID of the recipe to mark as favorite.
 * @param {boolean} like - The like status.
 * @returns {Object} - Mock success response.
 */
export function mockAddFavorite(recipeId, like) {
  return {
    status: 200,
    response: {
      data: {
        message: "The Recipe successfully saved as favorite",
        success: true,
      },
    },
  };
}

/**
 * Mock function to simulate adding a user recipe.
 * @param {Object} recipeDetails - Details of the recipe to add.
 * @returns {Object} - Mock success response.
 */
export function mockAddUserRecipe(recipeDetails) {
  return {
    status: 200,
    response: {
      data: {
        message: "The Recipe successfully added to My Recipes",
        success: true,
      },
    },
  };
}
