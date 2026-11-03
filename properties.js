document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("propertyFilters");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  document.getElementById("filterLocation").value =
    params.get("location") || "";
  document.getElementById("filterType").value = params.get("type") || "";
  document.getElementById("filterMax").value = params.get("maxPrice") || "";
  document.getElementById("filterBeds").value = params.get("bedrooms") || "";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderProperties();
  });
  document
    .getElementById("filterSort")
    .addEventListener("change", renderProperties);
  document.getElementById("resetFilters").addEventListener("click", () => {
    form.reset();
    renderProperties();
  });
  renderProperties();
});
function renderProperties() {
  const locationText = document
    .getElementById("filterLocation")
    .value.trim()
    .toLowerCase();
  const type = document.getElementById("filterType").value;
  const max = Number(document.getElementById("filterMax").value || Infinity);
  const beds = Number(document.getElementById("filterBeds").value || 0);
  const sort = document.getElementById("filterSort").value;
  let list = properties.filter(
    (p) =>
      (!locationText || p.location.toLowerCase().includes(locationText)) &&
      (!type || p.type === type) &&
      p.price <= max &&
      p.beds >= beds,
  );
  if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  if (sort === "newest")
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  document.getElementById("resultsCount").textContent =
    `${list.length} ${list.length === 1 ? "property" : "properties"} found`;
  document.getElementById("allProperties").innerHTML = list
    .map(propertyCard)
    .join("");
  document
    .getElementById("noResults")
    .classList.toggle("hidden", list.length !== 0);
}
