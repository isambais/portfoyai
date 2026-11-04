# Fonksiyonel Olmayan İsterler (NFR)

> **Proje:** PortföyAI · **Sürüm:** 1.0 · **İlgili doküman:** [fonksiyonel_isterler.md](fonksiyonel_isterler.md)

Fonksiyonel olmayan isterler, sistemin **ne kadar hızlı, güvenli, doğru ve güvenilir** çalışması gerektiğini tanımlar. Tüm isterler ölçülebilir kabul kriterleri içerir.

## N1. Performans

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-001 | Model çıkarımı (bir portföy için öneri üretimi) CPU üzerinde hızlı olmalıdır. | 🔴 M | ONNX modeliyle tek portföy için p95 çıkarım süresi < 50 ms. |
| NFR-002 | API, eşzamanlı kullanıcı yükü altında hızlı yanıt vermelidir. | 🔴 M | 100 eşzamanlı kullanıcıda p95 yanıt süresi < 300 ms ve hata oranı < %1 (Locust stres testi). |
| NFR-003 | Mobil uygulamada ekranlar hızlı açılmalıdır. | 🟡 S | Ana sayfa, uygulama açıldıktan sonra orta seviye bir Android telefonda 2 saniye içinde yüklenir. |
| NFR-004 | Günlük öneri üretimi zamanında tamamlanmalıdır. | 🔴 M | 18:30'da başlayan veri çekme ve öneri üretimi en geç 18:45'te biter. |

## N2. Güvenilirlik

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-005 | Tek bir bileşenin (veri kaynağı, model, haber servisi, SMS servisi) arızası uygulamayı çökertmemelidir. | 🔴 M | Her bileşen tek tek kapatıldığında uygulama açılır, son geçerli veriyle çalışmaya devam eder ve kullanıcıya uyarı gösterir. |
| NFR-006 | Canlı sistem yüksek erişilebilirlikte olmalıdır. | 🟡 S | Canlı takip süresince (8.–10. hafta) API erişilebilirliği ≥ %99. |
| NFR-007 | Sistemdeki tüm hatalar kayıt altına alınmalıdır. | 🔴 M | Her hata zaman, bileşen, hata mesajı ve istek kimliğiyle yapılandırılmış (JSON) log olarak yazılır. |
| NFR-008 | Mobil uygulama internet bağlantısı yokken son verileri gösterebilmelidir. | 🟡 S | Uçak modunda uygulama açıldığında son kaydedilmiş portföy ve öneri "çevrimdışı" etiketiyle görünür. |

## N3. Güvenlik

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-009 | Şifreler asla açık metin olarak saklanmamalıdır. | 🔴 M | Veritabanında şifreler bcrypt ile hash'lenmiş olarak bulunur. |
| NFR-010 | Mobil uygulama ile sunucu arasındaki tüm iletişim şifreli olmalıdır. | 🔴 M | API yalnızca HTTPS (TLS 1.2+) üzerinden erişilebilir; HTTP istekleri reddedilir. |
| NFR-011 | Erişim token'ları kısa ömürlü olmalı ve telefonda güvenli alanda saklanmalıdır. | 🔴 M | Erişim token'ı 15 dakika, yenileme token'ı 7 gün geçerlidir; token'lar Expo SecureStore'da tutulur. |
| NFR-012 | Her API isteğinde kimlik ve yetki kontrol edilmelidir (rol tabanlı yetkilendirme). | 🔴 M | Bir kullanıcı başka bir kullanıcının portföyüne erişmeye çalıştığında 403 hatası alır. |
| NFR-013 | API, kötüye kullanıma karşı istek sınırı uygulamalıdır. | 🔴 M | Bir IP adresinden dakikada 100'den fazla istek gelirse 429 hatası döner; giriş ve kod gönderme uç noktalarında sınır dakikada 5'tir. |
| NFR-014 | Sistem, yaygın web saldırılarına (SQL injection, XSS) karşı korunmalıdır. | 🔴 M | Tüm veritabanı sorguları ORM / parametreli sorgu ile yapılır; OWASP ZAP taramasında yüksek seviyeli açık bulunmaz. |
| NFR-015 | API anahtarları ve şifreler kod deposunda bulunmamalıdır. | 🔴 M | Gizli bilgiler `.env` dosyasında tutulur ve `.gitignore`'dadır; repoda gizli anahtar taraması (gitleaks) temiz çıkar. |

