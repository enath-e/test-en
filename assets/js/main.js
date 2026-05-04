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
<<<<<<< HEAD
let currentProduct = null;

// ===================== تحميل البيانات =====================
async function loadData() {
    showLoading();
    try {
=======

// ===================== تحميل البيانات من Firebase =====================
async function loadData() {
    showLoading();
    try {
        // تحميل الفئات
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
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

<<<<<<< HEAD
=======
        // تحميل المنتجات
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
        const prodSnap = await database.ref('products').once('value');
        if (prodSnap.val()) {
            products = Object.keys(prodSnap.val()).map(key => ({ id: key, ...prodSnap.val()[key] }));
        } else {
            products = [];
            await saveProducts();
        }

<<<<<<< HEAD
=======
        // تحميل الإعلانات
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
        const adsSnap = await database.ref('ads').once('value');
        if (adsSnap.val()) {
            ads = Object.keys(adsSnap.val()).map(key => ({ id: key, ...adsSnap.val()[key] }));
        } else {
            ads = [];
            await saveAds();
        }

        renderCategories();
<<<<<<< HEAD
        renderAds();
=======
        renderAds(); // استخدم طريقة السكرول الأفقي
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
        hideLoading();
    } catch (err) {
        console.error(err);
        alert("خطأ في تحميل البيانات");
        hideLoading();
    }
}

<<<<<<< HEAD
=======
// دوال الحفظ (للتأكد من وجود بيانات أولية)
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
async function saveCategories() {
    const obj = {};
    categories.forEach(c => { obj[c.id] = { name: c.name, image: c.image, active: c.active }; });
    await database.ref('categories').set(obj);
}
<<<<<<< HEAD

=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
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
<<<<<<< HEAD

=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
async function saveAds() {
    const obj = {};
    ads.forEach(a => { obj[a.id] = { image: a.image, text: a.text || '', active: a.active }; });
    await database.ref('ads').set(obj);
}

<<<<<<< HEAD
// دالة تحويل الريال إلى دولار (إذا احتجتها لاحقاً)
function convertToUSD(sarPrice) {
    if (!sarPrice) return '0';
    const usdPrice = parseFloat(sarPrice) / 3.75;
    return usdPrice.toFixed(2);
}

// ===================== عرض الفئات =====================
=======
// ===================== عرض الفئات والمنتجات =====================
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
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

<<<<<<< HEAD
// ===================== عرض المنتجات في سكرول أفقي =====================
=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
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
<<<<<<< HEAD
            <div class="product-card" data-product-id="${p.id}">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div><span class="product-price">${p.price} $</span>${p.oldprice ? `<span class="product-oldprice">${p.oldprice} $</span>` : ''}</div>
=======
            <div class="product-card">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div><span class="product-price"> $ ${p.price} </span>${p.oldprice ? `<span class="product-oldprice"> $ ${p.oldprice}  </span>` : ''}</div>
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
                    <div class="product-desc">${p.desc || ''}</div>
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';
<<<<<<< HEAD

    // إضافة حدث الضغط على المنتج لفتح نافذة الشراء
    document.querySelectorAll('.product-card').forEach(card => {
        card.onclick = (e) => {
            e.stopPropagation();
            const prodId = card.getAttribute('data-product-id');
            const product = products.find(p => p.id === prodId);
            if (product) openProductModal(product);
        };
    });
=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
}

document.getElementById('closeProductsBtn')?.addEventListener('click', () => {
    document.getElementById('productsSection').style.display = 'none';
    document.body.style.overflow = 'auto';
});

<<<<<<< HEAD
// ===================== نافذة تفاصيل المنتج والشراء =====================
function openProductModal(product) {
    currentProduct = product;
    const modal = document.getElementById('productModal');
    const detailsDiv = document.getElementById('modalProductDetails');
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    
    qrcodeContainer.style.display = 'none';
    qrcodeContainer.innerHTML = '';
    
    detailsDiv.innerHTML = `
        <img src="${product.image}" style="width:100%; max-height:250px; object-fit:cover; border-radius:20px; margin-bottom:1rem;">
        <h3 style="color:#b5838d; margin-bottom:0.5rem;">${product.name}</h3>
        <p style="color:#4a4a4a; margin-bottom:0.5rem;">${product.desc || ''}</p>
        <p style="font-size:1.2rem; font-weight:bold; color:#e5989b;">${product.price} $</p>
        ${product.oldprice ? `<p style="text-decoration:line-through; color:#aaa;">${product.oldprice} $</p>` : ''}
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

document.getElementById('whatsappBuyBtn')?.addEventListener('click', () => {
    if (!currentProduct) return;
    const phoneNumber = "9665XXXXXXX";
    const message = `مرحباً، أريد شراء المنتج التالي:\n\nالمنتج: ${currentProduct.name}\nالسعر: ${currentProduct.price} $\nالرابط: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
});

