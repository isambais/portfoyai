# AI Pipeline

> **Proje:** PortföyAI · **Sürüm:** 1.0 · **Hafta:** 1 · **İlgili:** [sistem_mimarisi.md](sistem_mimarisi.md) · [fonksiyonel_olmayan_isterler.md](../requirements/fonksiyonel_olmayan_isterler.md)

Bu diyagram, yapay zekâ modelinin **veriden yayına ve izlemeye kadar** olan yaşam döngüsünü gösterir. Günlük öneri üretimi (çıkarım) [sistem_mimarisi.md](sistem_mimarisi.md) içindeki *AI Karar Motoru* bölümünde anlatılmıştır; bu doküman modelin **nasıl üretildiğini, doğrulandığını ve güncellendiğini** anlatır.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontFamily':'Arial', 'lineColor':'#64748B', 'clusterBkg':'#F8FAFC', 'clusterBorder':'#CBD5E1'}}}%%
flowchart TB
    subgraph P1[" 1 · Veri Hazırlama "]
        A1[Ham veri<br/>~45 varlık · 2010–2025<br/>fiyat · haber · makro]
        A2[Öznitelikler<br/>log getiri · volatilite · RSI · MACD]
        A3[Zaman sıralı bölme<br/>eğitim 2010–20 · doğrulama 2021–22<br/>test 2023–25 🔒]
        A1 --> A2 --> A3
    end

    subgraph P2[" 2 · Öz-Denetimli Ön-Eğitim (SSL) "]
        B1[PatchTST kodlayıcı<br/>60 gün → 5 günlük parçalar]
        B2[Kayıp: maskeleme + karşıt öğrenme]
        B3{Temsil kontrolü<br/>etkin rank · probe · t-SNE}
        B4[B planı: yalnız maskeleme<br/>veya hazır model Chronos]
        B1 --> B2 --> B3
        B3 -- geçmedi --> B4
    end

    subgraph P3[" 3 · Pekiştirmeli Öğrenme (RL) "]
        C1[Varlıklar arası Transformer<br/>+ haber + makro]
        C2[KAN actor / critic]
        C3[PPO · SAC · TD3<br/>5 seed]
        C4[Gym ortamı<br/>ödül = getiri − maliyet − kayma − λ·düşüş]
        C1 --> C2 --> C3
        C3 <--> C4
    end

    subgraph P4[" 4 · Değerlendirme "]
        D1[Walk-forward backtest<br/>+ sızıntı testi]
        D2[Baseline kıyası<br/>1/N · XU100 · Markowitz · LSTM · EIIE]
        D3[Ablation<br/>SSL · KAN · haber · makro]
        D4[Anlamlılık<br/>bootstrap · Deflated Sharpe]
        D1 --> D2 --> D3 --> D4
    end

    subgraph P5[" 5 · Yayına Alma "]
        G{Yayın kapısı<br/>baseline'ı geçiyor mu?}
        E1[ONNX dönüşümü<br/>PyTorch ile çıktı kontrolü]
        E2[(Model deposu<br/>MLflow · sürüm v1.x)]
        E3[Canlı servis<br/>AI karar motoru]
        G -- evet --> E1 --> E2 --> E3
    end

    subgraph P6[" 6 · İzleme "]
        F1[Kayan Sharpe · PSI drift]
        F2{Eşik aşıldı mı<br/>veya ayın 1'i mi?}
        F1 --> F2
    end

    MLF[(MLflow deney kaydı<br/>config · metrik · veri hash · commit)]

    A3 --> B1
    B3 -- geçti --> C1
    B4 --> C1
    C3 --> D1
    D4 --> G
    G -- hayır --> R[Model reddedilir<br/>deney raporlanır]
    E3 --> F1
    F2 -- evet --> A1
    C3 -.-> MLF
    D4 -.-> MLF

    classDef gate fill:#FEF3C7,stroke:#D97706,color:#78350F,font-weight:bold
    classDef bad fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
    classDef store fill:#FFF7ED,stroke:#F97316,color:#7C2D12
    classDef live fill:#10B981,stroke:#047857,color:#FFFFFF,font-weight:bold
    class G,B3,F2 gate
    class R,B4 bad
    class E2,MLF store
    class E3 live
```

| Aşama | Ne yapılır? | İlgili isterler |
|---|---|---|
| **1 · Veri Hazırlama** | Ham veri toplanır, öznitelikler çıkarılır, veri zaman sırasıyla bölünür; test seti kilitlenir. | NFR-022 – 026, NFR-030 |
| **2 · SSL Ön-Eğitim** | Kodlayıcı etiketsiz veriyle piyasanın yapısını öğrenir; temsil kalitesi kontrol edilir, yetersizse B planına geçilir. | Öneri formu · Risk İP4 |
| **3 · RL Eğitimi** | Ajan, simülasyon ortamında ödül ve ceza alarak portföy dağıtmayı öğrenir; her yapılandırma 5 seed ile eğitilir. | NFR-029, NFR-033, NFR-045 |
| **4 · Değerlendirme** | Walk-forward backtest, sızıntı testi, baseline kıyası, ablation ve istatistiksel anlamlılık. | NFR-027 – 036 |
| **5 · Yayına Alma** | Baseline'ı geçemeyen model reddedilir; geçen model ONNX'e çevrilip sürümlenir ve yayına alınır. | NFR-032, NFR-040, NFR-051 |
| **6 · İzleme** | Canlı performans ve drift izlenir; eşik aşılırsa veya ayın 1'inde döngü baştan başlar. | FR-118 – 123 |