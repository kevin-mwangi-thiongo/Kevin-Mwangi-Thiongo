// Data model includes `image` and `isSoldOut` properties
const products = [
  { id: 1, name: "Chain Adjustment", price: 50, category: "Services", isSoldOut: false },
  { id: 2, name: "Chain Replacement", price: 200, category: "Services", isSoldOut: false },
  { id: 3, name: "Front Sprocket Replacement", price: 100, category: "Services", isSoldOut: false },

  { id: 6, name: "Heavy Duty Bike Chain", price: 1200, category: "Spare Parts", isSoldOut: false },
  { id: 7, name: "Front Brake Pads", price: 450, category: "Spare Parts", isSoldOut: true }, // Example Sold Out item

  { 
    id: 101, 
    name: "Boxer BM150 (2021 Model)", 
    price: 85000, 
    category: "Used Bikes",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80",
    description: "Good working condition, complete logbook.",
    isSoldOut: false
  },
  { 
    id: 102, 
    name: "TVS HLX 125 (Pre-owned)", 
    price: 72000, 
    category: "Used Bikes",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
    description: "Low mileage, engine in great condition.",
    isSoldOut: true // Sold Out Bike Example
  }
];

let cart = [];
let currentCategory = "All";
const WHATSAPP_PHONE = "254714303187";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCart();
});

function renderProducts(itemsToRender) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (itemsToRender.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1; color:#64748b;'>No items found in this category.</p>";
    return;
  }

  itemsToRender.forEach(product => {
    const card = document.createElement("div");
    card.className = `card ${product.isSoldOut ? 'sold-out-card' : ''}`;
    
    card.innerHTML = `
      <div>
        ${product.image ? `<div class="card-img-wrapper"><img src="${product.image}" alt="${product.name}">${product.isSoldOut ? '<span class="sold-badge">SOLD OUT</span>' : ''}</div>` : ''}
        <span class="card-category">${product.category}</span>
        <h4>${product.name}</h4>
        ${product.description ? `<p class="card-desc">${product.description}</p>` : ''}
        <div class="price">KSh ${product.price.toLocaleString()}</div>
      </div>
      <button ${product.isSoldOut ? 'disabled class="disabled-btn"' : `onclick="addToCart(${product.id})"`}>
        ${product.isSoldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function filterCategory(category) {
  currentCategory = category;
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.innerText.trim() === category || (category === "Used Bikes" && btn.innerText.includes("Bikes")));
  });

  const filtered = category === "All" ? products : products.filter(item => item.category === category);
  renderProducts(filtered);
}

function handleSearch() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = products.filter(item => {
    const matchesCat = currentCategory === "All" || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });
  renderProducts(filtered);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product && product.isSoldOut) return;

  const itemInCart = cart.find(item => item.id === productId);
  if (itemInCart) {
    itemInCart.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

function updateQuantity(productId, change) {
  const itemInCart = cart.find(item => item.id === productId);
  if (!itemInCart) return;
  itemInCart.quantity += change;
  if (itemInCart.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

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
    itemsContainer.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
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
        <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
      </div>
    `;
    itemsContainer.appendChild(div);
  });
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "Hello Rhoda Autospares! I would like to order:\n\n";
  cart.forEach(item => {
    message += `• *${item.name}* (x${item.quantity}) - KSh ${(item.price * item.quantity).toLocaleString()}\n`;
  });
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\n*Total:* KSh ${grandTotal.toLocaleString()}`;

  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
}

function openBikeModal() {
  document.getElementById("bike-modal").style.display = "flex";
}

function closeBikeModal() {
  document.getElementById("bike-modal").style.display = "none";
}

function submitBikeListing(e) {
  e.preventDefault();
  const model = document.getElementById("bike-model").value;
  const price = parseInt(document.getElementById("bike-price").value);
  const desc = document.getElementById("bike-desc").value;
  const fileInput = document.getElementById("bike-image-file");

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newBike = {
        id: Date.now(),
        name: model,
        price: price,
        category: "Used Bikes",
        image: e.target.result, // Preview Base64 Data URL
        description: desc,
        isSoldOut: false
      };
      products.unshift(newBike);
      filterCategory("Used Bikes");
      closeBikeModal();
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
}

function scrollToCart() {
  document.getElementById("cart-section").scrollIntoView({ behavior: 'smooth' });
}