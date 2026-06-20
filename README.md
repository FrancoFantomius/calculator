# PWA Calcolatrice

Una Progressive Web App (PWA) calcolatrice semplice ed intuitiva, progettata per funzionare sia online che offline direttamente dal browser. Offre un'interfaccia pulita basata sul font *Inter* e pulsanti reattivi sia per operazioni di base che per funzioni scientifiche semplici.

## Funzionalità

- **Operazioni di base**: Addizione, sottrazione, moltiplicazione e divisione.
- **Funzioni avanzate**: Radice quadrata, pi greco ($\pi$), elevamento a potenza ($^$) e percentuali.
- **Supporto Parentesi**: Gestione corretta dell'ordine delle operazioni tramite parentesi.
- **PWA (Progressive Web App)**: Installabile su dispositivi mobili e desktop grazie al file `manifest.json` e al Service Worker (`sw.js`), funzionante anche in assenza di rete.
- **Interfaccia Web Responsiva**: Layout adattivo progettato per simulare una tastiera fisica di calcolatrice su display di ogni dimensione.

## Installazione e Utilizzo Locali

Per avviare la calcolatrice localmente, puoi servire i file statici con un qualsiasi server locale. Ad esempio:

1. **Tramite Python**:
   ```bash
   python -m http.server 8000
   ```
   Apri poi il browser all'indirizzo `http://localhost:8000`.

2. **Tramite Node.js (npx)**:
   ```bash
   npx serve .
   ```
   Apri poi l'indirizzo mostrato nel terminale (solitamente `http://localhost:3000`).
