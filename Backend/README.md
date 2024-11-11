<h1>Recipe Management Application Backend</h1>

<h2>Overview</h2>

<p>
  This project is the backend API for a recipe management web application. It provides endpoints for user registration, login, and recipe management functionalities. Users can interact with recipes, save them to their favorites or meal plan, and manage their cooking progress.
</p>

<h2>API Documentation</h2>

<p>
  You can find the detailed API documentation for the backend <a href="https://app.swaggerhub.com/apis/GuyBiton/Register/1.0.0">here</a>.
</p>

<h2>Pages and API Endpoints Description</h2>

<h3>Auth Routes</h3>

<h4>Register a new user</h4>

<ul>
  <li><strong>Path:</strong> <code>/register</code></li>
  <li><strong>Method:</strong> <code>POST</code></li>
  <li><strong>Description:</strong> Registers a new user with the provided details.</li>
  <li><strong>Request Body:</strong>
    <ul>
      <li><code>username</code> (string) - Unique identifier for the user, must be 3-8 alphabetic characters.</li>
      <li><code>firstname</code> (string) - User's first name.</li>
      <li><code>lastname</code> (string) - User's last name.</li>
      <li><code>country</code> (string) - Country of residence.</li>
      <li><code>password</code> (string) - User's password, must be 5-10 characters with at least one digit and one special character.</li>
      <li><code>email</code> (string) - User's email address.</li>
    </ul>
  </li>
  <li><strong>Responses:</strong>
    <ul>
      <li><code>201</code> - User successfully registered.</li>
      <li><code>400</code> - Invalid input.</li>
      <li><code>409</code> - Username already exists.</li>
    </ul>
  </li>
</ul>

<h4>User login</h4>

<ul>
  <li><strong>Path:</strong> <code>/login</code></li>
  <li><strong>Method:</strong> <code>POST</code></li>
  <li><strong>Description:</strong> Logs in a user with the provided credentials.</li>
  <li><strong>Request Body:</strong>
    <ul>
      <li><code>username</code> (string) - The username of the user.</li>
      <li><code>password</code> (string) - The user's password.</li>
    </ul>
  </li>
  <li><strong>Responses:</strong>
    <ul>
      <li><code>201</code> - User successfully logged in.</li>
      <li><code>400</code> - Invalid input, username or password is invalid.</li>
      <li><code>409</code> - User already logged in.</li>
    </ul>
  </li>
</ul>

<h4>User logout</h4>

<ul>
  <li><strong>Path:</strong> <code>/logout</code></li>
  <li><strong>Method:</strong> <code>POST</code></li>
  <li><strong>Description:</strong> Logs out the currently logged-in user.</li>
  <li><strong>Responses:</strong>
    <ul>
      <li><code>200</code> - User successfully logged out.</li>
      <li><code>409</code> - User is not logged in.</li>
    </ul>
  </li>
</ul>

<h3>Recipe Management Routes</h3>

