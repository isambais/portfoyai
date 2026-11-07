// FR-033 / FR-060: bir önerinin işlem maliyetini hesaplar.
type Weight = { asset: string; from: number; to: number };
type Rates = { commission: number; slippage: number };

export function calcTrades(weights: Weight[], portfolioValue: number) {
  return weights
    .filter((w) => w.to !== w.from) // sadece değişenler işlem gerektirir
    .map((w) => ({
      asset: w.asset,
      from: w.from,
      to: w.to,
      amountTL: ((w.to - w.from) / 100) * portfolioValue, // + al, − sat
    }));
}

export function calcCost(trades: { amountTL: number }[], rates: Rates) {
  const volume = trades.reduce((sum, t) => sum + Math.abs(t.amountTL), 0); // alınan + satılan
  const commission = volume * rates.commission;
  const slippage = volume * rates.slippage;
  return { volume, commission, slippage, total: commission + slippage };
}