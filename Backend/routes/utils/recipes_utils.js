const axios = require("axios");
const DButils = require("../utils/DButils");
const api_domain = "https://api.spoonacular.com/recipes";

// ====================== Random Recipes ==============================================================================

/**
 * Fetch a list of random recipes from the Spoonacular API and extract relevant data for preview.
 * @param {number} number - Number of random recipes to fetch. Default is 3.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipe previews.
 * @throws {Object} - Throws an error if no random recipes are found or there is an issue with the Spoonacular API.
 */
async function getRandomRecipes(number = 4) {
  const params = {
    apiKey: process.env.spooncular_apiKey,
    number: number,
  };
  const url = `${api_domain}/random`; // Corrected to use backticks for template literals
  const randomRecipes = await axios.get(url, { params });

  if (randomRecipes.data.recipes.length > 0) {
    // Map and return the relevant recipe details for preview
    return randomRecipes.data.recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      readyInMinutes: recipe.readyInMinutes,
      image: recipe.image,
      aggregateLikes: recipe.aggregateLikes,
      vegan: recipe.vegan,
      vegetarian: recipe.vegetarian,
      glutenFree: recipe.glutenFree,
    }));
  } else {
    throw {
      status: 500,
      message: "No random recipes found or issue with Spoonacular API.",
    };
  }
}

//====================================================================================================

/**
 * Fetches the full information of a recipe either from the database or from the Spoonacular API.
 * @param {number} recipe_id - The ID of the recipe to retrieve.
 * @param {boolean} is_search - Indicates if the request is part of a search operation.
 * @returns {Promise<Object>} - A promise that resolves to an object containing recipe information.
 */
async function getRecipeInformation(recipe_id, is_search = false) {
  
  const checkIfFromDB = await DButils.execQuery(
    `SELECT 1 FROM myrecipes WHERE recipe_id = '${recipe_id}'`
  );

  if (checkIfFromDB.length > 0 && !is_search) {
    // Fetch recipe from the database
    const recipeInformation = (
      await DButils.execQuery(
        `SELECT * FROM myrecipes WHERE recipe_id = '${recipe_id}'`
      )
    )[0];
    return { recipeInformation: recipeInformation, fromDB: true };
  } else {
    // Fetch recipe from Spoonacular API
    const recipeInformation = await axios.get(
      `${api_domain}/${recipe_id}/information`, // Corrected to use backticks
      {
        params: {
          includeNutrition: false,
          apiKey: process.env.spooncular_apiKey,
        },
      }
    );
    return { recipeInformation: recipeInformation, fromDB: false };
  }
}

/**
 * Fetches the recipe details for preview based on the recipe ID.
 * @param {number} recipe_id - The ID of the recipe to retrieve details for.
 * @param {boolean} is_search - Indicates if the request is part of a search operation.
 * @returns {Promise<Object>} - A promise that resolves to an object containing recipe preview details.
 */
async function getRecipeDetails(recipe_id, is_search = false) {
  if(!recipe_id) {
    throw new Error("invalid recipe id : ",recipe_id);
  }
  let recipe_info = await getRecipeInformation(recipe_id, is_search);
  const recipeInformation = recipe_info.recipeInformation;
  const fromDB = recipe_info.fromDB;

  if (fromDB && !is_search) {
    // Return recipe details from the database
    let {
      recipe_id,
      title,
      ready_in_minutes,
      image,
      vegan,
      vegetarian,
      is_gluten_free,
    } = recipeInformation;
    return {
      id: recipe_id,
      title: title,
      readyInMinutes: ready_in_minutes,
      image: image,
      popularity: 0,
      vegan: Boolean(vegan),
      vegetarian: Boolean(vegetarian),
      glutenFree: Boolean(is_gluten_free),
    };
  } else {
    // Return recipe details from Spoonacular API
    let {
      id,
      title,
      readyInMinutes,
      image,
      aggregateLikes,
      vegan,
      vegetarian,
      glutenFree,
    } = recipeInformation.data;
    return {
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      image: image,
      popularity: aggregateLikes,
      vegan: vegan,
      vegetarian: vegetarian,
      glutenFree: glutenFree,
    };
  }
}

/**
 * Retrieves the full information of a recipe from either the database or the Spoonacular API.
 * @param {number} recipe_id - The ID of the recipe to retrieve full information for.
 * @param {boolean} fromDB - Flag to indicate whether to fetch from the database.
 * @returns {Promise<Object>} - A promise that resolves to an object containing full recipe information.
 */
