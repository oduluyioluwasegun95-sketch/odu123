document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("propertyDetail");
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = properties.find((item) => item.id === id);
  if (!p) {
    target.innerHTML = `<div class="empty-state"><h2>Property not found</h2><p class="muted">This listing may have been removed or the link is incorrect.</p><a class="btn" href="properties.html">Browse properties</a></div>`;
    return;
  }
  document.title = `${p.title} | Sunran Estate`;
  target.innerHTML = `
    <a class="text-link" href="properties.html">← Back to properties</a>
    <div class="detail-top" style="margin-top:25px"><div><span class="eyebrow">${p.status.toUpperCase()} · ${p.type.toUpperCase()}</span><h1>${p.title}</h1><p class="muted">⌖ ${p.location}</p></div><div class="property-price">${formatPrice(p.price)}</div></div>
    <div class="detail-gallery"><img src="${p.image}" alt="${p.title}"><img src="${p.image2}" alt="Property interior"><img src="${p.image3}" alt="Additional property view"></div>
    <div class="detail-layout"><div class="detail-copy">
      <h2>Property overview</h2><p>${p.description}</p>
      <h2>Property details</h2><div class="spec-grid"><div class="spec"><strong>${p.beds || "—"}</strong><span>Bedrooms</span></div><div class="spec"><strong>${p.baths || "—"}</strong><span>Bathrooms</span></div><div class="spec"><strong>${p.area} sqm</strong><span>Floor / plot area</span></div><div class="spec"><strong>${p.type}</strong><span>Property type</span></div></div>
      <h2>Important information</h2><p>Property details, price, availability, ownership documents and measurements must be independently confirmed with the agent before making a payment or commitment.</p>
    </div><aside class="enquiry-card"><span class="eyebrow">INTERESTED IN THIS PROPERTY?</span><p class="property-price">${formatPrice(p.price)}</p><p>Contact our team to ask a question or arrange an inspection.</p><a class="btn" href="contact.html?property=${encodeURIComponent(p.title)}">Enquire about property →</a><a class="btn whatsapp-link" target="_blank" rel="noopener noreferrer" href="${getWhatsAppUrl("Hello, I am interested in " + p.title + " in " + p.location)}">WhatsApp agent ↗</a></aside></div>`;
});
