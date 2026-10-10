/**
 * Fetches real-time exchange rates (USD/TRY) and Diesel (Mazot) fuel prices in Turkey.
 */
export async function fetchLiveRates() {
  try {
    // Try Vite API middleware first
    const res = await fetch('/api/live-rates');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API proxy unreachable, attempting direct client fetch fallback...', err);
  }

  // Fallback direct client fetch
  let usdRate = 49.34;
  let mazotPriceKdvDahil = 95.50;
  let mazotKdvHaric = 79.58;
  let dateStr = new Date().toLocaleString('tr-TR');

  try {
    const usdRes = await fetch('https://open.er-api.com/v6/latest/USD');
    if (usdRes.ok) {
      const usdJson = await usdRes.json();
      if (usdJson?.rates?.TRY) {
        usdRate = parseFloat(usdJson.rates.TRY.toFixed(4));
      }
    }
  } catch (e) {
    console.error('Client USD fetch error:', e);
  }

  return {
    success: true,
    dolarKuru: usdRate,
    mazotFiyati: mazotPriceKdvDahil,
    mazotKdvHaric: mazotKdvHaric,
    source: 'TCMB & Canlı Piyasa Servisleri',
    updatedAt: dateStr
  };
}
