import"./style-OyH2aAWt.js";import{createClient as b}from"https://esm.sh/@supabase/supabase-js@2";const g="https://kdijhjnkxkrfjlyavcoe.supabase.co",h="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaWpoam5reGtyZmpseWF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcyNDMsImV4cCI6MjA2Njc4MzI0M30.0EpnU9W3_O0b94Twy0FXdgtT49jByEO7tx2et-nQySA";let o;try{o=b(g,h),console.log("Supabase client initialized successfully")}catch(t){console.error("Failed to initialize Supabase client:",t),alert("Error connecting to the database. Please try again later.")}async function f(){if(!o){console.error("Supabase client is not initialized"),document.getElementById("product-catalog").innerHTML='<p class="text-danger text-center">Error: Database connection failed.</p>';return}try{const{data:t,error:a}=await o.from("laptops").select("id, model, specifications, price, is_in_stock, image_urls, phone_number, whatsapp_number").order("created_at",{ascending:!1});if(a)throw console.error("Error fetching laptops:",a),new Error(`Failed to fetch laptops: ${a.message}`);const s=document.getElementById("product-catalog");if(!s){console.error("Catalogue container element not found");return}if(s.innerHTML="",!t||t.length===0){s.innerHTML='<p class="text-center text-light">No laptops available.</p>';return}t.forEach((e,v)=>{const c=`carousel-${e.id}`,r=Array.isArray(e.image_urls)&&e.image_urls.length>0?e.image_urls:["https://kdijhjnkxkrfjlyavcoe.supabase.co/storage/v1/object/public/images/placeholder.jpg"],i=e.is_in_stock?"":"out-of-stock",l=e.is_in_stock?"":'<span class="out-of-stock-label">Out of Stock</span>',d=e.is_in_stock?`
            <div class="contact-links">
              <a href="tel:${e.phone_number}" class="contact-link">Call Us</a>
              <a href="https://wa.me/${e.whatsapp_number}" class="contact-link">WhatsApp</a>
            </div>
          `:'<div class="contact-links"><a class="contact-link disabled">Call Us</a><a class="contact-link disabled">WhatsApp</a></div>',u=r.map((m,n)=>`
        <div class="carousel-item ${n===0?"active":""}">
          <img src="${m}" alt="${e.model} image ${n+1}" class="d-block w-100" />
        </div>
      `).join(""),p=`
        <div class="product-card ${i}">
          <div class="carousel-container" id="${c}" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${u}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${c}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${c}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <div class="product-info">
            <h3 class="product-title">${e.model}</h3>
            <p class="product-specs">${e.specifications}</p>
            <p class="product-price">₦${e.price.toFixed(2)}</p>
            ${d}
            ${l}
          </div>
        </div>
      `;s.insertAdjacentHTML("beforeend",p)}),document.querySelectorAll(".carousel-container").forEach(e=>{new bootstrap.Carousel(e,{interval:5e3,ride:"carousel"})})}catch(t){console.error("Error displaying laptops:",t);const a=document.getElementById("product-catalog");a&&(a.innerHTML=`<p class="text-danger text-center">Error loading laptops: ${t.message}</p>`)}}document.addEventListener("DOMContentLoaded",()=>{console.log("DOM loaded, initializing catalogue..."),f()});
