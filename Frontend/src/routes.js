import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
    props: route => ({query: route.query.q}),
  },
  {
    path: "/recipe",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/AboutPage"),
  },

  {
    path: "/FamilyRecipes",
    name: "FamilyRecipes",
    component: () => import("./pages/FamilyRecipesPage"),
  },
  {
    path: "/FavoriteRecipes",
    name: "FavoriteRecipes",
    component: () => import("./pages/FavoriteRecipesPage"),
  },
  {
    path: "/MyRecipes",
    name: "MyRecipes",
    component: () => import("./pages/MyRecipesPage"),
  },
  {
    path: "/RecipeMaking",
    name: "RecipeMaking",
    component: () => import("./pages/RecipeMakingPage"),
  },
  {
    path: "/MealMaking",
    name: "MealMaking",
    component: () => import("./pages/MealMakingPage"),
  },

];


export default routes;
