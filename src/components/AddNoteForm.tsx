import { useState } from "react";
import type { CreateNoteData } from "../types";

interface AddNoteFormProps {
  onAddNote: (noteData: CreateNoteData) => void;
}

export default function AddNoteForm({ onAddNote }: AddNoteFormProps) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    const noteData: CreateNoteData = {
      content: content.trim(),
    };

    onAddNote(noteData);
    setContent("");
    setIsExpanded(false);
  };

  const handleTextareaClick = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setContent("");
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="relative">
        <textarea
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={handleTextareaClick}
          rows={isExpanded ? 4 : 1}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
        />

        {isExpanded && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded transition-colors"
            >
              Save Note
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
