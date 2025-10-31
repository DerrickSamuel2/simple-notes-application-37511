import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

const NOTES_BASE = '/api/notes';

// PUBLIC_INTERFACE
export async function listNotes(query = '') {
  /** List notes; supports optional search by 'q' query param. */
  const qs = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiGet(`${NOTES_BASE}${qs}`);
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id. */
  return apiGet(`${NOTES_BASE}/${id}`);
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note. payload: { title, content }. */
  return apiPost(`${NOTES_BASE}`, payload);
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note by id. payload: { title?, content? }. */
  return apiPut(`${NOTES_BASE}/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  return apiDelete(`${NOTES_BASE}/${id}`);
}
