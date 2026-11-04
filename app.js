const defaultVillas = [
  {
    id: "glass-house",
    name: "VILLA GLASS HOUSE",
    guests: 8,
    bedrooms: 4,
    bathrooms: 4,
    feature: "PRIVATE POOL",
    description: "Villa Glass House için lüks ve sade açıklama alanı. Gerçek villa bilgileri daha sonra yönetim panelinden güncellenebilir."
  },
  {
    id: "villa-02",
    name: "VILLA 02",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    feature: "PRIVATE POOL",
    description: "İkinci villanın adı ve bilgileri daha sonra yönetim panelinden değiştirilebilir."
  }
];

function getVillas() {
  try {
    const stored = JSON.parse(localStorage.getItem("kalkanVillas"));
    return Array.isArray(stored) && stored.length === 2 ? stored : defaultVillas;
  } catch {
    return defaultVillas;
  }
}

const villaImages = ["assets/glass-house.png", "assets/villa-02.png"];
let openingVilla = false;

function renderHome() {
  const grid = document.getElementById("villaGrid");
  if (!grid) return;
  const villas = getVillas();
  [...grid.querySelectorAll(".villa-card")].forEach((card, index) => {
    const villa = villas[index];
    card.href = `villa.html?id=${encodeURIComponent(villa.id)}`;
    card.dataset.id = villa.id;
    card.querySelector(".villa-name").textContent = villa.name;
    card.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      transitionToVilla(card);
    });
  });
}

function transitionToVilla(card) {
  if (openingVilla) return;
  const destination = card.href;
  const layer = document.getElementById("transitionLayer");
  if (!layer || !Element.prototype.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    location.href = destination;
    return;
  }
  openingVilla = true;
  document.body.classList.add("is-transitioning");
  const rect = card.getBoundingClientRect();
  const original = card.querySelector(".villa-image");
  const photo = original.cloneNode();
  photo.className = "transition-image";
  photo.style.objectPosition = getComputedStyle(original).objectPosition;
  layer.replaceChildren(photo);
  const from = { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` };
  const to = { left: "0px", top: "0px", width: `${innerWidth}px`, height: `${innerHeight}px` };
  Object.assign(photo.style, from);
  let navigated = false;
  const navigate = () => { if (!navigated) { navigated = true; location.href = destination; } };
  const animation = photo.animate([from, to], { duration: 850, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
  animation.finished.then(navigate, navigate);
  // Still follow the link if a browser interrupts the animation.
  setTimeout(navigate, 1100);
}

window.addEventListener("pageshow", () => {
  openingVilla = false;
  document.body.classList.remove("is-transitioning");
  document.getElementById("transitionLayer")?.replaceChildren();
});

function renderVilla() {
  const root = document.getElementById("villaDetail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const villa = getVillas().find(v => v.id === id) || getVillas()[0];
  const imageIndex = Math.max(0, getVillas().findIndex(v => v.id === villa.id));
  document.title = `${villa.name} | Kalkan Private Villas`;
  root.innerHTML = `
    <section class="villa-hero has-photo" style="background-image: url('${villaImages[imageIndex]}')">
      <div class="villa-copy">
        <p class="eyebrow">KALKAN · TURKEY</p>
        <h1>${villa.name}</h1>
        <p>${villa.description}</p>
      </div>
    </section>
    <section class="villa-meta">
      <div class="meta-item"><b>${villa.guests}</b><span>GUESTS</span></div>
      <div class="meta-item"><b>${villa.bedrooms}</b><span>BEDROOMS</span></div>
      <div class="meta-item"><b>${villa.bathrooms}</b><span>BATHROOMS</span></div>
      <div class="meta-item"><b>✓</b><span>${villa.feature}</span></div>
    </section>
    <section class="villa-content">
      <p class="eyebrow">THE VILLA</p>
      <h2>A private Mediterranean stay.</h2>
      <p>${villa.description}</p>
      <p>Fotoğraf galerisi, olanaklar, konum, fiyat, müsaitlik takvimi ve WhatsApp rezervasyon bölümü bir sonraki aşamada bu sayfaya eklenecek.</p>
    </section>
  `;
}

renderHome();
renderVilla();
