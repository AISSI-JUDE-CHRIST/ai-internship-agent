'use client';

import { CheckCircle2, Clock, Send, Eye, MessageSquare, XCircle, FileText } from 'lucide-react';

interface ApplicationStatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  statusCounts: {
    all: number;
    draft: number;
    pending: number;
    submitted: number;
    reviewed: number;
    interview: number;
    rejected: number;
    accepted: number;
  };
}

const statusConfig = {
  all: { label: 'Toutes', icon: FileText, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  draft: { label: 'Brouillon', icon: FileText, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  pending: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  submitted: { label: 'Envoyée', icon: Send, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  reviewed: { label: 'En cours', icon: Eye, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  interview: { label: 'Entretien', icon: MessageSquare, color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  rejected: { label: 'Refusée', icon: XCircle, color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  accepted: { label: 'Acceptée', icon: CheckCircle2, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
};

export default function ApplicationStatusFilter({
  selectedStatus,
  onStatusChange,
  statusCounts,
}: ApplicationStatusFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = statusCounts[status as keyof typeof statusCounts];
          const isSelected = selectedStatus === status;

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`
                flex items-center px-4 py-2 rounded-lg transition-colors
                ${isSelected 
                  ? `${config.color} ring-2 ring-primary-500` 
                  : `${config.color} opacity-70`
                }
              `}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="font-medium">{config.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                isSelected ? 'bg-white bg-opacity-50' : 'bg-white bg-opacity-30'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

