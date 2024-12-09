function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());
    
    // Send email using a backend service
    // For now, log the form data
    console.log('Form submitted:', formObject);
    
    // Email would be sent to: kourneymarshall79@gmail.com
    
    alert('Thank you! We will contact you shortly.');
    this.reset();
});

// Add parallax effect to animated background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    document.querySelector('.animated-bg').style.transform = 
        `translateY(${scrolled * 0.5}px)`;
});