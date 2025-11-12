// intranet.js de YoHerman (con recordatorio de sesión)

// Referencias de los DOM-
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const loginSection = document.getElementById("login-section");
const dataSection = document.getElementById("data-section");
const logoutBtn = document.getElementById("logout-btn");

// Evento para que al cargar si hay sesión, entrar directo; si no, mostrar login.
document.addEventListener("DOMContentLoaded", () => {
  const isAuth = sessionStorage.getItem("intranet-auth") === "1";

  if (isAuth) {
    loginSection?.classList.add("hidden");
    dataSection?.classList.remove("hidden");
    loadEmpreses();
  } else {
    loginSection?.classList.remove("hidden");
    dataSection?.classList.add("hidden");
  }
});

// Login y validación
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const validUser = /^[a-zA-Z0-9._%+-]+@montsia30\.net$/;
  const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!validUser.test(username)) {
    errorMsg.textContent = "L'usuari ha de ser un correu @montsia30.net";
    return;
  }
  if (!validPassword.test(password)) {
    errorMsg.textContent =
      "La contrasenya ha de tenir 8 caràcters, majúscules, minúscules i números.";
    return;
  }

  // Si está bien, guardar sesión de la pestaña y mostrar intranet.
  sessionStorage.setItem("intranet-auth", "1");
  errorMsg.textContent = "";

  loginSection.classList.add("hidden");
  dataSection.classList.remove("hidden");
  loadEmpreses();
});

// Botón para logout:
logoutBtn?.addEventListener("click", () => {
  sessionStorage.removeItem("intranet-auth");
  // Limpiar vista
  dataSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  // Limpia datos renderizados
  const c = document.getElementById("empreses-container");
  if (c) c.innerHTML = "";
  // Limpiar campos del login
  form.reset();
});

// Una vez autorizado se pude mostrar el XML:
function loadEmpreses() {
  const url = "../xml/empreses.xml";
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("No s'ha pogut carregar l'XML");
      return res.text();
    })
    .then((str) => {
      const xml = new DOMParser().parseFromString(str, "text/xml");
      if (xml.getElementsByTagName("parsererror").length) {
        throw new Error("XML mal format");
      }
      renderEmpreses(xml);
    })
    .catch((err) => {
      console.error("Error carregant XML:", err);
      const c = document.getElementById("empreses-container");
      if (c)
        c.innerHTML =
          "<p style='color:red'>No s'han pogut carregar les empreses.</p>";
    });
}

// Render: targetes d'empreses amb imatge i zoom
function renderEmpreses(xml) {
  const container = document.getElementById("empreses-container");
  if (!container) return;

  const overlay = document.getElementById("img-overlay");
  const overlayImg = overlay?.querySelector("img");

  const empreses = xml.getElementsByTagName("empresa");
  for (let i = 0; i < empreses.length; i++) {
    const e = empreses[i];
    const get = (tag) =>
      (e.getElementsByTagName(tag)[0]?.textContent || "").trim();

    const nom = get("nom");
    const municipi = get("municipi");
    const sector = get("sector");
    const imatge = get("imatge");

    const card = document.createElement("div");
    card.className = "empresa-card";
    card.innerHTML = `
      <div class="empresa-header">
        ${
          imatge
            ? `<img class="empresa-thumb" loading="lazy" src="${imatge}" alt="Imatge de ${nom}" />`
            : ""
        }
        <h3>${nom}</h3>
      </div>
      <div class="empresa-detalls">
        <p><strong>Municipi:</strong> ${municipi}</p>
        <p><strong>Sector:</strong> ${sector}</p>
        <a href="https://ccam.gencat.cat/ca/serveis/autodiagnosi/" target="_blank" rel="noopener noreferrer">
          Fer diagnosi d'aquesta empresa.
        </a>
      </div>
    `;

    const detalls = card.querySelector(".empresa-detalls");
    card.addEventListener("click", (ev) => {
      if (ev.target.classList.contains("empresa-thumb")) return;
      detalls.classList.toggle("show");
    });

    if (imatge && overlay && overlayImg) {
      const thumb = card.querySelector(".empresa-thumb");
      thumb.addEventListener("click", (ev) => {
        ev.stopPropagation();
        overlayImg.src = imatge;
        overlay.classList.add("show");
        overlay.setAttribute("aria-hidden", "false");
      });
    }

    container.appendChild(card);
  }

  if (overlay && overlayImg) {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      overlayImg.src = "";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("show")) {
        overlay.click();
      }
    });
  }
}