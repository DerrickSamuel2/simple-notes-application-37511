import React from 'react';

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        aria-label="Search notes"
        className="input"
        type="text"
        placeholder="Search notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NoteItem({ note, active, onClick, onDelete }) {
  const cls = ['note-item', active ? 'active' : ''].filter(Boolean).join(' ');
  return (
    <div
      className={cls}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onClick() : null)}
    >
      <div className="note-title">{note.title || 'Untitled'}</div>
      <button
        className="btn btn-danger btn-xs"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete note"
      >
        Delete
      </button>
    </div>
  );
}

function NoteList({ notes, selectedId, onSelect, onDelete }) {
  if (!notes.length) {
    return <div className="empty-list">No notes yet</div>;
  }
  return (
    <div className="note-list">
      {notes.map((n) => (
        <NoteItem
          key={n.id}
          note={n}
          active={n.id === selectedId}
          onClick={() => onSelect(n.id)}
          onDelete={() => onDelete(n.id)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedId,
  onSelect,
  onDelete,
  search,
  onSearchChange,
  onNew
}) {
  /** Sidebar with search and notes list. */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="brand">Notes</h1>
        <button className="btn btn-primary" onClick={onNew}>
          + New Note
        </button>
      </div>
      <SearchBar value={search} onChange={onSearchChange} />
      <NoteList
        notes={notes}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </aside>
  );
}
