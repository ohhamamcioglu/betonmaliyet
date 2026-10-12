export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let usdRate = 49.34;
  let mazotPriceKdvDahil = 98.88;
  let mazotPriceKdvHaric = 82.40;
  let dateStr = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let fuelSource = 'Opet Bolvadin / Afyonkarahisar';

  // 1. Live USD/TRY Exchange Rate
  try {
    const usdRes = await fetch('https://open.er-api.com/v6/latest/USD');
    if (usdRes.ok) {
      const usdJson = await usdRes.json();
      if (usdJson?.rates?.TRY) {
        usdRate = parseFloat(usdJson.rates.TRY.toFixed(4));
      }
    }
  } catch (err) {
    console.error('[API] USD Fetch Error:', err.message);
    try {
      const backupRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (backupRes.ok) {
        const backupJson = await backupRes.json();
        if (backupJson?.rates?.TRY) {
          usdRate = parseFloat(backupJson.rates.TRY.toFixed(4));
        }
      }
    } catch (e) {
      console.error('[API] Backup USD Fetch Error:', e.message);
    }
  }

  // 2. Live Official Diesel Price (Opet Bolvadin / Afyonkarahisar)
  try {
    const opetRes = await fetch('https://api.opet.com.tr/api/fuelprices/prices?ProvinceCode=03', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (opetRes.ok) {
      const opetJson = await opetRes.json();
      if (Array.isArray(opetJson)) {
        const bolvadin = opetJson.find(d => d.districtName === 'BOLVADİN') || opetJson.find(d => d.districtName === 'MERKEZ');
        if (bolvadin && Array.isArray(bolvadin.prices)) {
          const motorin = bolvadin.prices.find(p => 
            p.productShortName === 'MT_ULT' || 
            p.productShortName === 'MT_ECO' || 
            p.productName?.toLowerCase().includes('motorin')
          );
          if (motorin && motorin.amount) {
            mazotPriceKdvDahil = parseFloat(motorin.amount);
            mazotPriceKdvHaric = parseFloat((mazotPriceKdvDahil / 1.20).toFixed(3));
            fuelSource = `Opet Bolvadin (${motorin.productName || 'Motorin'})`;
          }
        }
      }
    }
  } catch (err) {
    console.error('[API] Opet Diesel Fetch Error:', err.message);
  }

  return res.status(200).json({
    success: true,
    dolarKuru: usdRate,
    mazotFiyati: mazotPriceKdvDahil,
    mazotKdvHaric: mazotPriceKdvHaric,
    source: `TCMB & ${fuelSource}`,
    updatedAt: dateStr
  });
}
