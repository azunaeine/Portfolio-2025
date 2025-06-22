function startTheAnimation() {
  document.querySelector("body").classList.add("fade-in");
}

setTimeout(startTheAnimation, 0.4 * 1000);

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
