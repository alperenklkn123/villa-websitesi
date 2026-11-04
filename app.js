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
      ${villa.id === "glass-house" ? `<img class="villa-card-photo" src="${glassHousePhotos[0].src}" alt="Villa Glass House havuz ve dış cephe" fetchpriority="high">` : ""}
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
      ${villa.id === "glass-house" ? `<img class="villa-hero-photo" src="${glassHousePhotos[0].src}" alt="Villa Glass House havuz ve dış cephe" fetchpriority="high">` : ""}
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

    </section>
    ${villa.id === "glass-house" ? `<section class="photo-gallery" aria-labelledby="galleryTitle">
      <p class="eyebrow">VILLA GLASS HOUSE · ${glassHousePhotos.length} FOTOĞRAF</p>
      <h2 id="galleryTitle">Villayı keşfedin.</h2>
      <div class="photo-grid">${glassHousePhotos.map((photo, i) => `<button type="button" class="photo-tile" data-photo="${i}" aria-label="Fotoğraf ${i + 1}: büyüt"><img src="${photo.thumb}" alt="${photo.alt}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async"></button>`).join('')}</div>
    </section>
    <dialog class="photo-viewer" aria-label="Villa fotoğrafları">
      <div class="viewer-toolbar"><span id="photoCount" aria-live="polite"></span><button type="button" class="viewer-close" aria-label="Galeriyi kapat">Kapat ×</button></div>
      <img class="viewer-image" alt="">
      <div class="viewer-controls"><button type="button" class="viewer-prev" aria-label="Önceki fotoğraf">← Önceki</button><button type="button" class="viewer-next" aria-label="Sonraki fotoğraf">Sonraki →</button></div>
    </dialog>` : ""}
  `;
  setupGallery();
}

function setupGallery() {
  const viewer = document.querySelector('.photo-viewer');
  if (!viewer) return;
  let current = 0;
  const show = index => {
    current = (index + glassHousePhotos.length) % glassHousePhotos.length;
    const photo = glassHousePhotos[current];
    viewer.querySelector('img').src = photo.src;
    viewer.querySelector('img').alt = photo.alt;
    viewer.querySelector('#photoCount').textContent = `${current + 1} / ${glassHousePhotos.length}`;
  };
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    show(Number(button.dataset.photo)); viewer.showModal(); document.body.classList.add('gallery-open');
  }));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });
  viewer.addEventListener('close', () => document.body.classList.remove('gallery-open'));
}

renderHome();
renderVilla();

