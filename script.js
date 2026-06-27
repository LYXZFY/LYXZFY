// ============================================================================
// PART 1: MARKETPLACE CORE FEED DATA & INDIA LOCATIONS MATRIX
// ============================================================================

const brands = [
    { name: "iPhone", icon: "🍏" }, { name: "Samsung", icon: "🪐" }, 
    { name: "realme", icon: "💛" }, { name: "AI+", icon: "🤖" }, 
    { name: "Snapdragon", icon: "🐉" }, { name: "motorola", icon: "🦇" }, 
    { name: "vivo", icon: "🔷" }, { name: "POCO", icon: "🟡" }
];

// Initial pre-loaded inventory stock setup data model (Added Nova phones for scrolling)
const defaultProducts = [
    { id: 1, name: "OPPO K14 5G", price: 17999, brand: "motorola", icon: "📱", location: "Mumbai, Maharashtra", phone: "9876543210", specs: "8GB RAM | 128GB Storage, Box Included" },
    { id: 2, name: "vivo T5x 5G", price: 21999, brand: "vivo", icon: "📲", location: "New Delhi, Delhi", phone: "9988776655", specs: "6GB RAM | 128GB Storage, Slim Design" },
    { id: 3, name: "Galaxy S25 FE", price: 59999, brand: "Samsung", icon: "💎", location: "Bangalore, Karnataka", phone: "9555443322", specs: "12GB RAM | 256GB Storage, AI Enabled" },
    { id: 4, name: "iPhone 17 Pro", price: 119999, brand: "iPhone", icon: "🍎", location: "Kolkata, West Bengal", phone: "9123456789", specs: "Dynamic Island, 512GB Premium Model" },
    { id: 5, name: "Nova 2 5G", price: 10999, brand: "AI+", icon: "📱", location: "Bhubaneswar, Odisha", phone: "9439123456", specs: "8GB RAM | 128GB Storage | Best Camera" },
    { id: 6, name: "Nova 3 Pro 5G", price: 15999, brand: "AI+", icon: "📲", location: "Cuttack, Odisha", phone: "9439765432", specs: "12GB RAM | 256GB Storage | 108MP Main" },
    { id: 7, name: "Nova 4 Neo", price: 12499, brand: "AI+", icon: "📱", location: "Patna, Bihar", phone: "7008123456", specs: "6GB RAM | 128GB Storage | Premium Display" },
    { id: 8, name: "Nova Flip Fold", price: 45999, brand: "AI+", icon: "📟", location: "Pune, Maharashtra", phone: "8895123456", specs: "12GB RAM | 512GB | Flexible Foldable screen" }
];

let cart = [];
let activeBrandFilter = null; 

// Dynamic location inputs data mapping dropdown arrays (All major India locations included)
const commonHubs = [
    "Bhubaneswar, Odisha", "Cuttack, Odisha", "Puri, Odisha", "Rourkela, Odisha", "Sambalpur, Odisha",
    "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Thane, Maharashtra",
    "New Delhi, Delhi", "Noida, Uttar Pradesh", "Ghaziabad, Uttar Pradesh", "Lucknow, Uttar Pradesh", "Patna, Bihar",
    "Kolkata, West Bengal", "Howrah, West Bengal", "Siliguri, West Bengal",
    "Bangalore, Karnataka", "Mysore, Karnataka", "Hyderabad, Telangana", "Chennai, Tamil Nadu",
    "Ahmedabad, Gujarat", "Surat, Gujarat", "Jaipur, Rajasthan", "Udaipur, Rajasthan", "Indore, Madhya Pradesh"
];

const hubDatalist = document.getElementById("global-delivery-hubs");
if (hubDatalist) {
    hubDatalist.innerHTML = ""; // Pehle clear kiya
    commonHubs.forEach(hub => {
        let opt = document.createElement("option");
        opt.value = hub;
        hubDatalist.appendChild(opt);
    });
}

// Render Circle Top Brand Selection Badges Strip Grid layout
const brandContainer = document.getElementById("brand-logo-container");
if (brandContainer) {
    brandContainer.innerHTML = "";
    brands.forEach(b => {
        const node = document.createElement("div");
        node.className = "brand-card-node";
        node.id = `brand-${b.name.toLowerCase()}`;
        node.innerHTML = `
            <div class="brand-img-shell">${b.icon}</div>
            <span>${b.name}</span>
        `;
        node.onclick = () => filterByBrand(b.name);
        brandContainer.appendChild(node);
    });
}

