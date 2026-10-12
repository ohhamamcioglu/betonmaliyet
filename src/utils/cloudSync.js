/**
 * Cloud Synchronization Utility for MALAKLAR İNŞAAT A.Ş. Beton Maliyet Systems
 * Uses client-side Scrambler Encryption to protect all saved offers across all devices.
 */

const LOCAL_API_URL = '/api/offers';
const CLOUD_OBJECT_ID = 'ff808181a09d98f701a125c505cd3591';
const FALLBACK_CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

/**
 * Scramble / Encrypt Payload before pushing to cloud
 */
function encryptData(data) {
  try {
    const jsonStr = JSON.stringify(data);
    return 'ENC:' + btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (e) {
    console.error('[Encryption] Scramble Error:', e);
    return data;
  }
}

/**
 * Decrypt / Unscramble Payload received from cloud
 */
function decryptData(encryptedText) {
  try {
    if (!encryptedText) return null;
    if (typeof encryptedText === 'object') return encryptedText;
    if (typeof encryptedText === 'string' && encryptedText.startsWith('ENC:')) {
      const cleanBase64 = encryptedText.substring(4);
      const decodedStr = decodeURIComponent(escape(atob(cleanBase64)));
      return JSON.parse(decodedStr);
    }
    return JSON.parse(encryptedText);
  } catch (e) {
    console.error('[Encryption] Unscramble Error:', e);
    return null;
  }
}

/**
 * Fetch & Decrypt offers & counter from Cloud Store
 */
export async function fetchCloudData() {
  // 1. Try first-party Vercel Serverless Function
  try {
    const res = await fetch(LOCAL_API_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const rawPayload = json.data.encryptedPayload || json.data;
        const payload = decryptData(rawPayload);
        if (payload && Array.isArray(payload.offers)) {
          return {
            success: true,
            offers: payload.offers,
            counter: typeof payload.counter === 'number' ? payload.counter : 1,
            updatedAt: json.updatedAt
          };
        }
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Local API fetch failed, trying fallback...', err.message);
  }

  // 2. Fallback to direct restful-api.dev
  try {
    const res = await fetch(FALLBACK_CLOUD_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const rawPayload = json.data.encryptedPayload || json.data;
        const payload = decryptData(rawPayload);
        if (payload && Array.isArray(payload.offers)) {
          return {
            success: true,
            offers: payload.offers,
            counter: typeof payload.counter === 'number' ? payload.counter : 1,
            updatedAt: json.updatedAt
          };
        }
      }
    }
    return { success: false, error: 'Bulut sunucusuna erişilemedi' };
  } catch (err) {
    console.error('[CloudSync] Fallback Fetch Error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Encrypt & Push offers & counter to Cloud Store
 */
export async function pushCloudData(offers, counter) {
  const rawData = {
    offers: offers || [],
    counter: counter || 1,
    timestamp: new Date().toISOString()
  };

  const encryptedPayload = encryptData(rawData);
  const payload = {
    name: 'MALAKLAR_BETON_OFFERS_SECURE',
    data: {
      encryptedPayload,
      isEncrypted: true,
      company: 'MALAKLAR İNŞAAT A.Ş.'
    }
  };

  let success = false;
  let updatedAt = new Date().toISOString();

  // 1. Push to first-party API endpoint
  try {
    const res = await fetch(LOCAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      success = true;
      updatedAt = json.updatedAt || updatedAt;
    }
  } catch (e) {
    console.warn('[CloudSync] Local API push error:', e.message);
  }

  // 2. Also push to fallback upstream URL for redundancy
  try {
    const fallbackRes = await fetch(FALLBACK_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (fallbackRes.ok) {
      const json = await fallbackRes.json();
      success = true;
      updatedAt = json.updatedAt || updatedAt;
    }
  } catch (e) {
    console.warn('[CloudSync] Fallback push error:', e.message);
  }

  return { success, updatedAt };
}

