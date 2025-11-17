// intranet.js – Login + sessió, filtre lateral, càrrega XML i targetes

// Referencias
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const loginSection = document.getElementById("login-section");
const dataSection = document.getElementById("data-section");
const logoutBtn = document.getElementById("logout-btn");

// Filtros
const qInput = document.getElementById("search");
const fSelect = document.getElementById("filter-llista");
const oSelect = document.getElementById("ordre");
const clearBtn = document.getElementById("clear-filters");

// Cache en memoria
let EMPRESES = [];

// Mostrar login o contenido según sesión
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

// Login
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

  sessionStorage.setItem("intranet-auth", "1");
  errorMsg.textContent = "";

  loginSection.classList.add("hidden");
  dataSection.classList.remove("hidden");
  loadEmpreses();
});

// Logout
logoutBtn?.addEventListener("click", () => {
  sessionStorage.removeItem("intranet-auth");
  dataSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  const c = document.getElementById("empreses-container");
  if (c) c.innerHTML = "";
  form.reset();
});

// Cargar XML
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
      EMPRESES = xmlToArray(xml);
      setupFilters();
    })
    .catch((err) => {
      console.error("Error carregant XML:", err);
      const c = document.getElementById("empreses-container");
      if (c)
        c.innerHTML =
          "<p style='color:red'>No s'han pogut carregar les empreses.</p>";
    });
}

function xmlToArray(xml) {
  const list = [];
  const nodes = xml.getElementsByTagName("empresa");
  for (let i = 0; i < nodes.length; i++) {
    const e = nodes[i];
    const get = (tag) => e.getElementsByTagName(tag)[0]?.textContent?.trim() || "";

    const digi = e.getElementsByTagName("digitalitzacio")[0];
    const soste = e.getElementsByTagName("sostenibilitat")[0];

    list.push({
      id: e.getAttribute("id") || "",
      nom: get("nom"),
      municipi: get("municipi"),
      sector: get("sector"),
      email: get("email"),
      telefon: get("telefon"),
      web: get("web"),
      imatge: get("imatge"),
      digi: digi
        ? {
            estat: digi.getAttribute("estat") || "pendent",
            resultat:
              digi.getElementsByTagName("resultat")[0]?.textContent || "",
            ref:
              digi.getElementsByTagName("respostes")[0]?.getAttribute("ref") ||
              "",
          }
        : null,
      soste: soste
        ? {
            estat: soste.getAttribute("estat") || "pendent",
            resultat:
              soste.getElementsByTagName("resultat")[0]?.textContent || "",
            ref:
              soste.getElementsByTagName("respostes")[0]?.getAttribute("ref") ||
              "",
          }
        : null,
    });
  }
  return list;
}

/* Sidebar: filtros y orden */
function setupFilters() {
  const trigger = () =>
    renderEmpreses({
      query: qInput?.value.trim().toLowerCase() || "",
      filter: fSelect?.value || "totes",
      order: oSelect?.value || "nom",
    });

  qInput?.addEventListener("input", trigger);
  fSelect?.addEventListener("change", trigger);
  oSelect?.addEventListener("change", trigger);
  clearBtn?.addEventListener("click", () => {
    if (qInput) qInput.value = "";
    if (fSelect) fSelect.value = "totes";
    if (oSelect) oSelect.value = "nom";
    trigger();
  });

  // primer pintado
  trigger();
}

function applyFilters(data, { query = "", filter = "totes", order = "nom" } = {}) {
  let out = [...data];

  if (query) {
    out = out.filter(
      (e) =>
        e.nom.toLowerCase().includes(query) ||
        e.municipi.toLowerCase().includes(query)
    );
  }

  switch (filter) {
    case "digi-fin":
      out = out.filter((e) => e.digi?.estat === "finalitzada");
      break;
    case "digi-pend":
      out = out.filter((e) => e.digi?.estat !== "finalitzada");
      break;
    case "soste-fin":
      out = out.filter((e) => e.soste?.estat === "finalitzada");
      break;
    case "soste-pend":
      out = out.filter((e) => e.soste?.estat !== "finalitzada");
      break;
    default:
      break;
  }

  if (["nom", "municipi", "sector"].includes(order)) {
    out.sort((a, b) => (a[order] || "").localeCompare(b[order] || "", "ca"));
  }

  return out;
}

