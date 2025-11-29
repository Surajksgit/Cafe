// Initialize Lucide Icons on document load
document.addEventListener('DOMContentLoaded', () => {
    // Check if lucide object is available
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Attach event listeners after DOM is loaded
    setupMobileMenu();
});

// Function to handle the Mobile Menu Toggle logic for the new full-screen design
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    
    // Exit if essential elements aren't found
    if (!mobileMenuBtn || !closeMenuBtn || !mobileMenu) return; 

    // --- Helper Functions ---
    
    // Function to open the menu
    const openMenu = () => {
        mobileMenu.classList.remove('closed');
        // Prevent scrolling on the body when the menu is open (better UX for overlays)
        document.body.style.overflow = 'hidden'; 
    };

    // Function to close the menu
    const closeMenu = () => {
        mobileMenu.classList.add('closed');
        // Restore scrolling on the body
        document.body.style.overflow = ''; 
    };

    // --- Event Listeners ---

    // 1. Open Menu Button
    mobileMenuBtn.addEventListener('click', openMenu);

    // 2. Close Menu Button (The 'X' icon inside the menu)
    closeMenuBtn.addEventListener('click', closeMenu);

    // 3. Close menu when a navigation link is clicked
    // This handles both the regular links and the 'Order Online' button within the mobile menu
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
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