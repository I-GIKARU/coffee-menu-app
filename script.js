// API Configuration on render 
const API_ENDPOINT = 'https://coffee-db.onrender.com';

// DOM Elements declared as constants
const coffeeList = document.getElementById('coffee-list');
const coffeeMenuSection = document.querySelector('.coffee-menu');
const coffeeDetailsSection = document.querySelector('.coffee-details');
const backToMenuBtn = document.getElementById('back-to-menu');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter-type');
const themeToggle = document.getElementById('theme-toggle');
const adminToggle = document.getElementById('admin-toggle');
const adminControls = document.querySelectorAll('.admin-controls');
const addCoffeeForm = document.getElementById('add-coffee-form');
const addReviewForm = document.getElementById('add-review-form');
const reviewsList = document.getElementById('reviews-list');
const editCoffeeBtn = document.getElementById('edit-coffee');
const deleteCoffeeBtn = document.getElementById('delete-coffee');
const body = document.body;

// State
let currentCoffeeId = null;
let isAdmin = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchCoffees);
searchInput.addEventListener('input', filterCoffees);
filterSelect.addEventListener('change', filterCoffees);
backToMenuBtn.addEventListener('click', showCoffeeMenu);
themeToggle.addEventListener('click', toggleTheme);
adminToggle.addEventListener('click', toggleAdminMode);
addCoffeeForm.addEventListener('submit', handleAddCoffee);
addReviewForm.addEventListener('submit', handleAddReview);
editCoffeeBtn.addEventListener('click', handleEditCoffee);
deleteCoffeeBtn.addEventListener('click', handleDeleteCoffee);

// Fetch all coffees
async function fetchCoffees() {
    try {
        const response = await fetch(`${API_ENDPOINT}/coffees`);
        const coffees = await response.json();
        displayCoffees(coffees);
    } catch (error) {
        console.error('Error fetching coffees:', error);
        showError('Failed to load coffee menu. Please try again later.');
    }
}

// Display coffees in the grid
function displayCoffees(coffees) {
    coffeeList.innerHTML = '';
    
    if (coffees.length === 0) {
        coffeeList.innerHTML = '<p class="no-results">No coffees found. Try a different search.</p>';
        return;
    }
    
    coffees.forEach(coffee => {
        const coffeeCard = document.createElement('div');
        coffeeCard.className = 'coffee-card';
        coffeeCard.innerHTML = `
            <img src="${coffee.image}" alt="${coffee.name}">
            <div class="card-body">
                <h3>${coffee.name}</h3>
                <p class="price">KES ${coffee.price}</p>
                <span class="type">${formatCoffeeType(coffee.type)}</span>
            </div>
        `;
        coffeeCard.addEventListener('click', () => showCoffeeDetails(coffee.id));
        coffeeList.appendChild(coffeeCard);
    });
}

// Format coffee type for display
function formatCoffeeType(type) {
    const types = {
        'hot': 'Hot Coffee',
        'iced': 'Iced Coffee',
        'espresso': 'Espresso',
        'traditional': 'Traditional Kenyan'
    };
    return types[type] || type;
}

// Show details for a specific coffee
async function showCoffeeDetails(coffeeId) {
    currentCoffeeId = coffeeId;
    
    try {
        const response = await fetch(`${API_ENDPOINT}/coffees/${coffeeId}`);
        const coffee = await response.json();
        
        document.getElementById('detail-name').textContent = coffee.name;
        document.getElementById('detail-type').textContent = formatCoffeeType(coffee.type);
        document.getElementById('detail-price').textContent = `KES ${coffee.price}`;
        document.getElementById('detail-description').textContent = coffee.description || 'No description available';
        document.getElementById('detail-image').src = coffee.image;
        
        coffeeMenuSection.classList.add('hidden');
        coffeeDetailsSection.classList.remove('hidden');
        
        fetchReviews(coffeeId);
    } catch (error) {
        console.error('Error fetching coffee details:', error);
        showError('Failed to load coffee details. Please try again.');
    }
}

// Fetch reviews for a coffee
async function fetchReviews(coffeeId) {
    try {
        const response = await fetch(`${API_ENDPOINT}/reviews?coffeeId=${coffeeId}`);
        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        showError('Failed to load reviews. Please try again.');
    }
}

