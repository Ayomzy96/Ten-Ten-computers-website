import"./style-KnZ4zc_j.js";import{createClient as u}from"https://esm.sh/@supabase/supabase-js@2";const m=u("https://kdijhjnkxkrfjlyavcoe.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaWpoam5reGtyZmpseWF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcyNDMsImV4cCI6MjA2Njc4MzI0M30.0EpnU9W3_O0b94Twy0FXdgtT49jByEO7tx2et-nQySA");console.log("Supabase URL:","https://kdijhjnkxkrfjlyavcoe.supabase.co");console.log("Supabase Key:","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaWpoam5reGtyZmpseWF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcyNDMsImV4cCI6MjA2Njc4MzI0M30.0EpnU9W3_O0b94Twy0FXdgtT49jByEO7tx2et-nQySA");async function h(){try{const{data:e,error:s}=await m.from("laptops").select("*");if(s)throw console.error("Supabase fetch error:",s),new Error(`Failed to fetch products: ${s.message} (Code: ${s.code})`);console.log("Fetched products:",e),(!e||e.length===0)&&console.warn("No products found in the database."),b(e)}catch(e){console.error("Error fetching products:",e);const s=document.getElementById("product-catalog");s.innerHTML=`<p class="text-danger text-center">Error loading products: ${e.message}</p>`}}function b(e){const s=document.getElementById("product-catalog");if(s.innerHTML="",!e||e.length===0){s.innerHTML='<p class="text-center text-light">No products available.</p>';return}e.forEach((a,o)=>{const n=Array.isArray(a.image_urls)&&a.image_urls.length>0?a.image_urls.map(r=>r.replace(/\/+/g,"/")).filter(y):["https://via.placeholder.com/300"],c=a.phone_number&&f(a.phone_number)?a.phone_number:"#",l=a.whatsapp_number&&g(a.whatsapp_number)?a.whatsapp_number:"#",t=a.is_in_stock!==!1;console.log(`Rendering product ${o+1}:`,{model:a.model,imageUrls:n,isInStock:t,phoneNumber:c,whatsappNumber:l});const p=n.map((r,i)=>`
      <div class="carousel-item ${i===0?"active":""}">
        <img src="${r}" alt="${a.model||"Laptop"} Image ${i+1}" class="d-block w-100" loading="lazy">
      </div>
    `).join(""),d=`
      <div class="product-card ${t?"":"out-of-stock"} animate__animated animate__fadeIn" style="animation-delay: ${o*.1}s;">
        <div id="carousel-${o}" class="carousel slide carousel-container" data-bs-ride="carousel" data-bs-interval="4000">
          <div class="carousel-inner">
            ${p}
          </div>
          ${n.length>1?`
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${o}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${o}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          `:""}
        </div>
        <div class="product-info">
          <h3 class="product-title">${a.model||"Unknown Model"}</h3>
          <p class="product-specs">${a.specifications||"No specifications available"}</p>
          <p class="product-price">$${a.price||"N/A"}</p>
          <div class="contact-links">
            <a href="${t&&c!=="#"?`tel:${c}`:"#"}" class="phone-link ${t?"":"disabled"}">Call Us</a>
            <a href="${t&&l!=="#"?`https://wa.me/${l}`:"#"}" class="whatsapp-link ${t?"":"disabled"}" target="_blank">WhatsApp</a>
          </div>
          ${t?"":'<span class="out-of-stock-label">Out of Stock</span>'}
        </div>
      </div>
    `;s.insertAdjacentHTML("beforeend",d)}),I()}function I(){document.querySelectorAll(".carousel").forEach(e=>{new bootstrap.Carousel(e,{interval:4e3,ride:"carousel"})})}function y(e){try{return new URL(e),!0}catch{return!1}}function f(e){return/^\+?\d{10,15}$/.test(e)}function g(e){return/^\d{10,15}$/.test(e)}document.addEventListener("DOMContentLoaded",h);
