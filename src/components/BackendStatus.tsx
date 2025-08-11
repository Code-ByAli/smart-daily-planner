interface BackendStatusProps {
  isOnline: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function BackendStatus({
  isOnline,
  error,
  onRetry,
}: BackendStatusProps) {
  if (isOnline && !error) {
    return (
      <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        Database Connected
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
        <span className="mr-2">Local Storage Mode</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-orange-700 hover:text-orange-800 underline"
            title="Try to reconnect to database"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
      Connecting...
    </div>
  );
}
