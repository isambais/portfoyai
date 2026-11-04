# Sistem Mimarisi

> **Proje:** PortföyAI · **Sürüm:** 1.0 · **Hafta:** 1 · **İlgili:** [use_case.md](use_case.md) · [fonksiyonel_isterler.md](../requirements/fonksiyonel_isterler.md)

PortföyAI; mobil istemci, API katmanı, uygulama servisleri, AI ve veri motorları, veri katmanı ve dış servislerden oluşan katmanlı bir mimariye sahiptir. Sistemde iki ana akış vardır:

- **Kullanıcı akışı (düz oklar):** Gün boyunca çalışır, hızlıdır, çoğunlukla hazır sonuçları okur.
- **Arka plan akışı (kalın oklar):** Her iş günü 18:30'da çalışır; veri toplama, öneri üretimi ve bildirimleri yapar.

## Genel Mimari

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B', 'clusterBkg':'#F8FAFC', 'clusterBorder':'#CBD5E1'}}}%%
flowchart TB
    %% ===== 1. İSTEMCİ =====
    subgraph L1[" 1 · İstemci "]
        APP[ Mobil Uygulama<br/>React Native · Expo]
    end

    %% ===== 2. GİRİŞ KAPISI =====
    subgraph L2[" 2 · API Katmanı "]
        GW[API Gateway · FastAPI<br/>JWT · istek sınırı · yönlendirme]
    end

    %% ===== 3. UYGULAMA SERVİSLERİ =====
    subgraph L3[" 3 · Uygulama Servisleri "]
        AUTH[Kullanıcı ve<br/>Güvenlik]
        PORT[Portföy<br/>Yönetimi]
        RISK[Risk Analiz<br/>Motoru]
        SIM[Simülasyon<br/>Motoru]
        REP[Raporlama<br/>Motoru]
        ASST[Asistan<br/>Servisi]
    end

    %% ===== 4. AI VE VERİ MOTORLARI =====
    subgraph L4[" 4 · AI ve Veri Motorları (arka plan) "]
        SCH[ Zamanlayıcı<br/>APScheduler]
        ING[Veri Toplama<br/>Motoru]
        AI[ AI Karar Motoru<br/>çoklu ajan · Transformer · KAN]
        MON[Model İzleme<br/>drift · yeniden eğitim]
        NOTIF[Bildirim<br/>Motoru]
    end

    %% ===== 5. VERİ KATMANI =====
    subgraph L5[" 5 · Veri Katmanı "]
        DB[(PostgreSQL<br/>kullanıcı · portföy · öneri)]
        RAW[(Ham Veri Deposu<br/>Parquet)]
        REG[(Model Deposu<br/>MLflow)]
        CACHE[(Önbellek<br/>Redis)]
    end

    %% ===== 6. DIŞ SERVİSLER =====
    subgraph L6[" 6 · Dış Servisler "]
        SRC[Veri Kaynakları<br/>yfinance · TEFAS · EVDS · KAP]
        PUSH[Push Servisi]
        SMS[SMS Servisi]
        MAIL[E-posta Servisi]
        LLM[LLM Servisi]
    end

    %% ===== KULLANICI AKIŞI (düz oklar) =====
    APP --> GW
    GW --> AUTH & PORT & RISK & SIM & REP & ASST
    AUTH --> DB
    PORT --> DB
    RISK --> DB
    SIM --> AI
    SIM --> CACHE
    REP --> DB
    ASST --> DB
    ASST --> LLM
    AUTH --> SMS & MAIL

    %% ===== ARKA PLAN AKIŞI (kalın oklar) =====
    SCH ==> ING
    ING ==> SRC
    ING ==> RAW
    ING ==> DB
    SCH ==> AI
    AI ==> REG
    AI ==> DB
    SCH ==> MON
    MON ==> REG
    SCH ==> NOTIF
    NOTIF ==> PUSH & MAIL

    %% ===== STİL =====
    classDef client fill:#1E293B,stroke:#1E293B,color:#FFFFFF,font-weight:bold
    classDef gateway fill:#4F46E5,stroke:#3730A3,color:#FFFFFF,font-weight:bold
    classDef service fill:#E0E7FF,stroke:#6366F1,color:#1E1B4B
    classDef engine fill:#ECFDF5,stroke:#10B981,color:#064E3B
    classDef ai fill:#10B981,stroke:#047857,color:#FFFFFF,font-weight:bold
    classDef data fill:#FFF7ED,stroke:#F97316,color:#7C2D12
    classDef ext fill:#F1F5F9,stroke:#94A3B8,color:#334155

    class APP client
    class GW gateway
    class AUTH,PORT,RISK,SIM,REP,ASST service
    class SCH,ING,MON,NOTIF engine
    class AI ai
    class DB,RAW,REG,CACHE data
    class SRC,PUSH,SMS,MAIL,LLM ext
