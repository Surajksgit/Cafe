
        // --- Core Data and State ---
        const products = [
            { id: 1, name: "Cardamom Latte", price: 5.50, category: "Coffee", image: "https://placehold.co/400x200/A8715A/FFFFFF?text=Cardamom+Latte" },
            { id: 2, name: "Turmeric Gold Milk", price: 4.75, category: "Coffee", image: "https://placehold.co/400x200/FAE1C0/262626?text=Turmeric+Milk" },
            { id: 3, name: "Classic Espresso Shot", price: 3.00, category: "Coffee", image: "https://placehold.co/400x200/262626/A8715A?text=Espresso" },
            { id: 4, name: "Iced Masala Chai", price: 4.50, category: "Tea & Spices", image: "https://placehold.co/400x200/A8715A/FFFFFF?text=Iced+Chai" },
            { id: 5, name: "Saffron Pistachio Croissant", price: 3.50, category: "Pastries & Snacks", image: "https://placehold.co/400x200/FAE1C0/262626?text=Croissant" },
            { id: 6, name: "Date & Fig Danish", price: 4.00, category: "Pastries & Snacks", image: "https://placehold.co/400x200/262626/FAE1C0?text=Danish" },
            { id: 7, name: "Single Origin Brew (Kenya)", price: 4.25, category: "Coffee", image: "https://placehold.co/400x200/A8715A/FFFFFF?text=Single+Origin" },
            { id: 8, name: "Ginger Snap Cookie", price: 2.50, category: "Pastries & Snacks", image: "https://placehold.co/400x200/FAE1C0/262626?text=Cookie" },
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
                                        <div class="product-price">$${product.price.toFixed(2)}</div>
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
                            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="remove-item-btn" onclick="removeFromCart(${item.instanceIds[0]})" title="Remove one ${item.name}">
                                <i data-lucide="minus" style="width: 1rem; height: 1rem;"></i>
                            </button>
                        </div>
                    `;
                    cartItemsEl.insertAdjacentHTML('beforeend', itemHtml);
                });
                
                checkoutBtn.disabled = false;
            }

            cartTotalEl.textContent = `$${total.toFixed(2)}`;
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
            checkoutMessageEl.textContent = `Order placed successfully! Total: $${total.toFixed(2)}. Thank you for choosing Spice Route Café!`;
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
        
    