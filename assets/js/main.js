// ===================== إعدادات Firebase =====================
const firebaseConfig = {
    apiKey: "AIzaSyD6CcJDUiXgCQxe_aL_j2aEi1nuQ2x2o5s",
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
let currentProduct = null;
let currentAdIndex = 0;
let autoSlideInterval = null;

// ===================== تحميل البيانات =====================
async function loadData() {
    showLoading();
    try {
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

        const prodSnap = await database.ref('products').once('value');
        if (prodSnap.val()) {
            products = Object.keys(prodSnap.val()).map(key => ({ id: key, ...prodSnap.val()[key] }));
        } else {
            products = [];
            await saveProducts();
        }

        const adsSnap = await database.ref('ads').once('value');
        if (adsSnap.val()) {
            ads = Object.keys(adsSnap.val()).map(key => ({ id: key, ...adsSnap.val()[key] }));
        } else {
            ads = [];
            await saveAds();
        }

        renderCategories();
        renderAds();
        hideLoading();
    } catch (err) {
        console.error(err);
        alert("خطأ في تحميل البيانات");
        hideLoading();
    }
}

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

// ===================== عرض الفئات (معالج النقر المحسن) =====================
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

    // إضافة حدث النقر لكل بطاقة فئة (مع منع انتشار الحدث)
    document.querySelectorAll('.category-card').forEach(card => {
        card.removeEventListener('click', categoryClickHandler);
        card.addEventListener('click', categoryClickHandler);
    });
}

// دالة منفصلة لمعالج النقر على الفئة
function categoryClickHandler(e) {
    e.stopPropagation(); // منع وصول الحدث للمستمع العام
    const catId = this.getAttribute('data-category-id');
    showProductsByCategory(catId);
}

// ===================== عرض المنتجات (دون تغيير) =====================
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
            <div class="product-card" data-product-id="${p.id}">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفرة'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div><span class="product-price">${p.price}$ </span>${p.oldprice ? `<span class="product-oldprice">${p.oldprice}$ </span>` : ''}</div>
                    <div class="product-desc">${p.desc || ''}</div>
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // ربط حدث النقر على بطاقات المنتجات الجديدة
    document.querySelectorAll('#productsScroll .product-card').forEach(card => {
        card.removeEventListener('click', productCardClickHandler);
        card.addEventListener('click', productCardClickHandler);
    });
}

function productCardClickHandler(e) {
    e.stopPropagation(); // منع الإغلاق العام
    const prodId = this.getAttribute('data-product-id');
    const product = products.find(p => p.id === prodId);
    if (product) openProductModal(product);
}

document.getElementById('closeProductsBtn')?.addEventListener('click', () => {
    document.getElementById('productsSection').style.display = 'none';
    document.body.style.overflow = 'auto';
});

// ===================== نافذة شراء المنتج =====================
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
        <p style="color:#4a4a4a;">${product.desc || ''}</p>
        <p style="font-size:1.2rem; font-weight:bold; color:#e5989b; margin-top:0.5rem;">${product.price}$ </p>
        ${product.oldprice ? `<p style="text-decoration:line-through; color:#aaa;">${product.oldprice}$ </p>` : ''}
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
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
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

// ===================== عرض الإعلانات =====================
function renderAds() {
    const activeAds = ads.filter(ad => ad.active);
    const slider = document.getElementById('adsSlider');
    const dotsContainer = document.getElementById('sliderDots');
    if (!slider) return;

    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    if (activeAds.length === 0) {
        slider.innerHTML = `<div class="ad-slide active"><div style="background:#eee; text-align:center; padding:80px;">لا توجد إعلانات</div></div>`;
        if (dotsContainer) dotsContainer.innerHTML = '';
        return;
    }

    slider.innerHTML = '';
    activeAds.forEach((ad, i) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'ad-slide' + (i === 0 ? ' active' : '');
        slideDiv.innerHTML = `
            <img src="${ad.image}" onerror="this.src='https://via.placeholder.com/1200x400?text=صورة+غير+متوفره'">
            ${ad.text ? `<div class="ad-text">${ad.text}</div>` : ''}
        `;
        slider.appendChild(slideDiv);
    });
    
    currentAdIndex = 0;
    
    if (dotsContainer && activeAds.length > 1) {
        dotsContainer.innerHTML = '';
        activeAds.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.onclick = () => goToAd(i);
            dotsContainer.appendChild(dot);
        });
    } else if (dotsContainer) {
        dotsContainer.innerHTML = '';
    }
    
    const prevBtn = document.getElementById('prevAdBtn');
    const nextBtn = document.getElementById('nextAdBtn');
    
    if (prevBtn && nextBtn && activeAds.length > 1) {
        const newPrev = prevBtn.cloneNode(true);
        const newNext = nextBtn.cloneNode(true);
        prevBtn.parentNode?.replaceChild(newPrev, prevBtn);
        nextBtn.parentNode?.replaceChild(newNext, nextBtn);
        
        newPrev.onclick = () => {
            goToAd((currentAdIndex - 1 + activeAds.length) % activeAds.length);
            resetAutoSlide(activeAds.length);
        };
        newNext.onclick = () => {
            goToAd((currentAdIndex + 1) % activeAds.length);
            resetAutoSlide(activeAds.length);
        };
    }
    
    startAutoSlide(activeAds.length);
}

