// js de YoHerman

// --- LOGIN VALIDATION ---
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
const loginSection = document.getElementById("login-section");
const dataSection = document.getElementById("data-section");

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

  // Si passes validació:
  errorMsg.textContent = "";
  loginSection.classList.add("hidden");
  dataSection.classList.remove("hidden");
  loadEmpreses();
});

// --- XML LOADING ---
function loadEmpreses() {
  fetch("../xml/empreses.xml")
    .then((response) => {
      if (!response.ok) throw new Error("Error al carregar l'arxiu XML.");
      return response.text();
    })
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((xml) => renderEmpreses(xml))
    .catch((err) => {
      console.error(err);
    });
}

function renderEmpreses(xml) {
  const tableBody = document.querySelector("#empreses-table tbody");
  tableBody.innerHTML = "";

  const empreses = xml.getElementsByTagName("empresa");
  for (let i = 0; i < empreses.length; i++) {
    const nom = empreses[i].getElementsByTagName("nom")[0].textContent;
    const municipi = empreses[i].getElementsByTagName("municipi")[0].textContent;
    const sector = empreses[i].getElementsByTagName("sector")[0].textContent;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${nom}</td>
      <td>${municipi}</td>
      <td>${sector}</td>
      <td><a href="https://ccam.gencat.cat/ca/serveis/autodiagnosi/" target="_blank">Fer diagnosi</a></td>
    `;
    tableBody.appendChild(row);
  }
}