// Master compilation logic fetching data straight from default arrays + user uploaded storage items
function getCombinedMarketplaceInventory() {
    // Sell page se data ko fetch karne ke liye local storage key match kari
    const userPostedItems = JSON.parse(localStorage.getItem("shopper_posted_items")) || 
                             JSON.parse(localStorage.getItem("shopper_products")) || [];
    return [...userPostedItems, ...defaultProducts];
}
// ============================================================================
// PART 2: RENDERING, DUAL SEARCH ENGINE, MODAL & CART FUNCTIONS
// ============================================================================

function renderProductShowcase(data) {
    const box = document.getElementById("product-container");
    if (!box) return;
    box.innerHTML = "";
    
    if (data.length === 0) {
        box.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px; color:var(--text-light);">No items found matching active filters bro.</p>`;
        return;
    }
    
    data.forEach(p => {
        const card = document.createElement("div");
        card.className = "premium-deal-card";
        // Fixed standard styles for beautiful presentation
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "12px";
        card.style.padding = "15px";
        card.style.background = "rgba(255, 255, 255, 0.9)";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.justifyContent = "space-between";
        card.style.cursor = "pointer";

        const mediaFrame = p.image ? `<img src="${p.image}" alt="Item Image" style="max-width:100%; max-height:80px; object-fit:contain;">` : p.icon;
        
        card.innerHTML = `
            <div onclick="openProductModal(${p.id}, '${p.image ? 'upload' : 'default'}')" style="width:100%">
                <div class="card-img-frame" style="font-size: 50px; text-align: center; margin-bottom:10px;">${mediaFrame}</div>
                <h4 style="margin:5px 0; font-size:16px;">${p.name}</h4>
                <p style="color:#666; font-size:12px; margin:2px 0;">📍 ${p.location || "India"}</p>
                <div class="card-pricing-panel" style="font-weight:bold; color:#2ecc71; margin-top:5px;">₹${p.price.toLocaleString('en-IN')}</div>
            </div>
            <button class="action-buy-btn" onclick="pushToCart(${p.id}); event.stopPropagation();" style="margin-top:10px; background:#ff9f43; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold;">Add To Cart</button>
        `;
        box.appendChild(card);
    });
}

// Toggle filter logic configuration parameters
function filterByBrand(brandName) {
    const activeNode = document.querySelector(".brand-card-node.active-brand");
    if (activeNode) activeNode.classList.remove("active-brand");

    const allItems = getCombinedMarketplaceInventory();

    if (activeBrandFilter === brandName) {
        activeBrandFilter = null;
        renderProductShowcase(allItems);
    } else {
        activeBrandFilter = brandName;
        const targetNode = document.getElementById(`brand-${brandName.toLowerCase()}`);
        if (targetNode) targetNode.classList.add("active-brand");
        
        const filtered = allItems.filter(p => p.brand && p.brand.toLowerCase() === brandName.toLowerCase());
        renderProductShowcase(filtered);
    }
}

// Dual input string combined searching filters function routine
function globalSearchEngine() {
    const itemTerm = document.getElementById("search-bar").value.toLowerCase();
    const locTerm = document.getElementById("location-bar").value.toLowerCase();
    const allItems = getCombinedMarketplaceInventory();

    // Live update location text badge on typing valid location
    const locDisplayText = document.querySelector(".loc-display-text");
    if (locDisplayText && commonHubs.includes(document.getElementById("location-bar").value)) {
        locDisplayText.textContent = document.getElementById("location-bar").value;
    }

    const matched = allItems.filter(p => {
        const matchItem = p.name.toLowerCase().includes(itemTerm) || (p.brand && p.brand.toLowerCase().includes(itemTerm));
        const matchLoc = (p.location || "").toLowerCase().includes(locTerm);
        return matchItem && matchLoc;
    });
    renderProductShowcase(matched);
}

const sb = document.getElementById("search-bar");
const lb = document.getElementById("location-bar");
if (sb) sb.addEventListener("input", globalSearchEngine);
if (lb) lb.addEventListener("input", globalSearchEngine);

