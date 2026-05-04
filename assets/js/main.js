// ===== إعدادات Firebase - استبدلها بإعدادات مشروعك =====
const firebaseConfig = {  // Import the functions you need from the SDKs you need

    apiKey: "AIzaSyD6CcJDUiXgCQxe_aL_j2aEi1nuQ2X2o5s",
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

// متغيرات السلايدر
let currentAdIndex = 0;
let autoSlideInterval;

// ===== تحميل البيانات من Firebase =====
async function loadData() {
    showLoading();
    
    try {
        // تحميل الفئات
        const categoriesSnapshot = await database.ref('categories').once('value');
        const categoriesData = categoriesSnapshot.val();
        
        if (categoriesData) {
            categories = Object.keys(categoriesData).map(key => ({
                id: key,
                ...categoriesData[key]
            }));
        } else {
            // بيانات افتراضية للفئات (مرة واحدة عند أول تشغيل)
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
            await saveCategoriesToFirebase();
        }
        
        // تحميل المنتجات
        const productsSnapshot = await database.ref('products').once('value');
        const productsData = productsSnapshot.val();
        if (productsData) {
            products = Object.keys(productsData).map(key => ({
                id: key,
                ...productsData[key]
            }));
        } else {
            // منتجات افتراضية
            products = [
                { id: "prod1", name: "سوار ذهبي", price: "150", oldprice: "200", desc: "سوار أنيق من الذهب", image: "https://via.placeholder.com/200x200?text=Gold", categoryId: "cat1", active: true },
                { id: "prod2", name: "عطر ورد", price: "200", oldprice: "280", desc: "عطر فرنسي فاخر", image: "https://via.placeholder.com/200x200?text=Perfume", categoryId: "cat2", active: true }
            ];
            await saveProductsToFirebase();
        }
        
        // تحميل الإعلانات
        const adsSnapshot = await database.ref('ads').once('value');
        const adsData = adsSnapshot.val();
        if (adsData) {
            ads = Object.keys(adsData).map(key => ({
                id: key,
                ...adsData[key]
            }));
        } else {
            ads = [
                { id: "ad1", image: "https://via.placeholder.com/1200x250?text=عرض+خاص", text: "تخفيضات تصل إلى 50%", active: true },
                { id: "ad2", image: "https://via.placeholder.com/1200x250?text=توصيل+مجاني", text: "توصيل مجاني", active: true }
            ];
            await saveAdsToFirebase();
        }
        
        renderCategoriesGrid();
        renderAdsSlider();
        hideLoading();
        
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        alert("حدث خطأ في تحميل البيانات. تأكد من اتصالك بالإنترنت.");
        hideLoading();
    }
}

// دوال الحفظ في Firebase (تستخدم من الأدمن)
async function saveCategoriesToFirebase() {
    const categoriesObj = {};
    categories.forEach(cat => {
        categoriesObj[cat.id] = { name: cat.name, image: cat.image, active: cat.active };
    });
    await database.ref('categories').set(categoriesObj);
}

async function saveProductsToFirebase() {
    const productsObj = {};
    products.forEach(prod => {
        productsObj[prod.id] = {
            name: prod.name,
            price: prod.price,
            oldprice: prod.oldprice || '',
            desc: prod.desc || '',
            image: prod.image,
            categoryId: prod.categoryId,
            active: prod.active
        };
    });
    await database.ref('products').set(productsObj);
}

async function saveAdsToFirebase() {
    const adsObj = {};
    ads.forEach(ad => {
        adsObj[ad.id] = { image: ad.image, text: ad.text || '', active: ad.active };
    });
    await database.ref('ads').set(adsObj);
}

// ===== عرض شبكة الفئات =====
function renderCategoriesGrid() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    const activeCats = categories.filter(c => c.active).slice(0, 9);
    container.innerHTML = activeCats.map(cat => `
        <div class="category-card" data-category-id="${cat.id}">
            <img src="${cat.image}" alt="${cat.name}">
            <h4>${cat.name}</h4>
        </div>
    `).join('');
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const catId = card.dataset.categoryId;
            showProductsByCategory(catId);
        });
    });
}

