'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ResumeUploader from '@/components/ResumeUploader';
import { FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { resumeApi } from '@/lib/api';

export default function UploadResumePage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (file: File, title: string, isDefault: boolean) => {
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      await resumeApi.upload(file, title, isDefault);
      setUploadSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/resume');
      }, 2000);
    } catch (error: any) {
      setUploadError(error.response?.data?.detail || 'Erreur lors de l\'upload du CV');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Télécharger votre CV
            </h1>
            <p className="text-gray-600">
              Ajoutez votre CV pour commencer à postuler automatiquement
            </p>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-semibold">CV téléchargé avec succès !</p>
                <p className="text-green-700 text-sm mt-1">
                  Redirection vers la page des CV...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold">Erreur</p>
                <p className="text-red-700 text-sm mt-1">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Upload Component */}
          <ResumeUploader
            onUpload={handleUpload}
            isUploading={isUploading}
          />

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              Conseils pour votre CV
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Format PDF recommandé pour une meilleure compatibilité</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Taille maximale : 10 Mo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Assurez-vous que votre CV est à jour et bien formaté</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Vous pouvez télécharger plusieurs CV et en définir un par défaut</span>
              </li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

