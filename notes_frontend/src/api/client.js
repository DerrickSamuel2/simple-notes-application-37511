import { getApiBaseUrl } from '../utils/env';

const BASE = getApiBaseUrl();
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let details = text;
    try {
      const maybeJson = JSON.parse(text);
      details = maybeJson?.message || JSON.stringify(maybeJson);
    } catch (_) {
      // keep text
    }
    const err = new Error(`HTTP ${res.status} ${res.statusText}${details ? `: ${details}` : ''}`);
    err.status = res.status;
    throw err;
  }
  // No content
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** Perform a GET request to the API base. */
  const url = `${BASE}${path}`;
  const res = await fetch(url, { method: 'GET' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** Perform a POST request with JSON body. */
  const url = `${BASE}${path}`;
  const res = await fetch(url, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(body) });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPut(path, body) {
  /** Perform a PUT request with JSON body. */
  const url = `${BASE}${path}`;
  const res = await fetch(url, { method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(body) });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** Perform a DELETE request to the given path. */
  const url = `${BASE}${path}`;
  const res = await fetch(url, { method: 'DELETE' });
  return handleResponse(res);
}
