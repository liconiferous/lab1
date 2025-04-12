const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route configuration
const dishesRoutes = require('./routes/dishes');
app.use('/api/dishes', dishesRoutes);

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection
mongoose.connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB database');
    
    // Initialize sample data
    const Dish = require('./models/Dish');
    
    // Check if database is empty, if so add sample data
    Dish.countDocuments().then(count => {
      if (count === 0) {
        console.log('Adding sample dish data');
        
        const sampleDishes = [
          {
            name: 'Kung Pao Chicken',
            ingredients: ['Chicken breast', 'Peanuts', 'Dried chili', 'Scallion', 'Ginger', 'Garlic', 'Soy sauce', 'Vinegar', 'Sugar'],
            preparationSteps: ['Dice chicken', 'Prepare seasoning', 'Heat wok and stir-fry', 'Add seasoning', 'Stir-fry evenly'],
            cookingTime: 30,
            origin: 'Sichuan, China',
            spiceLevel: 'Hot'
          },
          {
            name: 'Tomato and Egg Stir-fry',
            ingredients: ['Eggs', 'Tomatoes', 'Scallion', 'Cooking oil', 'Salt', 'Sugar'],
            preparationSteps: ['Beat eggs', 'Cut tomatoes', 'Scramble eggs', 'Stir-fry tomatoes', 'Combine and stir-fry'],
            cookingTime: 15,
            origin: 'China',
            spiceLevel: 'Mild'
          },
          {
            name: 'Spaghetti',
            ingredients: ['Pasta', 'Tomato sauce', 'Onion', 'Garlic', 'Ground beef', 'Olive oil', 'Salt', 'Pepper'],
            preparationSteps: ['Cook pasta', 'Prepare meat sauce', 'Combine', 'Plate'],
            cookingTime: 40,
            origin: 'Italy',
            spiceLevel: 'Medium'
          },
          {
            name: 'Sushi',
            ingredients: ['Rice', 'Vinegar', 'Sugar', 'Seaweed', 'Salmon', 'Cucumber', 'Avocado'],
            preparationSteps: ['Cook rice', 'Prepare sushi vinegar', 'Mix to make sushi rice', 'Roll sushi', 'Slice'],
            cookingTime: 60,
            origin: 'Japan',
            spiceLevel: 'Mild'
          },
          {
            name: 'Mapo Tofu',
            ingredients: ['Tofu', 'Ground meat', 'Doubanjiang', 'Chili', 'Sichuan pepper', 'Scallion', 'Ginger', 'Garlic'],
            preparationSteps: ['Prepare ingredients', 'Stir-fry meat', 'Add seasoning', 'Add tofu', 'Simmer', 'Thicken with starch'],
            cookingTime: 25,
            origin: 'Sichuan, China',
            spiceLevel: 'Very Hot'
          }
        ];
        
        Dish.insertMany(sampleDishes)
          .then(() => console.log('Sample data added successfully'))
          .catch(err => console.error('Failed to add sample data:', err));
      }
    });
  })
  .catch(error => console.error('Database connection failed:', error));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});