# intranet.js – referència tècnica

## Funcions principals
- `loadEmpreses()`:
  - Fa `fetch` a `../xml/empreses.xml`, valida resposta i parseja XML.
  - Crida `renderEmpreses(xml)`.

- `renderEmpreses(xml)`:
  - Neteja el contenidor.
  - Itera `<empresa>` i crea targetes amb:
    - capçalera (miniatura opcional + nom)
    - detalls desplegables (municipi, sector, enllaços)
  - Configura overlay per zoom d’imatge i tancament amb Escape.

## Login i sessió
- Submit del formulari valida:
  - email `@montsia30.net`
  - contrasenya amb regex
- Si OK:
  - guarda `sessionStorage["intranet-auth"] = "1"`
  - oculta `#login-section`, mostra `#data-section` i crida `loadEmpreses()`
- Botó `#logout-btn`:
  - fa `sessionStorage.removeItem("intranet-auth")`
  - neteja vista i torna al login

## Events
- `DOMContentLoaded`: mostra login o contingut segons sessió
- `click` en `.empresa-card`: toggle de `.empresa-detalls`
- `click` en `.empresa-thumb`: obre overlay amb imatge ampliada
- `click` en `#img-overlay` o `Escape`: tanca el overlay