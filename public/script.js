// DOM elements
const dishForm = document.getElementById('dish-form');
const dishesList = document.getElementById('dishes-list');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModalBtn = document.querySelector('.close');

// API base URL
const API_URL = '/api/dishes';

// Fetch all dishes when page loads
document.addEventListener('DOMContentLoaded', fetchDishes);

// Submit new dish form
dishForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    ingredients: document.getElementById('ingredients').value.split(',').map(item => item.trim()),
    preparationSteps: document.getElementById('preparationSteps').value.split(',').map(item => item.trim()),
    cookingTime: parseInt(document.getElementById('cookingTime').value),
    origin: document.getElementById('origin').value,
    spiceLevel: document.getElementById('spiceLevel').value
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.status === 201) {
      alert('Dish added successfully!');
      dishForm.reset();
      fetchDishes(); // Refresh dishes list
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error adding dish:', error);
    alert('Failed to add dish, please check console');
  }
});

// Fetch all dishes
async function fetchDishes() {
  try {
    const response = await fetch(API_URL);
    const dishes = await response.json();
    
    renderDishes(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    dishesList.innerHTML = '<tr><td colspan="5">Error loading dishes</td></tr>';
  }
}

// Render dishes list
function renderDishes(dishes) {
  if (dishes.length === 0) {
    dishesList.innerHTML = '<tr><td colspan="5">No dishes available</td></tr>';
    return;
  }
  
  dishesList.innerHTML = '';
  
  dishes.forEach(dish => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${dish.name}</td>
      <td>${dish.origin}</td>
      <td>${dish.cookingTime} minutes</td>
      <td>${getSpiceLevelText(dish.spiceLevel)}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${dish._id}">Edit</button>
        <button class="delete-btn" data-id="${dish._id}">Delete</button>
      </td>
    `;
    
    dishesList.appendChild(row);
  });
  
  // Add event listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => deleteDish(e.target.dataset.id));
  });
}

// Get spice level text
function getSpiceLevelText(spiceLevel) {
  const spiceLevelMap = {
    'Mild': 'Mild',
    'Medium': 'Medium',
    'Hot': 'Hot',
    'Very Hot': 'Very Hot'
  };
  
  return spiceLevelMap[spiceLevel] || spiceLevel;
}

// Open edit modal
async function openEditModal(id) {
  try {
    // First fetch dish details
    const response = await fetch(`${API_URL}/id/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dish details');
    }
    
    const dish = await response.json();
    
    // Populate form
    document.getElementById('edit-id').value = dish._id;
    document.getElementById('edit-name').value = dish.name;
    document.getElementById('edit-ingredients').value = dish.ingredients.join(', ');
    document.getElementById('edit-preparationSteps').value = dish.preparationSteps.join(', ');
    document.getElementById('edit-cookingTime').value = dish.cookingTime;
    document.getElementById('edit-origin').value = dish.origin;
    document.getElementById('edit-spiceLevel').value = dish.spiceLevel;
    
    // Show modal
    editModal.style.display = 'block';
  } catch (error) {
    console.error('Error opening edit modal:', error);
    alert('Failed to fetch dish details');
  }
}

// Close edit modal
closeModalBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
  }
});

// Submit edit form
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('edit-id').value;
  
  const formData = {
    name: document.getElementById('edit-name').value,
    ingredients: document.getElementById('edit-ingredients').value.split(',').map(item => item.trim()),
    preparationSteps: document.getElementById('edit-preparationSteps').value.split(',').map(item => item.trim()),
    cookingTime: parseInt(document.getElementById('edit-cookingTime').value),
    origin: document.getElementById('edit-origin').value,
    spiceLevel: document.getElementById('edit-spiceLevel').value
  };
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Dish updated successfully!');
      editModal.style.display = 'none';
      fetchDishes(); // Refresh dishes list
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error updating dish:', error);
    alert('Error updating dish, please check console');
  }
});

// Delete dish
async function deleteDish(id) {
  if (!confirm('Are you sure you want to delete this dish?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('Dish deleted successfully!');
      fetchDishes(); // Refresh dishes list
    } else {
      const data = await response.json();
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error deleting dish:', error);
    alert('Error deleting dish, please check console');
  }
}