# Kalkan Private Villas — fotoğraf güncellemesi

6 Kasım 2026

## Paketler

- `kalkan-private-villas-fotografli-tam-site.zip`: Mevcut GitHub sitesinin bütün dosyaları ve bu çalışmanın güncellemeleri. Yeni bir kurulum veya tam yedek için.
- `kalkan-private-villas-fotograf-guncellemesi.zip`: Yalnızca değişen ve eklenen dosyalar. Mevcut `alperenklkn123/villa-websitesi` deposuna yüklemek için önerilen paket. Tek başına tam site değildir.

Temel alınan GitHub sürümü: `6206184b337b8172205bdc0ef3d46ee0e0e6fd43` (main). Önceki `/mnt/data/kalkan-private-villas-ready.zip` bu oturumda mevcut değildi.

## Mevcut siteye yükleme

1. Önce mevcut deponun bir kopyasını indirin veya yedekleyin.
2. `kalkan-private-villas-fotograf-guncellemesi.zip` dosyasını açın.
3. https://github.com/alperenklkn123/villa-websitesi adresini açın. Yayındaki dosyaların bulunduğu `main` dalını seçin.
4. **Add file → Upload files** bölümünde ZIP'in içindeki dosya ve klasörleri kök dizine sürükleyin. ZIP dosyasının kendisini veya onu kapsayan fazladan bir klasörü yüklemeyin. `index.html` ve `villas.json` doğrudan deponun kökünde; fotoğraflar `assets/glass-house-real/` içinde olmalıdır.
5. Aynı adlı dosyaların yeni sürümleriyle değiştirildiğini kontrol edin ve **Commit changes** yapın. Pakette olmayan eski dosyaları silmeyin.
6. **Actions** bölümünde Pages dağıtımının başarıyla tamamlanmasını bekleyin.
7. https://alperenklkn123.github.io/villa-websitesi/ adresini açın. Mac'te `Cmd + Shift + R`, Windows'ta `Ctrl + Shift + R` ile önbelleksiz yenileyin.

Gizli `.nojekyll` dosyasını seçmek için macOS Finder'da `Cmd + Shift + .` kullanabilirsiniz. Sitenin derleme ihtiyacı yoktur.

Mevcut Pages ayarı zaten çalışıyorsa koruyun. Yeni kurulumda **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save** seçilir. Resmî kılavuz: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Tam site paketini kullanmak isterseniz bütün içeriği yerel depo klasörüne kopyalayıp GitHub Desktop üzerinden değişiklikleri commit ve push yapabilirsiniz. `.git` klasörünü değiştirmeyin.

## Yayından sonra kontrol

- Ana sayfada Villa Glass House kartı gerçek havuz ve villa fotoğrafını göstermeli.
- EN, DE ve TR detay sayfalarında 25 fotoğraf görünmeli; bir fotoğrafa tıklanınca büyük görünüm açılmalı. Kapatma düğmesi ve Escape çalışmalı.
- Villa Glass House Mini'nin görselleri değişmemeli; detay sayfasındaki örnek görsel uyarısı durmalı.
- `/admin/` açılmalı ve Glass House için `assets/glass-house-real/` yolları görünmeli.
- Önceden tarayıcıya kaydedilmiş bir admin taslağı eski fotoğrafları getiriyorsa, taslağı önce JSON olarak yedekleyin; sonra **Yayındaki veriyi geri yükle** seçeneğini kullanın. Bu işlem yalnızca yerel taslağı sıfırlar.

## Yapılan değişiklikler

- Kullanıcının açık teyidiyle Drive klasöründeki 49 görselin tamamı yalnızca Villa Glass House'a ait kabul edildi. Mini'ye hiçbir fotoğraf atanmadı.
- Tekrarlanan açıları azaltan 25 kare seçildi. Kapak kaynağı `41 kopyası.jpg adlı dosyanın kopyası`; gündüz bina ve havuz görünümüdür.
- Galeri görselleri en fazla 1920 piksel, küçük önizlemeler en fazla 640 piksel. Kare kapaklar 480 ve 960 piksel. EXIF bilgileri çıktılara taşınmadı.
- WebP sıkıştırma, tembel yükleme, duyarlı görsel seçimi ve EN/DE/TR açıklayıcı alt metinleri eklendi. Yeni görsel dosyaları toplam 7,13 MB; seçilen orijinaller toplam 276,90 MB.
- Sayfalardaki statik yedek içerik de gerçek fotoğraflarla güncellendi; JavaScript olmadan fotoğraflar ve doğrudan büyük görsel bağlantıları görünür.
- Glass House'un örnek fotoğraf uyarıları ve ilgili SSS yanıtı düzeltildi; sosyal paylaşım görseli eklendi.
- Tasarım, geçişler, dil bağlantıları, mevcut SEO/sitemap/robots altyapısı ve rezervasyon akışı korundu.
- Admin, HTTPS adreslerine ek olarak yerel `assets/` fotoğraf yollarını kabul eder. Fotoğraf listesindeki ilk görsel değiştirildiğinde kart kapağı da onu takip eder.
- Mevcut kullanılmayan eski görsel dosyaları tam pakette korundu; yeni galeri bunları kullanmaz.

`photo-manifest.json`, seçilen dosyaları ve üç dilde açıklamalarını; `photo-provenance.json`, kaynak Drive dosyalarının adlarını ve kimliklerini kaydeder.

## Mevcut eksikler

Mini'nin gerçek fotoğrafları bu klasörde yoktur; mevcut örnek görselleri korunmuştur. WhatsApp ve rezervasyon e-postası mevcut veride boş olduğu için talep gönderme düğmesi hâlâ kapalıdır. Kapasite, doğrulanmış olanaklar ve konum bilgileri bu fotoğraf çalışmasında değiştirilmedi.

Admin mevcut yapısıyla tarayıcıda çalışan JSON düzenleyicisidir; değişiklikleri yayınlamak için indirdiğiniz `villas.json` dosyasını GitHub'a yüklemeniz gerekir. Fotoğraflar kendi dosyalarından yüklenir; Mini'nin mevcut örnek görselleri ve Google Fonts internet bağlantısı kullanmaya devam eder.

Bu teslimatta GitHub'a dosya gönderilmedi ve canlı yayın değiştirilmedi. Paketler yerel önizlemede kontrol edildi; canlı dağıtım, yükleme sonrasında doğrulanmalıdır.
