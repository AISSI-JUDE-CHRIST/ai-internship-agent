'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import SearchCriteriaForm from '@/components/SearchCriteriaForm';
import { Search, Save, CheckCircle2 } from 'lucide-react';
import { searchCriteriaApi } from '@/lib/api';

export default function SearchCriteriaPage() {
  const [criteria, setCriteria] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadCriteria();
  }, []);

  const loadCriteria = async () => {
    try {
      setIsLoading(true);
      const data = await searchCriteriaApi.get();
      setCriteria(data);
    } catch (error) {
      console.error('Error loading search criteria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await searchCriteriaApi.update(data);
      setCriteria(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving search criteria:', error);
      alert('Erreur lors de la sauvegarde des critères');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des critères...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Search className="h-8 w-8 mr-3 text-primary-600" />
              Critères de recherche
            </h1>
            <p className="text-gray-600">
              Configurez vos préférences de recherche pour trouver les offres qui vous correspondent
            </p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-green-800 font-semibold">
                Critères de recherche sauvegardés avec succès !
              </p>
            </div>
          )}

          {/* Form */}
          {criteria && (
            <SearchCriteriaForm
              initialData={criteria}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

