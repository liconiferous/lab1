const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// Get all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().collation({locale:'en', strength:2}).sort({name:1});
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dish by name
router.get('/:name', async (req, res) => {
  try {
    const dish = await Dish.findOne({ name: req.params.name });
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dish by ID
router.get('/id/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new dish
router.post('/', async (req, res) => {
  try {
    // Check if dish already exists
    const existingDish = await Dish.findOne({ name: req.body.name });
    if (existingDish) {
      return res.status(409).json({ message: 'Dish already exists' });
    }
    
    const dish = new Dish(req.body);
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update dish
router.put('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    Object.assign(dish, req.body);
    const updatedDish = await dish.save();
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete dish
router.delete('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    await dish.deleteOne();
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;