import"./style-KnZ4zc_j.js";import{createClient as m}from"https://esm.sh/@supabase/supabase-js@2";const i="https://kdijhjnkxkrfjlyavcoe.supabase.co",b="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaWpoam5reGtyZmpseWF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcyNDMsImV4cCI6MjA2Njc4MzI0M30.0EpnU9W3_O0b94Twy0FXdgtT49jByEO7tx2et-nQySA",h=m(i,b),f=`${i}/storage/v1/object/public/images/`;async function v(){try{const{data:e,error:a}=await h.from("laptops").select("*");if(a)throw console.error("Supabase fetch error:",a),new Error(`Failed to fetch products: ${a.message} (Code: ${a.code})`);console.log("Fetched products:",e),!e||e.length===0?(console.warn("No products found in the database."),u([])):u(e)}catch(e){console.error("Error fetching products:",e);const a=document.getElementById("product-catalog");a.innerHTML=`<p class="text-danger text-center">Error loading products: ${e.message}</p>`}}function $(e){try{if(w(e)&&new URL(e).origin===i)return console.log(`Valid Supabase image URL: ${e}`),e;const a=e.replace(/^\/+/,"").replace(/^images\//,""),o=`${f}${a}`;return new URL(o),console.log(`Normalized image URL: ${o}`),o}catch(a){return console.warn(`Invalid image URL: ${e}, Error: ${a.message}`),"https://via.placeholder.com/300"}}function u(e){const a=document.getElementById("product-catalog");if(!a){console.error("Product catalog element not found");return}if(a.innerHTML="",!e||e.length===0){a.innerHTML='<p class="text-center text-light">No products available.</p>';return}e.forEach((o,t)=>{const s=Array.isArray(o.image_urls)&&o.image_urls.length>0?o.image_urls.map(c=>$(c)).filter(c=>c!==null):["https://via.placeholder.com/300"];s.length===0&&(console.warn(`No valid image URLs for product ${o.model||"Unknown"}`),s.push("https://via.placeholder.com/300"));const n=o.phone_number&&k(o.phone_number)?o.phone_number:"#",l=o.whatsapp_number&&U(o.whatsapp_number)?o.whatsapp_number:"#",r=o.is_in_stock!==!1;console.log(`Rendering product ${t+1}:`,{model:o.model,imageUrls:s,isInStock:r,phoneNumber:n,whatsappNumber:l});const p=s.map((c,d)=>`
      <div class="carousel-item ${d===0?"active":""}">
        <img src="${c}" alt="${o.model||"Laptop"} Image ${d+1}" class="d-block w-100" loading="lazy" onerror="console.error('Failed to load image: ${c}'); this.src='https://via.placeholder.com/300';">
      </div>
    `).join(""),g=`
      <div class="product-card ${r?"":"out-of-stock"} animate__animated animate__fadeIn" style="animation-delay: ${t*.1}s;">
        <div id="carousel-${t}" class="carousel slide carousel-container" data-bs-ride="carousel" data-bs-interval="4000">
          <div class="carousel-inner">
            ${p}
          </div>
          ${s.length>1?`
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${t}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${t}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          `:""}
        </div>
        <div class="product-info">
          <h3 class="product-title">${o.model||"Unknown Model"}</h3>
          <p class="product-specs">${o.specifications||"No specifications available"}</p>
          <p class="product-price">$${o.price||"N/A"}</p>
          <div class="contact-links">
            <a href="${r&&n!=="#"?`tel:${n}`:"#"}" class="phone-link ${r?"":"disabled"}">Call Us</a>
            <a href="${r&&l!=="#"?`https://wa.me/${l}`:"#"}" class="whatsapp-link ${r?"":"disabled"}" target="_blank">WhatsApp</a>
          </div>
          ${r?"":'<span class="out-of-stock-label">Out of Stock</span>'}
        </div>
      </div>
    `;a.insertAdjacentHTML("beforeend",g)}),y()}function y(){const e=document.querySelectorAll(".carousel");console.log(`Found ${e.length} carousels to initialize`),e.forEach(a=>{new bootstrap.Carousel(a,{interval:4e3,ride:"carousel"})})}function I(){const e=document.querySelector("#catalogue");if(!e){console.error("Catalogue section not found");return}if("IntersectionObserver"in window)new IntersectionObserver((o,t)=>{o.forEach(s=>{if(s.isIntersecting){const n=e.getAttribute("data-bg");n?(console.log("Loading background image:",n),e.style.backgroundImage=n):console.warn("No background image defined for catalogue section"),t.unobserve(e)}})},{rootMargin:"100px"}).observe(e);else{const a=e.getAttribute("data-bg");a&&(console.log("Fallback: Loading background image:",a),e.style.backgroundImage=a)}}function w(e){try{return new URL(e),!0}catch{return!1}}function k(e){return/^\+?\d{10,15}$/.test(e)}function U(e){return/^\d{10,15}$/.test(e)}document.addEventListener("DOMContentLoaded",()=>{console.log("DOM loaded, fetching products..."),v(),I()});
