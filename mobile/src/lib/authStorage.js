import * as SecureStore from 'expo-secure-store';

const KEY = 'qc_auth';
const DAYS_7_MS = 7 * 24 * 60 * 60 * 1000;

export async function saveAuth(auth) {
  const expiresAt = Date.now() + DAYS_7_MS;
  const payload = { ...auth, expiresAt };
  await SecureStore.setItemAsync(KEY, JSON.stringify(payload));
  return payload;
}

export async function loadAuth() {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data?.token || !data?.expiresAt) return null;
    if (Date.now() > data.expiresAt) {
      await clearAuth();
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function clearAuth() {
  try { await SecureStore.deleteItemAsync(KEY); } catch {}
}
