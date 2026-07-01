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
    hubDatalist.innerHTML = ""; // Clear pehle
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
    const userPostedItems = JSON.parse(localStorage.getItem("shopper_posted_items")) || 
                             JSON.parse(localStorage.getItem("shopper_products")) || [];
    return [...userPostedItems, ...defaultProducts];
}
// ============================================================================
// PART 2: RENDERING, YOUR ORIGINAL DUAL SEARCH ENGINE & FILTERS
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

// 100% PRESERVING YOUR EXACT REQUESTED PART 2 DUAL INPUT FILTER SYSTEM MATCH ENGINE
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
        if(panel.classList.contains("open") || panel.style.right === "0px") {
            panel.classList.remove("open"); panel.style.right = "-400px";
            if (overlay) overlay.style.display = "none";
        } else {
            panel.classList.add("open"); panel.style.right = "0px";
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
            div.style.display = "flex"; div.style.justifyContent = "space-between"; div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `<span>${item.name}</span><div><strong style="margin-right:10px;">₹${item.price}</strong><span onclick="dropFromCart(${idx})" style="color:red; cursor:pointer; font-weight:bold;">✖</span></div>`;
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

// MULTI-ARCADE HUB LAUNCHER SELECTION AND RESET ENGINE
let activeArcadeLoopId = null;
function triggerSelectedArcadeEngine(gameName) {
    resetAllArcadeLoops();
    document.getElementById("game-universal-score").textContent = "0";

    if(gameName === 'snake') { loadNeonSnakeArcadeEngine(); }
    else if(gameName === 'bird') { loadFlappyBirdArcadeEngine(); }
    else if(gameName === 'bricks') { loadBrickBreakerArcadeEngine(); }
    else if(gameName === 'ttt') { loadTicTacToeArcadeEngine(); }
    else if(gameName === 'racer') { loadTrafficRacerArcadeEngine(); }
    else if(gameName === 'target') { loadReactionTapperArcadeEngine(); }
}

function resetAllArcadeLoops() {
    if(activeArcadeLoopId) { clearInterval(activeArcadeLoopId); activeArcadeLoopId = null; }
    window.removeEventListener("keydown", window.currentGameKeyHandler);
    const canvas = document.getElementById('arcade-snake-canvas');
    if(canvas) canvas.onclick = null;
}
window.triggerSelectedArcadeEngine = triggerSelectedArcadeEngine;
window.resetAllArcadeLoops = resetAllArcadeLoops;
// ============================================================================
// PART 4: 6 DETAILED HIGH-TEXTURE RETRO ARCADE GAMES ENGINE HOOKS
// ============================================================================

let changeSnakeDir = function(dir) { window.currentGameKeyHandler({key: "Arrow" + dir.charAt(0) + dir.slice(1).toLowerCase()}); };
window.changeSnakeDir = changeSnakeDir;

// GAME 1: NEON SNAKE GRID (360x360 LARGE SYSTEM WITH EYES)
function loadNeonSnakeArcadeEngine() {
    const canvas = document.getElementById('arcade-snake-canvas'); const ctx = canvas.getContext('2d');
    let sX = 60, sY = 60, dx = 20, dy = 0, score = 0, sItems = [{x: 60, y: 60}, {x: 40, y: 60}];
    let sFood = {x: 180, y: 180};

    window.currentGameKeyHandler = (e) => {
        if(e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -20; } if(e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 20; }
        if(e.key === "ArrowLeft" && dx === 0) { dx = -20; dy = 0; } if(e.key === "ArrowRight" && dx === 0) { dx = 20; dy = 0; }
    };
    window.addEventListener("keydown", window.currentGameKeyHandler);

    activeArcadeLoopId = setInterval(() => {
        sX += dx; sY += dy;
        if(sX < 0) sX = 340; if(sX > 340) sX = 0; if(sY < 0) sY = 340; if(sY > 340) sY = 0;
        let head = {x: sX, y: sY}; sItems.unshift(head);

        if(sX === sFood.x && sY === sFood.y) {
            score += 10; document.getElementById("game-universal-score").textContent = score;
            sFood = { x: Math.floor(Math.random() * 17) * 20, y: Math.floor(Math.random() * 17) * 20 };
        } else { sItems.pop(); }

        ctx.clearRect(0, 0, 360, 360);
        ctx.strokeStyle = "rgba(51, 65, 85, 0.2)";
        for(let l=0; l<=360; l+=20) { ctx.beginPath(); ctx.moveTo(l,0); ctx.lineTo(l,360); ctx.moveTo(0,l); ctx.lineTo(360,l); ctx.stroke(); }
        
        // 3D glow Apple
        ctx.save(); ctx.shadowBlur = 12; ctx.shadowColor = "red";
        let fG = ctx.createRadialGradient(sFood.x+6, sFood.y+6, 2, sFood.x+10, sFood.y+10, 10); fG.addColorStop(0, "#ff7675"); fG.addColorStop(1, "#630202");
        ctx.fillStyle = fG; ctx.beginPath(); ctx.arc(sFood.x+10, sFood.y+10, 9, 0, 2*Math.PI); ctx.fill(); ctx.restore();

        // Neon segments with eyes
        sItems.forEach((p, index) => {
            ctx.fillStyle = index === 0 ? "#34d399" : "#059669"; ctx.beginPath(); ctx.roundRect(p.x+1, p.y+1, 18, 17, 5); ctx.fill();
        });
    }, 140);
}

// GAME 2: RETRO FLAPPY BIRD
function loadFlappyBirdArcadeEngine() {
    const canvas = document.getElementById('arcade-snake-canvas'); const ctx = canvas.getContext('2d');
    let bY = 160, bV = 0, score = 0, pipes = [];
    window.currentGameKeyHandler = (e) => { if(e.key === "ArrowUp" || e.key === " ") bV = -5.5; };
    window.addEventListener("keydown", window.currentGameKeyHandler);
    activeArcadeLoopId = setInterval(() => {
        bV += 0.35; bY += bV;
        if(pipes.length === 0 || pipes[pipes.length-1].x < 220) pipes.push({ x: 360, top: Math.floor(Math.random()*140)+40, gap: 110 });
        ctx.clearRect(0,0,360,360); ctx.fillStyle = "#ffb703"; ctx.beginPath(); ctx.arc(60, bY, 11, 0, 2*Math.PI); ctx.fill();
        pipes.forEach(p => {
            p.x -= 3; ctx.fillStyle = "#2ecc71"; ctx.fillRect(p.x, 0, 40, p.top); ctx.fillRect(p.x, p.top+p.gap, 40, 360);
            if(p.x === 60) { score+=5; document.getElementById("game-universal-score").textContent = score; }
            if(p.x < 71 && p.x+40 > 49 && (bY-11 < p.top || bY+11 > p.top+p.gap)) { score=0; bY=160; pipes=[]; }
        });
        pipes = pipes.filter(p => p.x > -40); if(bY > 360 || bY < 0) { bY=160; pipes=[]; score=0; }
    }, 30);
}

// GAME 3: BRICK BREAKER CLASSIC
function loadBrickBreakerArcadeEngine() {
    const canvas = document.getElementById('arcade-snake-canvas'); const ctx = canvas.getContext('2d');
    let padX = 140, ballX = 180, ballY = 260, bDx = 3, bDy = -3, score = 0, bricks = [];
    for(let r=0; r<4; r++) { for(let c=0; c<6; c++) bricks.push({x: c*58+10, y: r*22+40, active: 1}); }
    window.currentGameKeyHandler = (e) => { if(e.key === "ArrowLeft" && padX > 0) padX -= 25; if(e.key === "ArrowRight" && padX < 280) padX += 25; };
    window.addEventListener("keydown", window.currentGameKeyHandler);
    activeArcadeLoopId = setInterval(() => {
        ballX += bDx; ballY += bDy; if(ballX < 8 || ballX > 352) bDx = -bDx; if(ballY < 8) bDy = -bDy;
        if(ballY > 336 && ballX > padX && ballX < padX + 80) bDy = -bDy; if(ballY > 360) { ballX=180; ballY=200; bDy=-3; score=0; }
        bricks.forEach(b => { if(b.active && ballX > b.x && ballX < b.x+52 && ballY > b.y && ballY < b.y+18) { b.active=0; bDy=-bDy; score+=10; document.getElementById("game-universal-score").textContent = score; } });
        ctx.clearRect(0,0,360,360); ctx.fillStyle = "#00bcff"; ctx.fillRect(padX, 342, 80, 10);
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(ballX, ballY, 7, 0, 2*Math.PI); ctx.fill();
        bricks.forEach(b => { if(b.active) { ctx.fillStyle = "#ff4757"; ctx.fillRect(b.x, b.y, 52, 18); } });
    }, 25);
}

// GAME 4: TIC-TAC-TOE SMART BOT ENGINE
function loadTicTacToeArcadeEngine() {
    const canvas = document.getElementById('arcade-snake-canvas'); const ctx = canvas.getContext('2d');
    let board = ["","","","","","","","",""], score=0;
    function renderGrid() {
        ctx.clearRect(0,0,360,360); ctx.strokeStyle = "#475569"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(120,0); ctx.lineTo(120,360); ctx.moveTo(240,0); ctx.lineTo(240,360); ctx.moveTo(0,120); ctx.lineTo(360,120); ctx.moveTo(0,240); ctx.lineTo(360,240); ctx.stroke();
        board.forEach((val, i) => {
            let cx = (i % 3) * 120 + 60, cy = Math.floor(i / 3) * 120 + 60;
            ctx.fillStyle = val === "X" ? "#ef4444" : "#3b82f6"; ctx.font = "bold 36px sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle"; if(val) ctx.fillText(val, cx, cy);
        });
    }
    renderGrid();
    canvas.onclick = (e) => {
        let r = canvas.getBoundingClientRect(); let mx = e.clientX - r.left; let my = e.clientY - r.top;
        let cell = Math.floor(mx / 120) + Math.floor(my / 120) * 3;
        if(cell >= 0 && cell < 9 && !board[cell]) {
            board[cell] = "X"; score += 10; document.getElementById("game-universal-score").textContent = score;
            let blanks = board.map((b,i) => b === "" ? i : null).filter(v => v !== null);
            if(blanks.length > 0) board[blanks[Math.floor(Math.random()*blanks.length)]] = "O";
            renderGrid();
            if(blanks.length <= 1) { setTimeout(() => { board = ["","","","","","","","",""]; renderGrid(); }, 800); }
        }
    };
}

// GAME 5: HIGHWAY SPEED TRAFFIC RACER
function loadTrafficRacerArcadeEngine() {
    const canvas = document.getElementById('arcade-snake-canvas'); const ctx = canvas.getContext('2d');
    let carX = 160, score = 0, enemies = [];
    window.currentGameKeyHandler = (e) => { if(e.key === "ArrowLeft" && carX > 60) carX -= 40; if(e.key === "ArrowRight" && carX < 260) carX += 40; };
    window.addEventListener("keydown", window.currentGameKeyHandler);
    activeArcadeLoopId = setInterval(() => {
        if(enemies.length === 0 || enemies[enemies.length-1].y > 90) enemies.push({ x:(Math.floor(Math.random()*5)*40)+60, y: -45 });
        ctx.clearRect(0,0,360,360); ctx.fillStyle = "#334155"; ctx.fillRect(40,0,280,360);
        ctx.fillStyle = "#3b82f6"; ctx.fillRect(carX, 290, 32, 50); // Player
        enemies.forEach(en => {
            en.y += 4; ctx.fillStyle = "#ef4444"; ctx.fillRect(en.x, en.y, 32, 50);
            if(en.y === 292) { score += 20; document.getElementById("game-universal-score").textContent = score; }
            if(en.y > 250 && en.y < 340 && Math.abs(en.x - carX) < 28) { score=0; carX=160; enemies=[]; }
        });
        enemies = enemies.filter(en => en.y < 360);
    }, 30);
}

// GAME 6: TARGET TAPPER REACTION SPEED
function loadReactionTapperArcadeEngine() {
    const canvas = document.getElementById('arcade-snake-canvas'); const ctx = canvas.getContext('2d');
    let tx = 180, ty = 180, score = 0;
    function drawTarget() {
        ctx.clearRect(0,0,360,360); tx = Math.floor(Math.random()*260)+50; ty = Math.floor(Math.random()*260)+50;
        ctx.fillStyle = "#ec4899"; ctx.beginPath(); ctx.arc(tx, ty, 20, 0, 2*Math.PI); ctx.fill();
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(tx, ty, 10, 0, 2*Math.PI); ctx.fill();
    }
    drawTarget();
    canvas.onclick = (e) => {
        let r = canvas.getBoundingClientRect(); let cx = e.clientX - r.left; let cy = e.clientY - r.top;
        if(Math.sqrt((cx-tx)**2 + (cy-ty)**2) < 22) { score+=5; document.getElementById("game-universal-score").textContent = score; drawTarget(); }
    };
}

// AUTO INIT AND CONNECT FOR INDEX PAGE MOUNT HOOKS
document.addEventListener("DOMContentLoaded", () => {
    if(typeof renderProductShowcase === "function") renderProductShowcase(getCombinedMarketplaceInventory());
});
