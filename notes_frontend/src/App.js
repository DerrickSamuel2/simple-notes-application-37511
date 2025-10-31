import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { useNotes } from './hooks/useNotes';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component for Simple Notes Application.
   * Applies theme and renders a sidebar with notes list and main editor panel.
   */
  const [theme, setTheme] = useState('light');

  const {
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
    applyLocalUpdate
  } = useNotes();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App app-layout">
      <div className="topbar">
        <div className="logo">🗒️ Simple Notes</div>
        <div className="topbar-actions">
          <button className="btn btn-secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>

      <div className="content">
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={removeNote}
          search={search}
          onSearchChange={onSearchChange}
          onNew={addNote}
        />
        <Main
          note={selectedNote}
          onPatch={applyLocalUpdate}
        />
      </div>
      {loading && <div className="toast info">Loading…</div>}
      {error && <div className="toast error" role="alert">{error}</div>}
    </div>
  );
}

export default App;
