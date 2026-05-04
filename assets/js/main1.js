// ===== بيانات Firebase (استبدلها بإعداداتك) =====
const firebaseConfig = {
    apiKey: "AIzaSyD6CcJDUixgCQxe_al_j2aEiinUQ2X05s",
    authDomain: "enath-7d5e8.firebaseapp.com",
    databaseURL: "https://enath-7d5e8-default-rtdb.firebaseio.com",
    projectId: "enath-7d5e8",
    storageBucket: "enath-7d5e8.firebasestorage.app",
    messagingSenderId: "101026768739",
    appId: "1:101026768739:web:c3635b04e972914a5b1556"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// المتغيرات العامة
let categories = [];
let products = [];
let ads = [];
let currentAdIndex = 0;
let autoSlideInterval;

// ===== تحميل البيانات =====
async function loadData() {
    showLoading();
    
    try {
        // تحميل الفئات
        const categoriesSnap = await database.ref('categories').once('value');
        const categoriesData = categoriesSnap.val();
        if (categoriesData) {
            categories = Object.keys(categoriesData).map(key => ({ id: key, ...categoriesData[key] }));
        } else {
            categories = [];
            for (let i = 1; i <= 9; i++) {
                categories.push({ id: `cat${i}`, name: `فئة ${i}`, image: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png", active: true });
            }
            await saveCategories();
        }
        
        // تحميل المنتجات
        const productsSnap = await database.ref('products').once('value');
        const productsData = productsSnap.val();
        if (productsData) {
            products = Object.keys(productsData).map(key => ({ id: key, ...productsData[key] }));
        } else {
            products = [];
            await saveProducts();
        }
        
        // تحميل الإعلانات
        const adsSnap = await database.ref('ads').once('value');
        const adsData = adsSnap.val();
        if (adsData) {
            ads = Object.keys(adsData).map(key => ({ id: key, ...adsData[key] }));
        } else {
            ads = [];
            await saveAds();
        }
        
        renderAll();
        hideLoading();
        
    } catch (error) {
        console.error("خطأ:", error);
        alert("خطأ في التحميل");
        hideLoading();
    }
}

// دوال الحفظ
async function saveCategories() {
    const obj = {};
    categories.forEach(c => { obj[c.id] = { name: c.name, image: c.image, active: c.active }; });
    await database.ref('categories').set(obj);
}

async function saveProducts() {
    const obj = {};
    products.forEach(p => { obj[p.id] = { name: p.name, price: p.price, oldprice: p.oldprice || '', desc: p.desc || '', image: p.image, categoryId: p.categoryId, active: p.active }; });
    await database.ref('products').set(obj);
}

async function saveAds() {
    const obj = {};
    ads.forEach(a => { obj[a.id] = { image: a.image, text: a.text || '', active: a.active }; });
    await database.ref('ads').set(obj);
}

// ===== عرض كل شيء =====
function renderAll() {
    renderCategories();
    renderAds();
}

function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    const activeCats = categories.filter(c => c.active);
    container.innerHTML = activeCats.map(cat => `
        <div class="category-card" onclick="showProducts('${cat.id}')">
            <img src="${cat.image}">
            <h4>${cat.name}</h4>
        </div>
    `).join('');
}

function renderAds() {
    const activeAds = ads.filter(a => a.active);
    const container = document.getElementById('adsSlider');
    if (!container) return;
    
    if (activeAds.length === 0) {
        container.innerHTML = '<div class="ad-slide" style="background:#ddd; text-align:center; padding:80px;">لا توجد إعلانات</div>';
        return;
    }
    
    container.innerHTML = activeAds.map(ad => `
        <div class="ad-slide">
            <img src="${ad.image}" style="width:100%; height:250px; object-fit:cover;">
            ${ad.text ? `<div class="ad-text">${ad.text}</div>` : ''}
        </div>
    `).join('');
    
    // إعادة تهيئة السلايدر
    if (window.initSlider) window.initSlider();
}

// عرض المنتجات لفئة معينة
window.showProducts = function(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    const catProducts = products.filter(p => p.categoryId === categoryId && p.active);
    
    const section = document.getElementById('productsSection');
    const title = document.getElementById('selectedCategoryTitle');
    const scrollDiv = document.getElementById('productsScroll');
    
    title.innerHTML = category ? category.name : 'منتجات';
    
    if (catProducts.length === 0) {
        scrollDiv.innerHTML = '<div style="padding:20px; text-align:center;">لا توجد منتجات</div>';
    } else {
        scrollDiv.innerHTML = catProducts.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="product-img">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price} ر.س</div>
                    ${p.oldprice ? `<div class="product-oldprice">${p.oldprice} ر.س</div>` : ''}
                    <div class="product-desc">${p.desc || ''}</div>
                </div>
            </div>
        `).join('');
    }
    
    section.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// إغلاق المنتجات
document.getElementById('closeProductsBtn')?.addEventListener('click', () => {
    document.getElementById('productsSection').style.display = 'none';
    document.body.style.overflow = 'auto';
});

// ===== دوال السلايدر =====
function initSlider() {
    const slider = document.getElementById('adsSlider');
    if (!slider) return;
    
    let currentIndex = 0;
    const slides = slider.children;
    const total = slides.length;
    
    if (total <= 1) return;
    
    // إضافة أزرار
    let nextBtn = document.getElementById('customNextBtn');
    let prevBtn = document.getElementById('customPrevBtn');
    
    if (!nextBtn) {
        const container = document.querySelector('.ads-slider-container');
        if (container) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'customNextBtn';
            nextBtn.innerHTML = '❯';
            nextBtn.style.cssText = 'position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; padding:8px 12px; border-radius:50%; cursor:pointer; z-index:10;';
            nextBtn.onclick = () => {
                currentIndex = (currentIndex + 1) % total;
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            };
            
            prevBtn = document.createElement('button');
            prevBtn.id = 'customPrevBtn';
            prevBtn.innerHTML = '❮';
            prevBtn.style.cssText = 'position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; padding:8px 12px; border-radius:50%; cursor:pointer; z-index:10;';
            prevBtn.onclick = () => {
                currentIndex = (currentIndex - 1 + total) % total;
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            };
            
            container.appendChild(prevBtn);
            container.appendChild(nextBtn);
        }
    }
    
    slider.style.transition = 'transform 0.5s ease';
}

// ===== البحث =====
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    if (!keyword) return;
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword) && p.active);
    const title = document.getElementById('selectedCategoryTitle');
    const scrollDiv = document.getElementById('productsScroll');
    
    title.innerHTML = 'نتائج البحث';
    scrollDiv.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-img">
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">${p.price} ر.س</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('productsSection').style.display = 'block';
});

// ===== دوال مساعدة =====
function showLoading() {
    let loader = document.getElementById('pageLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#b5838d; color:white; padding:10px 20px; border-radius:30px; z-index:9999';
        loader.innerText = 'جاري التحميل...';
        document.body.appendChild(loader);
    }
}

function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.remove();
}

// التواصل
document.getElementById('contactLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('contactModal').style.display = 'flex';
});
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('contactModal').style.display = 'none';
});
document.getElementById('wishlistIcon')?.addEventListener('click', () => alert('قريباً'));
document.getElementById('cartIcon')?.addEventListener('click', () => alert('قريباً'));

// تشغيل
loadData();