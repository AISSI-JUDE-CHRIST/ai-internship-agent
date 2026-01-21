'use client';

import { Filter, TrendingDown, TrendingUp } from 'lucide-react';

interface JobFiltersProps {
  filters: {
    minScore: number;
    matchedOnly: boolean;
    platform: string;
    jobType: string;
    remoteOnly: boolean;
  };
  onFiltersChange: (filters: any) => void;
  sortBy: 'relevance' | 'date' | 'company';
  onSortChange: (sortBy: 'relevance' | 'date' | 'company') => void;
  totalJobs: number;
  filteredCount: number;
}

const PLATFORMS = [
  { value: '', label: 'Toutes les plateformes' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'hello_work', label: 'Hello Work' },
  { value: 'job_teaser', label: 'Job Teaser' },
  { value: 'welcome_to_the_jungle', label: 'Welcome to the Jungle' },
];

const JOB_TYPES = [
  { value: '', label: 'Tous les types' },
  { value: 'internship', label: 'Stage' },
  { value: 'full-time', label: 'Temps plein' },
  { value: 'part-time', label: 'Temps partiel' },
  { value: 'contract', label: 'Contrat' },
];

export default function JobFilters({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  totalJobs,
  filteredCount,
}: JobFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary-600" />
          Filtres et tri
        </h2>
        <span className="text-sm text-gray-600">
          {filteredCount} sur {totalJobs} offres
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Min Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Score minimum
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(e) => onFiltersChange({ ...filters, minScore: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="font-semibold">{filters.minScore}%</span>
            <span>100</span>
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plateforme
          </label>
          <select
            value={filters.platform}
            onChange={(e) => onFiltersChange({ ...filters, platform: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de poste
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => onFiltersChange({ ...filters, jobType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'relevance' | 'date' | 'company')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="relevance">Pertinence</option>
            <option value="date">Date de publication</option>
            <option value="company">Entreprise</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.matchedOnly}
              onChange={(e) => onFiltersChange({ ...filters, matchedOnly: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Uniquement matchées</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.remoteOnly}
              onChange={(e) => onFiltersChange({ ...filters, remoteOnly: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Télétravail uniquement</span>
          </label>
        </div>
      </div>
    </div>
  );
}

