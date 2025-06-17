// Navigation functions
function startTheAnimation() {
    document.querySelector("body").classList.add("fade-in");
}

// Start animation after a short delay
setTimeout(startTheAnimation, 400);

function toggleMenu() {
    const hamburgerMenuContent = document.querySelector(".hamburger-menu-content");
    const btnCloseMenu = document.querySelector(".btn-close-menu");
    const body = document.querySelector("body");
    
    const isOpen = body.classList.contains("menu-is-open");
    
    if (isOpen) {
        hamburgerMenuContent.classList.remove("visible");
        btnCloseMenu.classList.remove("visible");
        body.classList.remove("menu-is-open");
    } else {
        hamburgerMenuContent.classList.add("visible");
        btnCloseMenu.classList.add("visible");
        body.classList.add("menu-is-open");
    }
}

// Add event listeners for menu toggle
const hamburgerMenuBtn = document.querySelector(".btn-hamburger-menu:not(.btn-close-menu)");
const closeMenuBtn = document.querySelector(".btn-close-menu");

if (hamburgerMenuBtn) {
    hamburgerMenuBtn.addEventListener("click", toggleMenu);
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", toggleMenu);
}

// Close menu when clicking outside
const hamburgerMenuContent = document.querySelector(".hamburger-menu-content");
if (hamburgerMenuContent) {
    document.addEventListener("click", (e) => {
        if (!hamburgerMenuContent.contains(e.target) && !hamburgerMenuBtn.contains(e.target)) {
            const isOpen = document.body.classList.contains("menu-is-open");
            if (isOpen) {
                toggleMenu();
            }
        }
    });
}
