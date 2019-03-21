import axios from "axios";

export default {
  //To get the picture from recipes API

  getRecipes: function (query) {
    return axios.get(
      "https://cors.io/?http://www.recipepuppy.com/api/?q=" +
      { params: { q: query } }
    );
  },
  // Gets all foods
  getFood: function () {
    return axios.get("/api/food");
  },
  getMeal: function () {
    return axios.get("/api/meal");
  },
  //! this is the new one
  updateMealByID: function (id, updatedMeal) {
    return axios.put("/api/meal/" + id, updatedMeal);
  },
  getMealByUser: function (userName) {
    return axios.get("/api/meal/mealByUser/" + userName);
  },
  deleteMeal: function (id) {
    return axios.delete("/api/meal/" + id);
  },
  getFoodByFoodGroupName: function (foodGroupName) {
    return axios.get("/api/food/foodByFoodGroupName/" + foodGroupName);
  },
  getFoodByFoodGroupNameAndUser: function (foodGroupName, userName) {
    return axios.get(
      "/api/food/foodByFoodGroupNameAndUser/" + foodGroupName + "/" + userName
    );
  },
  getFoodByUser: function (userName) {
    return axios.get("/api/food/foodByUser/" + userName);
  },
  getFoodGroupByMasterAndUser: function (userName) {
    return axios.get("/api/foodgroup/foodGroupByMasterAndUser/" + userName);
  },
  // Gets the food with the given id
  getFoodByID: function (id) {
    return axios.get("/api/food/foodByID/" + id);
  },
  getFoodByFoodName: function (foodName) {
    return axios.get("/api/food/foodByFoodName/" + foodName);
  },
  // Deletes the food with the given id

  deleteFoodByID: function (id) {
    return axios.delete("/api/food/foodByID/" + id);
  },
  // Update the food with the given id

  updateFoodByID: function (id, updatedFood) {
    return axios.put("/api/food/foodByID/" + id, updatedFood);
  },

  // Saves a food to the database
  saveFood: function (foodData) {
    return axios.post("/api/food", foodData);
  },
  saveFoodGroup: function (foodGroupData) {
    return axios.post("/api/foodGroup", foodGroupData);
  },
  saveMeal: function (mealData) {
    return axios.post("/api/meal", mealData);
  },
  getUser: function () {
    return axios.get("/api/user");
  },
  getUserByID: function (id) {
    return axios.get("/api/user/userByID/" + id);
  },
  getFoodGroup: function () {
    return axios.get("/api/foodgroup");
  },
  // Gets the food with the given id
  getFoodGroupByID: function (id) {
    return axios.get("/api/foodgroup/foodGroupByID/" + id);
  }
};
