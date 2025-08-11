interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: StatsCardProps) {
  const getTrendColor = () => {
    if (trend === undefined) return "text-gray-500";
    return trend >= 0 ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (trend === undefined) return "";
    return trend >= 0 ? "↗" : "↘";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {trend !== undefined && (
          <div className={`text-sm font-medium ${getTrendColor()}`}>
            <span className="mr-1">{getTrendIcon()}</span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