## N4. Gizlilik (KVKK)

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-016 | Sistem yalnızca gerekli kişisel verileri toplamalıdır (veri minimizasyonu). | 🔴 M | Kayıtta yalnızca ad, e-posta, telefon ve şifre istenir; TC kimlik no, adres veya banka bilgisi istenmez. |
| NFR-017 | E-posta ve telefon numarası veritabanında şifrelenmiş olarak saklanmalıdır. | 🟡 S | Veritabanı doğrudan okunduğunda bu alanlar okunamaz durumdadır (AES-256). |
| NFR-018 | Loglarda kişisel veri açık olarak yer almamalıdır. | 🔴 M | Loglarda e-posta ve telefon maskelenmiş görünür (ör. `is***@gmail.com`, `+90 5** *** **12`). |
| NFR-019 | Hesap silme talebinden sonra kullanıcının verileri, yedekler dahil 30 gün içinde tamamen silinmelidir. | 🟡 S | Silmeden 30 gün sonra hiçbir tabloda ve yedekte kullanıcıya ait kayıt bulunmaz. |
| NFR-020 | KVKK aydınlatma metni sürümlü olmalı; metin değiştiğinde kullanıcıdan yeniden onay alınmalıdır. | 🔴 M | Metin sürümü güncellendiğinde, kullanıcı bir sonraki girişte yeni metni onaylamadan devam edemez. |
| NFR-021 | LLM servisine kişisel tanımlayıcı bilgi (ad, e-posta, telefon) gönderilmemelidir. | 🔴 M | LLM'e giden istekler loglandığında içlerinde kişisel bilgi bulunmaz, yalnızca anonim portföy verisi bulunur. |

## N5. Veri Kalitesi

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-022 | Ham veriler hiç değiştirilmeden ayrı saklanmalı; temizleme ve dönüştürme işlemleri ayrı bir katmanda yapılmalıdır. | 🔴 M | Ham veriden işlenmiş veri, aynı kodla tekrar üretildiğinde aynı sonucu verir. |
| NFR-023 | Her veri kaydı kaynağı, çekilme zamanı ve yayın tarihiyle saklanmalıdır. | 🔴 M | Rastgele seçilen bir kayıtta kaynak, çekilme zamanı ve yayın tarihi alanları doludur. |
| NFR-024 | Sonradan düzeltilen veriler eski kaydın üzerine yazılmamalı, yeni bir sürüm olarak eklenmelidir. | 🔴 M | Bir fiyat düzeltildiğinde eski ve yeni değer tarihleriyle birlikte veritabanında bulunur. |
| NFR-025 | Günlük veri tamlık oranı en az %98 olmalıdır. | 🟡 S | Beklenen varlık-gün kayıtlarının en az %98'i veritabanında mevcuttur; oran admin ekranında görünür. |
| NFR-026 | Veri doğrulama kuralları (eksik gün, sıfır/negatif fiyat, olağandışı sıçrama, kur tutarsızlığı) her çekimde otomatik çalışmalı ve sonuçları raporlanmalıdır. | 🔴 M | Her veri çekiminden sonra karantinaya alınan kayıtların listesi ve nedenleri loglanır. |

