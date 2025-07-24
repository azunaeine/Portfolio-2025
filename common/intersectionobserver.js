document.addEventListener("DOMContentLoaded", () => {
  // Options for the Intersection Observer
  const options = {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // If the element is in the viewport
      if (entry.isIntersecting) {
        // Add the class
        entry.target.classList.add("within-viewport");

        // Optional: Unobserve the element after it's been seen
        // observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all elements with the 'observe-me' class
  const elements = document.querySelectorAll("section");
  elements.forEach((element) => {
    observer.observe(element);
  });
});
