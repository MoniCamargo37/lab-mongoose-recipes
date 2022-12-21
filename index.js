const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';
// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
    // Run your code here, after you have insured that the connection was made
    .then(() => {
      // Create a new recipe document
      return Recipe.create({
        title: 'Moni cake',
        level: 'Easy Peasy',
        ingredients: ['100g flour','1 spoon baking powder', '1 mug of milk', '2 eggs', '1 spoon sugar', '1/4 tiny spoon salt'],
        cuisine: 'Brazilian',
        dishType: 'breakfast',
        creator: 'Monica Camargo',
        duration: 30
      });
    })
    .then(recipe => {
      console.log(`Recipe "${recipe.title}" added to the database`);
      // Import the array of recipes from the data file
      const recipes = require('./data');
      // Insert the entire array to the database
      return Recipe.insertMany(recipes);
    })
    .then(recipes => {
      // Insert many recipes to the database
      console.log('Recipes added to the database:');
      recipes.forEach(recipe => {
        console.log(recipe.title);
      });
      // Update a recipe in the database
      return Recipe.findOneAndUpdate(
        { title: 'Rigatoni alla Genovese' },
        { $set: { duration: 100 } },
        { new: true }
      );
    }).then((recipe) => {
      console.log(`Recipe "${recipe.title}" updated`);
      // Delete a recipe from the database
      return Recipe.deleteOne({ title: 'Carrot Cake' })
    }).then((recipe) => {
      console.log('Delete completed');
  })
  .then(() => mongoose.connection.close())
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
