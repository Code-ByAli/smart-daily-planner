import type { Task } from "../types";

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  tasks: Task[];
  dayOfWeek: number;
  dayNumber: number;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  monthName: string;
  weeks: CalendarWeek[];
  totalTasks: number;
}

export class CalendarService {
  private static monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  static generateCalendarMonth(
    year: number,
    month: number,
    tasks: Task[]
  ): CalendarMonth {
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const today = new Date();

    // Start from the beginning of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks: CalendarWeek[] = [];
    const currentDate = new Date(startDate);

    // Generate 6 weeks to ensure full calendar view
    for (let week = 0; week < 6; week++) {
      const days: CalendarDay[] = [];

      for (let day = 0; day < 7; day++) {
        const dayTasks = this.getTasksForDate(currentDate, tasks);
        const isCurrentMonth = currentDate.getMonth() === month;
        const isToday = this.isSameDate(currentDate, today);

        days.push({
          date: new Date(currentDate),
          isToday,
          isCurrentMonth,
          tasks: dayTasks,
          dayOfWeek: currentDate.getDay(),
          dayNumber: currentDate.getDate(),
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push({ days });
    }

    const totalTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === month && taskDate.getFullYear() === year;
    }).length;

    return {
      year,
      month,
      monthName: this.monthNames[month],
      weeks,
      totalTasks,
    };
  }

  private static getTasksForDate(date: Date, tasks: Task[]): Task[] {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return this.isSameDate(taskDate, date);
    });
  }

  private static isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  static getUpcomingTasks(tasks: Task[], days: number = 7): Task[] {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return tasks
      .filter((task) => {
        if (!task.dueDate || task.completed) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate <= futureDate;
      })
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      );
  }

  static getOverdueTasks(tasks: Task[]): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    });
  }

  static navigateMonth(
    currentMonth: number,
    currentYear: number,
    direction: "prev" | "next"
  ): { month: number; year: number } {
    if (direction === "next") {
      if (currentMonth === 11) {
        return { month: 0, year: currentYear + 1 };
      }
      return { month: currentMonth + 1, year: currentYear };
    } else {
      if (currentMonth === 0) {
        return { month: 11, year: currentYear - 1 };
      }
      return { month: currentMonth - 1, year: currentYear };
    }
  }

  static formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  static parseInputDate(dateString: string): Date {
    return new Date(dateString + "T00:00:00");
  }
}
