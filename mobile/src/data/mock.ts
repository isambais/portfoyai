// Sahte (mock) veri. Backend hazır olunca bu dosya yerine API'den gelecek.
// Her alanın yanında hangi FR için var olduğu yazıyor.

export type Confidence = 'Yüksek' | 'Orta' | 'Düşük'; // FR-054

export const mockUser = {
  firstName: 'Isam',
  riskProfile: 'Dengeli',
  riskTestCompleted: false, // FR-017: false ise hatırlatma kartı çıkar
};

export const mockPortfolio = {
  name: 'Ana portföy',      // FR-030
  type: 'Sanal',            // FR-039: 'Sanal' | 'Gerçek'
  totalValue: 125430.5,     // TL
  dailyChange: 1536.2,      // TL
  dailyChangePct: 1.24,     // %
  allocation: [             // toplam = 100
    { label: 'Hisse (BIST)', pct: 45 },
    { label: 'Mevduat / Fon', pct: 30 },
    { label: 'Altın', pct: 15 },
    { label: 'Döviz', pct: 10 },
  ],
};

export const mockRecommendation = {
  id: '2026-11-07',                    // FR-061: her önerinin kimliği
  date: '07.11.2026',
  modelVersion: 'v1.3',                // FR-061
  confidence: 'Yüksek' as Confidence,  // FR-054
  // FR-053: tam ağırlık listesi. from = dünkü, to = bugün önerilen. Toplam = 100.
  weights: [
    { asset: 'Mevduat / Para piyasası', from: 30, to: 30 },
    { asset: 'Gram altın', from: 15, to: 20 },
    { asset: 'THYAO', from: 12, to: 8 },
    { asset: 'GARAN', from: 11, to: 11 },
    { asset: 'USD', from: 10, to: 9 },
    { asset: 'ASELS', from: 9, to: 9 },
    { asset: 'BIMAS', from: 7, to: 7 },
    { asset: 'KCHOL', from: 6, to: 6 },
  ],
  // Ana Sayfa'da sadece değişenler gösterilir (FR-056)
  changes: [
    { asset: 'Gram altın', from: 15, to: 20 },
    { asset: 'THYAO', from: 12, to: 8 },
    { asset: 'USD', from: 10, to: 9 },
  ],
  explanation:                         // FR-057
    'Enflasyon beklentisi yükseldi ve haber duygu skoru altın lehine döndü.',
      // FR-068: kararı hangi ajan ne kadar etkiledi? Toplam = 100.
  contributions: [
    { agent: 'Trend', pct: 40 },
    { agent: 'Makro', pct: 30 },
    { agent: 'Haber', pct: 20 },
    { agent: 'Risk', pct: 10 },
  ],
  // FR-058: attention ısı haritası. Satırdaki varlık, sütundakilere ne kadar "baktı"? (0–1)
  attention: {
    labels: ['Altın', 'USD', 'THYAO', 'GARAN', 'Mevduat'],
    matrix: [
      [0.40, 0.35, 0.05, 0.05, 0.15],
      [0.30, 0.45, 0.10, 0.05, 0.10],
      [0.05, 0.15, 0.40, 0.30, 0.10],
      [0.05, 0.10, 0.35, 0.40, 0.10],
      [0.20, 0.15, 0.05, 0.05, 0.55],
    ],
  },
};

export const mockDataStatus = {
  updatedAt: '07.11.2026 18:32',       // FR-091
  source: 'yfinance',                  // FR-091
  isStale: false,                      // FR-092: true ise sarı uyarı
};

export const mockUnreadNotifications = 2; // FR-101


export const mockCrisisAlert = {
  active: true,                                  // FR-115: mockup'ta görünsün diye true
  message: 'Kriz alarmı: USD/TRY bugün %3,4 yükseldi.',
};

export const mockFavorites = [                   // FR-048
  { asset: 'Gram altın', price: 3125.4, changePct: 0.8 },
  { asset: 'THYAO', price: 312.5, changePct: -1.2 },
  { asset: 'USD/TRY', price: 41.85, changePct: 3.4 },
];


// NFR-052: oranlar kodda değil yapılandırmada durur. Şimdilik burada.
export const mockCostRates = {
  commission: 0.002, // binde 2
  slippage: 0.001,   // binde 1
};

export const mockExpectedBenefitTL = 410; // FR-060: modelin tahmini faydası
export const mockNextTradingDay = '09.11.2026 Pazartesi'; // FR-035: t+1