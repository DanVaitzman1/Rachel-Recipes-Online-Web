var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Middleware to authenticate all incoming requests.
 * Checks if a session exists and validates the user against the database.
 * If the user is authenticated, the user ID is stored in req.user_id and proceeds to the next middleware or route handler.
 * Otherwise, it responds with a 401 Unauthorized status.
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery(`SELECT user_id FROM users`)
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

// ====================== Last View Section ==============================================================================

/**
 * Adds a recipe to the last viewed list of the logged-in user.
 * Endpoint: POST /LastViewedRecipes
 * Body Parameters: recipeId (ID of the recipe to be added to the last viewed list)
 * Response: Success or failure message.
 */
router.post("/LastViewedRecipes", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.updateLastViewed(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as LastViwed");
  } catch (error) {
    next(error);
  }
});

/**
 * Retrieves the last viewed recipes saved by the logged-in user.
 * Endpoint: GET /LastViewedRecipes
 * Response: List of last viewed recipes.
 */
router.get("/LastViewedRecipes", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getLastViewedRecipes(user_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * Checks if a specific recipe is in the last viewed list of the logged-in user.
 * Endpoint: GET /IsLastViewedRecipe
 * Query Parameters: recipeId (ID of the recipe to check)
 * Response: Boolean indicating if the recipe is in the last viewed list.
 */
router.get("/IsLastViewedRecipe", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.query.recipeId;
    const recipes_id = await user_utils.getAllLastViewedRecipes(user_id);
    const isLastViewed = recipes_id.some((id) => String(id) === recipe_id);

    res.status(200).send({ isLastViewed });
  } catch (error) {
    next(error);
  }
});
// ====================================================================================================

/**
 * Adds a recipe to the favorites list of the logged-in user.
 * Endpoint: POST /FavoritesRecipes
 * Body Parameters: recipeId (ID of the recipe to be added to the favorites list)
 * Response: Success or failure message.
 */
router.post("/FavoritesRecipes", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * Retrieves the favorite recipes saved by the logged-in user.
 * Endpoint: GET /FavoritesRecipes
 * Response: List of favorite recipes.
 */
router.get("/FavoritesRecipes", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    if (recipes_id.length == 0) {
      throw { status: 203, message: "This user has no favorite Recipes ." };
    }
    res.status(200).send(recipes_id);
  } catch (error) {
    console.log("2.3 user.js - line 129 get(/FavoritesRecipes) error = ",error.message);
    next(error);
  }
});

/**
 * Removes a recipe from the favorites list of the logged-in user.
 * Endpoint: DELETE /FavoritesRecipes
 * Body Parameters: recipeId (ID of the recipe to be removed from the favorites list)
 * Response: Success or failure message.
 */
router.delete("/FavoritesRecipes", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.removeFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed from favorites");
  } catch (error) {
    next(error);
  }
});

/**
 * Adds a new recipe created by the logged-in user.
 * Endpoint: POST /addNewRecipe
 * Body Parameters: Details of the recipe to be added.
 * Response: Success or failure message.
 */
