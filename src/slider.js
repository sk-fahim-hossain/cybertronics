document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
  
    // Update the slider position
    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  
    // Go to the previous slide
    prevBtn.addEventListener('click', function() {
      currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
      updateSlider();
    });
  
    // Go to the next slide
    nextBtn.addEventListener('click', function() {
      currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
      updateSlider();
    });
  
    // Optional: Auto-slide every 3 seconds
    setInterval(function() {
      nextBtn.click();
    }, 3000);
  });
  