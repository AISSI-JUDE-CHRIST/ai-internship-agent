'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Save, MapPin, Briefcase, Calendar, DollarSign, Filter } from 'lucide-react';

interface SearchCriteriaFormProps {
  initialData: {
    domain?: string;
    sectors?: string[];
    location?: string;
    preferred_locations?: string[];
    remote_only?: boolean;
    job_type?: string;
    internship_duration?: string;
    required_keywords?: string[];
    excluded_keywords?: string[];
    preferred_start_date?: string;
    earliest_start_date?: string;
    latest_start_date?: string;
    min_salary?: number;
    max_salary?: number;
    salary_currency?: string;
    platforms?: string[];
    min_experience_years?: number;
    max_experience_years?: number;
  };
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
}

const JOB_TYPES = [
  { value: 'internship', label: 'Stage' },
  { value: 'full-time', label: 'Temps plein' },
  { value: 'part-time', label: 'Temps partiel' },
  { value: 'contract', label: 'Contrat' },
  { value: 'temporary', label: 'Temporaire' },
  { value: 'freelance', label: 'Freelance' },
];

const INTERNSHIP_DURATIONS = [
  { value: '1 mois', label: '1 mois' },
  { value: '2 mois', label: '2 mois' },
  { value: '3 mois', label: '3 mois' },
  { value: '4 mois', label: '4 mois' },
  { value: '5 mois', label: '5 mois' },
  { value: '6 mois', label: '6 mois' },
  { value: '1 an', label: '1 an' },
];

const PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'hello_work', label: 'Hello Work' },
  { value: 'job_teaser', label: 'Job Teaser' },
  { value: 'welcome_to_the_jungle', label: 'Welcome to the Jungle' },
];

const COMMON_DOMAINS = [
  'Informatique / IT',
  'Marketing / Communication',
  'Finance / Comptabilité',
  'Ressources Humaines',
  'Commercial / Vente',
  'Ingénierie',
  'Design / Création',
  'Juridique',
  'Santé',
  'Éducation',
  'Autre',
];

export default function SearchCriteriaForm({
  initialData,
  onSave,
  isSaving = false,
}: SearchCriteriaFormProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const addKeyword = (type: 'required' | 'excluded') => {
    if (type === 'required') {
      setFormData({
        ...formData,
        required_keywords: [...(formData.required_keywords || []), ''],
      });
    } else {
      setFormData({
        ...formData,
        excluded_keywords: [...(formData.excluded_keywords || []), ''],
      });
    }
  };

  const removeKeyword = (type: 'required' | 'excluded', index: number) => {
    if (type === 'required') {
      setFormData({
        ...formData,
        required_keywords: formData.required_keywords?.filter((_, i) => i !== index) || [],
      });
    } else {
      setFormData({
        ...formData,
        excluded_keywords: formData.excluded_keywords?.filter((_, i) => i !== index) || [],
      });
    }
  };

  const updateKeyword = (type: 'required' | 'excluded', index: number, value: string) => {
    if (type === 'required') {
      const updated = [...(formData.required_keywords || [])];
      updated[index] = value;
      setFormData({ ...formData, required_keywords: updated });
    } else {
      const updated = [...(formData.excluded_keywords || [])];
      updated[index] = value;
      setFormData({ ...formData, excluded_keywords: updated });
    }
  };

  const addLocation = () => {
    setFormData({
      ...formData,
      preferred_locations: [...(formData.preferred_locations || []), ''],
    });
  };

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      preferred_locations: formData.preferred_locations?.filter((_, i) => i !== index) || [],
    });
  };

  const updateLocation = (index: number, value: string) => {
    const updated = [...(formData.preferred_locations || [])];
    updated[index] = value;
    setFormData({ ...formData, preferred_locations: updated });
  };

  const togglePlatform = (platform: string) => {
    const platforms = formData.platforms || [];
    if (platforms.includes(platform)) {
      setFormData({
        ...formData,
        platforms: platforms.filter((p) => p !== platform),
      });
    } else {
      setFormData({
        ...formData,
        platforms: [...platforms, platform],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Domain & Sector */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
          Domaine et secteur
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine principal
            </label>
            <select
              value={formData.domain || ''}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un domaine</option>
              {COMMON_DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary-600" />
          Localisation
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation principale
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Paris, Lyon, Remote..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisations préférées
            </label>
            <div className="space-y-2">
              {(formData.preferred_locations || []).map((loc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={loc}
                    onChange={(e) => updateLocation(index, e.target.value)}
                    placeholder="Ex: Paris, Lyon..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLocation}
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une localisation
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remote_only"
              checked={formData.remote_only || false}
              onChange={(e) => setFormData({ ...formData, remote_only: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remote_only" className="ml-2 text-sm text-gray-700">
              Uniquement les postes en télétravail
            </label>
          </div>
        </div>
      </section>

      {/* Job Type & Duration */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
          Type de poste
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de poste
            </label>
            <select
              value={formData.job_type || ''}
              onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {JOB_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {formData.job_type === 'internship' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée du stage
              </label>
              <select
                value={formData.internship_duration || ''}
                onChange={(e) => setFormData({ ...formData, internship_duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Toutes durées</option>
                {INTERNSHIP_DURATIONS.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Keywords */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary-600" />
          Mots-clés
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mots-clés requis (doivent apparaître dans l'offre)
            </label>
            <div className="space-y-2">
              {(formData.required_keywords || []).map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword('required', index, e.target.value)}
                    placeholder="Ex: Python, React, Marketing..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyword('required', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addKeyword('required')}
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un mot-clé requis
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mots-clés exclus (ne doivent pas apparaître)
            </label>
            <div className="space-y-2">
              {(formData.excluded_keywords || []).map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword('excluded', index, e.target.value)}
                    placeholder="Ex: CDI, Senior, 5 ans d'expérience..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyword('excluded', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addKeyword('excluded')}
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un mot-clé exclu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dates */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          Dates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début souhaitée
            </label>
            <input
              type="date"
              value={formData.preferred_start_date || ''}
              onChange={(e) => setFormData({ ...formData, preferred_start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début minimum
            </label>
            <input
              type="date"
              value={formData.earliest_start_date || ''}
              onChange={(e) => setFormData({ ...formData, earliest_start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début maximum
            </label>
            <input
              type="date"
              value={formData.latest_start_date || ''}
              onChange={(e) => setFormData({ ...formData, latest_start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Salary (Optional) */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
          Rémunération (optionnel)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire minimum (€)
            </label>
            <input
              type="number"
              value={formData.min_salary || ''}
              onChange={(e) => setFormData({ ...formData, min_salary: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Ex: 1500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire maximum (€)
            </label>
            <input
              type="number"
              value={formData.max_salary || ''}
              onChange={(e) => setFormData({ ...formData, max_salary: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Ex: 3000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              value={formData.salary_currency || 'EUR'}
              onChange={(e) => setFormData({ ...formData, salary_currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Plateformes de recherche
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PLATFORMS.map((platform) => (
            <label
              key={platform.value}
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={(formData.platforms || []).includes(platform.value)}
                onChange={() => togglePlatform(platform.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{platform.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les critères
            </>
          )}
        </button>
      </div>
    </form>
  );
}

