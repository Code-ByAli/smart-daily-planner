import { useState } from "react";
import type { Note } from "../types";

interface NoteItemProps {
  note: Note;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
}

export default function NoteItem({
  note,
  onUpdateNote,
  onDeleteNote,
}: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSave = () => {
    if (editContent.trim() && editContent.trim() !== note.content) {
      onUpdateNote(note.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-2">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              autoFocus
            />
          ) : (
            <p
              className="text-sm text-gray-700 whitespace-pre-wrap cursor-pointer hover:bg-yellow-100 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {note.content}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-1 ml-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => onDeleteNote(note.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete note"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-2 text-xs text-gray-500">
          {formatDate(note.updatedAt)}
        </div>
      )}
    </div>
  );
}