<ul>
  <li><strong>Add Recipe to Last Viewed:</strong> <code>POST /LastViewedRecipes</code> - Adds a recipe to the last viewed list of the logged-in user.</li>
  <li><strong>Get Last Viewed Recipes:</strong> <code>GET /LastViewedRecipes</code> - Retrieves the last viewed recipes.</li>
  <li><strong>Check Last Viewed Recipe:</strong> <code>GET /IsLastViewedRecipe</code> - Checks if a recipe is in the last viewed list.</li>
  <li><strong>Add Recipe to Favorites:</strong> <code>POST /FavoritesRecipes</code> - Adds a recipe to the favorites list of the logged-in user.</li>
  <li><strong>Get Favorite Recipes:</strong> <code>GET /FavoritesRecipes</code> - Retrieves the favorite recipes.</li>
  <li><strong>Remove Recipe from Favorites:</strong> <code>DELETE /FavoritesRecipes</code> - Removes a recipe from the favorites list.</li>
  <li><strong>Add New Recipe:</strong> <code>POST /addNewRecipe</code> - Adds a new recipe created by the user.</li>
  <li><strong>Get User Meal Plan:</strong> <code>GET /MyMeal</code> - Retrieves all recipes included in the user's current meal plan.</li>
  <li><strong>Add Recipe to Meal Plan:</strong> <code>POST /MyMeal</code> - Adds a recipe to the user's meal plan.</li>
  <li><strong>Update Meal Plan Order:</strong> <code>PUT /MyMeal</code> - Updates the order of recipes in the user's meal plan.</li>
  <li><strong>Remove Recipe from Meal Plan:</strong> <code>DELETE /MyMeal</code> - Removes a recipe from the user's meal plan.</li>
  <li><strong>Get Recipe Making Progress:</strong> <code>GET /RecipeMakingProgress/{recipeId}</code> - Retrieves the progress of making a specific recipe.</li>
  <li><strong>Get All Recipes Making Progress:</strong> <code>GET /RecipeMaking</code> - Retrieves the making progress of all recipes.</li>
  <li><strong>Update Recipe Making Progress:</strong> <code>PUT /RecipeMaking</code> - Updates the making progress of a recipe.</li>
  <li><strong>Get All User-Created Recipes:</strong> <code>GET /MyRecipes</code> - Retrieves all recipes created by the logged-in user.</li>
  <li><strong>Search Recipes:</strong> <code>GET /search</code> - Searches for recipes based on various parameters.</li>
  <li><strong>Get Random Recipes:</strong> <code>GET /random</code> - Returns a specified number of random recipes.</li>
  <li><strong>Get Recipe Details:</strong> <code>GET /recipe/{recipe_id}</code> - Retrieves the full details of a specific recipe.</li>
  <li><strong>Get Recipes Preview:</strong> <code>POST /RecipesPreview</code> - Provides a preview of multiple recipes based on their IDs.</li>
</ul>

<h2>Installation Instructions</h2>

<p>To run this project locally:</p>

<h4>1. Clone the Repository</h4>

<pre><code>git clone https://github.com/WED-2023/assignment2-3-318940913_207577875_209384783.git
cd assignment2-3-318940913_207577875_209384783
</code></pre>

<h4>2. Install Dependencies</h4>

<p>Install the required packages by running:</p>

<pre><code>npm install
npm install --legacy-peer-deps
npm install --force
npm install dotenv
npm install dotenv --legacy-peer-deps
npm install dotenv --force
npm cache clean --force
npm install bootstrap-vue axios bootstrap
npm audit fix --force
</code></pre>

<h4>3. Configure Environment Variables</h4>

<p>Create a <code>.env</code> file in the root directory:</p>

<pre><code>DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=recipe_management
JWT_SECRET=your_jwt_secret
spooncular_apiKey=your_spoonacular_api_key
COOKIE_SECRET=your_cookie_secret
</code></pre>

<h4>4. Set Up MySQL Database</h4>

<p>Install MySQL and create a new database:</p>

<pre><code>CREATE DATABASE recipe_management;
</code></pre>

<p>Import the database schema:</p>

<pre><code>mysql -u yourusername -p recipe_management &lt; schema.sql
</code></pre>

<h4>5. Run the Backend Server</h4>

<p>Start the backend server by running:</p>

<pre><code>npm start
</code></pre>

<h2>Contributing</h2>

<p>Contributions are welcome! Please fork the repository and create a pull request with your changes.</p>

<h2>Contact</h2>

<p>For questions or suggestions, please contact:</p>

<ul>
  <li><a href="mailto:guybito@post.bgu.ac.il">Guy Biton - guybito@post.bgu.ac.il</a></li>
  <li><a href="mailto:danvai@post.bgu.ac.il">Dan Vaitzman - danvai@post.bgu.ac.il</a></li>
  <li><a href="mailto:schyuval@post.bgu.ac.il">Yuval Schwartz - schyuval@post.bgu.ac.il</a></li>
</ul>