function goToAd(index) {
    const slides = document.querySelectorAll('#adsSlider .ad-slide');
    const dots = document.querySelectorAll('#sliderDots .dot');
    if (!slides.length) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    
    if (dots.length) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }
    
    currentAdIndex = index;
}

function startAutoSlide(total) {
    if (total <= 1) return;
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    
    autoSlideInterval = setInterval(() => {
        const activeCount = ads.filter(ad => ad.active).length;
        if (activeCount <= 1) return;
        goToAd((currentAdIndex + 1) % activeCount);
    }, 5000);
}

function resetAutoSlide(total) {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        startAutoSlide(total);
    }
}

// ===================== البحث مع الاقتراحات =====================
function showSuggestions(inputElement, suggestionsContainer, keyword) {
    if (!keyword.trim()) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    const matched = products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()) && p.active).slice(0, 5);
    if (matched.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    suggestionsContainer.innerHTML = matched.map(p => `<div class="suggestion-item" data-name="${p.name}">${p.name}</div>`).join('');
    suggestionsContainer.style.display = 'block';
    
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.onclick = (e) => {
            e.stopPropagation();
            const selectedName = item.getAttribute('data-name');
            inputElement.value = selectedName;
            suggestionsContainer.style.display = 'none';
            performSearch(selectedName);
            if (inputElement.id === 'searchInputMobile') {
                const clearBtn = document.getElementById('clearMobileSearch');
                if (clearBtn) clearBtn.style.display = 'block';
            }
        };
    });
}

function performSearch(keyword) {
    if (!keyword.trim()) {
        document.getElementById('productsSection').style.display = 'none';
        document.body.style.overflow = 'auto';
        return;
    }
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()) && p.active);
    const title = document.getElementById('selectedCategoryTitle');
    const scrollDiv = document.getElementById('productsScroll');

    title.innerHTML = `<i class="fas fa-search"></i> نتائج البحث عن "${keyword}"`;

    if (filtered.length === 0) {
        scrollDiv.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">😞 لا توجد منتجات تطابق بحثك</div>';
    } else {
        scrollDiv.innerHTML = filtered.map(p => `
            <div class="product-card" data-product-id="${p.id}">
                <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/200x200?text=صورة+غير+متوفره'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price} $</div>
                </div>
            </div>
        `).join('');
    }
    document.getElementById('productsSection').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // إعادة ربط حدث النقر على بطاقات نتائج البحث
    document.querySelectorAll('#productsScroll .product-card').forEach(card => {
        card.removeEventListener('click', productCardClickHandler);
        card.addEventListener('click', productCardClickHandler);
    });
}

// ربط أحداث البحث لسطح المكتب
const desktopInput = document.getElementById('searchInputDesktop');
const desktopSuggestions = document.getElementById('suggestionsDesktop');
if (desktopInput) {
    desktopInput.addEventListener('input', (e) => {
        const val = e.target.value;
        showSuggestions(desktopInput, desktopSuggestions, val);
        if (val.trim() === '') {
            document.getElementById('productsSection').style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            performSearch(val);
        }
    });
}

// ربط أحداث البحث للجوال (الشريط العلوي)
const mobileInput = document.getElementById('searchInputMobile');
const mobileSuggestions = document.getElementById('suggestionsMobile');
const clearMobileBtn = document.getElementById('clearMobileSearch');

if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
        const val = e.target.value;
        showSuggestions(mobileInput, mobileSuggestions, val);
        if (clearMobileBtn) clearMobileBtn.style.display = val ? 'block' : 'none';
        if (val.trim() === '') {
            document.getElementById('productsSection').style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            performSearch(val);
        }
    });
    if (clearMobileBtn) {
        clearMobileBtn.addEventListener('click', () => {
            mobileInput.value = '';
            mobileSuggestions.style.display = 'none';
            performSearch('');
            clearMobileBtn.style.display = 'none';
            document.getElementById('productsSection').style.display = 'none';
            document.body.style.overflow = 'auto';
            
        });
    }
}

