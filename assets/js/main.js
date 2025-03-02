document.addEventListener('DOMContentLoaded', function() {
    // Paper filtering functionality
    const paperFilterButtons = document.querySelectorAll('#papers-section .filter-btn');
    const paperItems = document.querySelectorAll('.paper-item');
    
    paperFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            paperFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide papers based on filter
            paperItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-year') === filterValue) {
                    item.style.display = 'flex';  // Use flex instead of block
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Combined feed filtering functionality
    const feedFilterButtons = document.querySelectorAll('.feed-filters .filter-btn');
    const feedItems = document.querySelectorAll('.feed-item');
    
    feedFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            feedFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide feed items based on filter
            feedItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-type') === filterValue) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Section navigation and filter selection
    const sectionLinks = document.querySelectorAll('.section-link');
    
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the section
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Get the filter value
                const filterValue = this.getAttribute('data-filter');
                
                // If there's a filter value, activate the corresponding filter button
                if (filterValue) {
                    // For papers section
                    if (targetId === '#papers-section' && filterValue === 'paper') {
                        const allPapersBtn = document.querySelector('#papers-section .filter-btn[data-filter="all"]');
                        if (allPapersBtn) {
                            allPapersBtn.click();
                        }
                    }
                    
                    // For the feed section, activate the corresponding filter
                    const feedFilterBtn = document.querySelector('.feed-filters .filter-btn[data-filter="' + filterValue + '"]');
                    if (feedFilterBtn) {
                        feedFilterBtn.click();
                    }
                }
            }
        });
    });
    
    // Smooth scrolling for other anchor links
    document.querySelectorAll('a[href^="#"]:not(.section-link)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});