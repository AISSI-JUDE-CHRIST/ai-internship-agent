'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ProfileForm from '@/components/ProfileForm';
import { User, FileText, Sparkles } from 'lucide-react';
import { profileApi, resumeApi } from '@/lib/api';

interface ProfileData {
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    degree: string;
    school: string;
    field: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  skills: string[];
  languages: Array<{
    language: string;
    level: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiry_date: string;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    loadProfile();
    loadResumes();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileApi.get();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      const data = await resumeApi.getAll();
      setResumes(data);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const handleExtract = async (resumeId: number) => {
    try {
      setIsExtracting(true);
      await profileApi.extractFromResume(resumeId);
      await loadProfile();
    } catch (error) {
      console.error('Error extracting profile:', error);
      alert('Erreur lors de l\'extraction du profil');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async (data: ProfileData) => {
    try {
      setIsSaving(true);
      await profileApi.update(data);
      setProfile(data);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de la sauvegarde du profil');
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
              <p className="text-gray-600">Chargement du profil...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <User className="h-8 w-8 mr-3 text-primary-600" />
                  Mon Profil
                </h1>
                <p className="text-gray-600">
                  Gérez vos informations professionnelles extraites de votre CV
                </p>
              </div>
              
              {/* Extract from Resume Button */}
              {resumes.length > 0 && (
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleExtract(parseInt(e.target.value));
                      }
                    }}
                    disabled={isExtracting}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Extraire depuis un CV</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.title}
                      </option>
                    ))}
                  </select>
                  {isExtracting && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Extract Info Banner */}
          {resumes.length === 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
              <FileText className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-semibold">Aucun CV disponible</p>
                <p className="text-blue-700 text-sm mt-1">
                  Téléchargez d'abord un CV pour extraire automatiquement vos informations.
                </p>
              </div>
            </div>
          )}

          {/* Profile Form */}
          {profile && (
            <ProfileForm
              initialData={profile}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

