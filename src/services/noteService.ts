import { supabase, TABLES } from "../lib/supabase";
import type { DatabaseNote } from "../lib/supabase";
import type { Note, CreateNoteData, UpdateNoteData } from "../types";

export class NoteService {
  // Create a new note
  static async createNote(noteData: CreateNoteData): Promise<Note> {
    try {
      const dbNote: Omit<DatabaseNote, "id" | "created_at" | "updated_at"> = {
        title: noteData.title || "Untitled Note",
        content: noteData.content,
        tags: [],
        user_id: "anonymous", // For now, using anonymous user
      };

      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .insert([dbNote])
        .select()
        .single();

      if (error) throw error;

      return this.mapDatabaseNoteToNote(data);
    } catch (error) {
      console.error("Failed to create note in database:", error);
      // Fallback: return note with generated ID for local storage
      return {
        id: crypto.randomUUID(),
        content: noteData.content,
        title: noteData.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Get all notes
  static async getNotes(): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(this.mapDatabaseNoteToNote);
    } catch (error) {
      console.error("Failed to fetch notes from database:", error);
      // Fallback to local storage
      const localNotes = localStorage.getItem("notes");
      return localNotes ? JSON.parse(localNotes) : [];
    }
  }

  // Update a note
  static async updateNote(id: string, updates: UpdateNoteData): Promise<Note> {
    try {
      const dbUpdates: Partial<DatabaseNote> = {
        title: updates.title,
        content: updates.content,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return this.mapDatabaseNoteToNote(data);
    } catch (error) {
      console.error("Failed to update note in database:", error);
      // Fallback: return updated note for local storage handling
      return {
        id,
        content: updates.content || "",
        title: updates.title,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Delete a note
  static async deleteNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLES.NOTES).delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to delete note from database:", error);
      return false;
    }
  }

  // Get recent notes (last 10)
  static async getRecentNotes(): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map(this.mapDatabaseNoteToNote);
    } catch (error) {
      console.error("Failed to fetch recent notes:", error);
      // Fallback to local storage
      return [];
    }
  }

  // Helper method to map database note to app note
  private static mapDatabaseNoteToNote(dbNote: DatabaseNote): Note {
    return {
      id: dbNote.id,
      content: dbNote.content,
      title: dbNote.title,
      createdAt: dbNote.created_at,
      updatedAt: dbNote.updated_at,
    };
  }

  // Sync local storage with database
  static async syncWithLocalStorage(): Promise<void> {
    try {
      const localNotes = localStorage.getItem("notes");
      if (!localNotes) return;

      const notes: Note[] = JSON.parse(localNotes);

      // Check if notes exist in database, if not, upload them
      for (const note of notes) {
        const { data } = await supabase
          .from(TABLES.NOTES)
          .select("id")
          .eq("id", note.id)
          .single();

        if (!data) {
          // Note doesn't exist in database, create it
          await this.createNote({ content: note.content, title: note.title });
        }
      }
    } catch (error) {
      console.error("Failed to sync notes with local storage:", error);
    }
  }
}
