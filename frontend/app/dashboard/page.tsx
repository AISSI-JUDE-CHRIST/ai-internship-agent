'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import RecentApplications from '@/components/RecentApplications';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { applicationApi } from '@/lib/api';
import { ApplicationResponse } from '@/lib/api';

export default function DashboardPage() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    responseRate: 0,
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationApi.getAll();
      setApplications(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (apps: ApplicationResponse[]) => {
    const total = apps.length;
    const submitted = apps.filter(app => app.status === 'submitted').length;
    const pending = apps.filter(app => 
      ['draft', 'pending', 'submitted', 'reviewed'].includes(app.status)
    ).length;
    const accepted = apps.filter(app => app.status === 'accepted').length;
    const rejected = apps.filter(app => app.status === 'rejected').length;
    
    const responded = accepted + rejected;
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

    setStats({
      total,
      submitted,
      pending,
      accepted,
      rejected,
      responseRate,
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-2">
              Vue d'ensemble de vos candidatures
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total"
              value={stats.total}
              icon={FileText}
              color="blue"
              description="Candidatures créées"
            />
            <StatsCard
              title="Envoyées"
              value={stats.submitted}
              icon={Send}
              color="green"
              description="Candidatures soumises"
            />
            <StatsCard
              title="En attente"
              value={stats.pending}
              icon={Clock}
              color="yellow"
              description="En cours de traitement"
            />
            <StatsCard
              title="Taux de réponse"
              value={`${stats.responseRate}%`}
              icon={TrendingUp}
              color="purple"
              description={`${stats.accepted + stats.rejected} réponses sur ${stats.total}`}
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Statut des candidatures
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Acceptées</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats.accepted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-gray-700">Refusées</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats.rejected}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-gray-700">En attente</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats.pending}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Taux de réponse</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.responseRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${stats.responseRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Taux d'acceptation</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <RecentApplications 
            applications={applications} 
            isLoading={isLoading}
            onRefresh={loadApplications}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

