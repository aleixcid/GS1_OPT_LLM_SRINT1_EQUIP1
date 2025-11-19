document.addEventListener('DOMContentLoaded', () => {

    const boxes = document.querySelectorAll('.box'); // Busca tots el elements que tinguin la classe box
    boxes.forEach(box => { /*Per cada box que ha trobat afeigeix un escoltado que quan el usuari aprete entra 
        al enllaç guardat que esta en data-link*/
        box.addEventListener('click', () => {
            const destination = box.dataset.link;
            box.classList.add('clicked');
            setTimeout(() => {
                window.location.href = destination;
            }, 300); // AIxò es un timeout que es de 300 mil·lisegons
        });
    });

});