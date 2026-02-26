/**
 * API client for Smart Mining Helmet backend.
 * Schema: SensorData (temperature, humidity, gasValue, flameStatus, irValue, accelX, accelY, location, emergency, reason, timestamp)
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'https://minersgaurdhelmet.onrender.com/api';

/**
 * Fetch the 15 most recent sensor records (newest first).
 * @returns {Promise<{ success: boolean, count: number, data: Array }>}
 */
export async function getRecentData() {
  const res = await fetch(`${API_BASE}/data`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/**
 * Save one sensor payload from device (e.g. ESP32).
 * @param {Object} payload - Any of: temperature, humidity, gasValue, flameStatus, irValue, accelX, accelY, location, emergency, reason
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function saveData(payload) {
  const res = await fetch(`${API_BASE}/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `API error: ${res.status}`);
  return data;
}

export { API_BASE };
