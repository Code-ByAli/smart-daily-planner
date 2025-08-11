import type { Task, Note, AISuggestion } from "../types";

export interface AnalyticsData {
  // Task Analytics
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  overdueTasks: number;
  tasksByPriority: Record<"low" | "medium" | "high", number>;
  avgTasksPerDay: number;

  // Notes Analytics
  totalNotes: number;
  notesCreatedToday: number;
  avgNotesPerDay: number;

  // Productivity Insights
  mostProductiveDay: string;
  streakDays: number;
  timeToComplete: number; // average hours to complete a task

  // AI Analytics
  totalSuggestions: number;
  suggestionsFollowed: number;
  suggestionAcceptanceRate: number;
}

export interface DailyStats {
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
  notesCreated: number;
}

export class AnalyticsService {
  static calculateTaskAnalytics(tasks: Task[]): Partial<AnalyticsData> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < now;
    }).length;

    const tasksByPriority = {
      low: tasks.filter((task) => task.priority === "low").length,
      medium: tasks.filter((task) => task.priority === "medium").length,
      high: tasks.filter((task) => task.priority === "high").length,
    };

    // Calculate average tasks per day based on task creation dates
    const taskDates = tasks.map((task) =>
      new Date(task.createdAt).toDateString()
    );
    const uniqueDays = new Set(taskDates).size;
    const avgTasksPerDay = uniqueDays > 0 ? totalTasks / uniqueDays : 0;

    return {
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate * 100) / 100,
      overdueTasks,
      tasksByPriority,
      avgTasksPerDay: Math.round(avgTasksPerDay * 100) / 100,
    };
  }

  static calculateNotesAnalytics(notes: Note[]): Partial<AnalyticsData> {
    const totalNotes = notes.length;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const notesCreatedToday = notes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      return noteDate >= today;
    }).length;

    // Calculate average notes per day
    const noteDates = notes.map((note) =>
      new Date(note.createdAt).toDateString()
    );
    const uniqueDays = new Set(noteDates).size;
    const avgNotesPerDay = uniqueDays > 0 ? totalNotes / uniqueDays : 0;

    return {
      totalNotes,
      notesCreatedToday,
      avgNotesPerDay: Math.round(avgNotesPerDay * 100) / 100,
    };
  }

  static calculateProductivityInsights(tasks: Task[]): Partial<AnalyticsData> {
    // Calculate completion streak
    const completedTasks = tasks
      .filter((task) => task.completed)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

    let streakDays = 0;
    const today = new Date();
    const checkDate = new Date(today);

    // Check backwards from today for consecutive days with completed tasks
    while (checkDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      // Check last 30 days
      const dayStart = new Date(
        checkDate.getFullYear(),
        checkDate.getMonth(),
        checkDate.getDate()
      );
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const tasksCompletedOnDay = completedTasks.filter((task) => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= dayStart && taskDate < dayEnd;
      });

      if (tasksCompletedOnDay.length > 0) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Find most productive day of the week
    const dayStats: Record<string, number> = {};
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    completedTasks.forEach((task) => {
      const dayOfWeek = dayNames[new Date(task.updatedAt).getDay()];
      dayStats[dayOfWeek] = (dayStats[dayOfWeek] || 0) + 1;
    });

    const mostProductiveDay =
      Object.entries(dayStats).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "No data";

    // Calculate average time to complete (simplified - based on created to completed time)
    const completedTasksWithDates = tasks.filter(
      (task) => task.completed && task.createdAt && task.updatedAt
    );

    let totalCompletionTime = 0;
    completedTasksWithDates.forEach((task) => {
      const created = new Date(task.createdAt).getTime();
      const completed = new Date(task.updatedAt).getTime();
      totalCompletionTime += completed - created;
    });

    const avgCompletionTimeMs =
      completedTasksWithDates.length > 0
        ? totalCompletionTime / completedTasksWithDates.length
        : 0;
    const timeToComplete =
      Math.round((avgCompletionTimeMs / (1000 * 60 * 60)) * 100) / 100; // Convert to hours

    return {
      mostProductiveDay,
      streakDays,
      timeToComplete,
    };
  }

  static calculateAIAnalytics(
    suggestions: AISuggestion[]
  ): Partial<AnalyticsData> {
    const totalSuggestions = suggestions.length;
    // For now, we'll simulate suggestions followed (in real app, this would be tracked)
    const suggestionsFollowed = Math.floor(totalSuggestions * 0.3); // Assume 30% follow rate
    const suggestionAcceptanceRate =
      totalSuggestions > 0 ? (suggestionsFollowed / totalSuggestions) * 100 : 0;

    return {
      totalSuggestions,
      suggestionsFollowed,
      suggestionAcceptanceRate:
        Math.round(suggestionAcceptanceRate * 100) / 100,
    };
  }

  static generateDailyStats(
    tasks: Task[],
    notes: Note[],
    days: number = 7
  ): DailyStats[] {
    const stats: DailyStats[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const tasksCreated = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= dayStart && taskDate < dayEnd;
      }).length;

      const tasksCompleted = tasks.filter((task) => {
        if (!task.completed) return false;
        const taskDate = new Date(task.updatedAt);
        return taskDate >= dayStart && taskDate < dayEnd;
      }).length;

      const notesCreated = notes.filter((note) => {
        const noteDate = new Date(note.createdAt);
        return noteDate >= dayStart && noteDate < dayEnd;
      }).length;

      stats.push({
        date: dateStr,
        tasksCreated,
        tasksCompleted,
        notesCreated,
      });
    }

    return stats;
  }

  static getFullAnalytics(
    tasks: Task[],
    notes: Note[],
    suggestions: AISuggestion[]
  ): AnalyticsData {
    const taskAnalytics = this.calculateTaskAnalytics(tasks);
    const notesAnalytics = this.calculateNotesAnalytics(notes);
    const productivityInsights = this.calculateProductivityInsights(tasks);
    const aiAnalytics = this.calculateAIAnalytics(suggestions);

    return {
      ...taskAnalytics,
      ...notesAnalytics,
      ...productivityInsights,
      ...aiAnalytics,
    } as AnalyticsData;
  }
}
