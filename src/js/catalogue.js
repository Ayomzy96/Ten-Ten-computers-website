import supabase from './supabaseClient.js';

const PAGE_SIZE = 9;

console.log('Centralized supabase client available (catalogue):', !!supabase);

async function fetchLaptops(page = 1) {
  const catalog = document.getElementById('product-catalog');
  if (!catalog) return;

  if (!supabase) {
    catalog.innerHTML = '<p class="text-danger text-center">Error: Database client not initialized.</p>';
    return;
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = page * PAGE_SIZE - 1;

  try {
    // Support simple search via ?q=term — matches model OR specifications (case-insensitive)
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q')?.trim();

    let query = supabase
      .from('laptops')
      .select('id, model, specifications, price, is_in_stock, image_urls, phone_number, whatsapp_number', { count: 'exact' });

    if (q) {
      // Use supabase .or with ilike for model or specifications
      // e.g. model.ilike.%ThinkPad%,specifications.ilike.%ThinkPad%
      const like = `%${q}%`;
      query = query.or(`model.ilike.${like},specifications.ilike.${like}`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    renderLaptops(data || []);
    const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));
    renderPagination(totalPages, page);
  } catch (err) {
    console.error('Error fetching laptops:', err);
    catalog.innerHTML = `<p class="text-danger text-center">Error loading laptops: ${err.message}</p>`;
  }
}

function renderLaptops(items) {
  const catalog = document.getElementById('product-catalog');
  if (!catalog) return;
  catalog.innerHTML = '';

  if (!items || items.length === 0) {
    catalog.innerHTML = '<p class="text-center text-light">No laptops available.</p>';
    return;
  }

  items.forEach(laptop => {
    const card = document.createElement('div');
    card.className = 'product-card ' + (laptop.is_in_stock ? '' : 'out-of-stock');

    // Carousel container
    const carousel = document.createElement('div');
    const carouselId = `carousel-${laptop.id}`;
    carousel.className = 'carousel slide carousel-container';
    carousel.id = carouselId;
    carousel.setAttribute('data-bs-interval', 'false');

    const inner = document.createElement('div');
    inner.className = 'carousel-inner';

    const imageUrls = Array.isArray(laptop.image_urls) && laptop.image_urls.length ? laptop.image_urls : ['https://kdijhjnkxkrfjlyavcoe.supabase.co/storage/v1/object/public/images/placeholder.jpg'];

    imageUrls.forEach((url, idx) => {
      const item = document.createElement('div');
      item.className = 'carousel-item' + (idx === 0 ? ' active' : '');
      const img = document.createElement('img');
      img.className = 'd-block w-100';
      img.loading = 'lazy';
      img.src = url;
      img.alt = `${laptop.model} image ${idx + 1}`;
      item.appendChild(img);
      inner.appendChild(item);
    });

    // Controls
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-control-prev';
    prevBtn.type = 'button';
    prevBtn.setAttribute('data-bs-target', `#${carouselId}`);
    prevBtn.setAttribute('data-bs-slide', 'prev');
    prevBtn.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-control-next';
    nextBtn.type = 'button';
    nextBtn.setAttribute('data-bs-target', `#${carouselId}`);
    nextBtn.setAttribute('data-bs-slide', 'next');
    nextBtn.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';

    carousel.appendChild(inner);
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    // Info
    const info = document.createElement('div');
    info.className = 'product-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'product-title';
    titleEl.textContent = laptop.model;
    info.appendChild(titleEl);

    const specsEl = document.createElement('p');
    specsEl.className = 'product-specs';
    specsEl.textContent = laptop.specifications;
    info.appendChild(specsEl);

    const priceEl = document.createElement('p');
    priceEl.className = 'product-price';
    priceEl.textContent = `₦${Number(laptop.price).toFixed(2)}`;
    info.appendChild(priceEl);

    const contact = document.createElement('div');
    contact.className = 'contact-links';
    if (laptop.is_in_stock) {
      const callA = document.createElement('a');
      callA.href = `tel:${laptop.phone_number}`;
      callA.className = 'contact-link';
      callA.textContent = 'Call Us';
      const waA = document.createElement('a');
      waA.href = `https://wa.me/${laptop.whatsapp_number}`;
      waA.className = 'contact-link';
      waA.textContent = 'WhatsApp';
      contact.appendChild(callA);
      contact.appendChild(waA);
    } else {
      const callA = document.createElement('a');
      callA.className = 'contact-link disabled';
      callA.textContent = 'Call Us';
      const waA = document.createElement('a');
      waA.className = 'contact-link disabled';
      waA.textContent = 'WhatsApp';
      contact.appendChild(callA);
      contact.appendChild(waA);
    }

    info.appendChild(contact);
    if (!laptop.is_in_stock) {
      const out = document.createElement('div');
      out.className = 'out-of-stock-label';
      out.textContent = 'Out of Stock';
      info.appendChild(out);
    }

    card.appendChild(carousel);
    card.appendChild(info);
    catalog.appendChild(card);
  });

  // Initialize Bootstrap carousels
  setTimeout(() => {
    document.querySelectorAll('.carousel.slide').forEach(el => {
      bootstrap.Carousel.getOrCreateInstance(el, { interval: false, touch: true, wrap: true });
    });
  }, 50);
}

function renderPagination(totalPages, currentPage) {
  let container = document.getElementById('pagination-controls');
  if (!container) {
    const catalog = document.getElementById('product-catalog');
    if (!catalog) return;
    container = document.createElement('div');
    container.id = 'pagination-controls';
    container.className = 'd-flex justify-content-center mt-4';
    catalog.parentNode.insertBefore(container, catalog.nextSibling);
  }

  // Clear
  container.innerHTML = '';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page navigation');
  const ul = document.createElement('ul');
  ul.className = 'pagination';

  const addPageItem = (label, page, disabled = false, active = false) => {
    const li = document.createElement('li');
    li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
    const btn = document.createElement('button');
    btn.className = 'page-link';
    btn.type = 'button';
    btn.textContent = label;
    btn.dataset.page = page;
    if (!disabled && !active) {
      btn.addEventListener('click', () => {
        fetchLaptops(page);
        const catalogTop = document.getElementById('catalogue');
        if (catalogTop) catalogTop.scrollIntoView({ behavior: 'smooth' });
      });
    }
    li.appendChild(btn);
    ul.appendChild(li);
  };

  // Previous
  addPageItem('Previous', Math.max(1, currentPage - 1), currentPage === 1);

  // Pages
  const maxButtons = 7;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
  for (let p = start; p <= end; p++) {
    addPageItem(String(p), p, false, p === currentPage);
  }

  // Next
  addPageItem('Next', Math.min(totalPages, currentPage + 1), currentPage === totalPages);

  nav.appendChild(ul);
  container.appendChild(nav);
}

window.addEventListener('DOMContentLoaded', () => fetchLaptops(1));
