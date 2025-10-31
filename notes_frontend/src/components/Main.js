import React from 'react';

function EmptyState() {
  return (
    <div className="empty-state">
      <h2>Select or create a note</h2>
      <p>Use the sidebar to create a new note or select an existing one.</p>
    </div>
  );
}

function NoteEditor({ note, onTitleChange, onContentChange }) {
  return (
    <div className="editor">
      <input
        className="title-input"
        placeholder="Title"
        value={note.title || ''}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        className="content-input"
        placeholder="Start writing…"
        value={note.content || ''}
        onChange={(e) => onContentChange(e.target.value)}
        aria-label="Note content"
      />
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Main({ note, onPatch }) {
  /** Main panel showing either editor for selected note or an empty state. */
  if (!note) return <main className="main"><EmptyState /></main>;
  return (
    <main className="main">
      <NoteEditor
        note={note}
        onTitleChange={(v) => onPatch(note.id, { title: v })}
        onContentChange={(v) => onPatch(note.id, { content: v })}
      />
    </main>
  );
}
