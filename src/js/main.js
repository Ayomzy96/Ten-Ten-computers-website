import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kdijhjnkxkrfjlyavcoe.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaWpoam5reGtyZmpseWF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcyNDMsImV4cCI6MjA2Njc4MzI0M30.0EpnU9W3_O0b94Twy0FXdgtT49jByEO7tx2et-nQySA';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const form = event.target;
  const username = form.querySelector('#username').value;
  const rating = form.querySelector('input[name="rating"]:checked')?.value;
  const reviewText = form.querySelector('#reviewText').value;

  if (!username || !rating || !reviewText) {
    alert('Please fill out all fields and select a rating.');
    return;
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .insert([{ username, rating: parseInt(rating), review_text: reviewText }]);

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
    console.error('Unexpected error:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}

// Fetch and display reviews
async function fetchReviews() {
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
          <h5 class="fw-bold">${review.username}</h5>
          <p class="text-warning">${stars}</p>
          <p>${review.review_text}</p>
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
  }
  fetchReviews();
});