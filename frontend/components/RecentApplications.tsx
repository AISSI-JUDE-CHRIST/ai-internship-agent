import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
import { ApplicationResponse } from '@/lib/api';

interface RecentApplicationsProps {
  applications: ApplicationResponse[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: FileText },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  submitted: { label: 'Envoyée', color: 'bg-blue-100 text-blue-800', icon: FileText },
  reviewed: { label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: Clock },
  interview: { label: 'Entretien', color: 'bg-indigo-100 text-indigo-800', icon: Clock },
  accepted: { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  rejected: { label: 'Refusée', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function RecentApplications({
  applications,
  isLoading,
  onRefresh,
}: RecentApplicationsProps) {
  const recentApplications = applications.slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Candidatures récentes
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            Voir tout
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {recentApplications.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Aucune candidature pour le moment</p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Rechercher des offres
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {recentApplications.map((application) => {
            const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.draft;
            const StatusIcon = status.icon;
            const submittedDate = application.submitted_at 
              ? new Date(application.submitted_at).toLocaleDateString('fr-FR')
              : null;

            return (
              <Link
                key={application.id}
                href={`/dashboard/applications/${application.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {application.job_title || 'Titre du poste'}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {application.company || 'Entreprise'}
                    </p>
                    {submittedDate && (
                      <p className="text-xs text-gray-500">
                        Envoyée le {submittedDate}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