```

## AI Karar Motoru (Çoklu Ajan Sistemi)

AI karar motoru, her biri farklı bir bilgi türünde uzmanlaşmış dört ajandan ve bu ajanların çıktılarını birleştiren merkezi bir karar mekanizmasından oluşur. Kullanıcı bu motoru doğrudan görmez; yalnızca sonuçlarını (öneri, güven seviyesi, açıklama, ajan katkıları) görür.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B', 'clusterBkg':'#F8FAFC', 'clusterBorder':'#CBD5E1'}}}%%
flowchart TB
    %% ===== GİRDİLER =====
    subgraph IN[" Girdiler "]
        I1[Fiyat geçmişi<br/>~45 varlık · son 60 gün]
        I2[Haberler<br/>KAP · haber başlıkları]
        I3[Makro veriler<br/>TÜFE · faiz · CDS · VIX]
        I4[Kullanıcı bilgisi<br/>mevcut ağırlıklar · risk profili]
    end

    %% ===== AJANLAR =====
    subgraph AG[" Uzman Ajanlar "]
        A1[ Trend Ajanı<br/>PatchTST · SSL ön-eğitimli]
        A2[ Haber Ajanı<br/>BERTurk · duygu skoru]
        A3[ Makro Ajanı<br/>makro kodlayıcı]
        A4[ Risk Ajanı<br/>volatilite · korelasyon · λ]
    end

    %% ===== MERKEZİ KARAR =====
    subgraph CORE[" Merkezi Karar Mekanizması "]
        F[Varlıklar Arası Transformer<br/>cross-attention · varlık maskesi]
        H[KAN Actor<br/>softmax → ağırlıklar]
    end

    %% ===== GÜVEN VE KISITLAR =====
    subgraph POST[" Güven ve Kısıtlar "]
        E[5 Seed Ensemble<br/>ortalama ağırlık + güven seviyesi]
        R[Kısıt Katmanı<br/>toplam %100 · tek varlık ≤ %40 · likidite]
    end

    O[(Öneri kaydı<br/>ağırlıklar · güven · attention · ajan katkıları)]

    %% ===== AKIŞ =====
    I1 --> A1
    I2 --> A2
    I3 --> A3
    I1 --> A4
    I4 --> A4
    A1 & A2 & A3 & A4 --> F
    F --> H
    H --> E
    E --> R
    R --> O

    %% ===== STİL =====
    classDef input fill:#F1F5F9,stroke:#94A3B8,color:#334155
    classDef agent fill:#ECFDF5,stroke:#10B981,color:#064E3B
    classDef core fill:#10B981,stroke:#047857,color:#FFFFFF,font-weight:bold
    classDef post fill:#E0E7FF,stroke:#6366F1,color:#1E1B4B
    classDef out fill:#FFF7ED,stroke:#F97316,color:#7C2D12

    class I1,I2,I3,I4 input
    class A1,A2,A3,A4 agent
    class F,H core
    class E,R post
    class O out
```

| Bileşen | Görevi |
|---|---|
| **Trend Ajanı** | Fiyat hareketlerini ve trendleri öğrenir. Etiketsiz veriyle önceden eğitilmiş (SSL) PatchTST kodlayıcısıdır. |
| **Haber Ajanı** | KAP duyurularını ve haber başlıklarını BERTurk ile olumlu / olumsuz olarak değerlendirir. |
| **Makro Ajanı** | Enflasyon, faiz, CDS ve VIX gibi ekonomik göstergelerden piyasanın genel durumunu çıkarır. |
| **Risk Ajanı** | Oynaklık, korelasyon ve kullanıcının risk profilinden (λ) ne kadar risk alınabileceğini belirler. |
| **Varlıklar Arası Transformer** | Dört ajanın çıktısını birleştirir; her varlığı bir token olarak ele alıp varlıklar arasındaki ilişkiyi öğrenir. Verisi olmayan varlıklar maskelenir. |
| **KAN Actor** | Her varlık için bir skor üretir; skorlar softmax ile toplamı %100 olan ağırlıklara dönüşür. |
| **5 Seed Ensemble** | Farklı başlangıçlarla eğitilmiş 5 model çalıştırılır; ortalama ağırlık öneri, aralarındaki fark güven seviyesi olur. |
| **Kısıt Katmanı** | Ağırlık toplamı, tek varlık sınırı ve likidite kurallarını uygular. |