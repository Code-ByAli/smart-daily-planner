import { useState, useEffect } from "react";
import type { Note, CreateNoteData, UpdateNoteData } from "../types";
import { NoteService } from "../services/noteService";

const NOTES_STORAGE_KEY = "smart-planner-notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notes from database on mount, with local storage fallback
  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      setError(null);

      // First, load from localStorage immediately to prevent empty state
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        try {
          const localNotes = JSON.parse(storedNotes);
          setNotes(localNotes); // Set local notes first
        } catch (parseError) {
          console.error("Failed to parse stored notes:", parseError);
        }
      }

      try {
        // Try to load from database
        const dbNotes = await NoteService.getNotes();
        setNotes(dbNotes); // Update with database notes if successful

        // Also sync any local storage data to database
        await NoteService.syncWithLocalStorage();
      } catch (error) {
        console.error("Failed to load notes from database:", error);
        setError("Failed to connect to database. Using local data.");
        // Keep the local notes that were already loaded
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to localStorage whenever notes change (backup)
  useEffect(() => {
    // Always save to localStorage, even if empty array
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = async (noteData: CreateNoteData) => {
    try {
      setIsLoading(true);
      const newNote = await NoteService.createNote(noteData);

      setNotes((prevNotes) => [newNote, ...prevNotes]); // Add to beginning for newest first
      setError(null);
    } catch (error) {
      console.error("Failed to add note:", error);
      setError("Failed to add note. Please try again.");

      // Fallback to local storage
      const newNote: Note = {
        id: crypto.randomUUID(),
        content: noteData.content,
        title: noteData.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (noteId: string, updates: UpdateNoteData) => {
    // Optimistically update UI
    const originalNotes = notes;
    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : note
    );

    setNotes(updatedNotes);

    try {
      await NoteService.updateNote(noteId, updates);
      setError(null);
    } catch (error) {
      console.error("Failed to update note:", error);
      setError("Failed to update note. Please try again.");

      // Revert optimistic update
      setNotes(originalNotes);
    }
  };

  const deleteNote = async (noteId: string) => {
    // Optimistically remove from UI
    const originalNotes = notes;
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

    try {
      const success = await NoteService.deleteNote(noteId);
      if (!success) throw new Error("Delete operation failed");
      setError(null);
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note. Please try again.");

      // Revert optimistic update
      setNotes(originalNotes);
    }
  };

  // Get recent notes (for quick access)
  const getRecentNotes = (limit: number = 5) => {
    return notes
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, limit);
  };

  // Refresh notes from database
  const refreshNotes = async () => {
    setIsLoading(true);
    try {
      const dbNotes = await NoteService.getNotes();
      setNotes(dbNotes);
      setError(null);
    } catch (error) {
      console.error("Failed to refresh notes:", error);
      setError("Failed to refresh notes from server.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getRecentNotes,
    refreshNotes,
  };
}
