const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || "change-this-admin-key";
const DATA_DIR = path.join(__dirname, "data");
const PROPERTY_FILE = path.join(DATA_DIR, "properties.json");
const ENQUIRY_FILE = path.join(DATA_DIR, "enquiries.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
if (!fs.existsSync(PROPERTY_FILE)) {
  writeJson(
    PROPERTY_FILE,
    readJson(path.join(__dirname, "properties.json"), []),
  );
}
if (!fs.existsSync(ENQUIRY_FILE)) writeJson(ENQUIRY_FILE, []);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "sunran-estate")));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "Sunran Estate API" }),
);

// Public property endpoints
app.get("/api/properties", (req, res) => {
  let items = readJson(PROPERTY_FILE, []);
  const { location, type, maxPrice, bedrooms, featured, sort } = req.query;
  if (location)
    items = items.filter((p) =>
      p.location.toLowerCase().includes(String(location).toLowerCase()),
    );
  if (type)
    items = items.filter(
      (p) => p.type.toLowerCase() === String(type).toLowerCase(),
    );
  if (maxPrice && Number.isFinite(Number(maxPrice)))
    items = items.filter((p) => p.price <= Number(maxPrice));
  if (bedrooms) items = items.filter((p) => p.beds >= Number(bedrooms));
  if (featured === "true") items = items.filter((p) => p.featured);
  if (sort === "price-low") items.sort((a, b) => a.price - b.price);
  if (sort === "price-high") items.sort((a, b) => b.price - a.price);
  if (sort === "newest")
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ count: items.length, properties: items });
});

app.get("/api/properties/:id", (req, res) => {
  const property = readJson(PROPERTY_FILE, []).find(
    (p) => p.id === Number(req.params.id),
  );
  if (!property) return res.status(404).json({ error: "Property not found" });
  res.json(property);
});

// Public enquiry form endpoint
app.post("/api/enquiries", (req, res) => {
  const { name, email, phone = "", interest, message } = req.body || {};
  if (!name || !email || !interest || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, interest and message are required." });
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk)
    return res
      .status(400)
      .json({ error: "Please provide a valid email address." });
  const enquiries = readJson(ENQUIRY_FILE, []);
  const enquiry = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    interest: String(interest).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  enquiries.unshift(enquiry);
  writeJson(ENQUIRY_FILE, enquiries);
  res
    .status(201)
    .json({
      message: "Your enquiry has been received. Our team will contact you.",
      id: enquiry.id,
    });
});

// Simple admin-protected property management endpoints.
// Send header: x-admin-key: YOUR_ADMIN_KEY
function requireAdmin(req, res, next) {
  if (req.get("x-admin-key") !== ADMIN_KEY)
    return res.status(401).json({ error: "Admin access denied." });
  next();
}
app.get("/api/admin/enquiries", requireAdmin, (req, res) => {
  res.json(readJson(ENQUIRY_FILE, []));
});
app.post("/api/admin/properties", requireAdmin, (req, res) => {
  const items = readJson(PROPERTY_FILE, []);
  const p = req.body || {};
  if (!p.title || !p.location || !p.type || !Number.isFinite(Number(p.price))) {
    return res
      .status(400)
      .json({ error: "title, location, type and numeric price are required." });
  }
  const nextId = Math.max(0, ...items.map((x) => Number(x.id) || 0)) + 1;
  const created = {
    ...p,
    id: nextId,
    price: Number(p.price),
    beds: Number(p.beds || 0),
    baths: Number(p.baths || 0),
    area: Number(p.area || 0),
    date: p.date || new Date().toISOString().slice(0, 10),
  };
  items.push(created);
  writeJson(PROPERTY_FILE, items);
  res.status(201).json(created);
});
app.put("/api/admin/properties/:id", requireAdmin, (req, res) => {
  const items = readJson(PROPERTY_FILE, []);
  const index = items.findIndex((p) => p.id === Number(req.params.id));
  if (index < 0) return res.status(404).json({ error: "Property not found." });
  items[index] = { ...items[index], ...req.body, id: items[index].id };
  writeJson(PROPERTY_FILE, items);
  res.json(items[index]);
});
app.delete("/api/admin/properties/:id", requireAdmin, (req, res) => {
  const items = readJson(PROPERTY_FILE, []);
  const filtered = items.filter((p) => p.id !== Number(req.params.id));
  if (filtered.length === items.length)
    return res.status(404).json({ error: "Property not found." });
  writeJson(PROPERTY_FILE, filtered);
  res.json({ message: "Property deleted." });
});

app.listen(PORT, () =>
  console.log(`Sunran Estate is running at http://localhost:${PORT}`),
);
