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

function renderHome() {
  const grid = document.getElementById("villaGrid");
  if (!grid) return;
  const villas = getVillas();
  grid.innerHTML = villas.map((villa, index) => `
    <article class="villa-card" data-id="${villa.id}" aria-label="${villa.name}" tabindex="0">
      <div class="villa-name">${villa.name}</div>
    </article>
  `).join("");

  [...grid.querySelectorAll(".villa-card")].forEach(card => {
    const openVilla = () => transitionToVilla(card.dataset.id);
    card.addEventListener("click", openVilla);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openVilla(); });
  });
}

function transitionToVilla(id) {
  const layer = document.getElementById("transitionLayer");
  if (!layer) { window.location.href = `villa.html?id=${encodeURIComponent(id)}`; return; }
  layer.classList.add("active");
  setTimeout(() => window.location.href = `villa.html?id=${encodeURIComponent(id)}`, 580);
}

function renderVilla() {
  const root = document.getElementById("villaDetail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const villa = getVillas().find(v => v.id === id) || getVillas()[0];
  document.title = `${villa.name} | Kalkan Private Villas`;
  root.innerHTML = `
    <section class="villa-hero">
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
