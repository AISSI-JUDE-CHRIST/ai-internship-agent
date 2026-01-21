'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import JobList from '@/components/JobList';
import JobFilters from '@/components/JobFilters';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { jobApi, searchCriteriaApi } from '@/lib/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keywords: [] as string[],
    location: '',
  });
  const [filters, setFilters] = useState({
    minScore: 0,
    matchedOnly: false,
    platform: '',
    jobType: '',
    remoteOnly: false,
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'company'>('relevance');
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSearchCriteria();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [jobs, filters, sortBy]);

  const loadSearchCriteria = async () => {
    try {
      const criteria = await searchCriteriaApi.get();
      if (criteria.location) {
        setSearchParams(prev => ({ ...prev, location: criteria.location || '' }));
      }
      if (criteria.required_keywords && criteria.required_keywords.length > 0) {
        setSearchParams(prev => ({ ...prev, keywords: criteria.required_keywords || [] }));
      }
    } catch (error) {
      console.error('Error loading search criteria:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchParams.keywords.length && !searchParams.location) {
      alert('Veuillez entrer au moins des mots-clés ou une localisation');
      return;
    }

    setIsSearching(true);
    try {
      const results = await jobApi.search(
        searchParams.keywords,
        searchParams.location,
        100
      );
      setJobs(results);
    } catch (error) {
      console.error('Error searching jobs:', error);
      alert('Erreur lors de la recherche d\'offres');
    } finally {
      setIsSearching(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...jobs];

    // Apply filters
    if (filters.minScore > 0) {
      filtered = filtered.filter(job => (job.relevance_score || 0) >= filters.minScore);
    }

    if (filters.matchedOnly) {
      filtered = filtered.filter(job => job.matched === true);
    }

    if (filters.platform) {
      filtered = filtered.filter(job => job.platform === filters.platform);
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    if (filters.remoteOnly) {
      filtered = filtered.filter(job => job.remote === true);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.relevance_score || 0) - (a.relevance_score || 0);
        case 'date':
          const dateA = a.posted_date ? new Date(a.posted_date).getTime() : 0;
          const dateB = b.posted_date ? new Date(b.posted_date).getTime() : 0;
          return dateB - dateA;
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const toggleJobSelection = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleApplyToSelected = async () => {
    if (selectedJobs.size === 0) {
      alert('Veuillez sélectionner au moins une offre');
      return;
    }

    // TODO: Implement application creation for selected jobs
    alert(`${selectedJobs.size} candidature(s) sera(ont) créée(s)`);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Search className="h-8 w-8 mr-3 text-primary-600" />
              Recherche d'offres
            </h1>
            <p className="text-gray-600">
              Trouvez les offres qui correspondent à vos critères
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={searchParams.keywords.join(', ')}
                  onChange={(e) => {
                    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                    setSearchParams({ ...searchParams, keywords });
                  }}
                  placeholder="Ex: Python, Développeur, Marketing..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  placeholder="Ex: Paris, Lyon, Remote..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Sort */}
          {jobs.length > 0 && (
            <>
              <JobFilters
                filters={filters}
                onFiltersChange={setFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalJobs={jobs.length}
                filteredCount={filteredJobs.length}
              />

              {/* Selection Actions */}
              {selectedJobs.size > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-primary-800 font-semibold">
                    {selectedJobs.size} offre(s) sélectionnée(s)
                  </p>
                  <button
                    onClick={handleApplyToSelected}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Candidater aux offres sélectionnées
                  </button>
                </div>
              )}

              {/* Job List */}
              <JobList
                jobs={filteredJobs}
                selectedJobs={selectedJobs}
                onToggleSelection={toggleJobSelection}
                isLoading={isLoading}
              />
            </>
          )}

          {/* Empty State */}
          {jobs.length === 0 && !isSearching && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune recherche effectuée
              </h3>
              <p className="text-gray-600 mb-6">
                Entrez des mots-clés et une localisation, puis cliquez sur "Rechercher" pour trouver des offres
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