router.post("/addNewRecipe", async (req, res, next) => {
  try {
    let recipe_details = {
      user_id: req.session.user_id,
      title: req.body.title,
      image: req.body.image,
      ready_in_minutes: req.body.ready_in_minutes,
      summary: req.body.summary,
      servings: req.body.servings,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      is_gluten_free: req.body.is_gluten_free,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
    };
    console.log("recipe_details.instructions = ", recipe_details.instructions);
    recipe_id = await user_utils.addNewRecipe(recipe_details);
    res.status(201).send({
      message: "Recipe has been successfully created.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Retrieves the recipes in the user's meal.
 * Endpoint: GET /MyMeal
 * Response: List of recipes in the user's meal.
 */
router.get("/MyMeal", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    console.log("user_id = ", user_id);
    const recipes_info = await user_utils.getMyMealRecipes(user_id);
    if (recipes_info.length == 0) {
      throw { status: 203, message: "This user has no recipes in his meal." };
    }
    const recipes_id = recipes_info
    .filter((recipe) => !(recipe.recipeId === 'undefined' && recipe.externalRecipeId === 'undefined'))
    .map((recipe) => {
      return recipe.recipe_id;
    });
    // if (recipes_id.length == 0) {
    //   throw { status: 203, message: "This user has no recipes in his meal." };
    // }
    // Get the recipe previews
    const recipePreviews = await recipe_utils.getRecipesPreview(recipes_id);
    // Merge recipe progress into the recipe previews
    const results = await user_utils.fetchRecipeProgress(
      recipes_info,
      recipePreviews
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * Adds a recipe to the user's meal.
 * Endpoint: POST /MyMeal
 * Body Parameters: recipeId (ID of the recipe to be added to the meal)
 * Response: Success or failure message.
 */
router.post("/MyMeal", async (req, res, next) => {
  try {
    console.log("1");
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    console.log("2");
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log("3");
    console.log("user id = ", user_id, " recipe_id= ", recipe_id);
    await user_utils.addToMyMeal(user_id, recipe_id);
    console.log("4");
    res.status(200).send("The Recipe successfully add to user meal.");
    console.log("5");
  } catch (error) {
    next(error);
  }
});

/**
 * Updates the order of recipes in the user's meal.
 * Endpoint: PUT /MyMeal
 * Body Parameters: recipes_order_id (Array of recipe IDs representing the new order)
 * Response: Success or failure message.
 */
router.put("/MyMeal", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipes_order_id = req.body.recipes_order_id;
    console.log("recipes_order_id = ", recipes_order_id);
    const recipes_info = await user_utils.getMyMealRecipes(user_id);
    console.log("recipes_info = ", recipes_info);
    for (recipe of recipes_info)
      await user_utils.removeFromMyMeal(user_id, recipe.recipe_id);
    for (const recipe_id of recipes_order_id) {
      const matchingRecipe = recipes_info.find(
        (recipe) => recipe.recipe_id == recipe_id
      );
      if (matchingRecipe) {
        console.log('Found matching recipe: ${JSON.stringify(matchingRecipe)}');
        // Add the recipe to table again
        await user_utils.addToMyMeal(user_id, recipe_id);
        // Save progress for the recipe
        const recipe_progress = matchingRecipe.recipe_progress;
        await user_utils.updateRecipeProgressInMyMeal(
          user_id,
          recipe_id,
          recipe_progress
        );
        console.log('Recipe ID: ${recipe_id}, Progress: ${recipe_progress}');
      } else {
        console.log('No matching recipe found for recipe ID: ${recipe_id}');
        throw {
          status: 401,
          message: "No matching recipe found for recipe ID.",
        };
      }
    }
    res.status(200).send("The Recipes successfully reordered.");
  } catch (error) {
    next(error);
  }
});

/**
 * Removes a recipe from the user's meal.
 * Endpoint: DELETE /MyMeal
 * Body Parameters: recipeId (ID of the recipe to be removed from the meal)
 * Response: Success or failure message.
 */
router.delete("/MyMeal", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.removeFromMyMeal(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed from user meal");
  } catch (error) {
    next(error);
  }
});

/**
 * Retrieves the progress of making a specific recipe in the user's meal.
 * Endpoint: GET /RecipeMakingProgress/:recipeId
 * Path Parameters: recipeId (ID of the recipe to retrieve progress for)
 * Response: Progress details of the recipe.
 */
router.get("/RecipeMakingProgress/:recipeId", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    console.log("user.js: recipe_id = ", recipe_id);
    // Checks if recipe_id is located in my meal, if not it will throw an error

    // if there is recipe_id return only the progress for the specific recipe_id, else return list: recipes_info [ { recipe_id: '639054', recipe_progress: null }, { recipe_id: '645732', recipe_progress: null } ]
    const recipe_info = await user_utils.getMyMealRecipes(user_id, recipe_id);
    res.status(200).send(recipe_info[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * Retrieves the making progress of all recipes or a specific recipe in the user's meal.
 * Endpoint: GET /RecipeMaking
 * Response: Progress details of the recipes.
 */
router.get("/RecipeMaking", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    console.log("user.js: recipe_id = ", recipe_id);
    // Checks if recipe_id is located in my meal, if not it will throw an error

    // if there is recipe_id return only the progress for the specific recipe_id, else return list: recipes_info [ { recipe_id: '639054', recipe_progress: null }, { recipe_id: '645732', recipe_progress: null } ]
    const recipe_info = await user_utils.getMyMealRecipes(user_id, recipe_id);

    const recipePreviews = await recipe_utils.getRecipesPreview([recipe_id]);
    // Merge recipe progress into the recipe previews
    const results = await user_utils.fetchRecipeProgress(
      recipe_info,
      recipePreviews
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * Updates the making progress of a recipe in the user's meal.
 * Endpoint: PUT /RecipeMaking
 * Body Parameters: recipeId (ID of the recipe), recipe_progress (Progress data of the recipe)
 * Response: Success or failure message.
 */
router.put("/RecipeMaking", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    console.log(
      "user_id = ",
      req.session.user_id,
      " recipe_id = ",
      req.body.recipeId,
      " recipe_progress = ",
      req.body.recipe_progress
    );
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const recipe_progress = "[" + req.body.recipe_progress.toString() + "]";
    await user_utils.updateRecipeProgressInMyMeal(
      user_id,
      recipe_id,
      recipe_progress
    );
    res
      .status(200)
      .send("You have successfully update the recipe making progress.");
  } catch (error) {
    next(error);
  }
});

/**
 * Retrieves all recipes created by the logged-in user.
 * Endpoint: GET /MyRecipes
 * Response: List of recipes created by the user.
 */
router.get("/MyRecipes", async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw { status: 401, message: "No User Logged in." };
    }
    const user_id = req.session.user_id;
    const myRecipes_id = await user_utils.getMyRecipes(user_id);
    if (myRecipes_id.length == 0) {
      throw { status: 203, message: "This user has no Recipes ." };
    }
    const results = await recipe_utils.getRecipesPreview(myRecipes_id);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;