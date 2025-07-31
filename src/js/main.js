import { createClient } from '@supabase/supabase-js';
import.meta.env;

document.addEventListener('DOMContentLoaded', () => {
  // Lazy load background images
  const sections = document.querySelectorAll('.section-bg');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            const bg = section.getAttribute('data-bg');
            if (bg) {
              section.style.backgroundImage = bg;
            }
            observer.unobserve(section); // Load only once
          }
        });
      },
      { rootMargin: '100px' } // Load 100px before entering viewport
    );

    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback for older browsers (rare in 2025)
    sections.forEach(section => {
      const bg = section.getAttribute('data-bg');
      if (bg) {
        section.style.backgroundImage = bg;
      }
    });
  }

  // Fetch reviews
  fetchReviews();
});

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_KEY);

// 📝 Handle review form submission
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById('username').value.trim();
  const rating = document.querySelector('input[name="rating"]:checked')?.value;
  const review = document.getElementById('reviewText').value.trim();

  // Validate input
  if (!name || !rating || !review) {
    alert('⚠️ Please fill out all fields.');
    return;
  }

  // Insert data into Supabase
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ name, rating: Number(rating), review }]);

  console.log("🧾 Insert result:", { data, error });

  if (error) {
    alert('❌ ' + error.message);
    console.error('Insert error:', error);
  } else {
    // Show success toast
    const toast = new bootstrap.Toast(document.getElementById('successToast'));
    toast.show();

    // Reset form
    e.target.reset();

    // Refresh review list
    fetchReviews();
  }
});

// 📥 Fetch and display reviews
async function fetchReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('reviewList');
  list.innerHTML = '';

  if (error) {
    console.error('❌ Fetch error:', error);
    return;
  }

  // Render each review
  data.forEach((review) => {
    const card = document.createElement('div');
    card.className = 'bg-dark p-3 my-2 rounded text-white border';

    card.innerHTML = `
      <h5>${review.name} <span class="text-warning">${'★'.repeat(review.rating)}</span></h5>
      <p>${review.review}</p>
      <small class="text-white">
        ${new Date(review.created_at).toLocaleDateString()} at ${new Date(review.created_at).toLocaleTimeString()}
      </small>
    `;
    list.appendChild(card);
  });
}