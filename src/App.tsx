import "./App.css";
import { useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import NotesSection from "./components/NotesSection";
import AISuggestionsSection from "./components/AISuggestionsSection";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CalendarDashboard from "./components/CalendarDashboard";
import BackendStatus from "./components/BackendStatus";
import DatabaseTest from "./components/DatabaseTest";
import { useTasks } from "./hooks/useTasks";
import { useNotes } from "./hooks/useNotes";
import { useAISuggestions } from "./hooks/useAISuggestions";

function App() {
  const [activeView, setActiveView] = useState<
    "dashboard" | "analytics" | "calendar" | "database"
  >("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const {
    tasks,
    addTask,
    toggleTaskComplete,
    deleteTask,
    getTodaysTasks,
    error: tasksError,
    refreshTasks,
  } = useTasks();

  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getRecentNotes,
    error: notesError,
    refreshNotes,
  } = useNotes();

  const { suggestions, isLoading, refreshSuggestions, dismissSuggestion } =
    useAISuggestions(tasks, notes);

  const todaysTasks = getTodaysTasks();
  const recentNotes = getRecentNotes();

  const handleRetryConnection = () => {
    refreshTasks();
    refreshNotes();
  };

  return (
    <div className="h-screen bg-background text-foreground flex">
      {/* Collapsed Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-12" : "w-80"
        } bg-sidebar flex flex-col transition-all duration-300`}
      >
        {/* User Section */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              {sidebarCollapsed ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h7v18H3V3zm11 3h7v12h-7V6z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Add Task Button */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <button className="w-full flex items-center gap-2 text-destructive hover:bg-sidebar-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add task
            </button>
          </div>
        )}

        {/* Navigation */}
        {!sidebarCollapsed && (
          <nav className="flex-1 px-2 py-2">
            <div className="space-y-1">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeView === "dashboard"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m6-2v2m0 0v2m0-2h2m-2 0H8"
                  />
                </svg>
                Inbox
                {tasks.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {tasks.filter((t) => !t.completed).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveView("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeView === "dashboard"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <svg
                  className="w-4 h-4 text-destructive"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                Today
                {todaysTasks.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {todaysTasks.filter((t) => !t.completed).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveView("calendar")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeView === "calendar"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Upcoming
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Completed
                {tasks.filter((t) => t.completed).length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {tasks.filter((t) => t.completed).length}
                  </span>
                )}
              </button>
            </div>
          </nav>
        )}

        {/* Backend Status - Only show when expanded */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <BackendStatus
              isOnline={!tasksError && !notesError}
              error={tasksError || notesError}
              onRetry={handleRetryConnection}
            />
          </div>
        )}
      </div>

      {/* Main Content - No Header */}
      <div className="flex-1 flex flex-col">
        {/* Content Area starts immediately without header */}
        <main className="flex-1 overflow-auto">
          {activeView === "dashboard" && (
            <div className="max-w-4xl mx-auto px-8 py-8">
              {/* Page title integrated into content */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Today
                </h1>
                <p className="text-muted-foreground">
                  {todaysTasks.length === 0
                    ? "No tasks scheduled for today"
                    : `${
                        todaysTasks.filter((t) => !t.completed).length
                      } tasks remaining`}
                </p>
              </div>

              {todaysTasks.length === 0 ? (
                // Empty State - Todoist Style
                <div className="flex flex-col items-center justify-center min-h-96 text-center">
                  <div className="mb-8">
                    {/* Flower Icon */}
                    <svg
                      className="w-24 h-24 mx-auto text-yellow-400"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      <circle cx="50" cy="50" r="8" fill="#F59E0B" />
                      <path
                        d="M50 10c-8 0-15 7-15 15 0 5 2 9 6 12-4 3-6 7-6 12 0 8 7 15 15 15s15-7 15-15c0-5-2-9-6-12 4-3 6-7 6-12 0-8-7-15-15-15z"
                        fill="#FCD34D"
                      />
                      <path
                        d="M10 50c0-8 7-15 15-15 5 0 9 2 12 6 3-4 7-6 12-6 8 0 15 7 15 15s-7 15-15 15c-5 0-9-2-12-6-3 4-7 6-12 6-8 0-15-7-15-15z"
                        fill="#FCD34D"
                      />
                      <path
                        d="M25 25c-6-6-6-15 0-21s15-6 21 0c4 4 5 9 4 14 5-1 10 0 14 4 6 6 6 15 0 21s-15 6-21 0c-4-4-5-9-4-14-5 1-10 0-14-4z"
                        fill="#FCD34D"
                      />
                      <path
                        d="M75 75c6 6 6 15 0 21s-15 6-21 0c-4-4-5-9-4-14-5 1-10 0-14-4-6-6-6-15 0-21s15-6 21 0c4 4 5 9 4 14 5-1 10 0 14 4z"
                        fill="#FCD34D"
                      />
                      <circle cx="85" cy="15" r="3" fill="#FEF3C7" />
                      <circle cx="90" cy="25" r="2" fill="#FEF3C7" />
                      <circle cx="15" cy="85" r="2" fill="#86EFAC" />
                    </svg>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Welcome to your Today view
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    See everything due today across all your projects.
                  </p>

                  <button className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add task
                  </button>
                </div>
              ) : (
                // Task List View
                <div className="space-y-6">
                  <AddTaskForm onAddTask={addTask} />
                  <TaskList
                    tasks={todaysTasks}
                    onToggleComplete={toggleTaskComplete}
                    onDeleteTask={deleteTask}
                  />

                  {/* Notes Section */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Quick Notes</h3>
                    <NotesSection
                      notes={recentNotes}
                      onAddNote={addNote}
                      onUpdateNote={updateNote}
                      onDeleteNote={deleteNote}
                    />
                  </div>

                  {/* AI Suggestions */}
                  <div className="mt-8">
                    <AISuggestionsSection
                      suggestions={suggestions}
                      isLoading={isLoading}
                      onRefresh={refreshSuggestions}
                      onDismiss={dismissSuggestion}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "analytics" && (
            <div className="max-w-6xl mx-auto px-8 py-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                  Analytics
                </h1>
                <p className="text-muted-foreground">
                  Track your productivity insights
                </p>
              </div>
              <AnalyticsDashboard
                tasks={tasks}
                notes={notes}
                suggestions={suggestions}
              />
            </div>
          )}

          {activeView === "calendar" && (
            <div className="max-w-6xl mx-auto px-8 py-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Upcoming</h1>
                <p className="text-muted-foreground">
                  View your scheduled tasks
                </p>
              </div>
              <CalendarDashboard
                tasks={tasks}
                onToggleComplete={toggleTaskComplete}
              />
            </div>
          )}

          {activeView === "database" && (
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Database</h1>
                <p className="text-muted-foreground">
                  Test your database connection
                </p>
              </div>
              <DatabaseTest />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
