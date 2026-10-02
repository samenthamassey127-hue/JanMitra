// JanMitra Hybrid API Client (Full-Stack + Offline-First Fallback)

const API_BASE = 'http://localhost:5000/api';

export async function checkBackendHealth(): Promise<{ online: boolean; aiEngine?: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, aiEngine: data.aiEngine };
    }
  } catch {
    // Offline or server not running
  }
  return { online: false };
}

export async function analyzeSituationWithBackend(query: string, language: string = 'en') {
  try {
    const res = await fetch(`${API_BASE}/analyze-situation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log('Backend not reachable, utilizing client-side deterministic rule engine:', err);
  }
  return null;
}

export async function fetchVakhNotices(district?: string) {
  try {
    const url = district ? `${API_BASE}/vakh/notices?district=${encodeURIComponent(district)}` : `${API_BASE}/vakh/notices`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return data.notices;
    }
  } catch {
    // Fallback to local notices
  }
  return null;
}

export async function broadcastVakhNotice(notice: {
  author: string;
  handle: string;
  role: string;
  location: string;
  district: string;
  content: string;
  category: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/vakh/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notice),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.notice;
    }
  } catch (err) {
    console.log('Failed to broadcast to backend:', err);
  }
  return null;
}
