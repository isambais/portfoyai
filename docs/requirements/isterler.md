# Fonksiyonel İsterler (FR)

> **Proje:** PortföyAI · **Sürüm:** 1.0 · **Kaynak:** [use_case.md](../diagrams/use_case.md)

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