// Display reviews
function displayReviews(reviews) {
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <h4>${review.reviewerName}</h4>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
            <p class="review-date">${new Date(review.date).toLocaleDateString()}</p>
            ${isAdmin ? `<button class="delete-review" data-id="${review.id}">
                <i class="fas fa-trash"></i> Delete Review
            </button>` : ''}
        `;
        reviewsList.appendChild(reviewCard);
    });
    
    // Add event listeners to delete buttons if admin
    if (isAdmin) {
        document.querySelectorAll('.delete-review').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteReview(e.target.closest('button').dataset.id);
            });
        });
    }
}

// Filter coffees based on search and type
function filterCoffees() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = filterSelect.value;
    
    fetch(`${API_ENDPOINT}/coffees`)
        .then(response => response.json())
        .then(coffees => {
            const filtered = coffees.filter(coffee => {
                const matchesSearch = coffee.name.toLowerCase().includes(searchTerm) || 
                                    (coffee.description?.toLowerCase().includes(searchTerm) || false);
                const matchesType = filterType === 'all' || coffee.type === filterType;
                return matchesSearch && matchesType;
            });
            displayCoffees(filtered);
        })
        .catch(error => {
            console.error('Error filtering coffees:', error);
            showError('Failed to filter coffees. Please try again.');
        });
}

// Show the coffee menu
function showCoffeeMenu() {
    coffeeMenuSection.classList.remove('hidden');
    coffeeDetailsSection.classList.add('hidden');
    fetchCoffees();
}

// Toggle dark/light theme
function toggleTheme() {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    const isDark = body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Toggle admin mode
function toggleAdminMode() {
    isAdmin = !isAdmin;
    adminToggle.innerHTML = isAdmin 
        ? '<i class="fas fa-user"></i> User Mode' 
        : '<i class="fas fa-user-cog"></i> Admin Mode';
    
    adminControls.forEach(control => control.classList.toggle('hidden', !isAdmin));
    
    // Refresh the view to show/hide admin controls
    if (!coffeeDetailsSection.classList.contains('hidden')) {
        fetchReviews(currentCoffeeId);
    }
}

// Add a new coffee
async function handleAddCoffee(e) {
    e.preventDefault();
    
    const newCoffee = {
        name: document.getElementById('coffee-name').value,
        type: document.getElementById('coffee-type').value,
        price: parseFloat(document.getElementById('coffee-price').value),
        image: document.getElementById('coffee-image').value,
        description: document.getElementById('coffee-description').value
    };
    
    try {
        const response = await fetch(`${API_ENDPOINT}/coffees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCoffee)
        });
        
        if (response.ok) {
            addCoffeeForm.reset();
            fetchCoffees();
            showSuccess('Coffee added successfully!');
        } else {
            throw new Error('Failed to add coffee');
        }
    } catch (error) {
        console.error('Error adding coffee:', error);
        showError('Failed to add coffee. Please try again.');
    }
}

// Add a review
async function handleAddReview(e) {
    e.preventDefault();
    
    const newReview = {
        coffeeId: parseInt(currentCoffeeId),
        reviewerName: document.getElementById('reviewer-name').value,
        rating: parseInt(document.getElementById('review-rating').value),
        text: document.getElementById('review-text').value,
        date: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_ENDPOINT}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReview)
        });
        
        if (response.ok) {
            addReviewForm.reset();
            fetchReviews(currentCoffeeId);
            showSuccess('Review submitted successfully!');
        } else {
            throw new Error('Failed to add review');
        }
    } catch (error) {
        console.error('Error adding review:', error);
        showError('Failed to submit review. Please try again.');
    }
}

// Edit coffee
async function handleEditCoffee() {
    const currentName = document.getElementById('detail-name').textContent;
    const currentType = document.getElementById('detail-type').textContent;
    const currentPrice = document.getElementById('detail-price').textContent.replace('KES ', '');
    const currentDesc = document.getElementById('detail-description').textContent;
    
    const coffeeName = prompt('Enter coffee name:', currentName);
    if (!coffeeName) return;
    
    const coffeeType = prompt('Enter coffee type (hot, iced, espresso, traditional):', 
        currentType.replace('Traditional Kenyan', 'traditional')
                  .replace('Hot Coffee', 'hot')
                  .replace('Iced Coffee', 'iced')
                  .replace('Espresso', 'espresso'));
    if (!coffeeType) return;
    
    const coffeePrice = prompt('Enter coffee price (KES):', currentPrice);
    if (!coffeePrice) return;
    
    const coffeeDescription = prompt('Enter coffee description:', currentDesc === 'No description available' ? '' : currentDesc);
    
    const updatedCoffee = {
        name: coffeeName,
        type: coffeeType,
        price: parseFloat(coffeePrice),
        description: coffeeDescription
    };
    
    try {
        const response = await fetch(`${API_ENDPOINT}/coffees/${currentCoffeeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCoffee)
        });
        
        if (response.ok) {
            showCoffeeDetails(currentCoffeeId);
            fetchCoffees();
            showSuccess('Coffee updated successfully!');
        } else {
            throw new Error('Failed to update coffee');
        }
    } catch (error) {
        console.error('Error updating coffee:', error);
        showError('Failed to update coffee. Please try again.');
    }
}

// Delete coffee
async function handleDeleteCoffee() {
    if (!confirm('Are you sure you want to delete this coffee? This will also remove all its reviews.')) return;
    
    try {
        // First delete all reviews for this coffee
        const reviewsResponse = await fetch(`${API_ENDPOINT}/reviews?coffeeId=${currentCoffeeId}`);
        const reviews = await reviewsResponse.json();
        
        await Promise.all(reviews.map(review => 
            fetch(`${API_ENDPOINT}/reviews/${review.id}`, { method: 'DELETE' })
        ));
        
        // Then delete the coffee
        const response = await fetch(`${API_ENDPOINT}/coffees/${currentCoffeeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showCoffeeMenu();
            showSuccess('Coffee deleted successfully!');
        } else {
            throw new Error('Failed to delete coffee');
        }
    } catch (error) {
        console.error('Error deleting coffee:', error);
        showError('Failed to delete coffee. Please try again.');
    }
}

// Delete review
async function handleDeleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
        const response = await fetch(`${API_ENDPOINT}/reviews/${reviewId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchReviews(currentCoffeeId);
            showSuccess('Review deleted successfully!');
        } else {
            throw new Error('Failed to delete review');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        showError('Failed to delete review. Please try again.');
    }
}

// Show success message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Show error message
function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert error';
    alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Initialize theme icon
function initThemeIcon() {
    const isDark = body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Initialize the app
initThemeIcon();