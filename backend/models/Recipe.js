const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true }
    }
  ],
  instructions: {
    type: String,
    required: true
  },
  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to User model
    }
  ]
});
module.exports = mongoose.model('Recipe', recipeSchema);
