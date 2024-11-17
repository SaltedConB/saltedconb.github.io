window.filterPortfolio = function(category) {
    const items = document.querySelectorAll('.portfolio-item');
    
    items.forEach(item => {
        const shouldShow = category === 'all' || item.classList.contains(category);
        
        item.style.transition = 'all 0.5s ease-out';
        
        if (shouldShow) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 500);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.overlay');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    document.querySelector('.portfolio-grid').addEventListener('click', function(e) {
        const portfolioItem = e.target.closest('.portfolio-item');
        if (portfolioItem) {
            const itemId = portfolioItem.getAttribute('data-id');
            const modal = document.getElementById(`modal-${itemId}`);
            if (modal) {
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.style.opacity = '1';
                }, 10);
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 250);
            }
        }
    });
});