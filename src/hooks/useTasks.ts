import { useState, useEffect } from "react";
import type { Task, CreateTaskData } from "../types";
import { TaskService } from "../services/taskService";

const STORAGE_KEY = "smart-planner-tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from database on mount, with local storage fallback
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);

      // First, load from localStorage immediately to prevent empty state
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        try {
          const localTasks = JSON.parse(storedTasks);
          setTasks(localTasks); // Set local tasks first
        } catch (parseError) {
          console.error("Failed to parse stored tasks:", parseError);
        }
      }

      try {
        // Try to load from database
        const dbTasks = await TaskService.getTasks();
        setTasks(dbTasks); // Update with database tasks if successful

        // Also sync any local storage data to database
        await TaskService.syncWithLocalStorage();
      } catch (error) {
        console.error("Failed to load tasks from database:", error);
        setError("Failed to connect to database. Using local data.");
        // Keep the local tasks that were already loaded
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever tasks change (backup)
  useEffect(() => {
    // Always save to localStorage, even if empty array
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (taskData: CreateTaskData) => {
    try {
      setIsLoading(true);
      const newTask = await TaskService.createTask({
        ...taskData,
        completed: false,
      });

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setError(null);
    } catch (error) {
      console.error("Failed to add task:", error);
      setError("Failed to add task. Please try again.");

      // Fallback to local storage
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: string) => {
    // Optimistically update UI
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
      updatedAt: new Date().toISOString(),
    };

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );

    try {
      await TaskService.updateTask(taskId, {
        completed: updatedTask.completed,
      });
      setError(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      setError("Failed to update task completion status.");

      // Revert optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? taskToUpdate : task))
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    // Optimistically remove from UI
    const originalTasks = tasks;
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    try {
      const success = await TaskService.deleteTask(taskId);
      if (!success) throw new Error("Delete operation failed");
      setError(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Failed to delete task. Please try again.");

      // Revert optimistic update
      setTasks(originalTasks);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    // Optimistically update UI
    const originalTasks = tasks;
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    setTasks(updatedTasks);

    try {
      await TaskService.updateTask(taskId, updates);
      setError(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      setError("Failed to update task. Please try again.");

      // Revert optimistic update
      setTasks(originalTasks);
    }
  };

  // Get today's tasks (tasks due today or overdue)
  const getTodaysTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter((task) => {
      if (!task.dueDate) return true; // Tasks without due date show up today
      const taskDate = new Date(task.dueDate).toDateString();
      return taskDate <= today;
    });
  };

  // Get completed tasks
  const getCompletedTasks = () => tasks.filter((task) => task.completed);

  // Get pending tasks
  const getPendingTasks = () => tasks.filter((task) => !task.completed);

  // Refresh tasks from database
  const refreshTasks = async () => {
    setIsLoading(true);
    try {
      const dbTasks = await TaskService.getTasks();
      setTasks(dbTasks);
      setError(null);
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
      setError("Failed to refresh tasks from server.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    getTodaysTasks,
    getCompletedTasks,
    getPendingTasks,
    refreshTasks,
  };
}
