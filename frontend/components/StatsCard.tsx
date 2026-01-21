import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  description?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}

