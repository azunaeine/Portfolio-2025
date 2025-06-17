document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    let currentIndex = 0;
    const totalItems = items.length;

    // Add indicators
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    items.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    carousel.appendChild(indicators);

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update indicators
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    // Auto-advance every 5 seconds
    let autoAdvance = setInterval(() => {
        nextButton.click();
    }, 5000);

    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoAdvance);
    });

    carousel.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => {
            nextButton.click();
        }, 5000);
    });
});
