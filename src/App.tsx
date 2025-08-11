import "./App.css";
import { useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import NotesSection from "./components/NotesSection";
import AISuggestionsSection from "./components/AISuggestionsSection";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CalendarDashboard from "./components/CalendarDashboard";
import Navigation from "./components/Navigation";
import BackendStatus from "./components/BackendStatus";
import { useTasks } from "./hooks/useTasks";
import { useNotes } from "./hooks/useNotes";
import { useAISuggestions } from "./hooks/useAISuggestions";

function App() {
  const [activeView, setActiveView] = useState<
    "dashboard" | "analytics" | "calendar"
  >("dashboard");

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
    <div className="min-h-screen bg-gray-50">
      {/* AI Ready Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 text-center">
        <p className="text-sm font-medium">
          🤖 AI-Powered Smart Daily Planner - Get intelligent suggestions!
        </p>
      </div>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Daily Planner
              </h1>
              <p className="text-gray-600">
                Organize your day with AI-powered insights
              </p>
            </div>
            <BackendStatus
              isOnline={!tasksError && !notesError}
              error={tasksError || notesError}
              onRetry={handleRetryConnection}
            />
          </div>
        </div>
      </header>

      <Navigation activeView={activeView} onViewChange={setActiveView} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeView === "dashboard" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>

                {/* Add Task Form */}
                <AddTaskForm onAddTask={addTask} />

                {/* Task List */}
                <TaskList
                  tasks={todaysTasks}
                  onToggleComplete={toggleTaskComplete}
                  onDeleteTask={deleteTask}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notes Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Notes</h3>
                <NotesSection
                  notes={recentNotes}
                  onAddNote={addNote}
                  onUpdateNote={updateNote}
                  onDeleteNote={deleteNote}
                />
              </div>

              {/* AI Suggestions */}
              <div className="bg-blue-50 rounded-lg p-6">
                <AISuggestionsSection
                  suggestions={suggestions}
                  isLoading={isLoading}
                  onRefresh={refreshSuggestions}
                  onDismiss={dismissSuggestion}
                />
              </div>
            </div>
          </div>
        ) : activeView === "calendar" ? (
          <CalendarDashboard
            tasks={tasks}
            onToggleComplete={toggleTaskComplete}
          />
        ) : (
          <AnalyticsDashboard
            tasks={tasks}
            notes={notes}
            suggestions={suggestions}
          />
        )}
      </main>
    </div>
  );
}

export default App;
