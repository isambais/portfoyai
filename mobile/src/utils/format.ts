// Sayıyı Türk lirası formatında yaz: 125430.5 → "₺125.430,50"
export const formatTL = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

// Yüzdeyi Türkçe yaz: 1.24 → "%1,24"
export const formatPct = (value: number) =>
  '%' + value.toLocaleString('tr-TR', { maximumFractionDigits: 2 });