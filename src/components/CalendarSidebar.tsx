import type { Task } from "../types";

interface CalendarSidebarProps {
  upcomingTasks: Task[];
  overdueTasks: Task[];
  onTaskClick?: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export default function CalendarSidebar({
  upcomingTasks,
  overdueTasks,
  onTaskClick,
  onToggleComplete,
}: CalendarSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const TaskItem = ({
    task,
    isOverdue = false,
  }: {
    task: Task;
    isOverdue?: boolean;
  }) => (
    <div
      className={`
        p-3 border-l-4 rounded-r-lg cursor-pointer transition-all hover:shadow-sm
        ${getPriorityColor(task.priority)}
        ${task.completed ? "opacity-60" : ""}
        ${isOverdue ? "border-l-red-600 bg-red-100" : ""}
      `}
      onClick={() => onTaskClick?.(task)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className={`
              mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
              ${
                task.completed
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            {task.completed && (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-medium text-gray-900 truncate ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-gray-600 mt-1 truncate">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isOverdue
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {task.dueDate ? formatDate(task.dueDate) : "No due date"}
              </span>

              <span
                className={`text-xs font-medium ${
                  task.priority === "high"
                    ? "text-red-600"
                    : task.priority === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-red-600 flex items-center">
              <span className="mr-2">⚠️</span>
              Overdue Tasks
              <span className="ml-2 bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                {overdueTasks.length}
              </span>
            </h3>
          </div>

          <div className="p-4 space-y-3">
            {overdueTasks.map((task) => (
              <TaskItem key={task.id} task={task} isOverdue />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📅</span>
            Upcoming (7 days)
            <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {upcomingTasks.length}
            </span>
          </h3>
        </div>

        <div className="p-4 space-y-3">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => <TaskItem key={task.id} task={task} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">🎉</span>
              <p>No upcoming tasks!</p>
              <p className="text-sm">You're all caught up.</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="bg-white rounded-lg shadow border p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Priority Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
