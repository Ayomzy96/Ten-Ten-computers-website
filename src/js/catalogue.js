import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_IMAGE_URL = `${supabaseUrl}/storage/v1/object/public/images/`;

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
      displayProducts([]);
    } else {
      displayProducts(data);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    const catalog = document.getElementById('product-catalog');
    catalog.innerHTML = `<p class="text-danger text-center">Error loading products: ${error.message}</p>`;
  }
}

// Normalize image URLs
function normalizeImageUrl(url) {
  try {
    // If URL is already absolute and valid, return it
    if (isValidUrl(url)) {
      const parsedUrl = new URL(url);
      if (parsedUrl.origin === supabaseUrl) {
        console.log(`Valid Supabase image URL: ${url}`);
        return url;
      }
    }
    // If URL is a filename or partial path, prepend BASE_IMAGE_URL
    const cleanUrl = url.replace(/^\/+/, '').replace(/^images\//, '');
    const fullUrl = `${BASE_IMAGE_URL}${cleanUrl}`;
    new URL(fullUrl); // Validate
    console.log(`Normalized image URL: ${fullUrl}`);
    return fullUrl;
  } catch (e) {
    console.warn(`Invalid image URL: ${url}, Error: ${e.message}`);
    return 'https://via.placeholder.com/300';
  }
}

// Display products in the catalog
function displayProducts(products) {
  const catalog = document.getElementById('product-catalog');
  if (!catalog) {
    console.error('Product catalog element not found');
    return;
  }
  catalog.innerHTML = '';

  if (!products || products.length === 0) {
    catalog.innerHTML = '<p class="text-center text-light">No products available.</p>';
    return;
  }

  products.forEach((product, index) => {
    const imageUrls = Array.isArray(product.image_urls) && product.image_urls.length > 0 
      ? product.image_urls.map(url => normalizeImageUrl(url)).filter(url => url !== null)
      : ['https://via.placeholder.com/300'];
    
    if (imageUrls.length === 0) {
      console.warn(`No valid image URLs for product ${product.model || 'Unknown'}`);
      imageUrls.push('https://via.placeholder.com/300');
    }

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
        <img src="${url}" alt="${product.model || 'Laptop'} Image ${imgIndex + 1}" class="d-block w-100" loading="lazy" onerror="console.error('Failed to load image: ${url}'); this.src='https://via.placeholder.com/300';">
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

  // Initialize Bootstrap carousels
  initializeCarousels();
}

// Initialize all carousels
function initializeCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  console.log(`Found ${carousels.length} carousels to initialize`);
  carousels.forEach(carousel => {
    new bootstrap.Carousel(carousel, {
      interval: 4000,
      ride: 'carousel'
    });
  });
}

// Lazy load section background
function lazyLoadBackground() {
  const section = document.querySelector('#catalogue');
  if (!section) {
    console.error('Catalogue section not found');
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bg = section.getAttribute('data-bg');
            if (bg) {
              console.log('Loading background image:', bg);
              section.style.backgroundImage = bg;
            } else {
              console.warn('No background image defined for catalogue section');
            }
            observer.unobserve(section);
          }
        });
      },
      { rootMargin: '100px' }
    );
    observer.observe(section);
  } else {
    const bg = section.getAttribute('data-bg');
    if (bg) {
      console.log('Fallback: Loading background image:', bg);
      section.style.backgroundImage = bg;
    }
  }
}

// Helper functions
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidPhone(phone) {
  return /^\+?\d{10,15}$/.test(phone);
}

function isValidWhatsAppNumber(phone) {
  return /^\d{10,15}$/.test(phone);
}

// Load products and background on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, fetching products...');
  fetchProducts();
  lazyLoadBackground();
});