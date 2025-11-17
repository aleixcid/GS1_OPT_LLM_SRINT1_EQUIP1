let actual = 0;
const slides = document.querySelectorAll(".slide");
const total = slides.length;

document.getElementById("nextBtn").addEventListener("click", () => {
  canviaSlide(1);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  canviaSlide(-1);
});

function canviaSlide(direccio) {
  slides[actual].classList.remove("active");

  actual = (actual + direccio + total) % total;

  slides[actual].classList.add("active");
}
