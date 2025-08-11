import type { Task, Note, AISuggestion } from "../types";

export class AIService {
  private static generateId() {
    return crypto.randomUUID();
  }

  private static getRandomConfidence(min: number = 70, max: number = 95) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateTaskSuggestions(tasks: Task[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const now = new Date();

    // Check for overdue tasks
    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < now;
    });

    if (overdueTasks.length > 0) {
      suggestions.push({
        id: this.generateId(),
        title: `${overdueTasks.length} Overdue Task${
          overdueTasks.length > 1 ? "s" : ""
        }`,
        description: `You have ${overdueTasks.length} overdue task${
          overdueTasks.length > 1 ? "s" : ""
        }. Consider prioritizing these or adjusting their due dates.`,
        type: "priority",
        actionable: true,
        confidence: this.getRandomConfidence(85, 95),
        basedOn: ["task_due_dates", "task_completion_status"],
        createdAt: new Date().toISOString(),
      });
    }

    // Check for high priority tasks
    const highPriorityIncomplete = tasks.filter(
      (task) => task.priority === "high" && !task.completed
    );

    if (highPriorityIncomplete.length > 0) {
      suggestions.push({
        id: this.generateId(),
        title: "Focus on High Priority Tasks",
        description: `You have ${
          highPriorityIncomplete.length
        } high-priority task${
          highPriorityIncomplete.length > 1 ? "s" : ""
        } remaining. Tackle these first for maximum impact.`,
        type: "productivity",
        actionable: true,
        confidence: this.getRandomConfidence(80, 90),
        basedOn: ["task_priority", "task_completion_status"],
        createdAt: new Date().toISOString(),
      });
    }

    // Check task completion patterns
    const completedToday = tasks.filter((task) => {
      const today = new Date().toDateString();
      return (
        task.completed && new Date(task.updatedAt).toDateString() === today
      );
    });

    const totalTasks = tasks.length;
    const completionRate =
      totalTasks > 0
        ? (tasks.filter((t) => t.completed).length / totalTasks) * 100
        : 0;

    if (completedToday.length >= 3) {
      suggestions.push({
        id: this.generateId(),
        title: "Great Productivity Today! 🎉",
        description: `You've completed ${completedToday.length} tasks today. Keep up the momentum!`,
        type: "wellness",
        actionable: false,
        confidence: this.getRandomConfidence(95, 100),
        basedOn: ["task_completion_patterns", "daily_activity"],
        createdAt: new Date().toISOString(),
      });
    }

    if (completionRate > 0 && completionRate < 30) {
      suggestions.push({
        id: this.generateId(),
        title: "Break Down Large Tasks",
        description:
          "Consider breaking your tasks into smaller, more manageable chunks to improve completion rates.",
        type: "productivity",
        actionable: true,
        confidence: this.getRandomConfidence(75, 85),
        basedOn: ["completion_rate", "task_complexity"],
        createdAt: new Date().toISOString(),
      });
    }

    return suggestions;
  }

  static generateSchedulingSuggestions(tasks: Task[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check for tasks without due dates
    const tasksWithoutDates = tasks.filter(
      (task) => !task.dueDate && !task.completed
    );

    if (tasksWithoutDates.length > 0) {
      suggestions.push({
        id: this.generateId(),
        title: "Add Due Dates for Better Planning",
        description: `${tasksWithoutDates.length} task${
          tasksWithoutDates.length > 1 ? "s" : ""
        } don't have due dates. Setting deadlines helps with prioritization.`,
        type: "scheduling",
        actionable: true,
        confidence: this.getRandomConfidence(70, 80),
        basedOn: ["task_due_dates", "planning_effectiveness"],
        createdAt: new Date().toISOString(),
      });
    }

    // Suggest optimal work times
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      suggestions.push({
        id: this.generateId(),
        title: "Peak Focus Time",
        description:
          "This is typically a high-energy time. Consider tackling your most challenging tasks now.",
        type: "scheduling",
        actionable: true,
        confidence: this.getRandomConfidence(75, 85),
        basedOn: ["circadian_rhythms", "productivity_patterns"],
        createdAt: new Date().toISOString(),
      });
    }

    return suggestions;
  }

  static generateNoteSuggestions(notes: Note[], tasks: Task[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    if (notes.length > 5 && tasks.length < 3) {
      suggestions.push({
        id: this.generateId(),
        title: "Convert Notes to Tasks",
        description:
          "You have many notes but few tasks. Consider turning actionable notes into tasks with due dates.",
        type: "productivity",
        actionable: true,
        confidence: this.getRandomConfidence(70, 80),
        basedOn: ["note_count", "task_count", "content_analysis"],
        createdAt: new Date().toISOString(),
      });
    }

    if (notes.length === 0) {
      suggestions.push({
        id: this.generateId(),
        title: "Start Capturing Ideas",
        description:
          "Use the notes section to capture quick thoughts, ideas, or reminders throughout your day.",
        type: "productivity",
        actionable: true,
        confidence: this.getRandomConfidence(60, 70),
        basedOn: ["note_usage_patterns"],
        createdAt: new Date().toISOString(),
      });
    }

    return suggestions;
  }

  static generateAllSuggestions(tasks: Task[], notes: Note[]): AISuggestion[] {
    const taskSuggestions = this.generateTaskSuggestions(tasks);
    const schedulingSuggestions = this.generateSchedulingSuggestions(tasks);
    const noteSuggestions = this.generateNoteSuggestions(notes, tasks);

    const allSuggestions = [
      ...taskSuggestions,
      ...schedulingSuggestions,
      ...noteSuggestions,
    ];

    // Sort by confidence (highest first) and limit to top suggestions
    return allSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Show top 3 suggestions
  }
}
