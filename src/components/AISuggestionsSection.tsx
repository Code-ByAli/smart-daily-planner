import type { AISuggestion } from "../types";
import AISuggestionCard from "./AISuggestionCard";

interface AISuggestionsSectionProps {
  suggestions: AISuggestion[];
  isLoading: boolean;
  onRefresh: () => void;
  onDismiss: (suggestionId: string) => void;
}

export default function AISuggestionsSection({
  suggestions,
  isLoading,
  onRefresh,
  onDismiss,
}: AISuggestionsSectionProps) {
  return (
    <div>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-800">AI Suggestions</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`p-1 rounded-full transition-colors ${
            isLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100"
          }`}
          aria-label="Refresh suggestions"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-blue-600">Analyzing your data...</p>
          </div>
        </div>
      )}

      {/* No suggestions state */}
      {!isLoading && suggestions.length === 0 && (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🤖</div>
          <p className="text-sm text-blue-700 mb-1">No suggestions right now</p>
          <p className="text-xs text-blue-600">
            Add some tasks and notes to get personalized insights!
          </p>
        </div>
      )}

      {/* Suggestions list */}
      {!isLoading && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <AISuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onDismiss={onDismiss}
            />
          ))}

          {/* Insight footer */}
          <div className="text-xs text-blue-600 text-center mt-4 pt-3 border-t border-blue-200">
            💡 Based on your tasks, notes, and productivity patterns
          </div>
        </div>
      )}
    </div>
  );
}
