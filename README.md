# Kalkan Private Villas — Yayına Hazır Teknik Paket

## Mevcut site

https://alperenklkn123.github.io/villa-websitesi/

Bu paket, mevcut GitHub Pages sitesinin yeni sürümüdür. **İki villa** içerir:
- Villa Glass House (`villa-glass-house.html`)
- Villa Glass House Mini (`villa-glass-house-mini.html`)

Ana sayfa sadece iki kare seçim kartı gösterir. Villa sayfalarında hero, galeri, doğrulanmış özellik alanları, konum, tarih talebi, FAQ bulunur. İngilizce, Almanca ve Türkçe sayfalar, `hreflang`, canonical, sitemap, robots ve BreadcrumbList yapılandırılmış verisi dahildir.

## GitHub'a yükleme

1. ZIP dosyasını çıkar ve **içindeki tüm dosya ve klasörleri** repo'nun **kök dizinine** yükle (ZIP'i tek dosya olarak yükleme).
2. `index.html`, `site.js`, `admin.js`, `styles.css`, `villas.json`, `sitemap.xml`, `robots.txt`, `admin/`, `de/` ve `tr/` kökte olmalıdır.
3. GitHub: `alperenklkn123/villa-websitesi` → **Add file → Upload files → Commit changes**.
4. GitHub → **Actions → Pages build and deployment** tamamlandıktan sonra siteni kontrol et. Eski dosyalar önbellekteyse `Cmd + Shift + R`.
5. `https://alperenklkn123.github.io/villa-websitesi/admin/` adresini aç.

## İçerik yönetimi — önemli

`/admin/` paneli **giriş korumalı, sunucuya bağlı bir admin sistemi değildir**. Tarayıcıda çalışan bir JSON düzenleyicisidir. Siteye kendiliğinden yayın yapamaz.

- Yönetim panelinde fotoğraf URL'lerini, villa adı, kapasite, oda/banyo, özellikler, çok dilli açıklamalar, fiyat notu, mesafeler, iletişim numarası ve e-postayı gir.
- **villas.json indir** butonuyla yeni dosyayı al.
- GitHub repo kökündeki eski `villas.json` dosyasını **yeni dosyayla değiştir** ve commit yap.
- Değişiklikler böylece her ziyaretçi tarafından görülür. **Tarayıcı taslağı, yalnızca senin cihazında görünür.**

## Rezervasyon nasıl çalışır?

- `villas.json` dosyasındaki `whatsapp` alanına uluslararası formatta numara yaz, örn. `905XXXXXXXXX`. Gerçek numaranı kullan.
- Alternatif olarak `email` gir.
- Form ziyaretçinin tarih, isim ve misafir sayısını kullanarak WhatsApp ya da e-posta mesajı açar. **Sitede ödeme, tarih bloke etme, otomatik müsaitlik, veri saklama yok.** Talep, mesaj gönderenin uygulamasından gönderildikten sonra sana ulaşır.

## Yayınlamadan önce zorunlu içerik kontrolü

- Mevcut tüm Unsplash görselleri **temsili örnek görseldir**, gerçek villa görseli değildir; gerçek fotoğrafları ekleyince `photosAreSamples` değerini panelde kapat.
- Misafir sayısı, yatak/banyo, olanaklar, konum, mesafeler ve ruhsat/belge bilgilerini **doğrulayarak** gir.
- Telefon veya e-posta eklemezsen form **bilerek kapalı** kalır; ziyaretçi sana talep gönderemez.
- Ücret, müsaitlik, yorum puanı veya tescil bilgileri **uydurulmamıştır**.
- Türkiye'deki kısa süreli kiralama ve ilan yükümlülüklerini yetkili kurumlarla doğrula.

## Google / yurt dışı görünürlüğü

1. **Google Search Console**'da `https://alperenklkn123.github.io/villa-websitesi/` adresini URL öneki mülkü olarak ekle ve doğrula. GitHub Pages için HTML dosyasıyla doğrulama kullanabilirsin.
2. Site haritasını gönder: `https://alperenklkn123.github.io/villa-websitesi/sitemap.xml`.
3. Arama Performansı raporunda ülkeleri (UK, DE, NL vb.) ve arama sorgularını izle.
4. Gerçek fotoğrafları ve doğrulanmış bilgileri ekledikten sonra uygun tatil kiralama entegrasyonlarını değerlendir; Google Vacation Rentals görünürlüğü için uygun bağlantı iş ortakları kullanılabilir.
5. Instagram, Airbnb veya Booking.com gibi kanallardaki villa adlarını ve fotoğrafları siteyle tutarlı tut.

> Not: SEO dosyaları eklemek Google sıralaması veya Google Vacation Rentals kabulü garantisi vermez. URL doğrulaması ve Search Console kaydı mülk sahibince yapılmalıdır. 

## Teknik

Sadece HTML + CSS + JS + `villas.json`. Ana sayfadaki villa kartları HTML'de hazırdır: JS yüklenmezse bile iki seçim görünür. JS, `villas.json` üzerinden içerikleri günceller. Statik dosyalar GitHub Pages ile uyumludur. `admin.html` eski bağlantılar için `/admin/` sayfasına yönlendirir. Form verileri bu sitede sunucuya kaydedilmez.
