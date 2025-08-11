import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onDeleteTask,
}: TaskItemProps) {
  const priorityColors = {
    low: "border-green-200 bg-green-50",
    medium: "border-yellow-200 bg-yellow-50",
    high: "border-red-200 bg-red-50",
  };

  const priorityTextColors = {
    low: "text-green-700",
    medium: "text-yellow-700",
    high: "text-red-700",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-lg ${
        priorityColors[task.priority]
      } mb-3`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-4 text-xs">
              <span
                className={`px-2 py-1 rounded-full ${
                  priorityTextColors[task.priority]
                } bg-current bg-opacity-20`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
                Priority
              </span>
              {task.dueDate && (
                <span className="text-gray-500">
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
          aria-label="Delete task"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
