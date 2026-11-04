# Akış Diyagramları

> **Proje:** PortföyAI · **Sürüm:** 1.0 · **Hafta:** 1 · **İlgili:** [use_case.md](use_case.md) · [sistem_mimarisi.md](sistem_mimarisi.md)

Bu doküman, sistemin kritik süreçlerini adım adım ve **hata dallarıyla** birlikte gösterir.

| Şekil | Anlamı |
|---|---|
| Oval | Başlangıç / bitiş |
| Dikdörtgen | İşlem adımı |
| Eşkenar dörtgen | Karar (soru) |
| 🟥 Kırmızı kutu | Hata veya uyarı durumu |
| 🟩 Yeşil oval | Başarılı bitiş |

## Akış 1: Kayıt ve İki Aşamalı Giriş

**İlgili:** UC-02 · FR-006 – FR-010

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B'}}}%%
flowchart TD
    S([Kullanıcı giriş ekranını açar]) --> A[E-posta veya telefon + şifre girer]
    A --> B{Hesap 5 hatalı deneme<br/>nedeniyle kilitli mi?}
    B -- Evet --> E1[Hata: 15 dakika sonra tekrar dene]
    E1 --> X([Bitti])
    B -- Hayır --> C{Bilgiler doğru mu?}
    C -- Hayır --> E2[Hata: Bilgiler hatalı<br/>deneme sayacı +1]
    E2 --> A
    C -- Evet --> D{Giriş kanalı?}
    D -- E-posta --> K1[E-postaya 6 haneli kod gönder]
    D -- Telefon --> K2[SMS ile 6 haneli kod gönder]
    K2 --> SMS{SMS servisi<br/>çalışıyor mu?}
    SMS -- Hayır --> E3[Uyarı: SMS gönderilemedi<br/>kodu e-postayla gönder]
    E3 --> K1
    SMS -- Evet --> G
    K1 --> G[Kullanıcı kodu girer]
    G --> H{Kod süresi<br/>5 dakikayı geçti mi?}
    H -- Evet --> E4[Hata: Kodun süresi doldu<br/>Tekrar gönder]
    E4 --> D
    H -- Hayır --> I{Kod doğru mu?}
    I -- Hayır --> E5[Hata: Kod hatalı<br/>deneme sayacı +1]
    E5 --> L{Deneme sayısı<br/>5'e ulaştı mı?}
    L -- Hayır --> G
    L -- Evet --> KL[Hesabı 15 dakika kilitle]
    KL --> E1
    I -- Evet --> J[Token oluştur<br/>sayacı sıfırla]
    J --> Y([Ana sayfa açılır])

    classDef err fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
    classDef ok fill:#DCFCE7,stroke:#16A34A,color:#14532D
    Kod hatalı → sayaç +1 → 5 oldu mu?
                 ├─ Hayır → tekrar dene
                 └─ Evet → hesabı kilitle → "15 dakika sonra tekrar dene"
    class Y ok
```

## Akış 2: Günlük Veri Çekme ve Doğrulama

**İlgili:** UC-40 · FR-102 – FR-106 · NFR-022 – NFR-026

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B'}}}%%
flowchart TD
    S([Zamanlayıcı 18:30'da tetikler]) --> T{Bugün iş günü mü?}
    T -- Hayır --> X0([Çalışmadan bitir])
    T -- Evet --> A[Kaynak listesini al<br/>yfinance · TEFAS · EVDS · KAP]
    A --> B[Sıradaki kaynaktan veri iste]
    B --> C{Kaynak yanıt verdi mi?}
    C -- Hayır --> R{Deneme sayısı < 3 ?}
    R -- Evet --> W[5 dakika bekle] --> B
    R -- Hayır --> E1[Hata: Kaynak erişilemiyor<br/>önceki veriyle devam · logla · admin'e uyarı]
    E1 --> N
    C -- Evet --> RAW[Ham veriyi değiştirmeden kaydet]
    RAW --> V{Veri doğrulaması}
    V -- Eksik gün --> E2[Önceki değerle doldur<br/>'eksik' olarak işaretle]
    V -- Sıfır / negatif fiyat<br/>veya aşırı sıçrama --> E3[Kaydı karantinaya al<br/>modele verme · logla]
    V -- Sorun yok --> P
    E2 --> P
    E3 --> P
    P[TL'ye çevir · işlem günlerine hizala<br/>yayın tarihiyle kaydet]
    P --> N{Başka kaynak var mı?}
    N -- Evet --> B
    N -- Hayır --> Q{Tamlık oranı ≥ %98 mi?}
    Q -- Hayır --> E4[Uyarı: Veri eksik<br/>kullanıcıya 'veriler güncel değil' göster]
    E4 --> Y
    Q -- Evet --> Y([Öneri üretme akışını başlat])

    classDef err fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
    classDef ok fill:#DCFCE7,stroke:#16A34A,color:#14532D
    class E1,E2,E3,E4 err
    class Y ok
```

## Akış 3: Öneri Üretme

**İlgili:** UC-42, UC-43 · FR-109 – FR-113 · NFR-004, NFR-005

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B'}}}%%
flowchart TD
    S([Veri çekme tamamlandı]) --> A[Aktif portföyleri listele]
    A --> B[Sıradaki portföy için<br/>son 60 günlük pencereyi hazırla]
    B --> C{Tüm varlıkların<br/>verisi var mı?}
    C -- Hayır --> M[Eksik varlığı maskele] --> D
    C -- Evet --> D{Kullanıcının risk<br/>profili var mı?}
    D -- Hayır --> E1[Uyarı: Varsayılan 'dengeli'<br/>profil kullanılıyor]
    E1 --> F
    D -- Evet --> F{Model yüklenebildi mi?}
    F -- Hayır --> E2[Hata: Son geçerli öneriyi koru<br/>'güncel değil' etiketi · logla]
    E2 --> N
    F -- Evet --> G[5 seed modelini çalıştır]
    G --> H[Ortalama ağırlık = öneri<br/>modeller arası fark = güven]
    H --> I{Kurallar sağlanıyor mu?<br/>toplam %100 · tek varlık ≤ %40}
    I -- Hayır --> J[Ağırlıkları sınırla<br/>ve yeniden normalize et] --> K
    I -- Evet --> K[Türkçe açıklama ve<br/>attention değerlerini üret]
    K --> L[(Öneriyi kaydet)]
    L --> Q{Dağılım %10'dan<br/>fazla değişti mi?}
    Q -- Evet --> P[Push bildirimi gönder]
    Q -- Hayır --> N
    P --> N{Başka portföy var mı?}
    N -- Evet --> B
    N -- Hayır --> Y([Tüm öneriler hazır])

    classDef err fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
    classDef ok fill:#DCFCE7,stroke:#16A34A,color:#14532D
    class E1,E2 err
    class Y ok
```

## Akış 4: Öneriyi Onayla ve Uygula

**İlgili:** UC-14 · FR-033 – FR-036 · NFR-027, NFR-029

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B'}}}%%
flowchart TD
    S([Kullanıcı 'Uygula' butonuna basar]) --> A{Öneri güncel mi?<br/>bugünün önerisi mi}
    A -- Hayır --> E1[Uyarı: Bu öneri güncel değil<br/>yine de uygulamak istiyor musun?]
    E1 --> A2{Kullanıcı devam<br/>etmek istiyor mu?}
    A2 -- Hayır --> X([Vazgeçildi · portföy değişmedi])
    A2 -- Evet --> B
    A -- Evet --> B[Değişen ağırlıkları ve<br/>tahmini komisyon + kayma maliyetini hesapla]
    B --> C{Maliyet, beklenen<br/>faydadan yüksek mi?}
    C -- Evet --> E2[Uyarı: Bu değişiklik<br/>maliyetli olabilir]
    E2 --> D
    C -- Hayır --> D[Onay ekranını göster<br/>eski → yeni ağırlıklar · maliyet]
    D --> F{Kullanıcı onayladı mı?}
    F -- Hayır --> X
    F -- Evet --> G{Bakiye yeterli mi?}
    G -- Hayır --> E3[Hata: Sanal bakiye yetersiz]
    E3 --> X
    G -- Evet --> H[İşlemi 'bekliyor' olarak kaydet]
    H --> I[Ertesi işlem günü açılışını bekle<br/>t+1 kuralı]
    I --> J{Açılış fiyatları<br/>geldi mi?}
    J -- Hayır --> E4[Hata: Fiyat yok<br/>işlemi bir sonraki güne ertele]
    E4 --> I
    J -- Evet --> K[Açılış fiyatlarıyla işlemi gerçekleştir<br/>komisyon ve kaymayı düş]
    K --> L[(İşlem geçmişine kaydet<br/>tarih · eski/yeni ağırlık · maliyet · değer)]
    L --> Y([Portföy güncellendi · kullanıcıya bildirim])

    classDef err fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
    classDef ok fill:#DCFCE7,stroke:#16A34A,color:#14532D
    class E1,E2,E3,E4 err
    class Y ok
```

## Akış 5: Drift Kontrolü ve Yeniden Eğitim

**İlgili:** UC-47, UC-49 · FR-118 – FR-123 · NFR-032, NFR-051

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B'}}}%%
flowchart TD
    S1([Günlük kontrol · öneri sonrası]) --> A[Kayan 20 günlük Sharpe<br/>ve girdi PSI değerini hesapla]
    A --> B{Eşik aşıldı mı?<br/>PSI > 0,25 veya Sharpe < 0}
    B -- Hayır --> Z([Logla · bitti])
    B -- Evet --> C[Admin'e uyarı gönder]
    C --> T
    S2([Ayın 1'i · planlı eğitim]) --> T
    S3([Admin 'Yeniden eğit' der]) --> T
    T[Son verilerle yeni modeli eğit<br/>5 seed]
    T --> D{Eğitim başarılı mı?}
    D -- Hayır --> E1[Hata: Eğitim başarısız<br/>mevcut model yayında kalır · logla]
    E1 --> Z2([Bitti])
    D -- Evet --> G{Doğrulama setinde<br/>mevcut modelden iyi mi?}
    G -- Hayır --> E2[Yeni model reddedildi<br/>mevcut model yayında kalır]
    E2 --> Z2
    G -- Evet --> H{En az bir baseline'ı<br/>geçiyor mu? 1/N · XU100 · Markowitz}
    H -- Hayır --> E2
    H -- Evet --> I[Yeni sürümü yayına al<br/>eski sürümü arşivle · audit log]
    I --> J{İlk 5 iş gününde<br/>sorun çıktı mı?}
    J -- Evet --> E3[Önceki sürüme geri al<br/>admin'e bildir]
    E3 --> Z2
    J -- Hayır --> Y([Yeni model kalıcı olarak yayında])

    classDef err fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
    classDef ok fill:#DCFCE7,stroke:#16A34A,color:#14532D
    class E1,E2,E3 err
    class Y ok
```