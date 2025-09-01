import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  alert('Error connecting to the database. Please try again later.');
}


// Fetch, render, and paginate laptops
let allLaptops = [];
let currentPage = 1;
const pageSize = 9;

async function fetchLaptops() {
  const catalogContainer = document.getElementById('product-catalog');
  if (!supabase) {
    console.error('Supabase client is not initialized');
    if (catalogContainer) {
      catalogContainer.innerHTML = '<p class="text-danger text-center">Error: Database connection failed.</p>';
    }
    return;
  }
  try {
    let data = null;
    let error = null;
    const cacheKey = 'catalogue_laptops';
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      try {
        data = JSON.parse(cache);
      } catch (e) {
        data = null;
      }
    }
    if (!data) {
      const response = await supabase
        .from('laptops')
        .select('id, model, specifications, price, is_in_stock, image_urls, phone_number, whatsapp_number')
        .order('created_at', { ascending: false });
      data = response.data;
      error = response.error;
      if (data) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    }
    if (error) {
      throw new Error(`Failed to fetch laptops: ${error.message}`);
    }
    allLaptops = Array.isArray(data) ? data : [];
    currentPage = 1;
    renderLaptops();
  } catch (error) {
    console.error('Error displaying laptops:', error);
    if (catalogContainer) {
      catalogContainer.innerHTML = `<p class="text-danger text-center">Error loading laptops: ${error.message}</p>`;
    }
  }
}

function renderLaptops() {
  const catalogContainer = document.getElementById('product-catalog');
  if (!catalogContainer) return;
  catalogContainer.innerHTML = '';
  if (!allLaptops || allLaptops.length === 0) {
    catalogContainer.innerHTML = '<p class="text-center text-light">No laptops available.</p>';
    return;
  }
  const start = 0;
  const end = currentPage * pageSize;
  const laptopsToShow = allLaptops.slice(start, end);
  let html = '';
  laptopsToShow.forEach((laptop, index) => {
    const carouselId = `carousel-${laptop.id}`;
    const imageUrls = Array.isArray(laptop.image_urls) && laptop.image_urls.length > 0
      ? laptop.image_urls
      : ['https://kdijhjnkxkrfjlyavcoe.supabase.co/storage/v1/object/public/images/placeholder.jpg'];
    const stockStatus = laptop.is_in_stock ? '' : 'out-of-stock';
    const stockLabel = laptop.is_in_stock ? '' : '<span class="out-of-stock-label">Out of Stock</span>';
    const contactLinks = laptop.is_in_stock
      ? `<div class="contact-links">
            <a href="tel:${laptop.phone_number}" class="contact-link">Call Us</a>
            <a href="https://wa.me/${laptop.whatsapp_number}" class="contact-link">WhatsApp</a>
          </div>`
      : '<div class="contact-links"><a class="contact-link disabled">Call Us</a><a class="contact-link disabled">WhatsApp</a></div>';
    const carouselItems = imageUrls.map((url, imgIndex) => `
      <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
        <img src="${url}" alt="${laptop.model} image ${imgIndex + 1}" class="d-block w-100" loading="lazy" />
      </div>
    `).join('');
    html += `
      <div class="product-card ${stockStatus}">
        <div class="carousel-container" id="${carouselId}" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" aria-label="Previous image">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" aria-label="Next image">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <div class="product-info">
          <h3 class="product-title">${laptop.model}</h3>
          <p class="product-specs">${laptop.specifications}</p>
          <p class="product-price">₦${laptop.price.toFixed(2)}</p>
          ${contactLinks}
          ${stockLabel}
        </div>
      </div>
    `;
  });
  catalogContainer.innerHTML = html;
  // Re-initialize Bootstrap carousels
  setTimeout(() => {
    document.querySelectorAll('.carousel-container').forEach(carousel => {
      new bootstrap.Carousel(carousel, {
        interval: 5000,
        ride: 'carousel'
      });
    });
  }, 100);
  // Add Load More button if there are more products
  if (allLaptops.length > laptopsToShow.length) {
    const loadMoreDiv = document.createElement('div');
    loadMoreDiv.className = 'd-flex justify-content-center mt-4';
    loadMoreDiv.innerHTML = `<button id="loadMoreBtn" class="btn btn-primary" aria-label="Load more products">Load More</button>`;
    catalogContainer.appendChild(loadMoreDiv);
    document.getElementById('loadMoreBtn').onclick = () => {
      currentPage++;
      renderLaptops();
    };
  }
}

// Load products on page load
window.addEventListener('DOMContentLoaded', fetchLaptops);
