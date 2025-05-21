document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }
  
  // Auto-dismiss alerts
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.add('fade-out');
      setTimeout(() => {
        alert.remove();
      }, 500);
    }, 5000);
  });
  
  // Close alert on click
  const closeButtons = document.querySelectorAll('.btn-close');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const alert = this.parentElement;
      alert.classList.add('fade-out');
      setTimeout(() => {
        alert.remove();
      }, 500);
    });
  });
  
  // Listing sort functionality
  const sortSelect = document.querySelector('.sort-select');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('sort', this.value);
      window.location.href = currentUrl.toString();
    });
    
    // Set selected option based on URL
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');
    
    if (sortParam) {
      sortSelect.value = sortParam;
    }
  }
  
  // Confirmation for delete actions
  const deleteForms = document.querySelectorAll('.delete-form');
  
  deleteForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        e.preventDefault();
      }
    });
  });
  
  // Language selector functionality
  const languageLinks = document.querySelectorAll('.language-dropdown a');
  
  languageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      document.documentElement.lang = lang;
      document.querySelector('.language-btn').innerHTML = lang === 'ar' ? 
        '<i class="fas fa-globe"></i> العربية' : 
        '<i class="fas fa-globe"></i> English';
      
      // Here you would implement the actual language switch
      // This is just a placeholder for demonstration
      alert(`Language would change to ${lang === 'ar' ? 'Arabic' : 'English'}`);
    });
  });
});