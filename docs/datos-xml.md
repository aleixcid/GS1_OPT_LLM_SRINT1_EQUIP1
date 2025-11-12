# Dades XML d'empreses

## Fitxer
- `/xml/empreses.xml`

## Esquema mínim
```xml
<empreses>
  <empresa id="e001">
    <nom>Teixits Montsià</nom>
    <municipi>Amposta</municipi>
    <sector>Tèxtil</sector>
    <imatge>../assets/img/teixits.jpg</imatge> <!-- opcional -->
  </empresa>
</empreses>
```

## Ús al frontend
- `fetch("../xml/empreses.xml")` des de `/pages/intranet.html`
- Parseig amb `DOMParser().parseFromString(str, "text/xml")`
- Camps utilitzats:
  - `nom`, `municipi`, `sector` i opcional `imatge`
- Render:
  - Targeta amb títol (`nom`)
  - Dades desplegables (`municipi`, `sector`)
  - Enllaç a autodiagnosi
  - Zoom sobre `imatge` si existeix