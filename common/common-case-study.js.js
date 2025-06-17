window.onload = function () {
  // Hide the loader after all images are loaded
  const loader = document.querySelector(".loader");
  loader.style.display = "none";

  // 1. grab the element
  const myEl = document.querySelector(".images-wrapper");
  // 2. change its class
  myEl.classList.add("fade-in");
};
