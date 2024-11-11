
# Recipe Management Application

## Overview
This is a web application for managing and sharing recipes. It allows users to search for recipes, view details, register and log in, add recipes to favorites, and create new recipes. The project is developed using **Vue.js** for the frontend and **Node.js** with **Express.js** for the backend, with **MySQL** as the database.

## Pages Description

### Home Page (Recipes Main Page)
- **Path:** `/`
- **Description:** The main page of the application, displaying random recipes and user-specific content.
- **Features:**
  - Displays three random recipes from the database.
  - Shows the last watched recipes for logged-in users or a login/register prompt for guests.
  - Allows users to refresh and display new random recipes.

### Recipe Detail Page
- **Path:** `/recipe/:id`
- **Description:** Provides detailed information about a specific recipe.
- **Features:**
  - Shows recipe details like ingredients, preparation instructions, and servings.
  - Allows users to save the recipe to their favorites.
  - Includes a "Prepare Recipe" button for step-by-step preparation.

### Search Recipes Page
- **Path:** `/search`
- **Description:** A page for users to search for recipes using various filters.
- **Features:**
  - Search input for keywords or recipe names.
  - Dropdown filters for cuisine, diet, and intolerance.
  - Displays and sorts search results based on criteria like preparation time or popularity.

### Register Page
- **Path:** `/register`
- **Description:** Allows new users to create an account.
- **Features:**
  - Fields for username, name, country, password, and email.
  - Password confirmation field.
  - Handles errors for duplicate usernames or invalid formats.

### Login Page
- **Path:** `/login`
- **Description:** Enables existing users to log in to their accounts.
- **Features:**
  - Input fields for username and password.
  - Link to the registration page.
  - Error handling for incorrect credentials.

### User Favorites Page
- **Path:** `/favorites`
- **Description:** Displays a list of recipes marked as favorites by the user.
- **Features:**
  - Shows a preview of each favorite recipe.
  - Allows users to view details or remove recipes from favorites.

### My Recipes Page
- **Path:** `/my-recipes`
- **Description:** Shows all recipes created by the logged-in user.
- **Features:**
  - List of user-created recipes with options to view, edit, or delete.
  - Button to add a new recipe.

### Create New Recipe Page
- **Path:** `/create-recipe`
- **Description:** Provides a form for creating a new recipe.
- **Features:**
  - Input fields for title, ingredients, steps, servings, and image upload.
  - Saves the new recipe to "My Recipes."

### About Page
- **Path:** `/about`
- **Description:** Provides information about the project and the development team.

### Family Recipes Page
- **Path:** `/family-recipes`
- **Description:** A special page for managing family recipes.
- **Features:**
  - Displays a list of family recipes.
  - Allows adding new family recipes with personal and contextual details.

### Recipe Preparation Page (Bonus)
- **Path:** `/prepare/:id`
- **Description:** A guided step-by-step recipe preparation page.
- **Features:**
  - Displays each step for preparing the recipe.
  - Tracks and resets progress as needed.

### Meal Planning Page (Bonus)
- **Path:** `/meal-planning`
- **Description:** Assists users in planning meals by selecting recipes.
- **Features:**
  - Allows adding recipes to a meal plan.
  - Provides a downloadable shopping list.

## Installation Instructions

To run this project locally:

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-repo/project-name.git
cd project-name
\`\`\`

### 2. Install Frontend Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

### 3. Install Backend Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 4. Set Up MySQL Database
- Install MySQL and create a new database:
  \`\`\`sql
  CREATE DATABASE recipe_management;
  \`\`\`
- Import the database schema:
  \`\`\`bash
  mysql -u yourusername -p recipe_management < schema.sql
  \`\`\`

### 5. Configure Environment Variables
Create a `.env` file in the `backend` directory:

\`\`\`env
DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=recipe_management
JWT_SECRET=your_jwt_secret
\`\`\`

### 6. Run the Backend Server
\`\`\`bash
cd backend
npm start
\`\`\`

### 7. Run the Frontend Server
\`\`\`bash
cd frontend
npm run serve
\`\`\`

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.

## Contact
For questions, please refer to the project forum or contact the development team through the repository's contact information.
