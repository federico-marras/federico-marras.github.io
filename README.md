# federico-marras.github.io

Sito personale/professionale di Federico Marras dedicato a sperimentazione digitale, A/B testing, Adobe Target, Adobe Analytics, Adobe Data Collection, CRO, tracking strategy e JavaScript applicato al DOM.

Il progetto e pensato per GitHub Pages: HTML, CSS e JavaScript puro, senza framework e senza build step.

## Struttura

```text
.
+-- index.html
+-- assets/
|   +-- css/
|   +-- img/
|   +-- js/
|       +-- main.js
+-- README.md
```

## Funzionalita

- Homepage semantica e responsive.
- Header sticky con progress bar di lettura.
- Hero section con taglio tecnico/personale.
- Sezioni competenze, metodo, casi studio anonimi e tracking demo.
- Componente articoli renderizzato dinamicamente da array JavaScript, pronto per contenuti futuri.
- Filtri per categoria, ricerca testuale e ordinamento articoli.
- Demo tracking tramite `window.dataLayer.push()`.
- Compatibilita diretta con GitHub Pages.

## Pubblicazione

Per GitHub Pages e sufficiente pubblicare il repository sul branch `main` e abilitare Pages dalla root del branch.
