// JanMitra Hybrid API Client (Full-Stack + Offline-First Fallback)

const API_BASE = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000/api' : '/api');

// Auth Token management
export function getAuthToken(): string | null {
  return localStorage.getItem('janmitra_auth_token');
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('janmitra_auth_token', token);
  else localStorage.removeItem('janmitra_auth_token');
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// 1. Health Check
export async function checkBackendHealth(): Promise<{ online: boolean; aiEngine?: string; database?: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, aiEngine: data.aiEngine, database: data.database };
    }
  } catch {
    // Offline or server not running
  }
  return { online: false };
}

// 2. Natural Language Situation Analyzer
export async function analyzeSituationWithBackend(query: string, language: string = 'en') {
  try {
    const res = await fetch(`${API_BASE}/analyze-situation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ query, language }),
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log('Backend analyzer unreachable, utilizing client-side deterministic rule engine:', err);
  }
  return null;
}

// 3. Legal Circular Simplifier
export async function simplifyLegalWithBackend(text: string, language: string = 'en') {
  try {
    const res = await fetch(`${API_BASE}/simplify-legal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ text, language }),
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log('Backend simplifier unreachable, utilizing local statutory template:', err);
  }
  return null;
}

// 4. Vakh Notices
export async function fetchVakhNotices(district?: string) {
  try {
    const url = district ? `${API_BASE}/vakh/notices?district=${encodeURIComponent(district)}` : `${API_BASE}/vakh/notices`;
    const res = await fetch(url, { headers: { ...authHeaders() }, signal: AbortSignal.timeout(3000) });
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
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
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

// 5. Intelligent OCR & Document Classification
export async function scanDocumentWithBackend(formData: FormData) {
  try {
    const res = await fetch(`${API_BASE}/ocr/scan`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: formData,
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log('OCR backend scan error:', err);
  }
  return null;
}

// 6. Application Status Tracking
export async function trackApplicationNumber(appNumber: string) {
  try {
    const res = await fetch(`${API_BASE}/track/${encodeURIComponent(appNumber)}`, {
      headers: { ...authHeaders() },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log('Tracking request error:', err);
  }
  return null;
}

// 7. Persistent Journeys API
export async function fetchUserJourneys() {
  try {
    const res = await fetch(`${API_BASE}/journeys`, {
      headers: { ...authHeaders() },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.journeys;
    }
  } catch {
    // Fallback to localStorage
  }
  return null;
}

export async function saveUserJourney(journey: any) {
  try {
    const res = await fetch(`${API_BASE}/journeys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(journey),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log('Failed to persist journey to backend:', err);
  }
  return null;
}

export async function updateUserJourneyStage(id: string, stage: string, notes?: string) {
  try {
    const res = await fetch(`${API_BASE}/journeys/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ stage, notes }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Failed to update stage on backend:', err);
  }
  return null;
}

// 8. Auth API
export async function registerCitizen(payload: { name: string; email: string; password: string; role?: string; district?: string }) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (err) {
    return { error: 'Network error connecting to auth server' };
  }
}

export async function loginCitizen(payload: { email: string; password: string }) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (err) {
    return { error: 'Network error connecting to auth server' };
  }
}

export async function fetchCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...authHeaders() }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    //
  }
  return null;
}

// 9. Government Sandbox Integration Adapters
export async function verifyEdistrictCertificate(certType: string, certNumber: string, applicationNumber: string) {
  try {
    const res = await fetch(`${API_BASE}/government/edistrict/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ certType, certNumber, applicationNumber })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('eDistrict verification error:', err);
  }
  return null;
}

export async function checkDbtAadhaarSeeding(aadhaarLast4: string) {
  try {
    const res = await fetch(`${API_BASE}/government/dbt/check-seeding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ aadhaarLast4 })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('DBT check error:', err);
  }
  return null;
}
