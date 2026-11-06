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
  confidence: 'Yüksek' as Confidence, // FR-054
  changes: [                           // FR-056: dünkü öneriye göre
    { asset: 'Gram altın', from: 15, to: 20 },
    { asset: 'USD', from: 10, to: 9 },
    { asset: 'THYAO', from: 8, to: 4 },
  ],
  explanation:                         // FR-057
    'Enflasyon beklentisi yükseldi ve haber duygu skoru altın lehine döndü.',
  modelVersion: 'v1.3',                // FR-061
};

export const mockDataStatus = {
  updatedAt: '07.11.2026 18:32',       // FR-091
  source: 'yfinance',                  // FR-091
  isStale: false,                      // FR-092: true ise sarı uyarı
};

export const mockUnreadNotifications = 2; // FR-101