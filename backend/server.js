const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const User = require('./models/user');
const Recipe = require('./models/Recipe');
const recipeRoutes = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/recipes', recipeRoutes);
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'User already exists' });
  const user = new User({ username, password });
  await user.save();
  res.status(201).json({ message: 'Signup successful' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.status(200).json({ message: 'Login successful' });
});

// Add Dummy Recipes on First Run (optional init route)
app.get('/init', async (req, res) => {
  await Recipe.insertMany([
    { title: 'Pizza', image: 'https://via.placeholder.com/200?text=Pizza' },
    { title: 'Pasta', image: 'https://via.placeholder.com/200?text=Pasta' },
    { title: 'Salad', image: 'https://via.placeholder.com/200?text=Salad' }
  ]);
  res.send('Dummy recipes added');
});

// Save Recipe
app.post('/user/save-recipe', async (req, res) => {
  const { username, recipeId } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.savedRecipes.includes(recipeId)) {
    user.savedRecipes.push(recipeId);
    await user.save();
    res.status(200).json({ message: 'Recipe saved successfully' });
  } else {
    res.status(400).json({ message: 'Recipe already saved' });
  }
});

// Unsave Recipe
app.post('/user/unsave-recipe', async (req, res) => {
  const { username, recipeId } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.savedRecipes = user.savedRecipes.filter(id => id != recipeId);
  await user.save();
  res.status(200).json({ message: 'Recipe unsaved successfully' });
});

// Get Saved Recipes for a User
app.get('/user/saved-recipes', async (req, res) => {
  const { username } = req.query;
  try {
    // Find the user and populate all fields from the saved recipes
    const user = await User.findOne({ username }).populate({
      path: 'savedRecipes',
      select: '_id title image ingredients instructions' // Explicitly select all needed fields
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    console.log(`Found ${user.savedRecipes.length} saved recipes for user ${username}`);
    
    // Log a sample recipe to verify the image field is present
    if (user.savedRecipes.length > 0) {
      console.log('Sample saved recipe:', {
        title: user.savedRecipes[0].title,
        image: user.savedRecipes[0].image
      });
    }
    
    res.json(user.savedRecipes);
  } catch (err) {
    console.error('Error fetching saved recipes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Recipe Details by ID
app.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  res.json(recipe);
});

// Serve static frontend
const path = require("path");
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dashboard.html')));
app.get('/saved', (req, res) => res.sendFile(path.join(__dirname, '../frontend/saved.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '../frontend/profile.html')));
app.get('/logout', (req, res) => res.redirect('/')); // Optional: Clear session

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
