function renderFavourites() {
  const ids = getFavourites();
  const saved = properties.filter((p) => ids.includes(p.id));
  const grid = document.getElementById("favouriteProperties");
  grid.innerHTML = saved.map(propertyCard).join("");
  document.getElementById("favouriteCount").textContent =
    `${saved.length} saved ${saved.length === 1 ? "property" : "properties"}`;
  document
    .getElementById("emptyFavourites")
    .classList.toggle("hidden", saved.length > 0);
}
document.addEventListener("DOMContentLoaded", renderFavourites);
