class LuxeCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoPlay();
        this.initCollectionsCarousel();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelector('.prev-button').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next-button').addEventListener('click', () => this.nextSlide());

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Pause auto-play on hover
        document.querySelector('.hero-carousel').addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        document.querySelector('.hero-carousel').addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    goToSlide(index) {
        // Remove active classes
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active classes
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    initCollectionsCarousel() {
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.collection-prev');
        const nextBtn = document.querySelector('.collection-next');
        const cards = document.querySelectorAll('.collection-card');
        const cardWidth = cards[0].offsetWidth + 32; // width + gap

        let currentPosition = 0;

        const updateButtonState = () => {
            prevBtn.style.opacity = currentPosition < 0 ? '1' : '0.5';
            nextBtn.style.opacity = currentPosition > -(cardWidth * (cards.length - 3)) ? '1' : '0.5';
        };

        prevBtn.addEventListener('click', () => {
            if (currentPosition < 0) {
                currentPosition += cardWidth;
                track.style.transform = `translateX(${currentPosition}px)`;
                updateButtonState();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPosition > -(cardWidth * (cards.length - 3))) {
                currentPosition -= cardWidth;
                track.style.transform = `translateX(${currentPosition}px)`;
                updateButtonState();
            }
        });

        updateButtonState();

        // Handle window resize
        window.addEventListener('resize', () => {
            const newCardWidth = cards[0].offsetWidth + 32;
            currentPosition = currentPosition * (newCardWidth / cardWidth);
            track.style.transform = `translateX(${currentPosition}px)`;
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.collection-card, .prestige-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize carousel
    new LuxeCarousel();
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Enhanced cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'luxe-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .collection-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
});

// Add custom cursor styles
const style = document.createElement('style');
style.textContent = `
    .luxe-cursor {
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--color-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.2s ease;
        mix-blend-mode: difference;
    }
    
    .cursor-hover {
        transform: scale(2);
        background: var(--color-charcoal);
    }
    
    @media (max-width: 768px) {
        .luxe-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(style);