import type { CalendarDay } from "../services/calendarService";

interface CalendarGridProps {
  calendarMonth: {
    weeks: Array<{ days: CalendarDay[] }>;
    monthName: string;
    year: number;
  };
  onDateClick?: (date: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
  isCurrentMonth: boolean;
}

export default function CalendarGrid({
  calendarMonth,
  onDateClick,
  onNavigate,
  onGoToToday,
  isCurrentMonth,
}: CalendarGridProps) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {calendarMonth.monthName} {calendarMonth.year}
        </h2>

        <div className="flex items-center space-x-2">
          {!isCurrentMonth && (
            <button
              onClick={onGoToToday}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Today
            </button>
          )}

          <button
            onClick={() => onNavigate("prev")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Previous month"
          >
            ←
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 border-b">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarMonth.weeks.map((week, weekIndex) =>
          week.days.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`
                min-h-[100px] p-2 border-r border-b cursor-pointer hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                ${day.isToday ? "bg-blue-50 border-blue-200" : ""}
              `}
              onClick={() => onDateClick?.(day.date)}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium
                    ${
                      day.isToday
                        ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        : ""
                    }
                  `}
                >
                  {day.dayNumber}
                </span>

                {/* Task count indicator */}
                {day.tasks.length > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-1 rounded-full">
                    {day.tasks.length}
                  </span>
                )}
              </div>

              {/* Task indicators */}
              <div className="space-y-1">
                {day.tasks.slice(0, 2).map((task, index) => (
                  <div
                    key={index}
                    className={`
                      text-xs p-1 rounded text-white truncate
                      ${getPriorityColor(task.priority)}
                      ${task.completed ? "opacity-50 line-through" : ""}
                    `}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}

                {/* Show "more" indicator if there are additional tasks */}
                {day.tasks.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.tasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
