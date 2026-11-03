document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const property = new URLSearchParams(location.search).get("property");
  if (property)
    form.elements.message.value = `I would like to enquire about: ${property}.`;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    document.getElementById("contactMessage").textContent =
      "Your enquiry is ready. Choose WhatsApp to send it to the company.";
    const link = document.createElement("a");
    link.href = getWhatsAppUrl(
      `Hello Sunran Estate,\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nInterest: ${data.interest}\nMessage: ${data.message}`,
    );
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "text-link";
    link.textContent = "Send enquiry on WhatsApp →";
    document
      .getElementById("contactMessage")
      .appendChild(document.createElement("br"));
    document.getElementById("contactMessage").appendChild(link);
  });
});