// ===== عرض المنتجات =====
function showProductsByCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const categoryProducts = products.filter(p => p.categoryId === categoryId && p.active);
    const scrollContainer = document.getElementById('productsScroll');
    const titleElement = document.getElementById('selectedCategoryTitle');
    
    titleElement.innerHTML = `<i class="fas fa-tag"></i> ${category.name}`;
    
    if (categoryProducts.length === 0) {
        scrollContainer.innerHTML = `<div style="padding:2rem; text-align:center; color:#888;">لا توجد منتجات في هذه الفئة</div>`;
    } else {
        scrollContainer.innerHTML = categoryProducts.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="product-img" alt="${p.name}">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div>
                        <span class="product-price">${p.price} ر.س</span>
                        ${p.oldprice ? `<span class="product-oldprice">${p.oldprice} ر.س</span>` : ''}
                    </div>
                    <div class="product-desc">${p.desc || ''}</div>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// ===== إغلاق المنتجات =====
document.getElementById('closeProductsBtn')?.addEventListener('click', () => {
    document.getElementById('productsSection').style.display = 'none';
    document.body.style.overflow = 'auto';
});

document.getElementById('productsSection')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('productsSection')) {
        document.getElementById('productsSection').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===== السلايدر =====
function renderAdsSlider() {
    const activeAds = ads.filter(ad => ad.active);
    const slider = document.getElementById('adsSlider');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slider) return;
    
    // إذا لم يوجد إعلانات نشطة
    if (activeAds.length === 0) {
        slider.innerHTML = <div class="ad-slide"><img src="https://via.placeholder.com/1200x400?text=لا+توجد+إعلانات+حالياً" style="height:300px; object-fit:cover;"></div>;
        dotsContainer.innerHTML = '';
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        return;
    }
    
    // عرض جميع الإعلانات في السلايدر
    slider.innerHTML = activeAds.map(ad => 
        <div class="ad-slide">
            <img src="${ad.image}" alt="إعلان" style="width:100%; height:300px; object-fit:cover;">
            ${ad.text ? <div class="ad-text">${ad.text}</div> : ''}
        </div>
    ).join('');
    
    // إضافة النقاط (dots) للتنقل
    dotsContainer.innerHTML = activeAds.map((_, idx) => 
        <span class="dot ${idx === currentAdIndex ? 'active' : ''}" data-index="${idx}"></span>
    ).join('');
    
    // تحديث موضع السلايدر
    updateSliderPosition();
    
    // بدء التشغيل التلقائي
    startAutoSlide();
    
    // إضافة أحداث النقر على النقاط
    document.querySelectorAll('.dot').forEach(dot => {
        dot.removeEventListener('click', handleDotClick);
        dot.addEventListener('click', handleDotClick);
    });
}

function handleDotClick(e) {
    currentAdIndex = parseInt(e.target.dataset.index);
    updateSliderPosition();
    updateDots();
    resetAutoSlide();
}

function updateSliderPosition() {
    const slider = document.getElementById('adsSlider');
    if (slider) {
        slider.style.transform = translateX(-${currentAdIndex * 100}%);
    }
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentAdIndex);
    });
}

function nextAd() {
    const activeAds = ads.filter(ad => ad.active);
    if (activeAds.length === 0) return;
    currentAdIndex = (currentAdIndex + 1) % activeAds.length;
    updateSliderPosition();
    updateDots();
}

function prevAd() {
    const activeAds = ads.filter(ad => ad.active);
    if (activeAds.length === 0) return;
    currentAdIndex = (currentAdIndex - 1 + activeAds.length) % activeAds.length;
    updateSliderPosition();
    updateDots();
}

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextAd, 5000);
}

function resetAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    startAutoSlide();
}

function updateSliderPosition() {
    const slider = document.getElementById('adsSlider');
    if (slider) slider.style.transform = `translateX(-${currentAdIndex * 100}%)`;
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentAdIndex);
    });
}

function nextAd() {
    const activeAds = ads.filter(ad => ad.active);
    if (activeAds.length === 0) return;
    currentAdIndex = (currentAdIndex + 1) % activeAds.length;
    updateSliderPosition();
    updateDots();
}

function prevAd() {
    const activeAds = ads.filter(ad => ad.active);
    if (activeAds.length === 0) return;
    currentAdIndex = (currentAdIndex - 1 + activeAds.length) % activeAds.length;
    updateSliderPosition();
    updateDots();
}

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextAd, 5000);
}

function resetAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    startAutoSlide();
}

document.getElementById('nextAd')?.addEventListener('click', () => { nextAd(); resetAutoSlide(); });
document.getElementById('prevAd')?.addEventListener('click', () => { prevAd(); resetAutoSlide(); });

// ===== البحث =====
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const keyword = e.target.value.trim().toLowerCase();
    
    if (!keyword) {
        document.getElementById('productsSection').style.display = 'none';
        document.body.style.overflow = 'auto';
        return;
    }
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword) && p.active);
    
    document.getElementById('selectedCategoryTitle').innerHTML = '<i class="fas fa-search"></i> نتائج البحث';
    
    if (filtered.length === 0) {
        document.getElementById('productsScroll').innerHTML = `<div style="padding:2rem; text-align:center; color:#888;">لا توجد نتائج مطابقة</div>`;
    } else {
        document.getElementById('productsScroll').innerHTML = filtered.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="product-img">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price} ر.س</div>
                    ${p.oldprice ? `<span class="product-oldprice">${p.oldprice} ر.س</span>` : ''}
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// ===== التنقل =====
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

// ===== مودال التواصل =====
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

// ===== أيقونات غير عاملة =====
document.getElementById('wishlistIcon')?.addEventListener('click', () => alert("المفضلة قريباً"));
document.getElementById('cartIcon')?.addEventListener('click', () => alert("عربة التسوق قريباً"));
document.getElementById('mobileCart')?.addEventListener('click', () => alert("عربة التسوق قريباً"));

// ===== دوال مساعدة =====
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#b5838d; color:white; padding:1rem 2rem; border-radius:50px; z-index:9999; font-weight:bold;';
    loader.innerText = 'جاري التحميل...';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
}

// ===== تشغيل التطبيق =====
loadData();