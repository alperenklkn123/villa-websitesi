/* Kalkan Private Villas — static, no backend or tracking. */
(() => {
  'use strict';
  const body = document.body;
  const language = ['en', 'de', 'tr'].includes(body.dataset.lang) ? body.dataset.lang : 'en';
  const text = {
    en: {sample:'Illustrative photographs only. These are not photos of the actual villa.', photoAlt:'Illustrative villa interior photograph', realAlt:'Photograph of', guest:'Guests', bedroom:'Bedrooms', bathroom:'Bathrooms', confirm:'No dates are reserved until the host confirms your enquiry.', ready:'Send your dates to the host by WhatsApp or email.', unavailable:'The owner has not configured a contact number or email yet.', dateError:'Check-out must be after check-in.', name:'Name', checkin:'Check-in', checkout:'Check-out', guests:'Guests', message:'Message', noAmenities:'Verified amenities will be published here soon.', location:'Exact location and distances will be shared after confirmation.', opt:'Ask for current rates.', noPhoto:'Photos will be added soon.'},
    de: {sample:'Die Fotos sind Beispielbilder und zeigen nicht die tatsächliche Villa.', photoAlt:'Beispielbild einer Villa', realAlt:'Foto von', guest:'Gäste', bedroom:'Schlafzimmer', bathroom:'Badezimmer', confirm:'Eine Buchung ist erst nach Bestätigung durch den Gastgeber verbindlich.', ready:'Senden Sie Ihre Reisedaten per WhatsApp oder E-Mail.', unavailable:'Noch keine Telefonnummer oder E-Mail-Adresse hinterlegt.', dateError:'Das Abreisedatum muss nach dem Anreisedatum liegen.', name:'Name', checkin:'Anreise', checkout:'Abreise', guests:'Gäste', message:'Nachricht', noAmenities:'Bestätigte Ausstattungsmerkmale werden bald veröffentlicht.', location:'Die genaue Lage und Entfernungen werden nach Bestätigung ergänzt.', opt:'Aktuelle Preise auf Anfrage.', noPhoto:'Fotos folgen in Kürze.'},
    tr: {sample:'Görseller örnektir; gerçek villanın fotoğrafları değildir.', photoAlt:'Örnek villa fotoğrafı', realAlt:'Fotoğraf:', guest:'Misafir', bedroom:'Yatak odası', bathroom:'Banyo', confirm:'Ev sahibi onaylayana kadar tarihler rezerve edilmiş sayılmaz.', ready:'Tarihleriniz için WhatsApp veya e-posta üzerinden talep gönderin.', unavailable:'Henüz iletişim numarası veya e-posta tanımlanmadı.', dateError:'Çıkış tarihi giriş tarihinden sonra olmalıdır.', name:'İsim', checkin:'Giriş', checkout:'Çıkış', guests:'Misafir', message:'Mesaj', noAmenities:'Doğrulanmış özellikler yakında eklenecek.', location:'Kesin konum ve mesafeler doğrulandıktan sonra eklenecek.', opt:'Güncel fiyat için iletişime geçin.', noPhoto:'Fotoğraflar yakında eklenecek.'}
  }[language];
  const root = language === 'en' ? './' : '../';
  const validURL = s => typeof s === 'string' && /^https:\/\//i.test(s) ? s : '';
  const setText = (el, value) => { if (el && value !== undefined && value !== null) el.textContent = String(value); };
  const all = (sel, node=document) => Array.from(node.querySelectorAll(sel));
  const lvalue = (v, fallback='') => (typeof v === 'string' ? v : (v && typeof v === 'object' ? (v[language] || v.en || fallback) : fallback));
  const setupTransitions = () => {
    const wipe = document.querySelector('.page-wipe');
    all('.villa-card').forEach(card => card.addEventListener('click', e => {
      if (!wipe || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || (e.button !== 0)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      if (wipe.classList.contains('active')) return;
      wipe.classList.add('active');
      setTimeout(() => { window.location.href = card.href; }, 550);
    }));
    window.addEventListener('pageshow', () => wipe?.classList.remove('active'));
  };

  const renderHome = data => {
    const grid = document.getElementById('villaGrid');
    if (!grid) return;
    const lookup = Object.fromEntries(data.villas.map(v => [v.id, v]));
    all('[data-villa]', grid).forEach(card => {
      const villa = lookup[card.dataset.villa];
      if (!villa) return;
      setText(card.querySelector('.card-title'), villa.name);
      card.setAttribute('aria-label', villa.name);
      const src = validURL(villa.photos?.[0]);
      const img = card.querySelector('img');
      if (img && src) img.src = src;
      if (img) img.alt = villa.photosAreSamples ? text.photoAlt : `${text.realAlt} ${villa.name}`;
    });
  };

  const renderDetail = (data) => {
    const villa = data.villas.find(v => v.id === body.dataset.id);
    if (!villa) return;
    setText(document.querySelector('[data-name]'), villa.name);
    const hero = document.querySelector('[data-hero] img');
    const heroImg = validURL(villa.photos?.[0]);
    if (hero && heroImg) { hero.src = heroImg; hero.alt = villa.photosAreSamples ? text.photoAlt : `${text.realAlt} ${villa.name}`; }
    setText(document.querySelector('[data-description]'), lvalue(villa.description, lvalue(villa.summary)));
    setText(document.querySelector('[data-price]'), lvalue(villa.priceNote, text.opt));
    const sampleTag = document.querySelector('.sample-tag');
    const photoNote = document.querySelector('[data-photo-note]');
    if (sampleTag) sampleTag.hidden = !villa.photosAreSamples;
    if (photoNote) { photoNote.hidden = !villa.photosAreSamples; if (villa.photosAreSamples) setText(photoNote, text.sample); }
    const validFacts = [ ['guests',villa.guests], ['bedrooms',villa.bedrooms], ['bathrooms',villa.bathrooms] ];
    const factsBar = document.getElementById('facts');
    validFacts.forEach(([key,value]) => {
      const f = document.querySelector(`[data-field="${key}"]`);
      if (!f) return;
      if (Number.isInteger(value) && value > 0) { f.hidden = false; setText(f.querySelector('strong'),value); }
      else f.hidden = true;
    });
    if (factsBar) factsBar.hidden = !validFacts.some(([,x]) => Number.isInteger(x) && x > 0);
    const gallery = document.getElementById('gallery');
    const photos = Array.isArray(villa.photos) ? villa.photos.filter(validURL) : [];
    if (gallery) {
      gallery.replaceChildren();
      photos.forEach((url, i) => {
        const button = document.createElement('button'); button.type='button'; button.className='gallery-tile'; button.setAttribute('aria-label', `Photo ${i+1}`);
        const img = document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=url; img.alt = villa.photosAreSamples ? text.photoAlt : `${text.realAlt} ${villa.name} ${i+1}`;
        button.append(img); gallery.append(button);
        button.addEventListener('click', () => showLightbox(url, img.alt));
      });
      if (!photos.length) setText(gallery, text.noPhoto);
    }
    const amenities = document.getElementById('amenities');
    if (amenities) {
      amenities.replaceChildren();
      (Array.isArray(villa.amenities) ? villa.amenities : []).forEach(a => {
        if (typeof a !== 'string' || !a.trim()) return;
        const div = document.createElement('div'); div.className='amenity-item';
        const icon = document.createElement('span'); icon.textContent='✓'; icon.setAttribute('aria-hidden','true');
        div.append(icon, document.createTextNode(a)); amenities.append(div);
      });
      if (!amenities.childNodes.length) { const p = document.createElement('p'); p.className='muted-note'; p.textContent=text.noAmenities; amenities.append(p); }
    }
    const address = document.getElementById('addressNote');
    setText(address, villa.address?.trim() || text.location);
    const distances = document.getElementById('distanceList');
    if (distances) {
      distances.replaceChildren();
      for (const [place, distance] of Object.entries(villa.distanceNotes || {})) {
        if (!place.trim() || !String(distance).trim()) continue;
        const row=document.createElement('div'); const label=document.createElement('span'); const val=document.createElement('strong');
        label.textContent=place; val.textContent=distance; row.append(label,val); distances.append(row);
      }
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    const description = lvalue(villa.summary);
    if (metaDesc && description) metaDesc.content = description;
    document.title = `${villa.name} | Private Villa in Kalkan`;
    const form = document.getElementById('bookingForm');
    if (form) setupBooking(form, villa, data);
    const lightbox=document.getElementById('lightbox');
    const close=lightbox?.querySelector('.close-lightbox');
    close?.addEventListener('click', hideLightbox);
    lightbox?.addEventListener('click', e => { if(e.target === lightbox) hideLightbox(); });
    document.addEventListener('keydown', e => {if (e.key==='Escape') hideLightbox();});

    // Omit claims such as star ratings, license numbers, prices and availability if not confirmed.
    // VacationRental structured data is intentionally not published with sample photos and unknown property details.
  };
  function showLightbox(url, alt) {
    const box=document.getElementById('lightbox'); if(!box)return;
    const img=box.querySelector('img'); img.src=url; img.alt=alt; box.hidden=false;
    document.body.style.overflow='hidden'; box.querySelector('.close-lightbox')?.focus();
  }
  function hideLightbox() {
    const box=document.getElementById('lightbox'); if(!box || box.hidden)return;
    box.hidden=true; document.body.style.overflow='';
  }
  function setupBooking(form,villa,data) {
    const whatsapp=String(data.whatsapp||'').replace(/\D/g,'');
    const email=String(data.email||'').trim();
    const hasWhatsapp=whatsapp.length>=10 && whatsapp.length<=15;
    const hasEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const button=form.querySelector('button[type="submit"]');
    const status=document.getElementById('formStatus');
    if(button) button.disabled = !(hasWhatsapp || hasEmail);
    setText(status, (hasWhatsapp||hasEmail) ? text.ready : text.unavailable);
    const today = new Date();
    const localToday = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
    const start=form.elements.namedItem('start'), end=form.elements.namedItem('end');
    if(start)start.min=localToday; if(end)end.min=localToday;
    start?.addEventListener('change', () => { if(end) {end.min = start.value || localToday; if(end.value && end.value <= start.value)end.value=''; } });
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if (button?.disabled || !form.reportValidity())return;
      const checkin=start.value; const checkout=end.value;
      if (checkout<=checkin) {setText(status,text.dateError);end.focus();return;}
      const values=Object.fromEntries(new FormData(form).entries());
      const lines = [villa.name, `${text.name}: ${values.guestName||''}`, `${text.checkin}: ${checkin}`, `${text.checkout}: ${checkout}`, `${text.guests}: ${values.guests||''}`, `${text.message}: ${values.message||'-'}`, '', text.confirm];
      const message = lines.join('\n');
      if(hasWhatsapp) window.location.href=`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
      else if(hasEmail)window.location.href=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`${villa.name} – booking enquiry`)}&body=${encodeURIComponent(message)}`;
    });
  }
  setupTransitions();
  fetch(`${root}villas.json`,{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw new Error('Could not load villa data');return r.json();})
    .then(data=>{if (!data || !Array.isArray(data.villas))return; if(body.dataset.page==='home')renderHome(data);else if(body.dataset.page==='villa')renderDetail(data);})
    .catch(e=>{console.warn('Using static fallback:', e.message);});
})();
