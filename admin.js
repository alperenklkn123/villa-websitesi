const defaults = [
  { id: "glass-house", name: "VILLA GLASS HOUSE", guests: 8, bedrooms: 4, bathrooms: 4, feature: "PRIVATE POOL", description: "Villa Glass House için lüks ve sade açıklama alanı. Gerçek villa bilgileri daha sonra yönetim panelinden güncellenebilir." },
  { id: "villa-02", name: "VILLA 02", guests: 6, bedrooms: 3, bathrooms: 3, feature: "PRIVATE POOL", description: "İkinci villanın adı ve bilgileri daha sonra yönetim panelinden değiştirilebilir." }
];

function loadData() {
  try {
    const x = JSON.parse(localStorage.getItem("kalkanVillas"));
    return Array.isArray(x) && x.length === 2 ? x : structuredClone(defaults);
  } catch { return structuredClone(defaults); }
}

let villas = loadData();
const form = document.getElementById("adminForm");

function render() {
  form.innerHTML = villas.map((v, i) => `
    <section class="admin-card">
      <h2>Villa ${i + 1}</h2>
      <div class="field"><label>Villa Adı</label><input data-i="${i}" data-k="name" value="${v.name}"></div>
      <div class="field"><label>Kişi Kapasitesi</label><input type="number" min="1" data-i="${i}" data-k="guests" value="${v.guests}"></div>
      <div class="field"><label>Yatak Odası</label><input type="number" min="1" data-i="${i}" data-k="bedrooms" value="${v.bedrooms}"></div>
      <div class="field"><label>Banyo</label><input type="number" min="1" data-i="${i}" data-k="bathrooms" value="${v.bathrooms}"></div>
      <div class="field"><label>Öne Çıkan Özellik</label><input data-i="${i}" data-k="feature" value="${v.feature}"></div>
      <div class="field"><label>Açıklama</label><textarea data-i="${i}" data-k="description">${v.description}</textarea></div>
    </section>
  `).join("");

  form.querySelectorAll("input,textarea").forEach(el => {
    el.addEventListener("input", e => {
      const i = Number(e.target.dataset.i);
      const k = e.target.dataset.k;
      villas[i][k] = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    });
  });
}

render();

document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("kalkanVillas", JSON.stringify(villas));
  document.getElementById("saveStatus").textContent = "Kaydedildi.";
  setTimeout(() => document.getElementById("saveStatus").textContent = "", 1800);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  villas = structuredClone(defaults);
  localStorage.removeItem("kalkanVillas");
  render();
  document.getElementById("saveStatus").textContent = "Varsayılan değerlere dönüldü.";
});
