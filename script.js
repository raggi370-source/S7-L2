// Mini-libreria — Settimana VII Giorno I — Versione completa


// === Classi ===
const STORAGE_KEY = "libri";
class Libro {
  static contatore = 0;

  constructor(titolo, autore, anno) {
    this.id = ++Libro.contatore;
    this.titolo = titolo;
    this.autore = autore;
    this.anno = anno;
    this.letto = false;
  }

  segnaComeLetto() {
    this.letto = true;
  }

  formato() {
    return "cartaceo";
  }

  static fromJSON(d) {
    return Object.assign(new this(d.titolo, d.autore, d.anno), d);
  }
}

class LibroDigitale extends Libro {
  constructor(titolo, autore, anno, dimensioneMb) {
    super(titolo, autore, anno);
    this.dimensioneMb = dimensioneMb;
  }

  formato() {
    return `digitale (${this.dimensioneMb} MB)`;
  }
}


// === Stato ===

let libri = [];


// === Render ===

function renderLibri() {
  const html = libri.map(l => `
    <li class="${l.letto ? 'letto' : ''}" data-id="${l.id}">
      <div class="info">
        <span class="titolo">${l.titolo}</span>
        <span class="badge-formato">${l.formato()}</span>
        <div class="meta">${l.autore} — ${l.anno}</div>
      </div>
      <div class="azioni">
        ${l.letto ? '✓ letto' : '<button data-azione="leggi" id="bella">Segna come letto</button>'}
      </div>
      
    </li>
  `).join("");

  document.getElementById("lista-libri").innerHTML = html;
  document.getElementById("contatore").textContent = libri.length;
}


// === Eventi ===

// Mostra/nasconde il campo "dimensione" in base al formato selezionato
document.getElementById("formato").addEventListener("change", (e) => {
  const campo = document.getElementById("campo-dimensione");
  if (e.target.value === "digitale") {
    campo.removeAttribute("hidden");
  } else {
    campo.setAttribute("hidden", "");
  }
});

// Submit del form: crea l'istanza giusta e la aggiunge all'array
document.getElementById("aggiungi-libro").addEventListener("submit", (e) => {
  e.preventDefault();


  salvaLibri();
  renderLibri();

  const titolo = document.getElementById("titolo").value;
  const autore = document.getElementById("autore").value;
  const anno = parseInt(document.getElementById("anno").value);
  const formato = document.getElementById("formato").value;

  let nuovo;
  if (formato === "digitale") {
    const dim = parseFloat(document.getElementById("dimensione").value) || 0;
    nuovo = new LibroDigitale(titolo, autore, anno, dim);
  } else {
    nuovo = new Libro(titolo, autore, anno);
  }

  libri.push(nuovo);
  renderLibri();
  e.target.reset();
  document.getElementById("campo-dimensione").setAttribute("hidden", "");
});

// Event delegation: click su "Segna come letto" su una qualsiasi card
const segna_come_letto = document.getElementById("lista-libri")
segna_come_letto.addEventListener("click", (e) => {
  const bottone = e.target.closest("[data-azione='leggi']");
  if (!bottone) return;

  const card = bottone.closest("li");
  const id = parseInt(card.dataset.id);


  if (e.target.matches('.btn-letto')) {
    libro.letto = !libro.letto;
    salvaLibri();
    renderLibri();
  }
  if (e.target.matches('.btn-rimuovi')) {

    libri = libri.filter(l => l.id !== id);
    salvaLibri();   // <-- E aggiungi qui
    renderLibri();


  }
  const libro = libri.find(l => l.id === id);
  if (libro) libro.segnaComeLetto();

  renderLibri();
});


// === Render iniziale (lista vuota) ===
renderLibri();

function salvaLibri() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libri));
}

function caricaLibri() {
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")

}

document.getElementById("svuota-tutto").addEventListener("click",()=>{
  libri=[];
  localStorage.removeItem(STORAGE_KEY)
  renderLibri();
})
const azioni = document.querySelector(".azioni");
const btnRimuovi = document.createElement("button");
btnRimuovi.textContent = "Rimuovi";
btnRimuovi.dataset.azione = "rimuovi";
azioni.appendChild(btnRimuovi);