import type { AISuggestion } from "../types";

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onDismiss: (suggestionId: string) => void;
}

export default function AISuggestionCard({
  suggestion,
  onDismiss,
}: AISuggestionCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "productivity":
        return "⚡";
      case "scheduling":
        return "⏰";
      case "priority":
        return "🎯";
      case "wellness":
        return "🌟";
      default:
        return "💡";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "productivity":
        return "border-green-200 bg-green-50";
      case "scheduling":
        return "border-blue-200 bg-blue-50";
      case "priority":
        return "border-red-200 bg-red-50";
      case "wellness":
        return "border-purple-200 bg-purple-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "productivity":
        return "text-green-800";
      case "scheduling":
        return "text-blue-800";
      case "priority":
        return "text-red-800";
      case "wellness":
        return "text-purple-800";
      default:
        return "text-gray-800";
    }
  };

  const formatConfidence = (confidence: number) => {
    if (confidence >= 90) return "High confidence";
    if (confidence >= 75) return "Medium confidence";
    return "Low confidence";
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-3 ${getTypeColor(
        suggestion.type
      )} relative`}
    >
      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(suggestion.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss suggestion"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Main content */}
      <div className="pr-6">
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">{getTypeIcon(suggestion.type)}</span>
          <h4
            className={`font-semibold text-sm ${getTextColor(suggestion.type)}`}
          >
            {suggestion.title}
          </h4>
        </div>

        <p
          className={`text-sm ${getTextColor(
            suggestion.type
          )} mb-3 leading-relaxed`}
        >
          {suggestion.description}
        </p>

        <div className="flex items-center justify-between text-xs">
          <div className={`${getTextColor(suggestion.type)} opacity-75`}>
            {formatConfidence(suggestion.confidence)}
          </div>

          {suggestion.actionable && (
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                suggestion.type === "wellness"
                  ? "bg-purple-100 text-purple-700"
                  : suggestion.type === "productivity"
                  ? "bg-green-100 text-green-700"
                  : suggestion.type === "scheduling"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Actionable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