async function getRecipeFullInformation(recipe_id, fromDB) {
  if (fromDB) {
    // Fetch full recipe information from the database
    const recipe_information = (
      await DButils.execQuery(
        `SELECT * FROM myrecipes WHERE recipe_id = '${recipe_id}'`
      )
    )[0];
    const recipe_ingredients = await DButils.execQuery(
      `SELECT * FROM ingredients WHERE recipe_id = '${recipe_id}'`
    );
    const recipe_instructions = await DButils.execQuery(
      `SELECT * FROM instructions WHERE recipe_id = '${recipe_id}' ORDER BY instruction_order`
    );

    const recipe = {
      recipe_information: recipe_information,
      recipe_ingredients: recipe_ingredients,
      recipe_instructions: recipe_instructions,
    };

    return recipe;
  } else {
    // Fetch full recipe information from Spoonacular API
    return await axios.get(`${api_domain}/${recipe_id}/information`, { // Corrected to use backticks
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey,
      },
    });
  }
}

/**
 * Retrieves the full details of a specific recipe by its ID.
 * @param {number} recipe_id - The ID of the recipe to retrieve full details for.
 * @returns {Promise<Object>} - A promise that resolves to an object containing full recipe details.
 */
async function getRecipeFullDetails(recipe_id) {
  const checkIfFromDB = await DButils.execQuery(
    `SELECT 1 FROM myrecipes WHERE recipe_id = '${recipe_id}'`
  );

  if (checkIfFromDB.length == 0) {
    // Fetch recipe details from Spoonacular API
    let recipe = await getRecipeFullInformation(recipe_id, false);
    let {
      id,
      title,
      readyInMinutes,
      image,
      aggregateLikes,
      vegan,
      vegetarian,
      glutenFree,
      analyzedInstructions,
      extendedIngredients,
      servings,
    } = recipe.data;
    return {
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      image: image,
      popularity: aggregateLikes,
      vegan: vegan,
      vegetarian: vegetarian,
      glutenFree: glutenFree,
      instructions: analyzedInstructions[0].steps.map((step) => step.step),
      extendedIngredients: extendedIngredients,
      servings: servings,
    };
  } else {
    // Fetch recipe details from the database
    let recipe = await getRecipeFullInformation(recipe_id, true);
    let {
      recipe_id: db_recipe_id,
      title,
      ready_in_minutes,
      image,
      vegan,
      vegetarian,
      is_gluten_free,
      servings,
    } = recipe.recipe_information;
    let ingredients = [];
    for (const ingredient of recipe.recipe_ingredients) {
      let { name, quantity, unit } = ingredient;
      ingredients.push({ originalName: name, amount: quantity, unit: unit });
    }
    let instructions = [];
    for (const instruction of recipe.recipe_instructions) {
      let { instruction_text } = instruction;
      instructions.push(instruction_text);
    }
    return {
      id: db_recipe_id,
      title: title,
      readyInMinutes: ready_in_minutes,
      image: image,
      popularity: 0,
      vegan: Boolean(vegan),
      vegetarian: Boolean(vegetarian),
      glutenFree: Boolean(is_gluten_free),
      instructions: instructions,
      extendedIngredients: ingredients,
      servings: servings,
    };
  }
}

/**
 * Searches for recipes based on various parameters.
 * @param {string} recipeName - Name of the recipe to search.
 * @param {string} cuisines - Comma-separated list of cuisines to filter by.
 * @param {string} diets - Comma-separated list of diets to filter by.
 * @param {string} intolerances - Comma-separated list of intolerances to filter by.
 * @param {number} number - Number of recipes to retrieve.
 * @param {string} sort - Sorting order for the search results.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipe previews.
 */
async function searchRecipe(
  recipeName,
  cuisines,
  diets,
  intolerances,
  number,
  sort
) {
  const response = await axios.get(`${api_domain}/complexSearch`, { // Corrected to use backticks
    params: {
      query: recipeName,
      cuisine: cuisines,
      diet: diets,
      intolerances: intolerances,
      number: number,
      sort: sort,
      apiKey: process.env.spooncular_apiKey,
    },
  });
  let recipeIds = response.data.results.map((recipe) => recipe.id);
  return await getRecipesPreview(recipeIds, true);
}

/**
 * Retrieves previews of multiple recipes based on an array of recipe IDs.
 * @param {Array} recipes_id_array - Array of recipe IDs to retrieve previews for.
 * @param {boolean} is_search - Indicates if the request is part of a search operation.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipe previews.
 */
async function getRecipesPreview(recipes_id_array, is_search = false) {
  const recipesDetailsArray = [];
  const recipeDetailsPromises = recipes_id_array.map(async (recipe_id) => {
    const recipeDetails = await getRecipeDetails(recipe_id, is_search);
    return recipeDetails;
  });

  const resolvedRecipesDetails = await Promise.all(recipeDetailsPromises);
  recipesDetailsArray.push(...resolvedRecipesDetails);

  return recipesDetailsArray;
}

// Export functions to be used in other modules
exports.searchRecipe = searchRecipe;
exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeFullDetails = getRecipeFullDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.getRecipesPreview = getRecipesPreview;