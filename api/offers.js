const CLOUD_OBJECT_ID = 'ff808181a09d98f701a125c505cd3591';
const UPSTREAM_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Read cloud offers
  if (req.method === 'GET') {
    try {
      const upstreamRes = await fetch(UPSTREAM_URL);
      if (upstreamRes.ok) {
        const json = await upstreamRes.json();
        return res.status(200).json({
          success: true,
          data: json.data || {},
          updatedAt: json.updatedAt
        });
      }
      return res.status(500).json({ success: false, error: 'Bulut sunucu yanıt veremedi' });
    } catch (err) {
      console.error('[API Offers GET] Error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST / PUT: Update cloud offers
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const payload = {
        name: 'MALAKLAR_BETON_OFFERS_SECURE',
        data: body.data || body
      };

      const upstreamRes = await fetch(UPSTREAM_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (upstreamRes.ok) {
        const json = await upstreamRes.json();
        return res.status(200).json({
          success: true,
          updatedAt: json.updatedAt
        });
      }
      return res.status(500).json({ success: false, error: 'Bulut kayıt başarısız oldu' });
    } catch (err) {
      console.error('[API Offers PUT] Error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
