let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const totalSlides = slides.length;

// Títulos de las diapositivas para los breadcrumbs
const slideTitles = [
    "La missatgeria instantània",
    "Com et pot ajudar a vendre",
    "WhatsApp professional",
    "Exemple pràctic"
];

// Función para actualizar los breadcrumbs
function updateBreadcrumbs(slideIndex) {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;

    // Limpiar breadcrumbs y reconstruir
    breadcrumbs.innerHTML = '';

    // Añadir "Inici"
    const iniciItem = document.createElement('li');
    const iniciLink = document.createElement('a');
    iniciLink.href = '../index.html';
    iniciLink.textContent = 'Inici';
    iniciItem.appendChild(iniciLink);
    breadcrumbs.appendChild(iniciItem);

    // Añadir "Digitalització"
    const digitalitzacioItem = document.createElement('li');
    const digitalitzacioLink = document.createElement('a');
    digitalitzacioLink.href = '../pages/digitalitzacio.html';
    digitalitzacioLink.textContent = 'Digitalització';
    digitalitzacioItem.appendChild(digitalitzacioLink);
    breadcrumbs.appendChild(digitalitzacioItem);

    // Añadir la diapositiva actual
    if (slideIndex >= 0 && slideIndex < slideTitles.length) {
        const currentItem = document.createElement('li');
        currentItem.setAttribute('aria-current', 'page');
        currentItem.textContent = slideTitles[slideIndex];
        breadcrumbs.appendChild(currentItem);
    }
}

// Funció per simular el clic del vídeo a la diapositiva 3 (evitem alert() i confirm())
function simulateVideoClick() {
    const videoBox = document.querySelector('#slide-2 .right-col-3 > .image-box');

    // Creem un missatge temporal
    const message = document.createElement('div');
    message.textContent = "S'obriria el videotutorial en una finestra nova o es reproduiria aquí!";
    message.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #333;
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 100;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                opacity: 0;
                transition: opacity 0.5s;
                font-size: 1rem;
            `;
    videoBox.style.position = 'relative'; // Assegurar que el missatge es posi correctament


    videoBox.appendChild(message);

    // Mostrar missatge
    setTimeout(() => {
        message.style.opacity = 1;
    }, 10);

    // Amagar i eliminar missatge
    setTimeout(() => {
        message.style.opacity = 0;
        setTimeout(() => {
            if (videoBox.contains(message)) {
                videoBox.removeChild(message);
            }
        }, 500);
    }, 2500);
}


function showSlide(index) {
    if (index < 0 || index >= totalSlides) {
        return;
    }


    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');


    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === totalSlides - 1);

    currentSlide = index;

    // Actualizar breadcrumbs
    updateBreadcrumbs(index);
}


function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}


function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// Mostrar la primera diapositiva en carregar y actualizar breadcrumbs
document.addEventListener("DOMContentLoaded", () => {
    showSlide(0);
});
