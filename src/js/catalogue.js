import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_KEY);


// Fetch products from Supabase
async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('laptops')
      .select('*');
    if (error) {
      console.error('Supabase fetch error:', error);
      throw new Error(`Failed to fetch products: ${error.message} (Code: ${error.code})`);
    }
    console.log('Fetched products:', data);
    if (!data || data.length === 0) {
      console.warn('No products found in the database.');
    }
    displayProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    const catalog = document.getElementById('product-catalog');
    catalog.innerHTML = `<p class="text-danger text-center">Error loading products: ${error.message}</p>`;
  }
}

// Display products in the catalog
function displayProducts(products) {
  const catalog = document.getElementById('product-catalog');
  catalog.innerHTML = '';

  if (!products || products.length === 0) {
    catalog.innerHTML = '<p class="text-center text-light">No products available.</p>';
    return;
  }

  products.forEach((product, index) => {
    const imageUrls = Array.isArray(product.image_urls) && product.image_urls.length > 0 
      ? product.image_urls.map(url => url.replace(/\/+/g, '/')).filter(isValidUrl)
      : ['https://via.placeholder.com/300'];
    const phoneNumber = product.phone_number && isValidPhone(product.phone_number) 
      ? product.phone_number 
      : '#';
    const whatsappNumber = product.whatsapp_number && isValidWhatsAppNumber(product.whatsapp_number) 
      ? product.whatsapp_number 
      : '#';
    const isInStock = product.is_in_stock !== false;

    console.log(`Rendering product ${index + 1}:`, {
      model: product.model,
      imageUrls,
      isInStock,
      phoneNumber,
      whatsappNumber
    });

    const carouselItems = imageUrls.map((url, imgIndex) => `
      <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
        <img src="${url}" alt="${product.model || 'Laptop'} Image ${imgIndex + 1}" class="d-block w-100" loading="lazy">
      </div>
    `).join('');

    const productCard = `
      <div class="product-card ${isInStock ? '' : 'out-of-stock'} animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s;">
        <div id="carousel-${index}" class="carousel slide carousel-container" data-bs-ride="carousel" data-bs-interval="4000">
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          ${imageUrls.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          ` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.model || 'Unknown Model'}</h3>
          <p class="product-specs">${product.specifications || 'No specifications available'}</p>
          <p class="product-price">$${product.price || 'N/A'}</p>
          <div class="contact-links">
            <a href="${isInStock && phoneNumber !== '#' ? `tel:${phoneNumber}` : '#'}" class="phone-link ${isInStock ? '' : 'disabled'}">Call Us</a>
            <a href="${isInStock && whatsappNumber !== '#' ? `https://wa.me/${whatsappNumber}` : '#'}" class="whatsapp-link ${isInStock ? '' : 'disabled'}" target="_blank">WhatsApp</a>
          </div>
          ${isInStock ? '' : '<span class="out-of-stock-label">Out of Stock</span>'}
        </div>
      </div>
    `;
    catalog.insertAdjacentHTML('beforeend', productCard);
  });

  // Initialize Bootstrap carousels for automatic slideshow
  initializeCarousels();
}

// Initialize all carousels
function initializeCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    new bootstrap.Carousel(carousel, {
      interval: 4000,
      ride: 'carousel'
    });
  });
}

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Helper function to validate phone numbers
function isValidPhone(phone) {
  return /^\+?\d{10,15}$/.test(phone);
}

// Helper function to validate WhatsApp numbers
function isValidWhatsAppNumber(phone) {
  return /^\d{10,15}$/.test(phone);
}

// Load products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);