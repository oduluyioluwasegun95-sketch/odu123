// Shared site interactions
document.addEventListener("DOMContentLoaded", () => {
  const whatsappButton = document.createElement("a");
  whatsappButton.className = "whatsapp-float";
  whatsappButton.href = getWhatsAppUrl(
    "Hello Sunran Estate, I would like to make an enquiry.",
  );
  whatsappButton.target = "_blank";
  whatsappButton.rel = "noopener noreferrer";
  whatsappButton.setAttribute(
    "aria-label",
    "Chat with Sunran Estate on WhatsApp",
  );
  whatsappButton.title = "Chat with us on WhatsApp";
  whatsappButton.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16.04 3.2A12.72 12.72 0 0 0 5.12 22.45L3.3 29l6.72-1.76A12.8 12.8 0 1 0 16.04 3.2Zm0 23.3c-1.9 0-3.77-.5-5.4-1.48l-.39-.23-3.99 1.05 1.07-3.89-.25-.4a10.5 10.5 0 1 1 8.96 4.95Zm5.76-7.86c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.52-.16-.74.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.49-.57.16-.19.22-.32.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.4-.26-.63-.53-.54-.73-.55l-.62-.01c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71s1.17 3.14 1.33 3.36c.16.21 2.3 3.51 5.57 4.92.78.34 1.39.55 1.86.7.78.25 1.49.22 2.05.13.63-.1 1.9-.78 2.17-1.54.27-.76.27-1.41.19-1.54-.08-.13-.3-.21-.62-.38Z"/></svg>`;
  document.body.appendChild(whatsappButton);
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = getWhatsAppUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    nav.id = "site-navigation";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
      toggle.textContent = open ? "✕" : "☰";
    });
    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.textContent = "☰";
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !nav.classList.contains("open")) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.textContent = "☰";
      toggle.focus();
    });
  }
  document
    .querySelectorAll(".year")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
  updateFavouriteCount();

  const homeSearch = document.getElementById("homeSearch");
  if (homeSearch) {
    homeSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(homeSearch);
      const params = new URLSearchParams();
      for (const [key, value] of form.entries())
        if (value) params.set(key, value);
      window.location.href = `properties.html?${params.toString()}`;
    });
  }

  const featured = document.getElementById("featuredProperties");
  if (featured && typeof properties !== "undefined") {
    featured.innerHTML = properties
      .filter((p) => p.featured)
      .map(propertyCard)
      .join("");
  }
});

const SUNRAN_WHATSAPP_NUMBER = "2349057170103";
function getWhatsAppUrl(message = "") {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${SUNRAN_WHATSAPP_NUMBER}${text}`;
}

function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem("sunranFavourites") || "[]");
  } catch {
    return [];
  }
}
function saveFavourites(ids) {
  localStorage.setItem("sunranFavourites", JSON.stringify(ids));
  updateFavouriteCount();
}
function updateFavouriteCount() {
  const count = getFavourites().length;
  document
    .querySelectorAll(".fav-count")
    .forEach((el) => (el.textContent = count));
}
function formatPrice(price) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}
function propertyCard(p) {
  const saved = getFavourites().includes(p.id);
  const beds = p.beds ? `${p.beds} beds` : "Land / commercial";
  const baths = p.baths ? `${p.baths} baths` : "—";
  return `<article class="property-card">
    <div class="property-image">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <span class="property-tag">${p.status}</span>
      <button class="heart-btn ${saved ? "saved" : ""}" data-favourite="${p.id}" aria-label="Save ${p.title}" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
    </div>
    <div class="property-info">
      <p class="property-location">⌖ ${p.location} · ${p.type}</p>
      <h3>${p.title}</h3>
      <p class="property-price">${formatPrice(p.price)}</p>
      <div class="property-meta"><span>▣ ${beds}</span><span>▤ ${baths}</span><span>⌗ ${p.area} sqm</span></div>
      <div class="property-actions"><a href="property-details.html?id=${p.id}">View details →</a><span class="muted">${p.area} sqm</span></div>
    </div>
  </article>`;
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favourite]");
  if (!button) return;
  const id = Number(button.dataset.favourite);
  let ids = getFavourites();
  ids = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  saveFavourites(ids);
  const active = ids.includes(id);
  button.classList.toggle("saved", active);
  button.textContent = active ? "♥" : "♡";
  button.setAttribute("aria-pressed", String(active));
  if (document.getElementById("favouriteProperties")) renderFavourites();
});
