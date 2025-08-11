import { useMemo } from "react";
import type { Task, Note, AISuggestion } from "../types";
import { AnalyticsService } from "../services/analyticsService";

export function useAnalytics(
  tasks: Task[],
  notes: Note[],
  suggestions: AISuggestion[]
) {
  const analytics = useMemo(() => {
    return AnalyticsService.getFullAnalytics(tasks, notes, suggestions);
  }, [tasks, notes, suggestions]);

  const dailyStats = useMemo(() => {
    return AnalyticsService.generateDailyStats(tasks, notes, 7);
  }, [tasks, notes]);

  const weeklyTrend = useMemo(() => {
    if (dailyStats.length < 2) return 0;

    const recentAvg =
      dailyStats.slice(-3).reduce((sum, day) => sum + day.tasksCompleted, 0) /
      3;
    const earlierAvg =
      dailyStats.slice(0, 3).reduce((sum, day) => sum + day.tasksCompleted, 0) /
      3;

    if (earlierAvg === 0) return recentAvg > 0 ? 100 : 0;
    return Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100);
  }, [dailyStats]);

  return {
    analytics,
    dailyStats,
    weeklyTrend,
  };
}
