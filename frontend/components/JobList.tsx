'use client';

import { CheckCircle2, MapPin, Building2, Calendar, ExternalLink, TrendingUp } from 'lucide-react';

interface JobListProps {
  jobs: any[];
  selectedJobs: Set<string>;
  onToggleSelection: (jobId: string) => void;
  isLoading?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-blue-600 bg-blue-100';
  if (score >= 40) return 'text-yellow-600 bg-yellow-100';
  return 'text-gray-600 bg-gray-100';
};

const getPlatformLabel = (platform: string) => {
  const labels: Record<string, string> = {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    glassdoor: 'Glassdoor',
    hello_work: 'Hello Work',
    job_teaser: 'Job Teaser',
    welcome_to_the_jungle: 'Welcome to the Jungle',
  };
  return labels[platform] || platform;
};

export default function JobList({
  jobs,
  selectedJobs,
  onToggleSelection,
  isLoading = false,
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-600">Aucune offre trouvée avec ces critères</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const isSelected = selectedJobs.has(job.id);
        const score = job.relevance_score || 0;
        const scoreColor = getScoreColor(score);

        return (
          <div
            key={job.id}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all cursor-pointer ${
              isSelected ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:border-gray-200'
            }`}
            onClick={() => onToggleSelection(job.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {job.title}
                      </h3>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="mr-4">{job.company}</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location || 'Non spécifié'}</span>
                      {job.remote && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          Remote
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Relevance Score */}
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${scoreColor} flex items-center ml-4`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {score}%
                  </div>
                </div>

                {/* Description Preview */}
                {job.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description.substring(0, 200)}...
                  </p>
                )}

                {/* Job Details */}
                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                  {job.job_type && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {job.job_type}
                    </span>
                  )}
                  {job.salary && (
                    <span>{job.salary}</span>
                  )}
                  {job.posted_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(job.posted_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {getPlatformLabel(job.platform)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-4 flex flex-col items-end space-y-2">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                >
                  Voir l'offre
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