// SCREENSHOT SPECIFIC VIEW MODAL DYNAMIC INTERACTION LAYER RULES
function openProductModal(itemId, modeType) {
    const allItems = getCombinedMarketplaceInventory();
    const targetItem = allItems.find(p => p.id === itemId);
    if (!targetItem) return;

    document.getElementById("modal-product-title").innerText = targetItem.brand ? targetItem.brand.toUpperCase() : "PRODUCT DETAILS";
    document.getElementById("modal-item-name").innerText = targetItem.name;
    document.getElementById("modal-item-location").innerText = `📍 ${targetItem.location || "India"}`;
    
    if (targetItem.specs && targetItem.specs.trim().length > 0) {
        document.getElementById("modal-specs-container").style.display = "block";
        document.getElementById("modal-item-specs").innerText = targetItem.specs;
    } else {
        document.getElementById("modal-specs-container").style.display = "none";
    }

    const photoFrame = document.getElementById("modal-item-photo-render");
    if (modeType === "upload" && targetItem.image) {
        photoFrame.innerHTML = `<img src="${targetItem.image}" alt="Item Details View" style="max-width:100%; max-height:200px;">`;
    } else {
        photoFrame.innerHTML = targetItem.icon || "📱";
        photoFrame.style.fontSize = "120px";
    }

    document.getElementById("modal-cart-trigger").setAttribute("onclick", `pushToCart(${targetItem.id}); closeProductModal();`);
    
    const callBtn = document.getElementById("buy-now-trigger") || document.getElementById("modal-call-trigger");
    if (callBtn) {
        callBtn.innerText = `📞 Call Seller (₹${targetItem.price.toLocaleString('en-IN')})`;
        callBtn.setAttribute("onclick", `window.location.href='tel:${targetItem.phone || "9999999999"}'`);
    }

    const modal = document.getElementById("product-view-modal") || document.getElementById("product-modal-view");
    if (modal) modal.style.display = "block";
}

function closeProductModal() {
    const modal = document.getElementById("product-view-modal") || document.getElementById("product-modal-view");
    if (modal) modal.style.display = "none";
}

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;

// CART OPERATIONS SYSTEM CORES
function toggleCartPanel() {
    const overlay = document.getElementById("cart-overlay");
    const panel = document.getElementById("cart-panel");
    if (panel) {
        // Fallback checks for classes vs inline styles
        if(panel.classList.contains("open")) {
            panel.classList.remove("open");
            if (overlay) overlay.style.display = "none";
        } else {
            panel.classList.add("open");
            if (overlay) overlay.style.display = "block";
        }
    }
}
window.toggleCartPanel = toggleCartPanel;

function pushToCart(id) {
    const allItems = getCombinedMarketplaceInventory();
    const target = allItems.find(p => p.id === id);
    if(target) {
        cart.push(target);
        syncCartUI();
        alert(`${target.name} Added to Cart!`);
    }
}
window.pushToCart = pushToCart;

// Completed the truncated slice logic and attached sync engine
function dropFromCart(index) {
    cart.splice(index, 1);
    syncCartUI();
}
window.dropFromCart = dropFromCart;

function syncCartUI() {
    const badge = document.getElementById("cart-badge-counter");
    if (badge) badge.textContent = cart.length;

    const cartBox = document.getElementById("cart-items-box");
    const totalVal = document.getElementById("cart-total-val");
    
    if (cartBox && totalVal) {
        cartBox.innerHTML = "";
        let currentTotal = 0;
        cart.forEach((item, idx) => {
            currentTotal += item.price;
            let div = document.createElement("div");
            div.style.display = "flex"; 
            div.style.justifyContent = "space-between"; 
            div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <strong style="margin-right:10px;">₹${item.price}</strong>
                    <span onclick="dropFromCart(${idx})" style="color:red; cursor:pointer; font-weight:bold;">✖</span>
                </div>
            `;
            cartBox.appendChild(div);
        });
        totalVal.textContent = currentTotal.toLocaleString('en-IN');
    }
}

window.triggerCheckout = function() {
    if(cart.length === 0) return alert("Your cart is empty!");
    alert("Order Successful!");
    cart = []; syncCartUI(); toggleCartPanel();
};

// Auto render everything when page loads
document.addEventListener("DOMContentLoaded", () => {
    renderProductShowcase(getCombinedMarketplaceInventory());
});
