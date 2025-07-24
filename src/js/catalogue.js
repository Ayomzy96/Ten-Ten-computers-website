const products = [
  {
    model: "Dell Latitude",
    specs: "Intel i5 | Webcam | 8GB RAM | 320GB HDD | Windows 10",
    price: "₦160,000",
    phone: "+2348165773599",
    status: "available",
    images: [
      "/catalogues/Dellatitude/IMG-20250228-WA0008.jpg",
      "/catalogues/Dellatitude/IMG-20250513-WA0006.jpg",
      "/catalogues/Dellatitude/IMG-20250513-WA0005.jpg",
    ]
  },
  
  {
    model: "Toshiba",
    specs: "Intel i3 | Webcam| 8GB RAM | 320GB HDD | Windows 10",
    price: "₦100,000",
    phone: "+2348165773599",
    status: "available",
    images: [
      "/catalogues/toshiba/IMG-20250504-WA0048.jpg",
      "/catalogues/toshiba/IMG-20250504-WA0022.jpg",

    ]
  },
  {
    model: "Lenovo Thinkpad",
    specs: "Intel i5 (6th generation) | Webcam| 8GB RAM | 256GB SSD | Windows 10",
    price: "₦100,000",
    phone: "+2348165773599",
    status: "available",
    images: [
      "/catalogues/Lenovothinkpad/Lenovothinkpad.jpg",
      "/catalogues/Lenovothinkpad/Lenovothinkpad(2).jpg",
      "/catalogues/Lenovothinkpad/Lenovothinkpad(3).jpg",
      "/catalogues/Lenovothinkpad/Lenovothinkpad(4).jpg",
    ]
  },

  {
    model: "Acer Travelmate 5744",
    specs: "Intel i5 | Webcam | 8GB RAM | 320GB HDD | Windows 10",
    price: "₦100,000",
    phone: "+2348165773599",
    status: "sold",
    images: [
      "/catalogues/Acertravelmate/IMG-20250504-WA0046.jpg",
      "/catalogues/Acertravelmate/IMG-20250504-WA0043.jpg",
  
    ]
  },
];

function renderCatalogue() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((product, index) => {
    const carouselId = `carousel${index}`;
    const carouselItems = product.images.map((img, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="${img}" class="d-block w-100 catalogue-img" alt="${product.model}">
      </div>
    `).join("");

    const isSold = product.status.toLowerCase() === "sold";
    const statusBadge = isSold
      ? `<span class="badge bg-danger">SOLD</span>`
      : `<span class="badge bg-success">Available</span>`;

    const cardClasses = `card bg-secondary text-white h-100 shadow ${isSold ? 'opacity-50' : ''}`;

    const productHTML = `
      <div class="col-md-4">
        <div class="${cardClasses}">
          <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">${carouselItems}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title fw-bold mb-0">${product.model}</h5>
              ${statusBadge}
            </div>
            <p class="card-text">${product.specs}</p>
            <p class="card-text fw-bold">${product.price}</p>
            <div class="d-flex justify-content-between">
              <a href="tel:${product.phone}" class="btn btn-light btn-sm ${isSold ? 'disabled' : ''}">Call</a>
              <a href="https://wa.me/${product.phone.replace('+', '')}" class="btn btn-success btn-sm ${isSold ? 'disabled' : ''}">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    `;

    grid.insertAdjacentHTML("beforeend", productHTML);
  });
}

document.addEventListener("DOMContentLoaded", renderCatalogue);
