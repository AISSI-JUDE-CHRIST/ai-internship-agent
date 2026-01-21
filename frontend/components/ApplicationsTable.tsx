'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  Eye, 
  MessageSquare, 
  XCircle, 
  FileText,
  Edit,
  ExternalLink,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';
import { ApplicationResponse } from '@/lib/api';
import StatusUpdateModal from './StatusUpdateModal';

interface ApplicationsTableProps {
  applications: ApplicationResponse[];
  isLoading: boolean;
  onStatusUpdate: (applicationId: number, newStatus: string) => Promise<void>;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: FileText },
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  submitted: { label: 'Envoyée', color: 'bg-blue-100 text-blue-800', icon: Send },
  reviewed: { label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: Eye },
  interview: { label: 'Entretien', color: 'bg-indigo-100 text-indigo-800', icon: MessageSquare },
  rejected: { label: 'Refusée', color: 'bg-red-100 text-red-800', icon: XCircle },
  accepted: { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
};

export default function ApplicationsTable({
  applications,
  isLoading,
  onStatusUpdate,
}: ApplicationsTableProps) {
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusClick = (application: ApplicationResponse) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (selectedApplication) {
      await onStatusUpdate(selectedApplication.id, newStatus);
      setIsModalOpen(false);
      setSelectedApplication(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune candidature
        </h3>
        <p className="text-gray-600">
          Vous n'avez pas encore de candidatures. Commencez par rechercher des offres d'emploi.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poste / Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'envoi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créée le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => {
                const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.draft;
                const StatusIcon = status.icon;

                return (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {application.job_title || 'Titre non spécifié'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          {application.company || 'Entreprise non spécifiée'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusClick(application)}
                        className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${status.color} hover:opacity-80 transition-opacity cursor-pointer
                        `}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {application.submitted_at 
                          ? formatDateTime(application.submitted_at)
                          : 'Non envoyée'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(application.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/dashboard/applications/${application.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Voir les détails"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleStatusClick(application)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Modifier le statut"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedApplication && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}

