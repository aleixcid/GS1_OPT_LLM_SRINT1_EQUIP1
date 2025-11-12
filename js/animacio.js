document.addEventListener('DOMContentLoaded', () => {

    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', () => {
            const destination = box.dataset.link;
            box.classList.add('clicked');
            setTimeout(() => {
                window.location.href = destination;
            }, 300); 
        });
    });

});