
# Rachel-Recipes-Online-Web Project

Welcome to the **Rachel-Recipes-Online-Web** project! This is a **Full-Stack Web Application** designed to manage and share recipes, including family and personal favorites, with features for browsing, saving, and creating new recipes.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
- [License](#license)

---

## Project Overview
This project was developed as part of the Internet Development Environments course. It includes the following components:
1. **Frontend**: Developed using Vue.js for an interactive user experience.
2. **Backend**: Powered by Node.js and Express.js, integrated with a MySQL database.
3. **External API**: Utilizes the Spoonacular API for fetching general recipe data.

The goal is to create a platform where users can:
- Browse public and family recipes.
- Save their favorite recipes.
- Create new recipes and organize them in a personal dashboard.

---

## Features
1. **User Authentication**:
   - Registration, Login, and Logout.
   - Password strength validation and secure storage.

2. **Recipe Management**:
   - View, search, and filter recipes by dietary preferences or cooking time.
   - Save recipes as favorites or mark them as personal.

3. **Personal Dashboard**:
   - Manage personal and family recipes.
   - Add detailed information, including ingredients, preparation steps, and images.

4. **Interactive UI**:
   - Smooth navigation and dynamic updates with Vue.js.
   - Tooltip overlays and modals for user-friendly interactions.

5. **Integration with External API**:
   - Fetch random recipes or detailed recipe information from Spoonacular API.

---

## Technology Stack
- **Frontend**: Vue.js, Bootstrap-Vue
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **External API**: [Spoonacular API](https://spoonacular.com/food-api/docs)

---

## Setup and Installation

### Prerequisites
- Node.js and npm installed.
- MySQL database set up and running.
- Git installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url
   cd your-repo-folder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory with the following:
     ```env
     DB_HOST=your-db-host
     DB_USER=your-db-user
     DB_PASSWORD=your-db-password
     DB_NAME=your-db-name
     API_KEY=your-spoonacular-api-key
     ```

4. Initialize the database:
   ```bash
   npm run db:setup
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage
- Access the app via `http://localhost:3000`.
- Create an account or log in.
- Browse recipes, save favorites, or create new ones in your dashboard.

---

## API Documentation
The API documentation is available [here](https://your-swaggerhub-url). It outlines the endpoints for:
- Recipe management (e.g., `/api/recipes`, `/api/recipes/:id`).
- User authentication (e.g., `/api/auth/login`, `/api/auth/register`).

---


## License
This project is licensed under the MIT License. See the LICENSE file for details.
