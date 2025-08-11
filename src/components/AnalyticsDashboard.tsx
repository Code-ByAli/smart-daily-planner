import type { Task, Note, AISuggestion } from "../types";
import { useAnalytics } from "../hooks/useAnalytics";
import StatsCard from "./StatsCard";
import ProgressRing from "./ProgressRing";
import ActivityChart from "./ActivityChart";

interface AnalyticsDashboardProps {
  tasks: Task[];
  notes: Note[];
  suggestions: AISuggestion[];
}

export default function AnalyticsDashboard({
  tasks,
  notes,
  suggestions,
}: AnalyticsDashboardProps) {
  const { analytics, dailyStats, weeklyTrend } = useAnalytics(
    tasks,
    notes,
    suggestions
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={analytics.totalTasks}
          subtitle={`${analytics.completedTasks} completed`}
          icon="📋"
        />

        <StatsCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          trend={weeklyTrend}
          icon="✅"
        />

        <StatsCard
          title="Current Streak"
          value={`${analytics.streakDays} days`}
          subtitle="Keep it up!"
          icon="🔥"
        />

        <StatsCard
          title="Total Notes"
          value={analytics.totalNotes}
          subtitle={`${analytics.notesCreatedToday} today`}
          icon="📝"
        />
      </div>

      {/* Charts and Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart dailyStats={dailyStats} />
        </div>

        {/* Progress Rings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Task Completion</h3>
            <div className="flex justify-center">
              <ProgressRing
                percentage={analytics.completionRate}
                label={`${analytics.completedTasks}/${analytics.totalTasks} Tasks`}
                color="#10B981"
              />
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Task Priority</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <span className="font-medium">
                  {analytics.tasksByPriority.high}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <span className="font-medium">
                  {analytics.tasksByPriority.medium}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
                <span className="font-medium">
                  {analytics.tasksByPriority.low}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            📊 Productivity Insight
          </h4>
          <p className="text-blue-800">
            Your most productive day is{" "}
            <strong>{analytics.mostProductiveDay}</strong>
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">
            ⚡ Average Speed
          </h4>
          <p className="text-green-800">
            You complete tasks in an average of{" "}
            <strong>{analytics.timeToComplete}h</strong>
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">🤖 AI Insights</h4>
          <p className="text-purple-800">
            <strong>{analytics.suggestionAcceptanceRate}%</strong> suggestion
            acceptance rate
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-red-600">
              {analytics.overdueTasks}
            </p>
            <p className="text-sm text-gray-600">Overdue Tasks</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {analytics.avgTasksPerDay}
            </p>
            <p className="text-sm text-gray-600">Avg Tasks/Day</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {analytics.avgNotesPerDay}
            </p>
            <p className="text-sm text-gray-600">Avg Notes/Day</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {analytics.totalSuggestions}
            </p>
            <p className="text-sm text-gray-600">AI Suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