## N6. Bilimsel Geçerlilik

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-027 | Geleceği görme yanlılığı (look-ahead bias) olmamalıdır: t tarihindeki her karar yalnızca t ve öncesindeki bilgilerle verilmeli, işlem t+1 açılışında gerçekleşmelidir. | 🔴 M | Sızıntı testi: t tarihinden sonraki veriler bozulduğunda t ve öncesine ait hiçbir öznitelik, öneri veya backtest sonucu değişmez. |
| NFR-028 | Hayatta kalma yanlılığı (survivorship bias) olmamalıdır: her tarihte o tarihteki BIST 30 bileşimi kullanılmalı, sonradan endeksten çıkan hisseler veri setinde kalmalıdır. | 🔴 M | 2015 tarihli bir sorgu, bugünkü değil 2015'teki BIST 30 listesini döndürür. |
| NFR-029 | Tüm backtest ve simülasyonlarda gerçekçi işlem maliyetleri uygulanmalıdır: komisyon (%0,2), kayma (%0,05–0,1) ve stopaj. | 🔴 M | Maliyetsiz ve maliyetli backtest sonuçları raporda ayrı ayrı gösterilir; maliyetli sonuç her zaman daha düşüktür. |
| NFR-030 | Veri zaman sırasına göre bölünmelidir: eğitim (2010–2020), doğrulama (2021–2022), test (2023–2025). Test seti hiperparametre seçiminde kullanılmamalı, yalnızca son değerlendirmede bir kez kullanılmalıdır. | 🔴 M | Test seti ayrı bir dosyada tutulur, özeti (hash) proje başında kaydedilir ve her erişim loglanır. |
| NFR-031 | Modeller sınıflandırma doğruluğu (accuracy) ile değil, risk ayarlı yatırım performansıyla değerlendirilmelidir: Sharpe, Sortino, maksimum düşüş, Calmar ve devir hızı. Sonuçlar reel TL ve USD bazında raporlanmalı, risksiz getiri olarak TL politika faizi kullanılmalıdır. | 🔴 M | Deney raporundaki her model için bu metriklerin tamamı reel TL ve USD olarak yer alır. |
| NFR-032 | Her model en az 1/N, XU100 al-tut ve Markowitz ile karşılaştırılmalıdır. Doğrulama setinde en az bir baseline'ı Sharpe açısından geçemeyen model yayına alınmamalıdır. | 🔴 M | Yayın öncesi otomatik kontrol, koşulu sağlamayan modeli reddeder. |
| NFR-033 | Her model yapılandırması en az 5 farklı seed ile eğitilmeli ve sonuçlar ortalama ± standart sapma olarak raporlanmalıdır. | 🔴 M | Deney tablosundaki her değer "ortalama ± std" formatındadır. |
| NFR-034 | Model karşılaştırmalarının anlamlılığı bootstrap testi (10.000 örnek) ve çoklu deney etkisine karşı Deflated Sharpe Ratio ile sınanmalıdır. | 🟡 S | Her ana karşılaştırmanın yanında p-değeri ve DSR değeri raporlanır. |
| NFR-035 | Değerlendirme walk-forward yöntemiyle yapılmalıdır: model geçmiş veriyle eğitilip sonraki dönemde test edilmeli ve pencere ileri kaydırılmalıdır. | 🟡 S | Raporda en az 3 walk-forward penceresinin sonuçları ayrı ayrı gösterilir. |
| NFR-036 | Olumsuz sonuçlar da dürüstçe raporlanmalıdır; başarısız deneyler gizlenmemelidir. | 🔴 M | Final raporda tüm deneyler, beklentiyi karşılamayanlar dahil, listelenir. |

