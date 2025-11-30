
        // --- Core Data and State ---
        const products = [
            // Prices updated for Indian Rupee (₹)
            { id: 1, name: "Cardamom Latte", price: 130.00, category: "Coffee", image: "images/cardamom.jpg" },
            { id: 2, name: "Cappuccino", price: 99.00, category: "Coffee", image: "images/coffee.png" },
            { id: 3, name: "Classic Espresso", price: 130.00, category: "Coffee", image: "images/espresso10.png" },
            { id: 4, name: "Normal Chai", price: 20.00, category: "Tea & Snaks", image: "images/normal chai.jpg" },
            { id: 5, name: "Croissant (1pc)", price: 150.00, category: "Pastries & Cakes", image: "images/croissant.jpg" },
            { id: 6, name: "Danish (1pc)", price: 120.00, category: "Pastries & Cakes", image: "images/danish.jpg" },
            { id: 7, name: "Americano", price: 90.00, category: "Coffee", image: "images/americano.jpg" },
            { id: 8, name: "Blue berry Cake (1pc)", price: 89.00, category: "Pastries & Cakes", image: "images/blueberry.jpeg" },
            { id: 10, name: "strawberry Cake (1pc)", price: 99.00, category: "Pastries & Cakes", image: "images/strawberry.jpeg" },
            { id: 9, name: "Pazham pori", price: 30.00, category: "Tea & Snaks", image: "images/pazhampori.jpeg" },
            { id: 11, name: "Shawarma wrap", price: 70.00, category: "Tea & Snaks", image: "images/shawarma01.jpg" },
            { id: 12, name: "Veg Sandwich", price: 70.00, category: "Tea & Snaks", image: "images/vegsand.jpg" },
            { id: 13, name: "Chicken Sandwich", price: 90.00, category: "Tea & Snaks", image: "images/chisand.jpg" },
            { id: 14, name: "Chicken Sandwich & Fries(100g) Combo", price: 140.00, category: "Tea & Snaks", image: "images/chisandcombo.jpg" },
            { id: 15, name: "Chocolate Cake (1pc)", price: 99.00, category: "Pastries & Cakes", image: "images/chocolatecake.jpg" },
        ];

        let cart = [];

        // --- DOM Elements ---
        const productsListEl = document.getElementById('products-list');
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutMessageEl = document.getElementById('checkout-message');

        // --- Functions ---

        /**
         * Groups products by category and renders the menu to the DOM.
         */
        function renderProducts() {
            productsListEl.innerHTML = '';
            
            // Grouping products
            const categories = products.reduce((acc, product) => {
                if (!acc[product.category]) {
                    acc[product.category] = [];
                }
                acc[product.category].push(product);
                return acc;
            }, {});

            // Rendering categories and products
            for (const category in categories) {
                const categoryHtml = `
                    <h2 class="category-heading">${category}</h2>
                    <div class="product-grid">
                        ${categories[category].map(product => `
                            <div class="product-card">
                                <img src="${product.image}" alt="${product.name}" class="product-image" 
                                    onerror="this.onerror=null; this.src='https://placehold.co/400x200/262626/A8715A?text=${product.name.replace(/\s/g, '+')}'">
                                <div class="product-info">
                                    <div>
                                        <div class="product-name">${product.name}</div>
                                        <div class="product-price">₹${product.price.toFixed(2)}</div>
                                    </div>
                                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                productsListEl.insertAdjacentHTML('beforeend', categoryHtml);
            }
            // Initialize Lucide icons on the new content
            lucide.createIcons();
        }

        /**
         * Adds a product to the cart.
         * @param {number} productId 
         */
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                // Add product to cart with a unique instance ID for removal
                cart.push({ ...product, instanceId: Date.now() + Math.random() });
                updateCartDisplay();
            }
        }

        /**
         * Removes a product instance from the cart.
         * @param {number} instanceId 
         */
        function removeFromCart(instanceId) {
            const initialLength = cart.length;
            cart = cart.filter(item => item.instanceId !== instanceId);
            if (cart.length < initialLength) {
                updateCartDisplay();
            }
        }

        /**
         * Updates the cart display panel and total calculation.
         */
        function updateCartDisplay() {
            cartItemsEl.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsEl.innerHTML = '<p class="text-gray-400 text-sm p-2 text-center">Your cart is currently empty. Add some spice!</p>';
                checkoutBtn.disabled = true;
            } else {
                // Group items for display (optional: for showing quantities, but removing is by instance)
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

                    // Display unique cart items with quantity and a single button to remove one instance
                    const itemHtml = `
                        <div class="cart-item">
                            <span class="cart-item-name">${item.quantity} x ${item.name}</span>
                            <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="remove-item-btn" onclick="removeFromCart(${item.instanceIds[0]})" title="Remove one ${item.name}">
                                <i data-lucide="minus" style="width: 1rem; height: 1rem;"></i>
                            </button>
                        </div>
                    `;
                    cartItemsEl.insertAdjacentHTML('beforeend', itemHtml);
                });
                
                checkoutBtn.disabled = false;
            }

            cartTotalEl.textContent = `₹${total.toFixed(2)}`;
            // Re-initialize Lucide icons for cart items (specifically the minus icon)
            lucide.createIcons();
        }

        /**
         * Handles the checkout process.
         */
        function handleCheckout() {
            if (cart.length === 0) {
                return;
            }

            const total = cart.reduce((sum, item) => sum + item.price, 0);

            // Display success message
            checkoutMessageEl.textContent = `Order placed successfully! Total: ₹${total.toFixed(2)}. Thank you for choosing Spice Route Café!`;
            checkoutMessageEl.classList.remove('hidden');
            
            // Disable button and clear cart
            checkoutBtn.disabled = true;
            cart = [];
            updateCartDisplay();

            // Hide message after a few seconds
            setTimeout(() => {
                checkoutMessageEl.classList.add('hidden');
            }, 5000);
        }

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartDisplay();
            
            // Attach event listener to checkout button
            checkoutBtn.addEventListener('click', handleCheckout);
        });
        
   