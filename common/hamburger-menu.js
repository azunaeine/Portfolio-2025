function showMenu() {
  const hamburgerMenuContent = document.querySelector(
    ".hamburger-menu-content"
  );
  hamburgerMenuContent.classList.add("visible");

  const btnCloseMenu = document.querySelector(".btn-close-menu");
  btnCloseMenu.classList.add("visible");

  const body = document.querySelector("body");
  body.classList.add("menu-is-open");
}

function hideMenu() {
  const hamburgerMenuContent = document.querySelector(
    ".hamburger-menu-content"
  );
  hamburgerMenuContent.classList.remove("visible");

  const btnCloseMenu = document.querySelector(".btn-close-menu");
  btnCloseMenu.classList.remove("visible");

  const body = document.querySelector("body");
  body.classList.remove("menu-is-open");
}

console.log("hell!!!!o");

// Close menu when clicking outside
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerMenu = document.querySelector(".hamburger-menu-content");
  document.addEventListener("click", (e) => {
    const isClickInside = hamburgerMenu.contains(e.target);
    const isHamburgerButton = e.target.closest(".btn-hamburger-menu");

    if (
      !isClickInside &&
      !isHamburgerButton &&
      hamburgerMenu.classList.contains("visible")
    ) {
      hideMenu();
    }
  });

  // Theme toggle
  const toggleContainers = document.querySelectorAll(".theme-toggle-container");
  toggleContainers.forEach((container) => {
    fetch("../darktoggle.html")
      .then((response) => response.text())
      .then((html) => {
        container.innerHTML = html;
      })
      .catch((error) => {
        console.error("Error loading dark toggle:", error);
      });
  });
});
