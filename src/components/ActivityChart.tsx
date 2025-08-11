import type { DailyStats } from "../services/analyticsService";

interface ActivityChartProps {
  dailyStats: DailyStats[];
}

export default function ActivityChart({ dailyStats }: ActivityChartProps) {
  const maxValue = Math.max(
    ...dailyStats.flatMap((day) => [
      day.tasksCreated,
      day.tasksCompleted,
      day.notesCreated,
    ])
  );

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">7-Day Activity</h3>

      <div className="space-y-4">
        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Tasks Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Tasks Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span>Notes Created</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end justify-between h-32 border-b border-gray-200">
          {dailyStats.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              {/* Bars */}
              <div className="flex items-end gap-1 mb-2 h-24">
                {/* Tasks Created */}
                <div
                  className="bg-blue-500 rounded-t w-2 transition-all duration-500"
                  style={{ height: `${getBarHeight(day.tasksCreated)}%` }}
                  title={`${day.tasksCreated} tasks created`}
                />

                {/* Tasks Completed */}
                <div
                  className="bg-green-500 rounded-t w-2 transition-all duration-500"
                  style={{ height: `${getBarHeight(day.tasksCompleted)}%` }}
                  title={`${day.tasksCompleted} tasks completed`}
                />

                {/* Notes Created */}
                <div
                  className="bg-purple-500 rounded-t w-2 transition-all duration-500"
                  style={{ height: `${getBarHeight(day.notesCreated)}%` }}
                  title={`${day.notesCreated} notes created`}
                />
              </div>

              {/* Date Label */}
              <span className="text-xs text-gray-500">
                {formatDate(day.date)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="font-medium text-blue-600">
              {dailyStats.reduce((sum, day) => sum + day.tasksCreated, 0)}
            </p>
            <p className="text-gray-500">Tasks Created</p>
          </div>
          <div>
            <p className="font-medium text-green-600">
              {dailyStats.reduce((sum, day) => sum + day.tasksCompleted, 0)}
            </p>
            <p className="text-gray-500">Tasks Completed</p>
          </div>
          <div>
            <p className="font-medium text-purple-600">
              {dailyStats.reduce((sum, day) => sum + day.notesCreated, 0)}
            </p>
            <p className="text-gray-500">Notes Created</p>
          </div>
        </div>
      </div>
    </div>
  );
}
