// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- Core Data and State ---
const products = [
    { id: 1, name: "Cardamom Latte", price: 130.00, category: "Coffee", image: "images/cardamom.jpg" },
    { id: 2, name: "Velvet Cappuccino", price: 99.00, category: "Coffee", image: "images/coffee.png" },
    { id: 3, name: "Signature Espresso", price: 130.00, category: "Coffee", image: "images/espresso10.png" },
    { id: 4, name: "Masala Chai", price: 20.00, category: "Tea & Snacks", image: "images/masala_chai.jpg" },
    { id: 5, name: "Golden Croissant", price: 150.00, category: "Pastries & Cakes", image: "images/croissant.jpg" },
    { id: 6, name: "Honey Danish", price: 120.00, category: "Pastries & Cakes", image: "images/danish.jpg" },
    { id: 7, name: "Black Americano", price: 90.00, category: "Coffee", image: "images/americano.jpg" },
    { id: 8, name: "Blueberry Bliss Cake", price: 89.00, category: "Pastries & Cakes", image: "images/blueberry.jpeg" },
    { id: 10, name: "Strawberry Silk Cake", price: 99.00, category: "Pastries & Cakes", image: "images/strawberry.jpeg" },
    { id: 9, name: "Pazham Pori", price: 30.00, category: "Tea & Snacks", image: "images/pazhampori.jpeg" },
    { id: 11, name: "Shawarma Royale", price: 70.00, category: "Tea & Snacks", image: "images/shawarma01.jpg" },
    { id: 12, name: "Garden Veg Sandwich", price: 70.00, category: "Tea & Snacks", image: "images/vegsand.jpg" },
    { id: 13, name: "Grilled Chicken Sandwich", price: 90.00, category: "Tea & Snacks", image: "images/chisand.jpg" },
    { id: 14, name: "Classic Combo (Sandwich + Fries)", price: 140.00, category: "Tea & Snacks", image: "images/chisandcombo.jpg" },
    { id: 15, name: "Dark Espresso Truffle Cake", price: 99.00, category: "Pastries & Cakes", image: "images/chocolatecake.jpg" },
];

let cart = [];

// --- DOM Elements ---
const productsListEl = document.getElementById('products-list');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutMessageEl = document.getElementById('checkout-message');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderProducts();
    updateCartDisplay();
    initMagneticButtons();
    
    // Attach event listener to checkout button
    checkoutBtn.addEventListener('click', handleCheckout);
});

// 1. Navigation Scroll Behavior
function initNavigation() {
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// 2. Render Products with Animations
function renderProducts() {
    productsListEl.innerHTML = '';
    
    const categories = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {});

    for (const category in categories) {
        const categoryHtml = `
            <div class="category-block reveal-up">
                <h2 class="category-heading">${category}</h2>
                <div class="product-grid">
                    ${categories[category].map(product => `
                        <div class="product-card">
                            <div class="product-img-wrapper">
                                <img src="${product.image}" alt="${product.name}" class="product-image" 
                                    onerror="this.onerror=null; this.src='images/hero_espresso.png'">
                            </div>
                            <div class="product-info">
                                <div class="product-details">
                                    <h4 class="product-name">${product.name}</h4>
                                    <p class="product-price">₹${product.price.toFixed(2)}</p>
                                </div>
                                <button class="btn-add" onclick="addToCart(${product.id})">
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        productsListEl.insertAdjacentHTML('beforeend', categoryHtml);
    }

    // GSAP Staggered Reveal for Categories and Cards
    gsap.from('.category-block', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: productsListEl,
            start: 'top 95%'
        }
    });

    lucide.createIcons();
}

// 3. Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({ ...product, instanceId: Date.now() + Math.random() });
        updateCartDisplay();
        
        // Subtle feedback animation on cart
        gsap.fromTo('.cart-container', 
            { scale: 1 }, 
            { scale: 1.02, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
    }
}

function removeFromCart(instanceId) {
    cart = cart.filter(item => item.instanceId !== instanceId);
    updateCartDisplay();
}

function updateCartDisplay() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-msg">Your cart is empty. Start your journey.</p>';
        checkoutBtn.disabled = true;
    } else {
        const itemCounts = cart.reduce((acc, item) => {
            const existing = acc.find(i => i.id === item.id);
            if (existing) {
                existing.quantity++;
                existing.instanceIds.push(item.instanceId);
            } else {
                acc.push({ ...item, quantity: 1, instanceIds: [item.instanceId] });
            }
            return acc;
        }, []);
        
        itemCounts.forEach(item => {
            total += item.price * item.quantity;
            const itemHtml = `
                <div class="cart-item">
                    <span class="cart-item-name">${item.quantity} x ${item.name}</span>
                    <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.instanceIds[0]})" title="Remove one">
                        <i data-lucide="minus-circle" style="width: 1.2rem; height: 1.2rem;"></i>
                    </button>
                </div>
            `;
            cartItemsEl.insertAdjacentHTML('beforeend', itemHtml);
        });
        checkoutBtn.disabled = false;
    }

    cartTotalEl.textContent = `₹${total.toFixed(2)}`;
    lucide.createIcons();
}

function handleCheckout() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    checkoutMessageEl.textContent = `Order placed successfully! Total: ₹${total.toFixed(2)}.`;
    checkoutMessageEl.classList.remove('hidden');
    
    checkoutBtn.disabled = true;
    cart = [];
    updateCartDisplay();

    setTimeout(() => {
        checkoutMessageEl.classList.add('hidden');
    }, 5000);
}

// 4. Magnetic Interaction
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
    });
}