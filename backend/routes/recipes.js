const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/user'); // Import User model

// GET all recipes or search by title
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const recipes = await Recipe.find({
      title: { $regex: searchQuery, $options: 'i' }
    }).select('_id title image ingredients instructions'); // Explicitly select fields
    
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// GET recipe details by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    console.error('Error fetching recipe by ID:', err);
    res.status(500).json({ message: 'Server error while fetching recipe' });
  }
});

// PUT to toggle save/unsave recipe for a user
router.put('/:id/toggle-save', async (req, res) => {
  try {
    const { username } = req.body; // Assuming the username is sent in the request body

    // Find the recipe
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle saved recipe for the user
    const isSaved = user.savedRecipes.includes(recipe._id);
    if (isSaved) {
      // Remove from saved recipes if already saved
      user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipe._id.toString());
    } else {
      // Add to saved recipes if not already saved
      user.savedRecipes.push(recipe._id);
    }

    // Save the user after the update
    await user.save();

    res.json({
      message: isSaved ? 'Recipe unsaved!' : 'Recipe saved!',
      savedRecipes: user.savedRecipes
    });
  } catch (err) {
    console.error('Error toggling save/unsave:', err);
    res.status(500).json({ message: 'Server error while toggling save' });
  }
});

module.exports = router;

