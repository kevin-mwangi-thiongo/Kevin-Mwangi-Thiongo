// Rhoda.js - Complete catalog, cart logic, and configured WhatsApp ordering

// --- Product & Service Database ---
const products = [
  // --- Workshop Services ---
  { id: 101, name: "Chain Adjustment", price: 50, category: "Services" },
  { id: 102, name: "Chain Replacement", price: 200, category: "Services" },
  { id: 103, name: "Front Sprocket Replacement", price: 100, category: "Services" },
  { id: 104, name: "Rear Sprocket Replacement", price: 250, category: "Services" },
  { id: 105, name: "Motor Oil Change", price: 150, category: "Services" },
  { id: 106, name: "Indicator Change (Single)", price: 50, category: "Services" },
  { id: 107, name: "Headlight Change", price: 100, category: "Services" },
  { id: 108, name: "Side Mirror Replacement", price: 50, category: "Services" },
  { id: 109, name: "Spot Light Installation (Per Piece)", price: 100, category: "Services" },
  { id: 110, name: "Horn Installation", price: 150, category: "Services" },
  { id: 111, name: "Tyre Bearings Replacement", price: 100, category: "Services" },
  { id: 112, name: "Cone Bearings Replacement", price: 250, category: "Services" },
  { id: 113, name: "DC Converter Replacement", price: 100, category: "Services" },
  { id: 114, name: "MCB Replacement", price: 300, category: "Services" },
  { id: 115, name: "Tail Light Replacement", price: 150, category: "Services" },
  { id: 116, name: "Tyre Replacement", price: 200, category: "Services" },
  { id: 117, name: "Minor Wiring Repair", price: 500, category: "Services" },
  { id: 118, name: "Major Wiring Repair", price: 1000, category: "Services" },
  { id: 119, name: "Front Shock Service", price: 500, category: "Services" },
  { id: 120, name: "Rear Shocks Replacement", price: 200, category: "Services" },
  { id: 121, name: "Swing Arm Bushes Replacement", price: 500, category: "Services" },
  { id: 122, name: "Power Cable Replacement", price: 100, category: "Services" },
  { id: 123, name: "Brake Pad Replacement", price: 100, category: "Services" },
  { id: 124, name: "Brake Pad Bleeding", price: 150, category: "Services" },
  { id: 125, name: "Caliper Replacement", price: 250, category: "Services" },
  { id: 126, name: "Harness Replacement", price: 500, category: "Services" },

  // --- Spare Parts & Accessories ---
  { id: 201, name: "Phone Holder", price: 700, category: "Spare Parts" },
  { id: 202, name: "Heavy Duty Chain & Sprocket Set", price: 2500, category: "Spare Parts" },
  { id: 203, name: "Front Brake Pads (Ceramic)", price: 850, category: "Spare Parts" },
  { id: 204, name: "17-Inch Rear Tubeless Tyre", price: 4200, category: "Spare Parts" },
  { id: 205, name: "Performance Spark Plug", price: 450, category: "Spare Parts" },
  { id: 206, name: "Maintenance-Free 12V Battery", price: 3200, category: "Spare Parts" },
  { id: 207, name: "4T Engine Oil 1L", price: 950, category: "Spare Parts" }
];

// --- Application State ---
let cart = [];
let activeCategory = "All";
let searchQuery = "";

// Store Contact Configuration
const WHATSAPP_PHONE = "254714303187"; 

// --- App Initialization ---
function init() {
  renderCategories();
  renderProducts();
  updateCart();
}

// --- Dynamic Category Filtering ---
function renderCategories() {
  const container = document.getElementById("category-buttons");
  if (!container) return;

  const categories = ["All", ...new Set(products.map(p => p.category))];
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `category-btn ${cat === activeCategory ? 'active' : ''}`;
    btn.innerText = cat;
    btn.onclick = () => {
      activeCategory = cat;
      renderCategories();
      renderProducts();
    };
    container.appendChild(btn);
  });
}

// --- Product Grid Rendering ---
function renderProducts() {
  const container = document.getElementById("product-grid");
  if (!container) return;

  container.innerHTML = "";

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p class='no-results'>No items found.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <small style="color:#6b7280">${p.category}</small>
        <h4>${p.name}</h4>
      </div>
      <div>
        <div class="price">KSh ${p.price.toLocaleString()}</div>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleSearch(e) {
  searchQuery = e.target.value.trim();
  renderProducts();
}

// --- Cart Operations ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

function updateQuantity(id, change) {
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;

    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// --- Cart UI Synchronization ---
function updateCart() {
  const countContainer = document.getElementById("cart-count");
  const itemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (countContainer) countContainer.innerText = totalItemCount;
  if (totalContainer) totalContainer.innerText = totalPrice.toLocaleString();

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p class='empty-msg'>Your cart is empty.</p>";
    return;
  }

  itemsContainer.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-price">KSh ${(item.price * item.quantity).toLocaleString()}</span>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">&times;</button>
      </div>
    `;
    itemsContainer.appendChild(div);
  });
}

// --- WhatsApp Integration ---
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Please add items to your cart first.");
    return;
  }

  let msg = "Hello Rhoda Autospares, I would like to order/book:\n\n";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    msg += `${index + 1}. *${item.name}* [${item.category}]\n`;
    msg += `   Qty: ${item.quantity} x KSh ${item.price.toLocaleString()} = KSh ${itemTotal.toLocaleString()}\n`;
  });

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  msg += `\n*Grand Total: KSh ${grandTotal.toLocaleString()}*`;
  msg += "\n\nPlease confirm availability and booking details.";

  // Redirect to WhatsApp API using phone number: +254 714 303 187
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, "_blank");
}

function scrollToCart() {
  const cartPanel = document.getElementById("cart-panel");
  if (cartPanel) {
    cartPanel.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", init);