// ===================== إعدادات Firebase =====================
const firebaseConfig = {
    apiKey: "AIzaSyD6CcJDUixgCQxe_al_j2aEiinUQ2X05s",
    authDomain: "enath-7d5e8.firebaseapp.com",
    databaseURL: "https://enath-7d5e8-default-rtdb.firebaseio.com",
    projectId: "enath-7d5e8",
    storageBucket: "enath-7d5e8.firebasestorage.app",
    messagingSenderId: "101026768739",
    appId: "1:101026768739:web:c3635b04e972914a5b1556"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ===================== المتغيرات العامة =====================
let categories = [];
let products = [];
let ads = [];

// ===================== تحميل البيانات من Firebase =====================
async function loadData() {
    showLoading();
    try {
        // تحميل الفئات
        const catSnap = await database.ref('categories').once('value');
        if (catSnap.val()) {
            categories = Object.keys(catSnap.val()).map(key => ({ id: key, ...catSnap.val()[key] }));
        } else {
            categories = [
                { id: "cat1", name: "إكسسوارات", image: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png", active: true },
                { id: "cat2", name: "عطور", image: "https://cdn-icons-png.flaticon.com/512/1923/1923745.png", active: true },
                { id: "cat3", name: "حقائب", image: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png", active: true },
                { id: "cat4", name: "أحذية", image: "https://cdn-icons-png.flaticon.com/512/3114/3114886.png", active: true },
                { id: "cat5", name: "ملابس", image: "https://cdn-icons-png.flaticon.com/512/775/775926.png", active: true },
                { id: "cat6", name: "مكياج", image: "https://cdn-icons-png.flaticon.com/512/3014/3014582.png", active: true },
                { id: "cat7", name: "مجوهرات", image: "https://cdn-icons-png.flaticon.com/512/3657/3657297.png", active: true },
                { id: "cat8", name: "ساعات", image: "https://cdn-icons-png.flaticon.com/512/4836/4836642.png", active: true },
                { id: "cat9", name: "عناية", image: "https://cdn-icons-png.flaticon.com/512/2938/2938253.png", active: true }
            ];
            await saveCategories();
        }

        // تحميل المنتجات
        const prodSnap = await database.ref('products').once('value');
        if (prodSnap.val()) {
            products = Object.keys(prodSnap.val()).map(key => ({ id: key, ...prodSnap.val()[key] }));
        } else {
            products = [];
            await saveProducts();
        }

        // تحميل الإعلانات
        const adsSnap = await database.ref('ads').once('value');
        if (adsSnap.val()) {
            ads = Object.keys(adsSnap.val()).map(key => ({ id: key, ...adsSnap.val()[key] }));
        } else {
            ads = [];
            await saveAds();
        }

        renderCategories();
        renderAds(); // استخدم طريقة السكرول الأفقي
        hideLoading();
    } catch (err) {
        console.error(err);
        alert("خطأ في تحميل البيانات");
        hideLoading();
    }
}

// دوال الحفظ (للتأكد من وجود بيانات أولية)
async function saveCategories() {
    const obj = {};
    categories.forEach(c => { obj[c.id] = { name: c.name, image: c.image, active: c.active }; });
    await database.ref('categories').set(obj);
}
async function saveProducts() {
    const obj = {};
    products.forEach(p => {
        obj[p.id] = {
            name: p.name, price: p.price, oldprice: p.oldprice || '',
            desc: p.desc || '', image: p.image, categoryId: p.categoryId, active: p.active
        };
    });
    await database.ref('products').set(obj);
}
async function saveAds() {
    const obj = {};
    ads.forEach(a => { obj[a.id] = { image: a.image, text: a.text || '', active: a.active }; });
    await database.ref('ads').set(obj);
}

// ===================== عرض الفئات والمنتجات =====================
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    const activeCats = categories.filter(c => c.active);
    if (activeCats.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px;">لا توجد فئات</div>';
        return;
    }
    container.innerHTML = activeCats.map(cat => `
        <div class="category-card" data-category-id="${cat.id}">
            <img src="${cat.image}" alt="${cat.name}">
            <h4>${cat.name}</h4>
        </div>
    `).join('');
    document.querySelectorAll('.category-card').forEach(card => {
        card.onclick = () => {
            const catId = card.getAttribute('data-category-id');
            showProductsByCategory(catId);
        };
    });
}

function showProductsByCategory(catId) {
    const category = categories.find(c => c.id === catId);
    const catProducts = products.filter(p => p.categoryId === catId && p.active);
    const title = document.getElementById('selectedCategoryTitle');
    const scrollDiv = document.getElementById('productsScroll');
    title.innerHTML = category ? category.name : 'منتجات';
    if (catProducts.length === 0) {
        scrollDiv.innerHTML = '<div style="padding:20px; text-align:center;">لا توجد منتجات</div>';
    } else {
        scrollDiv.innerHTML = catProducts.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div><span class="product-price">${p.price} ر.س</span>${p.oldprice ? `<span class="product-oldprice">${p.oldprice} ر.س</span>` : ''}</div>
                    <div class="product-desc">${p.desc || ''}</div>
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

document.getElementById('closeProductsBtn')?.addEventListener('click', () => {
    document.getElementById('productsSection').style.display = 'none';
    document.body.style.overflow = 'auto';
});

// ===================== عرض الإعلانات (طريقة السكرول الأفقي البسيطة) =====================
function renderAds() {
    const activeAds = ads.filter(ad => ad.active);
    const slider = document.getElementById('adsSlider');
    if (!slider) return;

    if (activeAds.length === 0) {
        slider.innerHTML = `<div class="ad-slide"><div style="background:#eee; text-align:center; padding:80px;">لا توجد إعلانات</div></div>`;
        return;
    }

    // بناء جميع الإعلانات كشرائح أفقية
    slider.innerHTML = activeAds.map(ad => `
        <div class="ad-slide">
            <img src="${ad.image}" onerror="this.src='https://via.placeholder.com/1200x400?text=صورة+غير+متوفرة'">
            ${ad.text ? `<div class="ad-text">${ad.text}</div>` : ''}
        </div>
    `).join('');
    
    // إضافة أزرار التنقل البسيطة (إن وجدت في HTML)
    const prevBtn = document.getElementById('prevAdBtn');
    const nextBtn = document.getElementById('nextAdBtn');
    if (prevBtn && nextBtn && activeAds.length > 1) {
        // إزالة المستمعات القديمة لتجنب التكرار
        const newPrev = prevBtn.cloneNode(true);
        const newNext = nextBtn.cloneNode(true);
        if (prevBtn.parentNode) prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        if (nextBtn.parentNode) nextBtn.parentNode.replaceChild(newNext, nextBtn);
        
        newPrev.onclick = () => {
            slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
        };
        newNext.onclick = () => {
            slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
        };
    }
}

// ===================== البحث =====================
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const kw = e.target.value.trim().toLowerCase();
    if (!kw) {
        document.getElementById('productsSection').style.display = 'none';
        document.body.style.overflow = 'auto';
        return;
    }
    const filtered = products.filter(p => p.name.toLowerCase().includes(kw) && p.active);
    const title = document.getElementById('selectedCategoryTitle');
    const scrollDiv = document.getElementById('productsScroll');
    title.innerHTML = 'نتائج البحث';
    if (filtered.length === 0) {
        scrollDiv.innerHTML = '<div style="padding:20px; text-align:center;">لا توجد نتائج</div>';
    } else {
        scrollDiv.innerHTML = filtered.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price} ر.س</div>
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// ===================== التنقل للموبايل =====================
document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        if (page === 'home') {
            document.getElementById('productsSection').style.display = 'none';
            document.body.style.overflow = 'auto';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (page === 'categories') {
            document.getElementById('categoriesGrid').scrollIntoView({ behavior: 'smooth' });
        }
        document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ===================== مودال التواصل =====================
const modal = document.getElementById('contactModal');
const contactLink = document.getElementById('contactLink');
const closeBtn = document.querySelector('.close');
contactLink?.addEventListener('click', (e) => {
    e.preventDefault();
    if (modal) modal.style.display = 'flex';
});
closeBtn?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// ===================== أيقونات وهمية =====================
document.getElementById('wishlistIcon')?.addEventListener('click', () => alert('المفضلة قريباً'));
document.getElementById('cartIcon')?.addEventListener('click', () => alert('عربة التسوق قريباً'));
document.getElementById('mobileCart')?.addEventListener('click', () => alert('عربة التسوق قريباً'));

// ===================== دوال مساعدة =====================
function showLoading() {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000;';
        loader.innerHTML = '<div style="background:#b5838d; color:white; padding:15px 30px; border-radius:50px;">جاري التحميل...</div>';
        document.body.appendChild(loader);
    } else {
        loader.style.display = 'flex';
    }
}
function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}

// ===================== بدء التشغيل =====================
loadData();