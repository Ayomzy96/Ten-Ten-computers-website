import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  alert('Error connecting to the database. Please try again later.');
}

// Fetch and display laptops
async function fetchLaptops() {
  if (!supabase) {
    console.error('Supabase client is not initialized');
    document.getElementById('product-catalog').innerHTML = '<p class="text-danger text-center">Error: Database connection failed.</p>';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('laptops')
      .select('id, model, specifications, price, is_in_stock, image_urls, phone_number, whatsapp_number')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching laptops:', error);
      throw new Error(`Failed to fetch laptops: ${error.message}`);
    }

    const catalogContainer = document.getElementById('product-catalog');
    if (!catalogContainer) {
      console.error('Catalogue container element not found');
      return;
    }

    catalogContainer.innerHTML = '';

    if (!data || data.length === 0) {
      catalogContainer.innerHTML = '<p class="text-center text-light">No laptops available.</p>';
      return;
    }

    data.forEach((laptop, index) => {
      const carouselId = `carousel-${laptop.id}`;
      const imageUrls = Array.isArray(laptop.image_urls) && laptop.image_urls.length > 0
        ? laptop.image_urls
        : ['https://kdijhjnkxkrfjlyavcoe.supabase.co/storage/v1/object/public/images/placeholder.jpg'];
      const stockStatus = laptop.is_in_stock ? '' : 'out-of-stock';
      const stockLabel = laptop.is_in_stock ? '' : '<span class="out-of-stock-label">Out of Stock</span>';
      const contactLinks = laptop.is_in_stock
        ? `
            <div class="contact-links">
              <a href="tel:${laptop.phone_number}" class="contact-link">Call Us</a>
              <a href="https://wa.me/${laptop.whatsapp_number}" class="contact-link">WhatsApp</a>
            </div>
          `
        : '<div class="contact-links"><a class="contact-link disabled">Call Us</a><a class="contact-link disabled">WhatsApp</a></div>';

      // Generate carousel items
      const carouselItems = imageUrls.map((url, imgIndex) => `
        <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
          <img src="${url}" alt="${laptop.model} image ${imgIndex + 1}" class="d-block w-100" />
        </div>
      `).join('');

      const laptopElement = `
        <div class="product-card ${stockStatus}">
          <div class="carousel-container" id="${carouselId}" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
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
      catalogContainer.insertAdjacentHTML('beforeend', laptopElement);
    });

    // Initialize Bootstrap carousels
    document.querySelectorAll('.carousel-container').forEach(carousel => {
      new bootstrap.Carousel(carousel, {
        interval: 5000,
        ride: 'carousel'
      });
    });
  } catch (error) {
    console.error('Error displaying laptops:', error);
    const catalogContainer = document.getElementById('product-catalog');
    if (catalogContainer) {
      catalogContainer.innerHTML = `<p class="text-danger text-center">Error loading laptops: ${error.message}</p>`;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing catalogue...');
  fetchLaptops();
});