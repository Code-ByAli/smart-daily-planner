import type { Task } from "../types";
import { useCalendar } from "../hooks/useCalendar";
import CalendarGrid from "./CalendarGrid";
import CalendarSidebar from "./CalendarSidebar";

interface CalendarDashboardProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
}

export default function CalendarDashboard({
  tasks,
  onToggleComplete,
}: CalendarDashboardProps) {
  const {
    calendarMonth,
    upcomingTasks,
    overdueTasks,
    navigateMonth,
    goToToday,
    isCurrentMonth,
  } = useCalendar(tasks);

  const handleDateClick = (date: Date) => {
    console.log("Clicked date:", date.toLocaleDateString());
    // TODO: Add date selection functionality (show tasks for that date, quick add, etc.)
  };

  const handleTaskClick = (task: Task) => {
    console.log("Clicked task:", task.title);
    // TODO: Add task detail view or editing functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
          <p className="text-gray-600">View and manage your tasks by date</p>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{calendarMonth.totalTasks}</span>
            <span>tasks this month</span>
          </div>

          {overdueTasks.length > 0 && (
            <div className="flex items-center space-x-2 text-red-600">
              <span className="font-medium">{overdueTasks.length}</span>
              <span>overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <CalendarGrid
            calendarMonth={calendarMonth}
            onDateClick={handleDateClick}
            onNavigate={navigateMonth}
            onGoToToday={goToToday}
            isCurrentMonth={isCurrentMonth}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CalendarSidebar
            upcomingTasks={upcomingTasks}
            overdueTasks={overdueTasks}
            onTaskClick={handleTaskClick}
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {tasks.filter((t) => !t.completed).length}
          </div>
          <div className="text-sm text-gray-600">Active Tasks</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter((t) => t.completed).length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {upcomingTasks.length}
          </div>
          <div className="text-sm text-gray-600">Due Soon</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-red-600">
            {overdueTasks.length}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>
    </div>
  );
}
