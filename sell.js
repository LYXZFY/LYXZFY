// ============================================================================
// INDIA ATLAS DATA DICTIONARY SYSTEM INTERFACE & DYNAMIC UPLOADER ENGINE
// ============================================================================

// Indian Geography Subsets Arrays - Covering all key territories, hubs and zones options dynamically
const indianAtlasLocations = [
    "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Thane, Maharashtra",
    "New Delhi, NCR", "Noida, Uttar Pradesh", "Ghaziabad, Uttar Pradesh", "Gurugram, Haryana",
    "Kolkata, West Bengal", "Howrah, West Bengal", "Siliguri, West Bengal", "Darjeeling, West Bengal",
    "Bangalore, Karnataka", "Mysore, Karnataka", "Hubli, Karnataka", "Mangalore, Karnataka",
    "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", "Salem, Tamil Nadu",
    "Hyderabad, Telangana", "Secunderabad, Telangana", "Warangal, Telangana", "Nizamabad, Telangana",
    "Ahmedabad, Gujarat", "Surat, Gujarat", "Vadodara, Gujarat", "Rajkot, Gujarat",
    "Jaipur, Rajasthan", "Jodhpur, Rajasthan", "Udaipur, Rajasthan", "Kota, Rajasthan",
    "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Agra, Uttar Pradesh", "Varanasi, Uttar Pradesh",
    "Patna, Bihar", "Gaya, Bihar", "Muzaffarpur, Bihar", "Bhagalpur, Bihar",
    "Bhopal, Madhya Pradesh", "Indore, Madhya Pradesh", "Gwalior, Madhya Pradesh", "Jabalpur, Madhya Pradesh",
    "Ranchi, Jharkhand", "Jamshedpur, Jharkhand", "Dhanbad, Jharkhand", "Bokaro, Jharkhand",
    "Bhubaneswar, Odisha", "Cuttack, Odisha", "Rourkela, Odisha", "Puri, Odisha",
    "Chandigarh, Punjab", "Ludhiana, Punjab", "Amritsar, Punjab", "Jalandhar, Punjab",
    "Guwahati, Assam", "Dispur, Assam", "Dibrugarh, Assam", "Silchar, Assam",
    "Srinagar, Jammu & Kashmir", "Jammu, Jammu & Kashmir", "Leh, Ladakh", "Kargil, Ladakh"
];

let globalBase64ImageStorageString = "";

// Auto-inject and render full geography options strings into datalist elements tree framework nodes
document.addEventListener("DOMContentLoaded", () => {
    const atlasListTarget = document.getElementById("india-atlas-hubs");
    if (atlasListTarget) {
        indianAtlasLocations.forEach(place => {
            let optionNode = document.createElement("option");
            optionNode.value = place;
            atlasListTarget.appendChild(optionNode);
        });
    }
});

// Conversion processing rules fetching uploaded files variables and loading base64 strings images layouts
function previewUploadedImage(event) {
    const inputElement = event.target;
    const placeholderText = document.getElementById("upload-placeholder-text");
    const previewRender = document.getElementById("upload-preview-render");
    
    if (inputElement.files && inputElement.files[0]) {
        const fileReaderInstance = new FileReader();
        
        fileReaderInstance.onload = function(e) {
            globalBase64ImageStorageString = e.target.result;
            if (previewRender) {
                previewRender.src = globalBase64ImageStorageString;
                previewRender.style.display = "block";
            }
            if (placeholderText) placeholderText.style.display = "none";
        };
        
        fileReaderInstance.readAsDataURL(inputElement.files[0]);
    }
}
window.previewUploadedImage = previewUploadedImage;

// Submit submission processing posting data matrix vectors straight inside storage layers databases
function handlePostItem(event) {
    event.preventDefault();

    const titleVal = document.getElementById("sell-item-name").value.trim();
    const specsVal = document.getElementById("sell-item-specs").value.trim();
    const locationVal = document.getElementById("sell-item-location").value.trim();
    const phoneVal = document.getElementById("sell-item-phone").value.trim();
    const priceVal = parseInt(document.getElementById("sell-item-price").value);

    if (!globalBase64ImageStorageString) {
        alert("Configuration Error: Please select and upload a valid item screenshot image bro!");
        return;
    }

    // Creating unique item ID based on current timestamps tracking tokens arrays elements indices
    const uniqueListingID = Date.now();

    // Mapping item to a standard brand group layout filter match
    let automaticBrandGroup = "Other";
    const lowerTitle = titleVal.toLowerCase();
    if (lowerTitle.includes("iphone") || lowerTitle.includes("apple")) automaticBrandGroup = "iPhone";
    else if (lowerTitle.includes("samsung") || lowerTitle.includes("galaxy")) automaticBrandGroup = "Samsung";
    else if (lowerTitle.includes("realme")) automaticBrandGroup = "realme";
    else if (lowerTitle.includes("poco")) automaticBrandGroup = "POCO";
    else if (lowerTitle.includes("motorola") || lowerTitle.includes("moto")) automaticBrandGroup = "motorola";
    else if (lowerTitle.includes("vivo")) automaticBrandGroup = "vivo";

    const newListingNode = {
        id: uniqueListingID,
        name: titleVal,
        specs: specsVal,
        location: locationVal,
        phone: phoneVal,
        price: priceVal,
        image: globalBase64ImageStorageString,
        brand: automaticBrandGroup
    };

    // Append and save structures inside global localStorage arrays indexes models
    const activePostedItems = JSON.parse(localStorage.getItem("shopper_posted_items")) || [];
    activePostedItems.unshift(newListingNode); // Insert at top of feed array
    localStorage.setItem("shopper_posted_items", JSON.stringify(activePostedItems));

    alert("Success! Your saamaan has been successfully listed in Shopper Marketplace feeds bro!");
    window.location.href = "index.html"; // Takes user straight back to updated live homepage
}
window.handlePostItem = handlePostItem;
