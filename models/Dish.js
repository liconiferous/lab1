const mongoose = require('mongoose');

// 菜品数据模型定义
const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  preparationSteps: {
    type: [String],
    required: true
  },
  cookingTime: {
    type: Number,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  // 自定义字段
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Hot', 'Very Hot'],
    default: 'Medium'
  }
});

module.exports = mongoose.model('Dish', dishSchema);