(() => {
  'use strict';
  const status = document.getElementById('adminStatus');
  const form = document.getElementById('editor');
  const host = document.getElementById('villaEditors');
  const key = 'kalkan-villas-draft-v1';
  let liveData, draft;
  function showStatus(message) { status.textContent=message; }
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function field(label, type='text', value='', attrs={}) {
    const el=document.createElement('label'); el.textContent=label;
    const control=document.createElement(type==='textarea'?'textarea':'input');
    if(type!=='textarea')control.type=type;
    control.value=value ?? '';
    if(attrs.placeholder)control.placeholder=attrs.placeholder;
    if(attrs.min!==undefined)control.min=attrs.min;
    control.dataset.field=attrs.field||'';
    el.append(control);return {el,control};
  }
  function safeNumber(s) { if(s===''||s===null||s===undefined)return null;const n=Number(s);return Number.isSafeInteger(n)&&n>0?n:null; }
  function section(id, title,desc) {
    const x=document.createElement('section');x.className='admin-card';
    const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent=id;
    const h2=document.createElement('h2');h2.textContent=title;
    x.append(eyebrow,h2);
    if(desc){const p=document.createElement('p');p.className='admin-help';p.textContent=desc;x.append(p);}
    return x;
  }
  function render() {
    form.hidden=false;
    form.elements.brand.value=draft.brand||'';
    form.elements.whatsapp.value=draft.whatsapp||'';
    form.elements.email.value=draft.email||'';
    host.replaceChildren();
    draft.villas.forEach((villa,index)=>{
      const block=section('VILLA '+String(index+1).padStart(2,'0'),villa.name, 'Bu bilgiler ziyaretçilere açık olarak yayınlanır. Gerçek fotoğrafları yükleyene kadar “örnek görseller” seçimini açık tut.');
      block.dataset.villa=String(index);
      const input=(label,key,type='text',transform=x=>x) => {
        const a=field(label,type,transform(villa[key]),{field:key});block.append(a.el);
        a.control.addEventListener('input',()=>{villa[key]=['guests','bedrooms','bathrooms'].includes(key)?safeNumber(a.control.value):a.control.value; if(key==='name')block.querySelector('h2').textContent=a.control.value;});
        return a.control;
      };
      input('Villa adı','name');
      const photo=field('Fotoğraf bağlantıları — her satırda bir HTTPS adresi veya assets/ dosya yolu','textarea',(villa.photos||[]).join('\n'));
      photo.control.rows=5;block.append(photo.el);photo.control.addEventListener('input',()=>{const previous=villa.photos?.[0];villa.photos=photo.control.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(villa.photos[0]!==previous){villa.cover=villa.photos[0]||'';delete villa.coverSmall;}});
      const sampleLabel=document.createElement('label');sampleLabel.className='admin-check';const sample=document.createElement('input');sample.type='checkbox';sample.checked=!!villa.photosAreSamples;
      sample.addEventListener('change',()=>villa.photosAreSamples=sample.checked);
      sampleLabel.append(sample,document.createTextNode('Bu fotoğraflar örnek, gerçek villa fotoğrafları değil'));block.append(sampleLabel);
      const nums=document.createElement('div');nums.className='admin-rows';
      for(const [label,key] of [['Maks. misafir','guests'],['Yatak odası','bedrooms'],['Banyo','bathrooms']]){
        const f=field(label,'number',villa[key]??'',{min:1});
        f.control.addEventListener('input',()=>villa[key]=safeNumber(f.control.value));nums.append(f.el);
      }block.append(nums);
      const amenities=field('Doğrulanmış olanaklar (her satırda bir özellik)','textarea',(villa.amenities||[]).join('\n'));
      amenities.control.rows=4;block.append(amenities.el);amenities.control.addEventListener('input',()=>villa.amenities=amenities.control.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean));
      const address=field('Adres / bölge bilgisi (kamusal olacak)','textarea',villa.address||'');address.control.rows=2;block.append(address.el);address.control.addEventListener('input',()=>villa.address=address.control.value);
      const distances=field('Mesafe bilgileri (her satır: Yer = Mesafe)','textarea',Object.entries(villa.distanceNotes||{}).map(([a,b])=>`${a} = ${b}`).join('\n'));
      distances.control.rows=3;block.append(distances.el);distances.control.addEventListener('input',()=>{
        const data={};for(const line of distances.control.value.split(/\r?\n/)){const i=line.indexOf('=');if(i<=0)continue;const left=line.slice(0,i).trim(),right=line.slice(i+1).trim();if(left&&right)data[left]=right;}villa.distanceNotes=data;
      });
      for(const [label,key] of [['İşletme belge numarası (varsa)','registrationNumber'],['Enlem (varsa)','latitude'],['Boylam (varsa)','longitude']]){
        const f=field(label,'text',villa[key]??'');block.append(f.el);
        f.control.addEventListener('input',()=>{if(key==='latitude'||key==='longitude'){const n=Number(f.control.value);villa[key]=f.control.value.trim()===''?null:(Number.isFinite(n)?n:null);}else villa[key]=f.control.value;});
      }
      const locales=[['en','English'],['de','Deutsch'],['tr','Türkçe']];
      for(const [lang,langName] of locales){
        const tag=document.createElement('h3');tag.className='admin-lang';tag.textContent=langName;block.append(tag);
        for(const [key,label] of [['summary','Kısa SEO açıklaması'],['description','Detay açıklaması'],['priceNote','Fiyat notu']]){
          if(!villa[key] || typeof villa[key]!=='object')villa[key]={en:'',de:'',tr:''};
          const f=field(label, key==='priceNote'?'text':'textarea',villa[key][lang]||'');
          if(key!=='priceNote')f.control.rows=key==='description'?4:2;
          block.append(f.el);f.control.addEventListener('input',()=>villa[key][lang]=f.control.value);
        }
      }
      host.append(block);
    });
    showStatus('Veriler yüklendi. Değişikliklerini JSON olarak indirip GitHub’a yükleyerek yayınlayabilirsin.');
  }
  function readGlobals(){draft.brand=form.elements.brand.value.trim();draft.whatsapp=form.elements.whatsapp.value.trim();draft.email=form.elements.email.value.trim();}
  function validate(data) {
    if(!data || !Array.isArray(data.villas) || data.villas.length !== 2 || data.villas[0].id!=='glass-house'||data.villas[1].id!=='glass-house-mini')throw Error('İki villa kaydı gerekli: glass-house ve glass-house-mini.');
    for(const v of data.villas) {
      if(!v.name?.trim())throw Error('Villa adı boş olamaz.');
      if(!Array.isArray(v.photos)||v.photos.some(x=>!(/^https:\/\//i.test(x) || /^assets\/[a-zA-Z0-9_./-]+$/.test(x) && !x.split('/').includes('..'))))throw Error('Fotoğraflar HTTPS adresi veya assets/ ile başlayan güvenli dosya yolu olmalı.');
    }
  }
  function getData(){readGlobals();validate(draft);return draft;}
  function download(){
    try{
      const v=getData();const blob=new Blob([JSON.stringify(v,null,2)+'\n'],{type:'application/json'});
      const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='villas.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
      showStatus('villas.json indirildi. Şimdi GitHub deposundaki villas.json dosyasını bu dosyayla değiştirip Commit changes yap.');
    }catch(e){showStatus('Hata: '+e.message);}
  }
  document.getElementById('download').addEventListener('click',download);
  document.getElementById('saveDraft').addEventListener('click',()=>{try{localStorage.setItem(key,JSON.stringify(getData()));showStatus('Taslak yalnızca bu tarayıcıya kaydedildi, henüz internette yayınlanmadı.');}catch(e){showStatus('Hata: '+e.message);}});
  document.getElementById('reset').addEventListener('click',()=>{if(!confirm('Tarayıcıdaki taslak silinsin ve GitHub’da yayınlanan veriler geri yüklensin mi?'))return;localStorage.removeItem(key);draft=copy(liveData);render();});
  document.getElementById('importTrigger').addEventListener('click',()=>document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{const data=JSON.parse(await file.text());validate(data);draft=data;render();showStatus('JSON içe aktarıldı; yayınlamak için tekrar indirip GitHub’a yükle.');}catch(err){showStatus('Dosya okunamadı: '+err.message);}e.target.value='';
  });
  form.addEventListener('submit',e=>e.preventDefault());
  fetch('../villas.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json();}).then(data=>{validate(data);liveData=data;try{const saved=JSON.parse(localStorage.getItem(key));if(saved){validate(saved);draft=saved;}else draft=copy(data);}catch{draft=copy(data);}render();}).catch(err=>showStatus('Canlı villas.json yüklenemedi: '+err.message+'. Sayfayı GitHub Pages URL’sinden açtığından emin ol.'));
})();

