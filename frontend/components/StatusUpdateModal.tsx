'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ApplicationResponse } from '@/lib/api';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationResponse;
  onStatusUpdate: (newStatus: string) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'pending', label: 'En attente' },
  { value: 'submitted', label: 'Envoyée' },
  { value: 'reviewed', label: 'En cours' },
  { value: 'interview', label: 'Entretien' },
  { value: 'rejected', label: 'Refusée' },
  { value: 'accepted', label: 'Acceptée' },
];

export default function StatusUpdateModal({
  isOpen,
  onClose,
  application,
  onStatusUpdate,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(application.status);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(application.status);
    }
  }, [isOpen, application.status]);

  const handleSave = async () => {
    if (selectedStatus === application.status) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onStatusUpdate(selectedStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Modifier le statut
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Application Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {application.job_title || 'Titre non spécifié'}
            </p>
            <p className="text-sm text-gray-600">
              {application.company || 'Entreprise non spécifiée'}
            </p>
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nouveau statut
            </label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                    ${selectedStatus === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || selectedStatus === application.status}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