/* Render de tarjetas con overlay único */
function renderEmpreses(opts = {}) {
  const container = document.getElementById("empreses-container");
  if (!container) return;

  container.innerHTML = "";

  const data = applyFilters(EMPRESES, opts);

  // Overlay único
  const overlay = document.getElementById("img-overlay");
  const overlayImg = overlay?.querySelector("img");

  for (const e of data) {
    const card = document.createElement("div");
    card.className = "empresa-card";
    card.innerHTML = `
      <div class="empresa-header">
        ${
          e.imatge
            ? `<img class="empresa-thumb" loading="lazy" src="${e.imatge}" alt="Imatge de ${e.nom}" />`
            : ""
        }
        <h3>${e.nom}</h3>
      </div>
      <div class="empresa-detalls">
        <p><strong>Municipi:</strong> ${e.municipi || ""}</p>
        <p><strong>Sector:</strong> ${e.sector || ""}</p>
        ${
          e.email
            ? `<p><strong>Email:</strong> <a href="mailto:${e.email}">${e.email}</a></p>`
            : ""
        }
        ${e.telefon ? `<p><strong>Telèfon:</strong> ${e.telefon}</p>` : ""}
        ${
          e.web
            ? `<p><strong>Web:</strong> <a href="${e.web}" target="_blank" rel="noopener">${e.web}</a></p>`
            : ""
        }

        ${
          e.digi || e.soste
            ? `
          <div class="enquesta-block">
            ${
              e.digi
                ? `
              <h4>Digitalització</h4>
              <p>Estat: <strong>${e.digi.estat || "pendent"}</strong>
              ${e.digi.resultat ? ` · Resultat: ${e.digi.resultat}%` : ""}</p>
              ${
                e.digi.ref
                  ? `<a class="button" href="${e.digi.ref}" target="_blank">Veure respostes</a>`
                  : `<a class="button" href="https://ccam.gencat.cat/ca/serveis/autodiagnosi/" target="_blank">Fer enquesta</a>`
              }
            `
                : ""
            }
            ${
              e.soste
                ? `
              <h4>Sostenibilitat</h4>
              <p>Estat: <strong>${e.soste.estat || "pendent"}</strong>
              ${e.soste.resultat ? ` · Resultat: ${e.soste.resultat}%` : ""}</p>
              ${
                e.soste.ref
                  ? `<a class="button" href="${e.soste.ref}" target="_blank">Veure respostes</a>`
                  : `<a class="button" href="#" onclick="alert('Formulari de sostenibilitat pendent d’integrar');return false;">Fer enquesta</a>`
              }
            `
                : ""
            }
          </div>
        `
            : ""
        }
      </div>
    `;

    // Toggle de detalles
    const detalls = card.querySelector(".empresa-detalls");
    card.addEventListener("click", (ev) => {
      if (ev.target.classList.contains("empresa-thumb")) return;
      detalls.classList.toggle("show");
    });

    // Zoom imagen
    if (e.imatge && overlay && overlayImg) {
      const thumb = card.querySelector(".empresa-thumb");
      thumb.addEventListener("click", (ev) => {
        ev.stopPropagation();
        overlayImg.src = e.imatge;
        overlay.classList.add("show");
        overlay.setAttribute("aria-hidden", "false");
      });
    }

    container.appendChild(card);
  }

  // Cerrar overlay
  if (overlay && overlayImg) {
    overlay.onclick = () => {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      overlayImg.src = "";
    };
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && overlay.classList.contains("show")) {
          overlay.click();
        }
      },
      { once: true }
    );
  }
}