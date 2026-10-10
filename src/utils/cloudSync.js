/**
 * Cloud Synchronization Utility for MALAKLAR İNŞAAT A.Ş. Beton Maliyet Systems
 * Uses a dedicated cloud endpoint for real-time cross-device sync (PC, Mobile, Tablet)
 */

const CLOUD_OBJECT_ID = 'ff808181a09d98f701a125c505cd3591';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

/**
 * Fetch offers & counter from Cloud Store
 */
export async function fetchCloudData() {
  try {
    const res = await fetch(CLOUD_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return {
          success: true,
          offers: Array.isArray(json.data.offers) ? json.data.offers : [],
          counter: typeof json.data.counter === 'number' ? json.data.counter : 1,
          updatedAt: json.updatedAt
        };
      }
    }
    return { success: false, error: 'Sunucu yanıt veremedi' };
  } catch (err) {
    console.error('[CloudSync] Fetch Error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Push current offers & counter to Cloud Store
 */
export async function pushCloudData(offers, counter) {
  try {
    const payload = {
      name: 'MALAKLAR_BETON_OFFERS',
      data: {
        offers: offers || [],
        counter: counter || 1,
        lastDevice: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web'
      }
    };

    const res = await fetch(CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const json = await res.json();
      return { success: true, updatedAt: json.updatedAt };
    }
    return { success: false, error: 'Bulut güncelleme başarısız' };
  } catch (err) {
    console.error('[CloudSync] Push Error:', err.message);
    return { success: false, error: err.message };
  }
}
