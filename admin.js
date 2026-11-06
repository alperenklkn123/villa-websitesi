let adminVillas=getVillas();
const form=document.getElementById('adminForm');
const statusEl=document.getElementById('saveStatus');
function val(v){return esc(v??'')}
function renderAdmin(){
 form.innerHTML=adminVillas.map((v,i)=>`<section class="admin-card"><p class="eyebrow">VILLA 0${i+1}</p><h2>${val(v.name)}</h2>
 <label>Villa adı<input data-i="${i}" data-path="name" value="${val(v.name)}"></label>
 <label>Ana görsel URL<input data-i="${i}" data-path="hero" value="${val(v.hero)}"></label>
 <label>Galeri URL'leri (satır başına 1)<textarea data-i="${i}" data-path="gallery">${val(v.gallery.join('\n'))}</textarea></label>
 <div class="admin-row"><label>Misafir<input type="number" min="1" data-i="${i}" data-path="guests" value="${v.guests}"></label><label>Yatak odası<input type="number" min="1" data-i="${i}" data-path="bedrooms" value="${v.bedrooms}"></label><label>Banyo<input type="number" min="1" data-i="${i}" data-path="bathrooms" value="${v.bathrooms}"></label></div>
 <label>Öne çıkan özellik<input data-i="${i}" data-path="feature" value="${val(v.feature)}"></label>
 <label>İngilizce açıklama<textarea data-i="${i}" data-path="description">${val(v.description)}</textarea></label>
 <label>Olanaklar (satır başına 1)<textarea data-i="${i}" data-path="amenities">${val(v.amenities.join('\n'))}</textarea></label>
 <div class="admin-row"><label>Kalkan merkez<input data-i="${i}" data-path="distances.centre" value="${val(v.distances.centre)}"></label><label>Plaj<input data-i="${i}" data-path="distances.beach" value="${val(v.distances.beach)}"></label><label>Havalimanı<input data-i="${i}" data-path="distances.airport" value="${val(v.distances.airport)}"></label></div>
 <label>Fiyat notu<input data-i="${i}" data-path="priceNote" value="${val(v.priceNote)}"></label>
 <label>WhatsApp numarası (ülke koduyla)<input data-i="${i}" data-path="whatsapp" value="${val(v.whatsapp)}"></label>
 </section>`).join('');
 form.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',e=>{
  const i=Number(e.target.dataset.i), path=e.target.dataset.path; let value=e.target.type==='number'?Number(e.target.value):e.target.value;
  if(path==='gallery'||path==='amenities') value=value.split('\n').map(x=>x.trim()).filter(Boolean);
  if(path.includes('.')){const [a,b]=path.split('.');adminVillas[i][a][b]=value}else adminVillas[i][path]=value;
  if(path==='name') e.target.closest('.admin-card').querySelector('h2').textContent=value;
 }))
}
renderAdmin();
document.getElementById('saveBtn').addEventListener('click',()=>{localStorage.setItem('kalkanVillasV4',JSON.stringify(adminVillas));statusEl.textContent='Kaydedildi.';setTimeout(()=>statusEl.textContent='',2200)});
document.getElementById('resetBtn').addEventListener('click',()=>{localStorage.removeItem('kalkanVillasV4');adminVillas=cloneDefaults();renderAdmin();statusEl.textContent='Varsayılanlara dönüldü.'});
