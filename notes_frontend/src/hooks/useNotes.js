import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listNotes, createNote, updateNote, deleteNote } from '../services/notesService';

// Simple debounce helper
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  const debounced = useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => cbRef.current(...args), delay);
  }, [delay]);

  // Cleanup
  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);
  return debounced;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Manage list of notes, selected note, and CRUD operations with optimistic updates.
   * - Debounced search
   * - Debounced autosave for title/content changes
   */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const selectedNote = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const fetchNotes = useCallback(async (q = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await listNotes(q);
      setNotes(Array.isArray(data) ? data : []);
      if (data?.length && !selectedId) {
        setSelectedId(data[0].id);
      } else if (!data?.length) {
        setSelectedId(null);
      }
    } catch (e) {
      setError(e.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { fetchNotes(''); }, [fetchNotes]);

  const debouncedSearch = useDebouncedCallback((q) => fetchNotes(q), 300);
  const onSearchChange = useCallback((value) => {
    setSearch(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Create new note
  const addNote = useCallback(async () => {
    const optimistic = {
      id: `tmp-${Date.now()}`,
      title: 'Untitled',
      content: '',
      _optimistic: true
    };
    setNotes(prev => [optimistic, ...prev]);
    setSelectedId(optimistic.id);
    try {
      const created = await createNote({ title: optimistic.title, content: optimistic.content });
      setNotes(prev => prev.map(n => n.id === optimistic.id ? created : n));
      setSelectedId(created.id);
    } catch (e) {
      setNotes(prev => prev.filter(n => n.id !== optimistic.id));
      setError(e.message || 'Failed to create note');
    }
  }, []);

  // Delete note
  const removeNote = useCallback(async (id) => {
    const prev = notes;
    setNotes(prev.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      await deleteNote(id);
    } catch (e) {
      setNotes(prev); // revert
      setError(e.message || 'Failed to delete note');
    }
  }, [notes, selectedId]);

  // Update note fields locally and autosave (debounced)
  const applyLocalUpdate = useCallback((id, patch) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
    debouncedAutosave(id);
  }, []);

  const autosaveRef = useRef({});
  const debouncedAutosave = useDebouncedCallback(async (id) => {
    const note = (notes || []).find(n => n.id === id);
    if (!note || note._optimistic) return;
    // Collapse rapid changes: store last payload by id
    if (!autosaveRef.current[id]) autosaveRef.current[id] = { pending: false };
    if (autosaveRef.current[id].pending) return;

    autosaveRef.current[id].pending = true;
    try {
      await updateNote(id, { title: note.title, content: note.content });
    } catch (e) {
      setError(e.message || 'Failed to save changes');
    } finally {
      autosaveRef.current[id].pending = false;
    }
  }, 500);

  return {
    notes,
    selectedId,
    selectedNote,
    loading,
    error,
    search,
    onSearchChange,
    setSelectedId,
    addNote,
    removeNote,
    applyLocalUpdate,
    refresh: fetchNotes
  };
}