## N7. Test Altyapısı

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-037 | **Backend:** Tüm API uç noktaları için birim ve entegrasyon testleri yazılmalıdır. Her uç noktanın en az bir başarılı ve bir hatalı senaryosu test edilmelidir. | 🔴 M | pytest ile kod kapsamı ≥ %70. |
| NFR-038 | **Finansal hesaplar:** Getiri, reel getiri, Sharpe, Sortino, VaR, komisyon ve stopaj hesapları, sonucu elle bilinen örneklerle test edilmelidir. | 🔴 M | Test sonuçları referans kütüphaneyle ±%1 içinde uyuşur. |
| NFR-039 | **Veri hattı:** Doğrulama kuralları bilerek bozulmuş test verisiyle (negatif fiyat, eksik gün, sıçrama) test edilmeli; sızıntı testi (NFR-027) otomatik çalışmalıdır. | 🔴 M | Bozuk test verisinin tamamı karantinaya alınır; sızıntı testi geçer. |
| NFR-040 | **AI modeli:** Model çıktıları kurallara (toplam %100, tek varlık ≤ %40) uymalı, aynı seed ve girdiyle her zaman aynı sonucu vermeli ve uç durumlarda mantıklı davranmalıdır. ONNX modeli, orijinal PyTorch modeliyle aynı sonucu vermelidir. | 🔴 M | Tüm varlıkların düştüğü test senaryosunda nakit/altın payı artar; ONNX ve PyTorch çıktıları arasındaki fark < 0,0001. |
| NFR-041 | **Mobil uygulama:** Bileşenler için birim testleri, kritik akışlar (kayıt, giriş, öneriyi uygulama) için uçtan uca testler yazılmalıdır. | 🟡 S | Jest birim testleri ve Maestro uçtan uca testleri CI'da başarıyla çalışır. |
| NFR-042 | **Stres testi:** API 10, 50, 100 ve 200 eşzamanlı kullanıcıyla test edilmeli ve sonuçlar raporlanmalıdır. | 🔴 M | Locust raporunda her senaryo için p50 / p95 / p99 yanıt süresi ve hata oranı bulunur. |
| NFR-043 | **Güvenlik testi:** OWASP ZAP taraması yapılmalı; başkasının verisine erişim (IDOR) ve istek sınırı testleri otomatik çalışmalıdır. | 🔴 M | ZAP raporunda yüksek seviyeli açık yoktur; IDOR ve rate limit testleri geçer. |
| NFR-044 | **Sürekli entegrasyon (CI):** Her push'ta lint ve tüm testler otomatik çalışmalı; testi kırmızı olan kod ana dala birleştirilememelidir. | 🔴 M | GitHub Actions'ta başarısız test varken pull request birleştirme butonu pasiftir. |

## N8. Bakım ve Tekrarlanabilirlik

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-045 | Model eğitimleri tekrarlanabilir olmalıdır: aynı yapılandırma ve seed ile yapılan eğitim aynı sonucu vermelidir. | 🔴 M | Aynı deney iki kez çalıştırıldığında test Sharpe değerleri arasındaki fark < 0,01. |
| NFR-046 | Tüm bağımlılıkların sürümleri sabitlenmelidir. | 🔴 M | `requirements.txt` ve `package-lock.json` dosyalarında tüm paketlerin tam sürüm numarası yazılıdır. |
| NFR-047 | Her deney; yapılandırma dosyası, metrikler, kullanılan verinin özeti (hash) ve kodun commit numarasıyla MLflow'a kaydedilmelidir. | 🔴 M | MLflow'daki her deneyden, hangi kod ve hangi veriyle üretildiği bulunabilir. |
| NFR-048 | Tüm sistem tek bir komutla ayağa kaldırılabilmelidir. | 🔴 M | Temiz bir bilgisayarda `docker compose up` komutuyla backend, veritabanı ve model servisi çalışır. |
| NFR-049 | API dokümantasyonu otomatik üretilmeli ve her uç nokta açıklamalı olmalıdır. | 🔴 M | Swagger sayfasında tüm uç noktalar istek ve yanıt örnekleriyle görünür. |
| NFR-050 | Kod belirli bir stil standardına uymalıdır. | 🟡 S | Python için ruff, TypeScript için ESLint ve Prettier kontrolleri CI'da hatasız geçer. |
| NFR-051 | Model sürümleri anlamsal sürümleme (v1.0, v1.1, v2.0) ile yönetilmeli; her sürümle birlikte model dosyası, metrikler ve eğitim verisi tarih aralığı saklanmalıdır. | 🔴 M | Herhangi bir model sürümü için bu üç bilgiye erişilebilir. |
| NFR-052 | Eşik değerleri, vergi ve komisyon oranları ile takvim verileri kod içinde değil, yapılandırma dosyalarında tutulmalıdır. | 🔴 M | Bir eşik değeri, kod değiştirilmeden yalnızca yapılandırma dosyası güncellenerek değiştirilebilir. |

