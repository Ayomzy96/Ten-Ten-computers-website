import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  alert('Error connecting to the database. Please try again later.');
}

// Lazy load background images
function lazyLoadBackground() {
  const sections = document.querySelectorAll('[data-bg]');
  sections.forEach(section => {
    const bgUrl = section.getAttribute('data-bg');
    if (bgUrl) {
      // Create a pseudo-element-like div for the background
      const bgLayer = document.createElement('div');
      bgLayer.style.position = 'absolute';
      bgLayer.style.top = '0';
      bgLayer.style.left = '0';
      bgLayer.style.width = '100%';
      bgLayer.style.height = '100%';
      bgLayer.style.backgroundImage = bgUrl;
      bgLayer.style.backgroundSize = section.id === 'hero' ? 'cover' : 'contain';
      bgLayer.style.backgroundPosition = 'center';
      bgLayer.style.backgroundRepeat = 'no-repeat';
      bgLayer.style.zIndex = '1';
      if (section.id === 'welcome' || section.id === 'hero') {
        bgLayer.style.filter = 'brightness(70%)'; // Apply brightness to welcome and hero
      }
      section.insertBefore(bgLayer, section.firstChild);
    }
  });
}

// Handle review form submission
async function handleReviewSubmit(event) {
  event.preventDefault();
  if (!supabase) {
    console.error('Supabase client is not initialized');
    alert('Cannot submit review: Database connection failed.');
    return;
  }

  const form = event.target;
  const name = form.querySelector('#username').value;
  const rating = form.querySelector('input[name="rating"]:checked')?.value;
  const review = form.querySelector('#reviewText').value;

  if (!name || !rating || !review) {
    alert('Please fill out all fields and select a rating.');
    return;
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .insert([{ name, rating: parseInt(rating), review }]);

    if (error) {
      console.error('Error submitting review:', error);
      alert(`Failed to submit review: ${error.message}`);
      return;
    }

    // Show success toast
    const toast = new bootstrap.Toast(document.getElementById('successToast'));
    toast.show();

    // Reset form
    form.reset();

    // Refresh reviews
    fetchReviews();
  } catch (error) {
    console.error('Unexpected error submitting review:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}

// Fetch and display reviews
async function fetchReviews() {
  if (!supabase) {
    console.error('Supabase client is not initialized');
    document.getElementById('reviewList').innerHTML = '<p class="text-danger text-center">Error: Database connection failed.</p>';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }

    const reviewList = document.getElementById('reviewList');
    if (!reviewList) {
      console.error('Review list element not found');
      return;
    }

    reviewList.innerHTML = '';

    if (!data || data.length === 0) {
      reviewList.innerHTML = '<p class="text-center text-light">No reviews yet.</p>';
      return;
    }

    data.forEach(review => {
      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      const reviewElement = `
        <div class="review-card mb-3 p-3 bg-dark text-light rounded">
          <h5 class="fw-bold">${review.name}</h5>
          <p class="text-warning">${stars}</p>
          <p>${review.review}</p>
        </div>
      `;
      reviewList.insertAdjacentHTML('beforeend', reviewElement);
    });
  } catch (error) {
    console.error('Error displaying reviews:', error);
    const reviewList = document.getElementById('reviewList');
    if (reviewList) {
      reviewList.innerHTML = `<p class="text-danger text-center">Error loading reviews: ${error.message}</p>`;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  lazyLoadBackground();
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleReviewSubmit);
  } else {
    console.error('Review form element not found');
  }
  fetchReviews();
});