# Estils i convencions CSS

## Fitxers
- `/css/intranet.css`:
  - Targetes d’empresa (.empresa-card, .empresa-header, .empresa-detalls)
  - Targeta d’acció (.action-card)
  - Overlay de zoom d’imatges (.image-overlay)
  - Barra d’accions i botó de logout (.intranet-bar, #logout-btn)

## Principis
- Layout amb Flexbox
- Sombra només inferior (elevació): `box-shadow: 0 6px 10px -4px rgba(0,0,0,.4);`
- Paleta intranet: gris/blau; targeta d’acció amb fons blau suau
- Responsive: amplades màximes de 800 px per a llegibilitat

## Components
- Targeta d’empresa:
  - miniatura 90% (object-fit: cover)
  - títol i dades desplegables
- Overlay d’imatge:
  - centrat, tanca amb clic i tecla Escape