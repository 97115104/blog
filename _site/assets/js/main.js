// Simple script to handle basic interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Add active class to current nav item
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        link.getAttribute('href') === currentPath.replace(/\/$/, "")) {
      link.classList.add('active');
    }
  });
});