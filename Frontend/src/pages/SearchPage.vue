<template>
  <div class="container mt-5">
    <!-- Main header for the search page -->
    <h1 class="mb-4 text-center">Search Recipes</h1>

    <!-- Search input and button -->

      <div class="row mb-4">
      <div class="search-bar d-flex align-items-center">
        <span class="search-label">Search</span>
        <b-input-group size="lg" style="flex: 1;">
          <b-form-input v-model="searchQuery" placeholder="Enter recipe name..."></b-form-input>
          <b-input-group-append>
            <b-button size="lg" variant="success" @click="performSearch" class="search-icon-button">
              <i class="fas fa-search"></i>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <!-- Filters toggle button -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <b-button v-b-toggle.filters-sidebar variant="primary"
          ><i class="bi bi-filter"> Filters</i></b-button
        >
      </div>

      <!-- Sort and result count options -->
      <div
        class="sort-options d-flex align-items-center mb-4"
      >
        <div class="d-flex align-items-center me-3">
          <label for="resultsCount" class="me-2">Results per Page:</label>
          <select
            id="resultsCount"
            v-model="resultsCount"
            class="form-select-result"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
        </div>
        <div class="d-flex align-items-center">
          <label for="sortBy" class="me-2">Sort by:</label>
          <select id="sortBy" v-model="sortBy" class="form-select-sort">
            <option value="time">Time</option>
            <option value="popularity">Popularity</option>
            <option value="healthiness">Healthiness</option>
            <option value="calories">Calories</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Sidebar for filter options -->
    <b-sidebar id="filters-sidebar" title="Filters" left>
      <div class="mb-3">
        <h5>Cuisines</h5>
        <div v-for="cuisine in cuisines" :key="cuisine">
          <b-form-checkbox
            v-model="filters.selectedCuisines"
            :value="cuisine"
            >{{ cuisine }}</b-form-checkbox
          >
        </div>
      </div>
      <div class="mb-3">
        <h5>Diets</h5>
        <div v-for="diet in diets" :key="diet">
          <b-form-checkbox v-model="filters.selectedDiets" :value="diet">{{
            diet
          }}</b-form-checkbox>
        </div>
      </div>
      <div class="mb-3">
        <h5>Intolerances</h5>
        <div v-for="intolerance in intolerances" :key="intolerance">
          <b-form-checkbox
            v-model="filters.selectedIntolerances"
            :value="intolerance"
            >{{ intolerance }}</b-form-checkbox
          >
        </div>
      </div>
    </b-sidebar>

    <!-- Display area for search results or messages -->
    <b-col cols="12">
      <div
        v-if="recipes.length === 0 && searchQuery && !$root.store.username"
        class="text-center mt-3"
      >
        <p>No results found.</p>
      </div>
      <RecipePreviewList
        v-else-if="recipes.length > 0"
        title="The search results of the recipes"
        :recipes="recipes"
      />
      <div
        v-else-if="!searchQuery && !$root.store.username"
        class="text-center mt-3"
      >
        <p>Start searching to see recipes.</p>
      </div>
      <div
        v-else-if="$root.store.username && searchQuery && recipes.length === 0"
      >
        <p class="text-center mt-3">No results found for your search.</p>
      </div>
      <div v-else-if="$root.store.username">
        <RecipePreviewList
          title="Your recently viewed recipes"
          :recipes="lastViewedRecipes"
        />
      </div>
    </b-col>
  </div>
</template>

<script>
import {
  getSearchResultsFromServer,
} from "../services/recipes.js";
import cuisines from "../assets/cuisines.json";
import diets from "../assets/diets.json";
import intolerances from "../assets/intolerances.json";
import RecipePreviewList from "@/components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      recipes: [],
      sortBy: "time",
      searchQuery: this.$route.query.q || "",
      resultsCount: 5,
      filters: {
        selectedCuisines: [],
        selectedDiets: [],
        selectedIntolerances: [],
      },
      cuisines,
      diets,
      intolerances,
      lastViewedRecipes: [],
      connectedUser: false,
    };
  },
  mounted(){
    const lastSearch = JSON.parse(localStorage.getItem("lastSearch"));
    if(lastSearch)
    {
      this.searchQuery = lastSearch.searchQuery || "";
      this.filters = lastSearch.filters || this.filters;
      this.sortBy = lastSearch.sortBy || "time";
      this.resultsCount = lastSearch.resultsCount || 5;
      if(this.searchQuery)
      {
        this.performSearch();
      }
    }
  },
  methods: {
    async performSearch() {
      const cuisines = this.filters.selectedCuisines.join(",");
      const diets = this.filters.selectedDiets.join(",");
      const intolerances = this.filters.selectedIntolerances.join(",");
      const response = await getSearchResultsFromServer(
        this.searchQuery,
        cuisines,
        diets,
        intolerances,
        this.resultsCount,
        this.sortBy
      );
      this.recipes = response;
      const lastSearch = {
        searchQuery: this.searchQuery,
        filters: this.filters,
        sortBy: this.sortBy,
        resultsCount: this.resultsCount
      };
      localStorage.setItem("lastSearch",JSON.stringify(lastSearch));
    },
  },
  watch:{
    '$route.query.q':{
      immediate:true,
      handler(newQuery){
        this.searchQuery = newQuery || '';
        if(this.searchQuery){this.performSearch();}
      }
    },
    filters:{
      handler: function(){
        this.performSearch();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
h1 {
  color: #333;
  font-weight: bold;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.search-label {
  font-size: 1.5rem; /* Adjust the font size as needed */
  padding-right: 10px;
  height: 38px; /* Same height as the input field */
  line-height: 38px; /* Aligns text vertically */
}

.search-icon-button {
  height: 48px; /* Same height as the input field */
  display: flex;
  align-items: center;
  justify-content: center;
}
.sort-options{
  display: flex;
  align-items: center;
  gap: 15px;
}
.form-select-sort{
  width: auto;
  padding: 2px 4px;
}
.form-select-result
 {
  width: auto;
  margin-right: 10px;
}
.btn-primary {
  margin-left: 25px;
  background-color: gray;
  border-color: gray;
}

.btn-primary:hover {
  background-color: rgb(96, 96, 96);
  border-color: rgb(96, 96, 96);
}

::v-deep .b-sidebar {
  position: fixed;
  padding: 10px;
  border-radius: 10px;
  margin-top: 60px;
}

::v-deep .b-sidebar-header button {
  order: 2;
  margin-left: 60%;
}

::v-deep .b-sidebar-header .b-sidebar-title {
  order: 1;
}

h5,
.h5 {
  font-size: 1.5rem;
}

.bi-filter {
  font-size: 1.4rem;
}



.me-2 {
  margin-right: 15px;
  font-size: 18px;
}
</style>
