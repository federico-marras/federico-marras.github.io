# federico-marras.github.io

Sito personale/professionale di Federico Marras dedicato a sperimentazione digitale, A/B testing, Adobe Target, Adobe Analytics, Adobe Data Collection, CRO, tracking strategy e JavaScript applicato al DOM.

Il progetto è pensato per GitHub Pages: HTML, CSS e JavaScript puro, senza framework e senza build step.

## Struttura

```text
.
+-- index.html
+-- assets/
|   +-- css/
|   |   +-- style.css
|   |   +-- homepage-improvements.css
|   +-- js/
|       +-- main.js
+-- articles/
|   +-- checklist-qa-adobe-target.html
|   +-- primary-metric-ab-test.html
|   +-- mutationobserver-adobe-target.html
+-- README.md
```

## Funzionalità

- Homepage semantica e responsive.
- Header sticky.
- Hero section con taglio tecnico/personale.
- Sezioni competenze, metodo, casi studio anonimi e articoli.
- Articoli renderizzati dinamicamente da array JavaScript.
- Filtri per categoria e ricerca testuale.
- Dark mode con preferenza salvata in `localStorage`.
- Progress bar di scroll.
- Demo tracking tramite `window.dataLayer.push()`.
- Compatibilità diretta con GitHub Pages.

## Pubblicazione

Per GitHub Pages è sufficiente pubblicare il repository sul branch `main` e abilitare Pages dalla root del branch.
