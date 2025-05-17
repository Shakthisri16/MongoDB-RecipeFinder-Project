const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});

// Method to add a saved recipe to a user's savedRecipes array
userSchema.methods.addSavedRecipe = function(recipeId) {
  if (!this.savedRecipes.includes(recipeId)) {
    this.savedRecipes.push(recipeId);
    return this.save();
  }
  return Promise.resolve(this); // Recipe already saved, no change
};

// Method to remove a saved recipe from a user's savedRecipes array
userSchema.methods.removeSavedRecipe = function(recipeId) {
  this.savedRecipes = this.savedRecipes.filter(id => id.toString() !== recipeId.toString());
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
