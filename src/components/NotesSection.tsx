import type { Note } from "../types";
import AddNoteForm from "./AddNoteForm";
import NoteItem from "./NoteItem";

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (noteData: { content: string; title?: string }) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
}

export default function NotesSection({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesSectionProps) {
  return (
    <div>
      <AddNoteForm onAddNote={onAddNote} />

      {notes.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <svg
            className="mx-auto h-8 w-8 text-gray-300 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <p className="text-sm">No notes yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Click above to add your first note
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
