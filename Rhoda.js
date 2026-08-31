const products = [
  { id: 1, name: "Heavy Duty Chain & Sprocket Set", price: 2500, category: "Drive" },
  { id: 2, name: "Front Brake Pads (Ceramic)", price: 850, category: "Brakes" },
  { id: 3, name: "17-Inch Rear Tubeless Tyre", price: 4200, category: "Tyres" },
  { id: 4, name: "Performance Spark Plug", price: 450, category: "Engine" },
  { id: 5, name: "Maintenance-Free 12V Battery", price: 3200, category: "Electrical" },
  { id: 6, name: "4T Engine Oil 1L", price: 950, category: "Engine" }
];

let cart = [];
let activeCategory = "All";
let searchQuery = "";

function init() {
  renderCategories();
  renderProducts();
}

function renderCategories() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const container = document.getElementById("category-buttons");
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

function renderProducts() {
  const container = document.getElementById("product-grid");
  container.innerHTML = "";

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No matching spare parts found.</p>";
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
  searchQuery = e.target.value;
  renderProducts();
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").innerText = cart.length;
  const itemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");

  if (cart.length === 0) {
    itemsContainer.innerHTML = "Your cart is empty.";
    totalContainer.innerText = "0";
    return;
  }

  itemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name}</span>
      <strong>KSh ${item.price.toLocaleString()}</strong>
    `;
    itemsContainer.appendChild(div);
  });

  totalContainer.innerText = total.toLocaleString();
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Please add items to your cart first.");
    return;
  }

  const phone = "254700000000"; // Replace with Rhoda Autospares WhatsApp number
  let msg = "Hello Rhoda Autospares, I would like to order:\n\n";
  
  cart.forEach(item => {
    msg += `• ${item.name} - KSh ${item.price}\n`;
  });

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  msg += `\n*Total: KSh ${total.toLocaleString()}*`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

function scrollToCart() {
  document.getElementById("cart-panel").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", init);