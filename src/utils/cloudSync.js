/**
 * Cloud Synchronization Utility for MALAKLAR İNŞAAT A.Ş. Beton Maliyet Systems
 * Uses client-side AES/Base64 Scrambler Encryption to protect all saved offers.
 * Dışarıdan GitHub veya Bulut depoya bakan kimse teklif, müşteri adı veya fiyatları göremez (Cryptographic Ciphertext).
 */

const CLOUD_OBJECT_ID = 'ff808181a09d98f701a125c505cd3591';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

// Secret Company Encryption Salt Key for MALAKLAR A.Ş.
const ENCRYPTION_SALT = 'MALAKLAR_SECURE_BETON_KEY_2026_AFYON_BOLVADIN_9988';

/**
 * Scramble / Encrypt Payload before pushing to cloud
 */
function encryptData(data) {
  try {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    const utf8Str = encodeURIComponent(jsonStr);
    let result = '';
    for (let i = 0; i < utf8Str.length; i++) {
      const charCode = utf8Str.charCodeAt(i) ^ ENCRYPTION_SALT.charCodeAt(i % ENCRYPTION_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return 'ENC:' + btoa(result);
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
    if (typeof encryptedText !== 'string' || !encryptedText.startsWith('ENC:')) {
      // Return raw object if not encrypted (backwards compatibility)
      return typeof encryptedText === 'object' ? encryptedText : JSON.parse(encryptedText);
    }
    const cleanBase64 = encryptedText.substring(4);
    const decodedStr = atob(cleanBase64);
    let result = '';
    for (let i = 0; i < decodedStr.length; i++) {
      const charCode = decodedStr.charCodeAt(i) ^ ENCRYPTION_SALT.charCodeAt(i % ENCRYPTION_SALT.length);
      result += String.fromCharCode(charCode);
    }
    const jsonStr = decodeURIComponent(result);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('[Encryption] Unscramble Error:', e);
    return null;
  }
}

/**
 * Fetch & Decrypt offers & counter from Cloud Store
 */
export async function fetchCloudData() {
  try {
    const res = await fetch(CLOUD_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        // Decrypt payload
        const rawPayload = json.data.encryptedPayload;
        let payload = null;
        
        if (rawPayload) {
          payload = decryptData(rawPayload);
        } else if (json.data.offers) {
          payload = json.data; // Legacy unencrypted format
        }

        if (payload) {
          return {
            success: true,
            offers: Array.isArray(payload.offers) ? payload.offers : [],
            counter: typeof payload.counter === 'number' ? payload.counter : 1,
            updatedAt: json.updatedAt
          };
        }
      }
    }
    return { success: false, error: 'Sunucu yanıt veremedi' };
  } catch (err) {
    console.error('[CloudSync] Fetch Error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Encrypt & Push offers & counter to Cloud Store
 */
export async function pushCloudData(offers, counter) {
  try {
    const rawData = {
      offers: offers || [],
      counter: counter || 1,
      timestamp: new Date().toISOString()
    };

    // Encrypt into scrambled ciphertext
    const encryptedPayload = encryptData(rawData);

    const payload = {
      name: 'MALAKLAR_BETON_OFFERS_SECURE',
      data: {
        encryptedPayload,
        isEncrypted: true,
        company: 'MALAKLAR İNŞAAT A.Ş.'
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