## N9. Kullanılabilirlik ve Erişilebilirlik

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-053 | Arayüz sade bir Türkçe kullanmalı; finans terimleri ilk geçtikleri yerde açıklanmalıdır. | 🔴 M | Finans bilgisi olmayan 5 test kullanıcısından en az 4'ü ana sayfadaki bilgileri doğru yorumlar. |
| NFR-054 | Yeni bir kullanıcı kayıttan ilk öneriyi görmeye kadar olan süreci kısa sürede tamamlayabilmelidir. | 🟡 S | 5 test kullanıcısının ortalama süresi 3 dakikanın altındadır. |
| NFR-055 | Arayüz erişilebilirlik standartlarına uymalıdır: dokunma alanları en az 44×44 pt, metin kontrastı en az 4,5:1, sistem yazı boyutu büyütmesi desteklenmeli ve tüm butonlarda ekran okuyucu etiketi bulunmalıdır. | 🟡 S | Android erişilebilirlik tarayıcısında kritik hata çıkmaz; yazı boyutu en büyüğe çıkarıldığında ekranlar bozulmaz. |
| NFR-056 | Renk, tek başına anlam taşımamalıdır; artış ve azalış hem renk hem simgeyle (▲ ▼) gösterilmelidir. | 🔴 M | Ekran gri tonlamada görüntülendiğinde tüm artış/azalış bilgileri yine anlaşılır. |
| NFR-057 | Uygulama Android 10 ve üzeri sürümlerde, 5–7 inç ekranlarda düzgün çalışmalıdır. | 🔴 M | Test edilen en küçük ve en büyük ekranda yatay kaydırma veya taşan metin olmaz. |
| NFR-058 | Öneri, simülasyon ve asistan ekranlarının tamamında "yatırım tavsiyesi değildir" uyarısı görünmelidir. | 🔴 M | İlgili ekranların hepsinde uyarı metni bulunur. |

## N10. Yedekleme ve Ölçeklenebilirlik

| ID | İster | Öncelik | Kabul kriteri |
|---|---|---|---|
| NFR-059 | Veritabanı her gün otomatik olarak yedeklenmeli ve yedekler 30 gün saklanmalıdır. | 🔴 M | Son 30 günün yedekleri mevcuttur. |
| NFR-060 | Yedekten geri yükleme düzenli olarak test edilmelidir. | 🟡 S | Haftada bir, yedek ayrı bir test veritabanına geri yüklenir ve kayıt sayıları karşılaştırılır. |
| NFR-061 | Sistem bir arızadan sonra makul sürede geri getirilebilmelidir: en fazla 24 saatlik veri kaybı (RPO) ve en fazla 4 saatlik kesinti (RTO). | 🟡 S | Test amaçlı geri yükleme 4 saatin altında tamamlanır. |
| NFR-062 | Model dosyaları ve ham veriler veritabanından ayrı ve yedekli bir depolamada tutulmalıdır. | 🟡 S | Veritabanı silindiğinde model dosyaları ve ham veri etkilenmez. |
| NFR-063 | API durumsuz (stateless) tasarlanmalı ve yatay olarak ölçeklenebilmelidir. | 🟡 S | API'nin ikinci bir kopyası çalıştırıldığında istekler iki kopyaya dağıtılır ve sistem hatasız çalışır. |
| NFR-064 | Öneri üretimi 1.000 portföye kadar ölçeklenebilmelidir. | 🟡 S | 1.000 test portföyü için günlük öneri üretimi 15 dakika içinde tamamlanır. |