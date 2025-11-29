// Initialize Lucide Icons on document load
document.addEventListener('DOMContentLoaded', () => {
    // Check if lucide object is available
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Attach event listeners after DOM is loaded
    setupMobileMenu();
});

// Function to handle the Mobile Menu Toggle logic
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return; // Exit if elements aren't found

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden-mobile-menu');
        
        // Toggle icon for better UX
        const icon = mobileMenuBtn.querySelector('.mobile-menu-icon');
        if (icon) {
            if (mobileMenu.classList.contains('hidden-mobile-menu')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
             // Re-render icon if lucide is available
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons(); 
            }
        }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden-mobile-menu');
            const icon = mobileMenuBtn.querySelector('.mobile-menu-icon');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                // Re-render icon if lucide is available
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            }
        });
    });
}


/**
 * 2. Simulated Form Submission for Newsletter
 * @param {Event} event - The form submission event.
 */
function handleNewsletterSignup(event) {
    event.preventDefault(); // Stop the form from submitting normally
    
    const messageBox = document.getElementById('newsletter-message');
    const emailInput = event.target.querySelector('input[type="email"]');

    if (!messageBox || !emailInput) return;

    // Show success message
    messageBox.textContent = 'Subscribed! Check your inbox for confirmation.';
    messageBox.classList.remove('hidden');
    
    // Clear input and hide message after a few seconds
    setTimeout(() => {
        emailInput.value = '';
        messageBox.classList.add('hidden');
    }, 4000); 
}