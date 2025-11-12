2) docs/intranet.md
Propósito: documentar la Intranet (arquitectura, flujos, validaciones, datos).

Contenido sugerido:
```markdown
# Intranet Montsià30

## Objectiu
Accés amb login bàsic per a personal de Montsià30. Llista d'empreses carregada des d'XML i enllaç al formulari d'autodiagnosi.

## Pàgina i arxius
- `/pages/intranet.html`    Maquetació HTML de login i intranet.
- `/css/intranet.css`       Estils (targetes, overlay d’imatges, barra d’accions).
- `/js/intranet.js`         Lògica (login, sessió, càrrega d’XML, render de targetes).
- `/xml/empreses.xml`       Dades d’empreses (nom, municipi, sector, imatge).

## Flux de navegació
1. Usuari accedeix a `intranet.html`.
2. Es mostra el formulari de login.
3. Validacions client:
   - Email amb domini `@montsia30.net`
   - Contrasenya: mínim 8 caràcters, 1 majúscula, 1 minúscula, 1 dígit
4. Si OK:
   - S’amaga el login, es mostra la intranet.
   - Es carrega `/xml/empreses.xml` amb `fetch`.
   - Es pinten targetes (desplegables) i una targeta fixa d’autodiagnosi.
5. Opcional: sessió recordada amb `sessionStorage`.

## Estat de sessió
- `sessionStorage["intranet-auth"] = "1"` quan el login és vàlid.
- Botó “Tancar sessió” neteja la sessió i torna al login.

## Accessibilitat
- Overlay d’imatge amb `aria-hidden`.
- Imatges amb `alt`.
- Contrast i focus visibles a botons/enllaços.