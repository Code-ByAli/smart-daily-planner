import { useState, useMemo } from "react";
import type { Task } from "../types";
import { CalendarService } from "../services/calendarService";

export function useCalendar(tasks: Task[]) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const calendarMonth = useMemo(() => {
    return CalendarService.generateCalendarMonth(
      currentDate.year,
      currentDate.month,
      tasks
    );
  }, [currentDate.month, currentDate.year, tasks]);

  const upcomingTasks = useMemo(() => {
    return CalendarService.getUpcomingTasks(tasks, 7);
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    return CalendarService.getOverdueTasks(tasks);
  }, [tasks]);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = CalendarService.navigateMonth(
      currentDate.month,
      currentDate.year,
      direction
    );
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate({
      month: now.getMonth(),
      year: now.getFullYear(),
    });
  };

  const goToDate = (date: Date) => {
    setCurrentDate({
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  };

  return {
    calendarMonth,
    upcomingTasks,
    overdueTasks,
    currentDate,
    navigateMonth,
    goToToday,
    goToDate,
    isCurrentMonth:
      currentDate.month === today.getMonth() &&
      currentDate.year === today.getFullYear(),
  };
}
