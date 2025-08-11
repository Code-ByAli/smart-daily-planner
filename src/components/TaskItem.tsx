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
    low: "border-l-green-500 bg-card",
    medium: "border-l-amber-500 bg-card", 
    high: "border-l-red-500 bg-card",
  };

  const priorityBadgeColors = {
    low: "bg-green-500 text-white",
    medium: "bg-amber-500 text-white",
    high: "bg-red-500 text-white",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-lg ${
        priorityColors[task.priority]
      } mb-3 border border-border`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary border-border"
          />
          <div className="flex-1">
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-4 text-xs">
              <span
                className={`px-2 py-1 rounded-full ${
                  priorityBadgeColors[task.priority]
                } border-0`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
                Priority
              </span>
              {task.dueDate && (
                <span className="text-muted-foreground">
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-muted-foreground hover:text-destructive ml-2 transition-colors"
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
