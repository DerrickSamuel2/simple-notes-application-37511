//
// Environment utilities for resolving API base URLs and other config.
// Uses CRA-style REACT_APP_ variables. Do not import dotenv on client.
//
/* eslint-disable no-undef */

// PUBLIC_INTERFACE
export function getEnvVar(name, fallback = undefined) {
  /** Returns a specific environment variable from process.env with a fallback. */
  const value = process.env[name];
  return value !== undefined && value !== '' ? value : fallback;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Determines the API base URL.
   * Order of precedence:
   * - REACT_APP_API_BASE
   * - REACT_APP_BACKEND_URL
   * - If running on localhost, default to http://localhost:3001
   * - Else, relative /api path (assumes reverse proxy)
   */
  const fromExplicit = getEnvVar('REACT_APP_API_BASE') || getEnvVar('REACT_APP_BACKEND_URL');
  if (fromExplicit) return stripTrailingSlash(fromExplicit);

  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  if (isLocalhost) return 'http://localhost:3001';

  return '/api';
}

function stripTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
