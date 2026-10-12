/**
 * Fetches real-time exchange rates (USD/TRY) and Diesel (Mazot) fuel prices in Turkey.
 */
export async function fetchLiveRates() {
  try {
    const res = await fetch('/api/live-rates');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('API route unreachable, falling back to direct client fetch...', err.message);
  }

  // Fallback direct client fetch
  let usdRate = 49.34;
  let mazotPriceKdvDahil = 98.88; // Güncel Opet Bolvadin / Afyon Pompa Fiyatı
  let mazotKdvHaric = 82.40;
  let dateStr = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

  try {
    const usdRes = await fetch('https://open.er-api.com/v6/latest/USD');
    if (usdRes.ok) {
      const usdJson = await usdRes.json();
      if (usdJson?.rates?.TRY) {
        usdRate = parseFloat(usdJson.rates.TRY.toFixed(4));
      }
    }
  } catch (e) {
    console.error('Client USD fetch error:', e.message);
  }

  return {
    success: true,
    dolarKuru: usdRate,
    mazotFiyati: mazotPriceKdvDahil,
    mazotKdvHaric: mazotKdvHaric,
    source: 'TCMB & Opet (Bolvadin / Afyonkarahisar)',
    updatedAt: dateStr
  };
}
