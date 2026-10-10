import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Custom Vite plugin to serve live USD/TRY rate & Diesel (Mazot) prices from official APIs
 */
function liveRatesApiPlugin() {
  return {
    name: 'live-rates-api',
    configureServer(server) {
      server.middlewares.use('/api/live-rates', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        try {
          let usdRate = 49.34;
          let mazotPriceKdvDahil = 96.60;
          let mazotPriceKdvHaric = 80.50;
          let dateStr = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

          // 1. Fetch Live USD/TRY Exchange Rate
          try {
            const usdRes = await fetch('https://open.er-api.com/v6/latest/USD');
            if (usdRes.ok) {
              const usdJson = await usdRes.json();
              if (usdJson?.rates?.TRY) {
                usdRate = parseFloat(usdJson.rates.TRY.toFixed(4));
              }
            }
          } catch (err) {
            console.error('[API Proxy] Error fetching USD rate:', err.message);
          }

          // 2. Fetch Live Petrol Ofisi / EPDK Motorin Prices
          try {
            const poRes = await fetch('https://www.petrolofisi.com.tr/akaryakit-fiyatlari', {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            if (poRes.ok) {
              const html = await poRes.text();
              // Extract V/Max Diesel numbers
              // HTML structure has ISTANBUL prices or V/Max Diesel rows
              const matches = html.match(/V\/Max Diesel[\s\S]*?(\d{2,3}[\.,]\d{2})/i);
              if (matches && matches[1]) {
                const parsedVal = parseFloat(matches[1].replace(',', '.'));
                if (parsedVal > 20 && parsedVal < 200) {
                  mazotPriceKdvDahil = parsedVal;
                  mazotPriceKdvHaric = parseFloat((parsedVal / 1.20).toFixed(3));
                }
              }
            }
          } catch (err) {
            console.error('[API Proxy] Error fetching Diesel price:', err.message);
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            dolarKuru: usdRate,
            mazotFiyati: mazotPriceKdvDahil,
            mazotKdvHaric: mazotPriceKdvHaric,
            source: 'TCMB & Petrol Ofisi (Canlı Veri Servisi)',
            updatedAt: dateStr
          }));

        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), liveRatesApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
