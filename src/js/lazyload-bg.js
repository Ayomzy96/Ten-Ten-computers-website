// /js/lazyload-bg.js

export function lazyLoadBackgrounds() {
  const lazyBgSections = document.querySelectorAll(".lazy-bg");

  const loadBg = (el) => {
    const bg = el.getAttribute("data-bg");
    if (bg) el.style.backgroundImage = bg;
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadBg(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    lazyBgSections.forEach(section => observer.observe(section));
  } else {
    // Fallback for unsupported browsers
    lazyBgSections.forEach(loadBg);
  }
}
