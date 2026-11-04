# Fonksiyonel İsterler (FR)

> **Proje:** PortföyAI · **Sürüm:** 1.0 · **Kaynak:** [use_case.md](../diagrams/use_case.md) · **İlgili doküman:** [fonksiyonel_olmayan_isterler.md](fonksiyonel_olmayan_isterler.md)

Her ister bir kullanım durumundan (UC) türetilmiştir ve önceliğini o kullanım durumundan alır. Kabul kriterleri, 9. haftadaki testlerin temelini oluşturur.

## 1. Hesap
| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-001 | Sistem, kullanıcının ad, e-posta, telefon numarası ve şifreyle kayıt olmasını sağlamalıdır. | UC-01 | 🔴 M | Geçerli bilgilerle kayıt başlar; daha önce kayıtlı bir e-posta veya telefon numarasıyla kayıt "Bu bilgiyle kayıtlı bir hesap var" hatasıyla reddedilir. |
| FR-002 | Şifre en az 8 karakter olmalı, en az bir harf ve bir rakam içermelidir. | UC-01 | 🔴 M | Kurala uymayan şifreyle kayıt reddedilir ve eksik kural kullanıcıya gösterilir. |
| FR-003 | Sistem, kayıt sırasında e-posta adresine 6 haneli bir doğrulama kodu göndermeli; kod doğrulanmadan hesap aktifleşmemelidir. | UC-01 | 🔴 M | Doğru kod girilince e-posta "doğrulandı" olarak işaretlenir; yanlış kodda hata mesajı gösterilir. |
| FR-004 | Sistem, kayıt sırasında telefon numarasına SMS ile 6 haneli bir doğrulama kodu göndermelidir. | UC-01 | 🟡 S | Doğru kod girilince telefon "doğrulandı" olarak işaretlenir. SMS servisi erişilemezse kayıt e-posta doğrulamasıyla tamamlanır, telefon sonradan doğrulanabilir. |
| FR-005 | Sistem, KVKK aydınlatma metni ve "yatırım tavsiyesi değildir" onayı verilmeden kaydı tamamlamamalıdır. | UC-03 | 🔴 M | Onay kutuları işaretlenmeden "Kayıt ol" butonu pasif kalır; onay tarihi ve metin sürümü veritabanına kaydedilir. |
| FR-006 | Kullanıcı, e-posta + şifre veya telefon + şifre ile giriş yapabilmelidir. | UC-02 | 🔴 M | Her iki yöntemle de doğru bilgiler girilince doğrulama kodu adımına geçilir. |
| FR-007 | Şifre doğrulandıktan sonra sistem, girişte kullanılan kanala (e-posta ise e-postaya, telefon ise SMS'e) tek kullanımlık bir kod göndermeli; kod doğrulanınca erişim token'ı (JWT) vermelidir. | UC-02 | 🔴 M | Doğru kodla giriş tamamlanır ve kullanıcı ana sayfaya yönlenir; kod girilmeden token verilmez. |
| FR-008 | Doğrulama kodları 5 dakika geçerli ve tek kullanımlık olmalıdır; "Kodu tekrar gönder" 60 saniyede bir kullanılabilmelidir. | UC-01, UC-02 | 🔴 M | Süresi dolmuş veya daha önce kullanılmış kod reddedilir; 60 saniye dolmadan tekrar gönder butonu pasif kalır. |
| FR-009 | Hatalı şifre veya kodla yapılan giriş reddedilmeli; hangi bilginin yanlış olduğu belirtilmemeli ve 5 hatalı denemeden sonra hesap 15 dakika kilitlenmelidir. | UC-02 | 🔴 M | Yanlış bilgide "Bilgiler hatalı" mesajı çıkar; 5. hatalı denemeden sonra 15 dakika giriş yapılamaz. |
| FR-010 | Erişim token'ının süresi dolduğunda kullanıcı tekrar giriş yapmaya yönlendirilmelidir. | UC-02 | 🔴 M | Süresi dolmuş token'la yapılan istek 401 hatası alır ve uygulama giriş ekranını açar. |
| FR-011 | Sistem, şifresini unutan kullanıcıya seçtiği kanaldan (e-posta veya SMS) bir sıfırlama kodu göndermelidir. | UC-04 | 🟡 S | Kod doğrulanınca yeni şifre belirlenebilir; eski şifreyle artık giriş yapılamaz. |
| FR-012 | Kullanıcı, kişisel verilerinin tamamını JSON dosyası olarak indirebilmelidir. | UC-05 | 🟡 S | İndirilen dosyada profil, portföyler ve işlem geçmişi yer alır. |
| FR-013 | Kullanıcı hesabını silebilmeli; silme işleminde tüm kişisel verileri kalıcı olarak silinmelidir. | UC-05 | 🟡 S | Silme sonrası aynı bilgilerle giriş yapılamaz; veritabanında kullanıcıya ait kayıt kalmaz. |
| FR-014 | Kullanıcı uygulama dilini (Türkçe / İngilizce / Arapça) ve temasını (aydınlık / karanlık) seçebilmelidir. | UC-06 | ⚪ C | Seçim uygulama yeniden açıldığında korunur; Arapçada ekran sağdan sola (RTL) düzenlenir. |

## 2. Profil ve Plan
| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-015 | Sistem, 6 soruluk bir risk profili testi sunmalı ve cevaplara göre kullanıcıyı temkinli, dengeli veya cesur olarak sınıflandırmalıdır. | UC-07 | 🔴 M | Tüm sorular cevaplanmadan sonuç gösterilmez; aynı cevaplar her zaman aynı profili verir. |
| FR-016 | Risk profili, modelin öneri üretirken kullandığı risk katsayısını (λ) belirlemelidir. | UC-07 | 🔴 M | Aynı piyasa verisiyle, temkinli profile önerilen portföyün volatilitesi dengeli profilinkinden düşüktür. |
| FR-017 | Risk profili testi tamamlanmamışsa sistem varsayılan olarak "dengeli" profili kullanmalı ve kullanıcıya testi çözmesini hatırlatmalıdır. | UC-07 | 🔴 M | Testi çözmemiş kullanıcının önerisi "dengeli" risk katsayısıyla üretilir; öneri ekranında "Varsayılan profil kullanılıyor, testi çöz" uyarısı görünür. |
| FR-018 | Kullanıcı testi istediği zaman tekrar çözebilmeli; yeni profil bir sonraki öneriden itibaren geçerli olmalıdır. | UC-07 | 🔴 M | Profil değişikliği tarihiyle birlikte kaydedilir; eski öneriler değişmez. |
| FR-019 | Kullanıcı ad, hedef tutar, hedef tarihi ve mevcut birikim girerek birden fazla finansal hedef oluşturabilmeli, düzenleyebilmeli ve silebilmelidir. | UC-08 | 🟡 S | En az 5 hedef aynı anda tanımlanabilir. |
| FR-020 | Sistem, her hedef için gereken aylık birikimi ve enflasyona göre hedefin gelecekteki maliyetini hesaplamalıdır. | UC-08 | 🟡 S | Hesaplama güncel enflasyon verisiyle yapılır; bilinen girdilerle yazılan birim testi doğru sonucu verir. |
| FR-021 | Hedef ilerlemesi yüzde olarak ve "yolunda / geride" durumuyla gösterilmelidir. | UC-08 | 🟡 S | Mevcut birikim, planlanan seviyenin altındaysa durum "geride" olarak görünür. |
| FR-022 | Kullanıcı aylık gelirini ve kategori bazlı giderlerini (kira, fatura, market, diğer) girebilmelidir. | UC-09 | ⚪ C | Girilen değerler kaydedilir ve aylık toplam gider otomatik hesaplanır. |
| FR-023 | Sistem, aylık toplam giderin 3 ve 6 katı olarak bir acil durum fonu hedefi önermelidir. | UC-09 | ⚪ C | Aylık gider 25.000 TL ise öneri 75.000 – 150.000 TL olarak gösterilir. |
| FR-024 | Sistem tasarruf oranı, acil durum fonu, portföy çeşitliliği ve reel getiriden 0-100 arası bir finansal sağlık skoru hesaplamalı; alt skorları ayrı ayrı göstermelidir. | UC-10 | ⚪ C | Formül ve ağırlıklar dokümante edilmiştir; aynı verilerle her zaman aynı skor çıkar. |
| FR-025 | Sağlık skorunun yanında hangi verilerle hesaplandığı ve "tahmini bir göstergedir" uyarısı yer almalıdır. | UC-10 | ⚪ C | Skor ekranında hesaplamada kullanılan veriler ve uyarı metni görünür. |
| FR-026 | Kullanıcı harcamalarını kategorilere ayırarak kaydedebilmeli ve aylık harcama özetini görebilmelidir. | UC-11 | ⚪ C | Kategori bazlı aylık toplamlar grafikle gösterilir. |
| FR-027 | Kullanıcı maaş, kira, fatura gibi tekrarlayan tarihleri ekleyebilmeli ve tarihten bir gün önce hatırlatma alabilmelidir. | UC-11 | ⚪ C | Tanımlanan tarihten bir gün önce bildirim gelir. |

## 3. Portföy

| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-028 | Kullanıcı başlangıç sermayesi, varlık evreni ve ajan seçerek sanal portföy oluşturabilmelidir. | UC-12 | 🔴 M | Portföy oluşturulunca ilk öneri hemen üretilir ve gösterilir. |
| FR-029 | Portföy oluştururken başlangıç sermayesi en az 1.000 TL olmalı ve en az 2 varlık seçilmelidir. | UC-12 | 🔴 M | Kurala uymayan girişte "Oluştur" butonu pasif kalır ve eksik kural gösterilir. |
| FR-030 | Kullanıcı birden fazla sanal portföy oluşturabilmeli, adlandırabilmeli ve silebilmelidir. | UC-12 | 🔴 M | En az 3 portföy aynı anda yönetilebilir. |
| FR-031 | Kullanıcı sanal bakiyeye tek seferlik para ekleyebilmeli; eklenen tutar işlem geçmişine kaydedilmelidir. | UC-13 | 🔴 M | Eklenen tutar bakiyeye yansır ve bir sonraki öneride dağıtılır. |
| FR-032 | Kullanıcı aylık otomatik sanal para ekleme planı tanımlayabilmelidir. | UC-13 | 🟡 S | Tanımlanan günde tutar otomatik eklenir ve kullanıcıya bildirilir. |
| FR-033 | Öneri uygulanmadan önce sistem değişen ağırlıkları, tahmini komisyon ve kayma maliyetini gösteren bir onay ekranı göstermelidir. | UC-14 | 🔴 M | "Uygula"ya basınca maliyet özetiyle birlikte onay ekranı açılır. |
| FR-034 | Öneri, kullanıcı açıkça onaylamadan sanal portföye uygulanmamalıdır. | UC-14 | 🔴 M | Onay ekranında "İptal" seçilirse portföy değişmez. |
| FR-035 | Öneri, bir sonraki işlem günü açılış fiyatıyla gerçekleşmiş sayılmalıdır (t+1 kuralı). | UC-14 | 🔴 M | Bugün onaylanan işlem, ertesi işlem gününün açılış fiyatlarıyla hesaplanır. |
| FR-036 | Uygulanan her işlem tarih, eski ve yeni ağırlıklar, maliyet ve portföy değeriyle birlikte kaydedilmelidir. | UC-14 | 🔴 M | İşlem geçmişinde tüm alanlar eksiksiz görünür. |
| FR-037 | Kullanıcı sahip olduğu varlıkları tür, miktar ve isteğe bağlı alış fiyatıyla girebilmelidir. | UC-15 | 🟡 S | "5 gram altın", "1.000 USD" gibi girişler kaydedilir. |
| FR-038 | Gerçek varlıkların değeri günlük güncel fiyatla hesaplanmalı ve kâr/zarar gösterilmelidir. | UC-15 | 🟡 S | Alış fiyatı girilmişse kâr/zarar TL ve yüzde olarak görünür. |
| FR-039 | Gerçek ve sanal portföy verileri ayrı saklanmalı ve arayüzde her zaman açıkça etiketlenmelidir. | UC-15 | 🟡 S | Veritabanında ayrı tablolarda tutulur; her ekranda "Sanal" veya "Gerçek" etiketi görünür. |
| FR-040 | Portföy değer grafiği 1H / 1A / 3A / 1Y / Tümü dönemleriyle gösterilmelidir. | UC-16 | 🔴 M | Dönem değiştirilince grafik 1 saniye içinde güncellenir. |
| FR-041 | Değerler nominal TL, reel TL (TÜFE'den arındırılmış) ve USD olarak görüntülenebilmelidir. | UC-16 | 🔴 M | Üç görünüm arasında geçiş yapılabilir; reel TL hesabı TÜİK TÜFE verisini kullanır. |
| FR-042 | Grafikte XU100 ve enflasyon karşılaştırma çizgileri yer almalıdır. | UC-16 | 🔴 M | Üç çizgi de aynı başlangıç değerine (100) normalize edilerek gösterilir. |
| FR-043 | Sistem portföy için volatilite, maksimum düşüş, Sharpe, Sortino, %95 VaR ve varlıklar arası korelasyonu hesaplamalıdır. Sharpe ve Sortino'da risksiz getiri olarak TL politika faizi kullanılmalıdır. | UC-17 | 🔴 M | Bilinen bir veri setiyle hesaplanan değerler, referans bir kütüphanenin sonuçlarıyla ±%1 içinde uyuşur. |
| FR-044 | Her risk metriğinin yanında kısa ve sade bir açıklama gösterilmelidir. | UC-17 | 🔴 M | ⓘ simgesine dokununca metriğin anlamı Türkçe olarak gösterilir. |
| FR-045 | Tek bir varlık %40'ı veya tek bir sektör %50'yi aşarsa sistem yoğunlaşma uyarısı göstermelidir. | UC-17 | 🔴 M | Eşik aşıldığında risk ekranında uyarı görünür. |
| FR-046 | Sistem, risk profiline uyum, yoğunlaşma ve tek faktöre bağımlılığı kontrol eden kural tabanlı bir sağlık raporu üretmeli; her bulgu için bir öneri sunmalıdır. | UC-18 | ⚪ C | Rapor her bulguyu "iyi / dikkat / risk" seviyesiyle gösterir. |
| FR-047 | Kullanıcının portföyü, AI portföyü, sadece altın ve XU100 aynı dönemde getiri, maksimum düşüş, volatilite ve Sharpe ile karşılaştırılmalıdır. | UC-19 | 🟡 S | Dört

## 4. AI Öneri

| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-053 | Sistem her portföy için günlük önerilen ağırlıkları göstermelidir; ağırlıkların toplamı %100 olmalı ve tek bir varlığın ağırlığı %40'ı aşmamalıdır. | UC-23 | 🔴 M | Her öneride ağırlık toplamı %100 ± 0,01'dir; hiçbir varlık %40'ın üzerinde değildir. |
| FR-054 | Her öneriyle birlikte bir güven seviyesi (Yüksek / Orta / Düşük) gösterilmelidir. Güven seviyesi, farklı seed'lerle eğitilmiş 5 modelin önerdiği ağırlıkların birbirine ne kadar yakın olduğundan hesaplanmalıdır. | UC-23 | 🔴 M | 5 model aynı ağırlıkları verirse güven "Yüksek", çok farklı ağırlıklar verirse "Düşük" çıkar; eşikler dokümante edilmiştir. |
| FR-055 | Güven seviyesi "Düşük" olduğunda kullanıcıya "Model bu öneride kararsız" uyarısı gösterilmelidir. | UC-23 | 🔴 M | Düşük güvenli öneride uyarı kutusu görünür. |
| FR-056 | Her öneride, bir önceki güne göre ağırlık değişimleri (▲ / ▼) gösterilmelidir. | UC-23 | 🔴 M | Önceki öneriye göre artan varlıklar ▲, azalanlar ▼ ile işaretlenir. |
| FR-057 | Sistem her öneri için Türkçe ve sade bir açıklama üretmelidir. Açıklama yalnızca modelin gerçekten kullandığı girdilere dayanmalıdır. | UC-24 | 🔴 M | Açıklamadaki her sayı (ör. "dolar oynaklığı %35 arttı") veritabanındaki değerle aynıdır. |
| FR-058 | Açıklama ekranında varlıklar arası ilişkiyi gösteren bir attention ısı haritası yer almalıdır. | UC-24 | 🔴 M | Isı haritası, o önerinin üretildiği andaki attention değerlerinden çizilir. |
| FR-059 | Gelişmiş görünümde, KAN katmanının öğrendiği eğriler (girdi → karara etkisi) gösterilmelidir. | UC-24 | 🟡 S | En etkili 5 girdinin eğrisi grafikle gösterilir. |
| FR-060 | Açıklamada önerinin tahmini işlem maliyeti ve "bu değişikliğe değer mi?" bilgisi yer almalıdır. | UC-24 | 🔴 M | Maliyet, beklenen faydadan yüksekse "Değişiklik yapmak maliyetli olabilir" notu görünür. |
| FR-061 | Sistem tüm geçmiş önerileri tarih, ağırlıklar, güven seviyesi, açıklama ve modelin sürüm numarasıyla birlikte saklamalı ve listelemelidir. | UC-25 | 🔴 M | Karar geçmişinde her öneri tüm alanlarıyla görünür; hiçbir kayıt sonradan değiştirilemez. |
| FR-062 | Her geçmiş karar için, sonraki 1 hafta ve 1 ay içindeki sonuç hesaplanmalıdır: önerilen dağılım, bir önceki dağılım ve XU100 karşılaştırılmalıdır. | UC-25 | 🔴 M | Her kararın yanında "Bu karar 1 ayda +%2,1 fark yarattı" gibi bir sonuç görünür. |
| FR-063 | Kullanıcı karar geçmişini varlığa ve tarihe göre filtreleyebilmelidir. | UC-25 | 🔴 M | "Altın" seçilince yalnızca altın ağırlığının değiştiği kararlar listelenir. |
| FR-064 | Kullanıcı Türkçe doğal dille soru sorabilmeli; sistem cevabı LLM servisi aracılığıyla üretmelidir. | UC-26 | ⚪ C | "Altın oranım neden arttı?" sorusuna 10 saniye içinde Türkçe cevap gelir. |
| FR-065 | LLM'e bağlam olarak yalnızca kullanıcının kendi portföy verisi, model çıktıları ve metrikler verilmelidir. Cevapta kullanılan verinin tarihi belirtilmeli; veri yoksa asistan bilmediğini söylemelidir. | UC-26 | ⚪ C | 20 soruluk test setinde cevaplardaki tüm sayılar veritabanıyla eşleşir; verisi olmayan soruda "Bu bilgiye sahip değilim" cevabı verilir. |
| FR-066 | Asistan kesin "al / sat" talimatı vermemeli ve her cevapta "yatırım tavsiyesi değildir" uyarısı yer almalıdır. | UC-26 | ⚪ C | Test setindeki "Hangi hisseyi alayım?" gibi sorulara talimat içermeyen cevap verilir. |
| FR-067 | Asistan kullanımı kullanıcı başına günde 20 soruyla sınırlandırılmalıdır. | UC-26 | ⚪ C | 21. soruda "Günlük soru sınırına ulaştın" mesajı gösterilir. |
| FR-068 | Sistem, karar üzerindeki trend, risk, haber ve makro bileşenlerinin katkısını yüzde olarak göstermelidir. | UC-27 | ⚪ C | Katkı yüzdelerinin toplamı %100'dür ve her öneri için ayrı hesaplanır. |

## 6. Öğren ve Bilgi

| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-086 | Uygulamada en az 10 finans eğitim kartı yer almalıdır (enflasyon, faiz, hisse, XU100, döviz, altın, fon, risk ve getiri, Sharpe, çeşitlendirme). Her kart en fazla 150 kelime olmalıdır. | UC-34 | 🟡 S | 10 kartın tamamı Öğren sekmesinde listelenir. |
| FR-087 | Her kartın sonunda tek soruluk bir mini test olmalı; cevap verildikten sonra doğru/yanlış geri bildirimi gösterilmeli ve tamamlanan kart işaretlenmelidir. | UC-34 | 🟡 S | Tamamlanan kartlarda ✓ işareti görünür ve uygulama yeniden açıldığında korunur. |
| FR-088 | Uygulamada geçen finans terimleri için aranabilir bir sözlük olmalı; ekranlardaki terimlere dokununca sözlükteki açıklama açılmalıdır. | UC-34 | 🟡 S | "Sharpe" kelimesine dokununca açıklama penceresi açılır. |
| FR-089 | Ekonomik takvim; TCMB faiz kararı, TÜİK enflasyon açıklaması ve FED kararlarını tarih, önceki değer ve açıklanan değerle göstermelidir. | UC-35 | ⚪ C | Önümüzdeki 30 günün olayları tarih sırasıyla listelenir. |
| FR-090 | Takvimdeki olay tarihleri bir yapılandırma dosyasından okunmalı; açıklanan değerler EVDS'ten otomatik güncellenmelidir. | UC-35 | ⚪ C | Bir olay açıklandıktan sonraki ilk veri çekiminde "açıklanan değer" alanı dolar. |
| FR-091 | Fiyat veya öneri gösteren her ekranda verinin son güncellenme zamanı ve kaynağı gösterilmelidir. | UC-36 | 🔴 M | Ekranda "Son güncelleme: 04.11.2026 18:32 · Kaynak: yfinance" gibi bir bilgi görünür. |
| FR-092 | Veri 1 iş gününden eskiyse veya son veri çekimi başarısız olduysa kullanıcıya uyarı gösterilmelidir. | UC-36 | 🔴 M | Veri çekimi başarısız olduğunda ana sayfada sarı "Veriler güncel değil" uyarısı çıkar. |
| FR-093 | Eksik veya hatalı olarak işaretlenmiş verisi olan varlıklar arayüzde belirtilmelidir. | UC-36 | 🔴 M | Eksik verili varlığın yanında ⚠️ simgesi ve açıklaması görünür. |
| FR-094 | Fiyatların gün sonu fiyatı olduğu, gerçek zamanlı olmadığı açıkça belirtilmelidir. | UC-36 | 🔴 M | Fiyat ekranlarında "Gün sonu fiyatlarıdır" notu görünür. |
| FR-095 | Her öneride, öneriyi üreten modelin sürümü ve modelin hangi tarihe kadarki veriyle eğitildiği gösterilmelidir. | UC-36 | 🔴 M | Öneri detayında "Model v1.3 · Eğitim verisi: 2010–2022" bilgisi görünür. |

## 7. Bildirim

| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-096 | Kullanıcı öneri değişikliği, kriz alarmı, kişisel alarm, günlük özet ve haftalık e-posta bildirimlerini ayrı ayrı açıp kapatabilmelidir. | UC-37 | 🟡 S | Kapatılan türde bildirim gelmez; ayar uygulama yeniden açıldığında korunur. |
| FR-097 | Kullanıcının belirlediği sessiz saatlerde (varsayılan 22:00–08:00) bildirim gönderilmemeli; bu sürede oluşan bildirimler sessiz saat bitince gönderilmelidir. | UC-37 | 🟡 S | 23:00'te oluşan bildirim 08:00'de iletilir. |
| FR-098 | Kullanıcı; varlık fiyatı (yüzde değişim veya seviye), portföy değeri (yüzde kayıp) ve reel getiri (negatife düşme) için alarm kurabilmelidir. | UC-38 | 🟡 S | "Altın %3 düşerse" alarmı, koşul gerçekleştiğinde bildirim gönderir. |
| FR-099 | Kullanıcı en fazla 10 aktif alarm tanımlayabilmeli; alarmları düzenleyebilmeli, duraklatabilmeli ve silebilmelidir. | UC-38 | 🟡 S | 11. alarm eklenmek istendiğinde sınır mesajı gösterilir. |
| FR-100 | Aynı alarm 24 saat içinde en fazla bir kez tetiklenmelidir. | UC-38 | 🟡 S | Koşul gün içinde birden çok kez gerçekleşse de yalnızca bir bildirim gelir. |
| FR-101 | Kullanıcı son 90 günün bildirimlerini okundu/okunmadı durumuyla görebilmeli; bir bildirime dokununca ilgili ekran açılmalıdır. | UC-39 | 🟡 S | Kriz alarmına dokununca ana sayfa, öneri bildirimine dokununca öneri detayı açılır. |

## 8. Otomasyon

| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-102 | Zamanlayıcı, veri çekme işini her iş günü saat 18:30'da (İstanbul saati) başlatmalı; hafta sonları ve resmi tatillerde çalışmamalıdır. | UC-40 | 🔴 M | Log kayıtlarında her iş günü 18:30'da bir çalışma kaydı bulunur; tatil günlerinde kayıt yoktur. |
| FR-103 | Veriler yfinance, TEFAS ve TCMB EVDS'ten alınmalı, tüm fiyatlar TL'ye çevrilmeli ve işlem günlerine hizalanmalıdır. | UC-40 | 🔴 M | Çekilen her kayıtta tarih, varlık, TL fiyat ve kaynak alanları doludur. |
| FR-104 | Bir veri kaynağı yanıt vermezse sistem 5 dakika arayla 3 kez yeniden denemeli; yine başarısız olursa önceki verilerle devam etmeli, hatayı loglamalı ve admin'e uyarı göndermelidir. | UC-40 | 🔴 M | Kaynak kapatıldığında 3 deneme loglanır, uygulama çalışmaya devam eder ve admin uyarı alır. |
| FR-105 | Sistem çekilen verileri doğrulamalıdır: eksik günler, sıfır veya negatif fiyatlar ve olağandışı sıçramalar (ör. hissede günlük %25'ten fazla değişim) tespit edilip karantinaya alınmalı ve işaretlenmelidir. | UC-40 | 🔴 M | Test verisine eklenen negatif fiyat karantinaya alınır ve modele girdi olarak verilmez. |
| FR-106 | Makro veriler yayın tarihleriyle birlikte saklanmalı; BIST 30 bileşimi tarih bazında tutulmalıdır (point-in-time veri). | UC-40 | 🔴 M | Belirli bir tarih için sorgu yapıldığında yalnızca o tarihte yayımlanmış veriler ve o tarihteki endeks bileşimi döner. |
| FR-107 | Sistem KAP duyurularını ve haber başlıklarını günlük olarak çekmeli; BERTurk ile her varlık ve tarih için −1 ile +1 arasında bir duygu skoru hesaplamalıdır. | UC-41 | 🟡 S | Her işlem günü için haberi olan varlıklara bir duygu skoru kaydedilir. |
| FR-108 | Haber verisi alınamazsa model, haber girdisini nötr (0) kabul ederek çalışmaya devam etmelidir. | UC-41 | 🟡 S | Haber kaynağı kapalıyken öneri yine üretilir ve logda "haber verisi yok" notu bulunur. |
| FR-109 | Veri çekimi başarıyla tamamlanınca sistem her aktif portföy için yeni bir öneri üretmelidir; tüm portföylerin önerisi 15 dakika içinde hazır olmalıdır. | UC-42 | 🔴 M | 18:30'da başlayan iş 18:45'e kadar tüm portföyler için öneri kaydı oluşturur. |
| FR-110 | Öneri üretiminde 5 farklı seed ile eğitilmiş model çalıştırılmalı; nihai öneri bu modellerin ortalama ağırlığı, güven seviyesi ise aralarındaki farktan hesaplanmalıdır. | UC-42 | 🔴 M | Her öneri kaydında 5 modelin ayrı ağırlıkları, ortalama ağırlıklar ve güven seviyesi saklanır. |
| FR-111 | Üretilen öneri kurallara uymalıdır: ağırlık toplamı %100, tek varlık en fazla %40, düşük hacimli varlıklarda likidite sınırı. Kural ihlal edilirse ağırlıklar sınırlanıp yeniden normalize edilmelidir. | UC-42 | 🔴 M | Kuralları ihlal eden bir model çıktısı verildiğinde kaydedilen öneri tüm kurallara uyar. |
| FR-112 | Model yüklenemez veya hata verirse son geçerli öneri "güncel değil" etiketiyle korunmalı ve hata loglanmalıdır. | UC-42 | 🔴 M | Model dosyası silindiğinde kullanıcı son öneriyi uyarıyla görür; uygulama çökmez. |
| FR-113 | Ağırlıklardaki toplam değişim belirli bir eşiği (varsayılan %10) aşarsa kullanıcıya öneri bildirimi gönderilmelidir; eşik yapılandırılabilir olmalıdır. | UC-43 | 🟡 S | Değişim %10'un altındaysa bildirim gitmez, üstündeyse gider. |
| FR-114 | Yeni veri geldikten sonra tüm aktif kişisel alarmlar kontrol edilmeli ve koşulu gerçekleşenler için bildirim gönderilmelidir. | UC-44 | 🟡 S | Koşulu sağlanan alarm, veri çekiminden sonra 5 dakika içinde bildirim gönderir. |
| FR-115 | USD/TRY'de günlük %3'ten fazla artış, CDS'te 50 baz puandan fazla artış veya VIX'in 30'u aşması gibi durumlarda kriz alarmı gönderilmelidir; eşikler yapılandırılabilir olmalıdır. | UC-45 | 🟡 S | Test verisinde eşik aşıldığında kriz alarmı tetiklenir. |
| FR-116 | Sistem her sabah 09:00'da günlük özet bildirimi göndermelidir: portföy değişimi, reel getiri, en çok yükselen ve düşen varlık, öneri değişip değişmediği. | UC-46 | 🟡 S | Bildirim içeriği o günün verileriyle eşleşir. |
| FR-117 | Sistem her pazartesi 09:00'da haftalık e-posta raporu göndermelidir: haftalık performans, önceki haftayla karşılaştırma, risk değişimi, karar performansı ve sonraki haftanın ekonomik takvimi. | UC-46 | 🟡 S | Rapor tüm bölümleri içerir ve e-posta istemcilerinde düzgün görünür. |
| FR-118 | Sistem her gün kayan 20 günlük Sharpe değerini ve girdi verisinin dağılım değişimini (PSI) hesaplayıp kaydetmelidir. | UC-47 | 🟡 S | Her iş günü için bir izleme kaydı oluşur. |
| FR-119 | PSI 0,25'i aşarsa veya kayan Sharpe sıfırın altına düşerse sistem admin'e uyarı göndermeli ve yeniden eğitimi tetiklemelidir. | UC-47 | 🟡 S | Eşik aşıldığında uyarı gönderilir ve bir yeniden eğitim işi başlar. |

## 9. Yönetim

| ID | İster | Kaynak | Öncelik | Kabul kriteri |
|---|---|---|---|---|
| FR-120 | Yönetim ekranı ve admin API'leri yalnızca admin rolündeki kullanıcılara açık olmalıdır. | UC-48–51 | 🟡 S | Normal kullanıcının admin API'sine isteği 403 hatası alır; yönetim menüsü normal kullanıcıya görünmez. |
| FR-121 | Admin canlı model performansını (kayan Sharpe grafiği) ve drift uyarılarını görebilmelidir. | UC-48 | 🟡 S | Son 90 günün performans grafiği ve uyarı listesi görünür. |
| FR-122 | Model yeniden eğitimi admin tarafından elle, Zamanlayıcı tarafından her ayın 1'inde veya drift uyarısıyla başlatılabilmelidir. Yeni model, doğrulama setinde mevcut modelden daha iyi Sharpe değeri vermezse yayına alınmamalıdır. | UC-49 | 🟡 S | Daha kötü performanslı yeni model "reddedildi" olarak kaydedilir ve mevcut model yayında kalır. |
| FR-123 | Tüm model sürümleri saklanmalı ve admin yayındaki modeli tek işlemle önceki bir sürüme geri alabilmelidir. | UC-49 | 🟡 S | Geri alma işleminden sonraki ilk öneri, seçilen eski sürümle üretilir. |
| FR-124 | Admin model sürümlerini ve deney kayıtlarını (parametreler, metrikler, eğitim tarihi) görüntüleyebilmelidir. | UC-50 | 🟡 S | Her sürüm için MLflow kaydına bağlantı ve temel metrikler listelenir. |
| FR-125 | Admin sistem durumunu görebilmelidir: son veri çekme zamanı ve sonucu, kaynak bazında hatalar ve servislerin çalışma durumu. | UC-51 | 🟡 S | Bir veri kaynağı hata verdiğinde durum ekranında kırmızı olarak görünür. |
| FR-126 | Admin işlemleri (yeniden eğitim, geri alma) kim, ne zaman ve ne yaptı bilgisiyle denetim kaydına (audit log) yazılmalıdır. | UC-49 | 🟡 S | Her admin işlemi için tarih, admin ve işlem türünü içeren bir kayıt oluşur. |