// ===================== إغلاق نتائج البحث عند النقر خارجها (مع استثناء الفئات والمنتجات) =====================
document.addEventListener('click', function(e) {
    const productsSection = document.getElementById('productsSection');
    if (!productsSection || productsSection.style.display !== 'block') return;

    // العناصر التي يجب ألا تغلق النتائج عند النقر عليها
    const searchElements = [
        document.getElementById('searchInputDesktop'),
        document.getElementById('searchInputMobile'),
        document.getElementById('suggestionsDesktop'),
        document.getElementById('suggestionsMobile'),
        document.getElementById('clearMobileSearch')
    ].filter(el => el !== null);
    
    // بطاقات المنتجات داخل النتائج
    const productCards = document.querySelectorAll('#productsScroll .product-card');
    
    // التحقق إذا كان النقر داخل نافذة النتائج نفسها
    const isInsideResults = productsSection.contains(e.target);
    const isInsideSearch = searchElements.some(el => el && el.contains(e.target));
    const isInsideProductCard = Array.from(productCards).some(card => card.contains(e.target));
    
    // أيضاً نمنع الإغلاق إذا كان النقر على فئة (لأن الفئات خارج النتائج)
    const isOnCategory = e.target.closest('.category-card') !== null;
    
    if (!isInsideResults && !isInsideSearch && !isInsideProductCard && !isOnCategory) {
        productsSection.style.display = 'none';
        document.body.style.overflow = 'auto';
        // إخفاء الاقتراحات أيضاً
        if (desktopSuggestions) desktopSuggestions.style.display = 'none';
        if (mobileSuggestions) mobileSuggestions.style.display = 'none';
    }
});

// ===================== تنقل الموبايل =====================
document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const page = item.getAttribute('data-page');
        if (page === 'home') {
            document.getElementById('productsSection').style.display = 'none';
            document.getElementById('productModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (page === 'categories') {
            document.getElementById('categoriesGrid').scrollIntoView({ behavior: 'smooth' });
        } else if (page === 'contact') {
            const contactModal = document.getElementById('contactModal');
            if (contactModal) contactModal.style.display = 'flex';
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

document.getElementById('wishlistIcon')?.addEventListener('click', () => alert('المفضلة قريباً'));

// ===================== شاشة التحميل =====================
// function showLoading() {
//     let loader = document.getElementById('globalLoader');
//     if (!loader) {
//         loader = document.createElement('div');
//         loader.id = 'globalLoader';
//         loader.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000;';
//         loader.innerHTML = '<div style="background:#b5838d; color:white; padding:15px 30px; border-radius:50px;">جاري التحميل...</div>';
//         document.body.appendChild(loader);
//     } else {
//         loader.style.display = 'flex';
//     }
// }

function showLoading() {
    // إذا كان العنصر موجوداً بالفعل، أظهره فقط
    let loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'flex';
        return;
    }
    
    // إنشاء عنصر التحميل الجديد
    loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #faf8f6;      /* لون الموقع الأساسي */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        direction: rtl;
        font-family: 'Tajawal', sans-serif;
    `;
    
    // محتوى الواجهة: أيقونة + عبارة ترحيبية + تأثير تحميل بسيط (اختياري)
    loader.innerHTML = `
        <div style="text-align: center; max-width: 80%; padding: 20px;">
            <i class="fas fa-feather-alt" style="font-size: 4rem; color: #b5838d; margin-bottom: 1rem;"></i>
            <h2 style="color: #b5838d; font-size: 1.8rem; margin-bottom: 0.5rem;">أهلاً وسهلاً</h2>
            <p style="color: #6d6875; font-size: 1.2rem; margin-bottom: 1.5rem;">في متجر إناث</p>
            <div style="width: 40px; height: 40px; margin: 0 auto; border: 4px solid #e5989b; border-top-color: #b5838d; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="color: #b5838d; margin-top: 1rem; font-size: 0.9rem;">جاري التحميل...</p>
            <p style="color:#b5838d; margin-top: 1rem; font-size: 0.7rem;">تصميم وتطوير: أحمد كلاوي</p>
        </div>
    `;
    
    // إضافة حركة الدوران (اختياري)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}




// ===================== بدء التطبيق =====================
loadData();