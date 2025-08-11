import { supabase, TABLES } from "../lib/supabase";
import type { DatabaseTask } from "../lib/supabase";
import type { Task } from "../types";

export class TaskService {
  // Create a new task
  static async createTask(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    try {
      const dbTask: Omit<DatabaseTask, "id" | "created_at" | "updated_at"> = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        due_date: task.dueDate,
        user_id: "anonymous", // For now, using anonymous user
      };

      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .insert([dbTask])
        .select()
        .single();

      if (error) throw error;

      return this.mapDatabaseTaskToTask(data);
    } catch (error) {
      console.error("Failed to create task in database:", error);
      // Fallback: return task with generated ID for local storage
      return {
        id: crypto.randomUUID(),
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Get all tasks
  static async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(this.mapDatabaseTaskToTask);
    } catch (error) {
      console.error("Failed to fetch tasks from database:", error);
      // Fallback to local storage
      const localTasks = localStorage.getItem("tasks");
      return localTasks ? JSON.parse(localTasks) : [];
    }
  }

  // Update a task
  static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const dbUpdates: Partial<DatabaseTask> = {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        completed: updates.completed,
        due_date: updates.dueDate,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return this.mapDatabaseTaskToTask(data);
    } catch (error) {
      console.error("Failed to update task in database:", error);
      // Fallback: return updated task for local storage handling
      return {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      } as Task;
    }
  }

  // Delete a task
  static async deleteTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLES.TASKS).delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to delete task from database:", error);
      return false;
    }
  }

  // Get tasks for today
  static async getTodaysTasks(): Promise<Task[]> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .select("*")
        .or(`due_date.gte.${startOfDay},due_date.lte.${endOfDay}`)
        .order("priority", { ascending: false });

      if (error) throw error;

      return data.map(this.mapDatabaseTaskToTask);
    } catch (error) {
      console.error("Failed to fetch today's tasks:", error);
      // Fallback to local storage
      return [];
    }
  }

  // Helper method to map database task to app task
  private static mapDatabaseTaskToTask(dbTask: DatabaseTask): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description,
      priority: dbTask.priority,
      completed: dbTask.completed,
      dueDate: dbTask.due_date,
      createdAt: dbTask.created_at,
      updatedAt: dbTask.updated_at,
    };
  }

  // Sync local storage with database
  static async syncWithLocalStorage(): Promise<void> {
    try {
      const localTasks = localStorage.getItem("tasks");
      if (!localTasks) return;

      const tasks: Task[] = JSON.parse(localTasks);

      // Check if tasks exist in database, if not, upload them
      for (const task of tasks) {
        const { data } = await supabase
          .from(TABLES.TASKS)
          .select("id")
          .eq("id", task.id)
          .single();

        if (!data) {
          // Task doesn't exist in database, create it
          await this.createTask(task);
        }
      }
    } catch (error) {
      console.error("Failed to sync tasks with local storage:", error);
    }
  }
}
