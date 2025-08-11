import { useState, useEffect } from "react";
import type { Task, Note, AISuggestion } from "../types";
import { AIService } from "../services/aiService";

export function useAISuggestions(tasks: Task[], notes: Note[]) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // Regenerate suggestions when tasks or notes change (but not too frequently)
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime;
    const minUpdateInterval = 30000; // 30 seconds minimum between updates

    if (timeSinceLastUpdate < minUpdateInterval && suggestions.length > 0) {
      return; // Skip update if too recent
    }

    setIsLoading(true);

    // Simulate AI processing time (remove in production)
    const timer = setTimeout(() => {
      const newSuggestions = AIService.generateAllSuggestions(tasks, notes);
      setSuggestions(newSuggestions);
      setLastUpdateTime(now);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [tasks, notes, lastUpdateTime, suggestions.length]);

  const refreshSuggestions = () => {
    setIsLoading(true);
    const newSuggestions = AIService.generateAllSuggestions(tasks, notes);
    setSuggestions(newSuggestions);
    setLastUpdateTime(Date.now());
    setIsLoading(false);
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
  };

  return {
    suggestions,
    isLoading,
    refreshSuggestions,
    dismissSuggestion,
  };
}
