// navbar.js – Funcionalidad del menú desplegable en el navbar global

document.addEventListener("DOMContentLoaded", () => {
  // Funcionalidad del menú desplegable en global-nav
  const globalNavMenuToggle = document.querySelector(".global-nav__menu .menu-toggle");

  if (globalNavMenuToggle) {
    globalNavMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = globalNavMenuToggle.closest(".global-nav__menu");
      menu?.classList.toggle("open");

      // Actualizar aria-expanded
      const isOpen = menu?.classList.contains("open");
      globalNavMenuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".global-nav__menu")) {
        const menu = document.querySelector(".global-nav__menu");
        menu?.classList.remove("open");
        globalNavMenuToggle?.setAttribute("aria-expanded", "false");
      }
    });
  }
});