document.getElementById('qrcodeBuyBtn')?.addEventListener('click', () => {
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    qrcodeContainer.style.display = 'block';
    qrcodeContainer.innerHTML = '';
    
    const paymentUrl = `https://wa.me/9665XXXXXXX?text=طلب شراء: ${currentProduct.name}`;
    new QRCode(qrcodeContainer, {
        text: paymentUrl,
        width: 200,
        height: 200,
        colorDark: "#b5838d",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
});

document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) {
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===================== عرض الإعلانات (سكرول أفقي) =====================
=======
// ===================== عرض الإعلانات (طريقة السكرول الأفقي البسيطة) =====================
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
function renderAds() {
    const activeAds = ads.filter(ad => ad.active);
    const slider = document.getElementById('adsSlider');
    if (!slider) return;

    if (activeAds.length === 0) {
        slider.innerHTML = `<div class="ad-slide"><div style="background:#eee; text-align:center; padding:80px;">لا توجد إعلانات</div></div>`;
        return;
    }

<<<<<<< HEAD
=======
    // بناء جميع الإعلانات كشرائح أفقية
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
    slider.innerHTML = activeAds.map(ad => `
        <div class="ad-slide">
            <img src="${ad.image}" onerror="this.src='https://via.placeholder.com/1200x400?text=صورة+غير+متوفرة'">
            ${ad.text ? `<div class="ad-text">${ad.text}</div>` : ''}
        </div>
    `).join('');
    
<<<<<<< HEAD
    const prevBtn = document.getElementById('prevAdBtn');
    const nextBtn = document.getElementById('nextAdBtn');
    if (prevBtn && nextBtn && activeAds.length > 1) {
=======
    // إضافة أزرار التنقل البسيطة (إن وجدت في HTML)
    const prevBtn = document.getElementById('prevAdBtn');
    const nextBtn = document.getElementById('nextAdBtn');
    if (prevBtn && nextBtn && activeAds.length > 1) {
        // إزالة المستمعات القديمة لتجنب التكرار
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
        const newPrev = prevBtn.cloneNode(true);
        const newNext = nextBtn.cloneNode(true);
        if (prevBtn.parentNode) prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        if (nextBtn.parentNode) nextBtn.parentNode.replaceChild(newNext, nextBtn);
        
<<<<<<< HEAD
        newPrev.onclick = () => { slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' }); };
        newNext.onclick = () => { slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' }); };
=======
        newPrev.onclick = () => {
            slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
        };
        newNext.onclick = () => {
            slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
        };
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
    }
}

// ===================== البحث =====================
<<<<<<< HEAD
function performSearch(keyword) {
    if (!keyword.trim()) {
=======
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const kw = e.target.value.trim().toLowerCase();
    if (!kw) {
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
        document.getElementById('productsSection').style.display = 'none';
        document.body.style.overflow = 'auto';
        return;
    }
<<<<<<< HEAD
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()) && p.active);
=======
    const filtered = products.filter(p => p.name.toLowerCase().includes(kw) && p.active);
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
    const title = document.getElementById('selectedCategoryTitle');
    const scrollDiv = document.getElementById('productsScroll');
    title.innerHTML = 'نتائج البحث';
    if (filtered.length === 0) {
        scrollDiv.innerHTML = '<div style="padding:20px; text-align:center;">لا توجد نتائج</div>';
    } else {
        scrollDiv.innerHTML = filtered.map(p => `
<<<<<<< HEAD
            <div class="product-card" data-product-id="${p.id}">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price} $</div>
=======
            <div class="product-card">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price} $ </div>
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';
<<<<<<< HEAD

    document.querySelectorAll('#productsScroll .product-card').forEach(card => {
        card.onclick = (e) => {
            e.stopPropagation();
            const prodId = card.getAttribute('data-product-id');
            const product = products.find(p => p.id === prodId);
            if (product) openProductModal(product);
        };
    });
}

document.getElementById('searchInput')?.addEventListener('input', (e) => {
    performSearch(e.target.value);
});

document.getElementById('mobileSearchBtn')?.addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.focus();
    searchInput.scrollIntoView({ behavior: 'smooth' });
=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
});

// ===================== التنقل للموبايل =====================
document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        if (page === 'home') {
            document.getElementById('productsSection').style.display = 'none';
<<<<<<< HEAD
            document.getElementById('productModal').style.display = 'none';
=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
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
<<<<<<< HEAD
=======
document.getElementById('cartIcon')?.addEventListener('click', () => alert('عربة التسوق قريباً'));
document.getElementById('mobileCart')?.addEventListener('click', () => alert('عربة التسوق قريباً'));
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad

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
<<<<<<< HEAD

=======
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}

<<<<<<< HEAD
// ===================== بدء تشغيل التطبيق =====================
=======
// ===================== بدء التشغيل =====================
>>>>>>> f37e9e541e2547bd028442ad40440446256127ad
loadData();