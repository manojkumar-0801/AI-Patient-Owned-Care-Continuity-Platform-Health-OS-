import { useState, useEffect } from 'react';
import api from '../services/api';
import { Spinner, Card, CardBody } from '../components/ui';
import { AlertCircle, BrainCircuit } from 'lucide-react';
import HealthSummaryCard from '../components/health/HealthSummaryCard';
import TrendAnalysisCard from '../components/health/TrendAnalysisCard';
import RiskFactorsCard from '../components/health/RiskFactorsCard';
import RecommendationsCard from '../components/health/RecommendationsCard';
import HealthCharts from '../components/health/HealthCharts';

export default function HealthInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/health-insights/');
        if (response.data && response.data.success) {
          setData(response.data.data);
        } else {
          setError('Failed to load health insights.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner size="lg" label="Analyzing health records..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px] animate-fade-in">
        <div className="bg-error/10 border border-error/50 text-error px-6 py-4 rounded-xl flex items-center">
          <AlertCircle className="w-6 h-6 mr-3" />
          <p>{error || "Could not retrieve insights at this time."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Health Insights</h1>
          <p className="text-text-secondary mt-1">AI-powered analytics and risk predictions based on your medical history.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-2">
        <HealthSummaryCard status={data.overall_status} risk={data.overall_risk} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TrendAnalysisCard trends={data.trends} />
          </div>
          <div className="lg:col-span-1">
            <RiskFactorsCard riskFactors={data.risk_factors} />
          </div>
          <div className="lg:col-span-1">
            <RecommendationsCard recommendations={data.recommendations} />
          </div>
        </div>

        <HealthCharts />
      </div>

    </div>
  );
}
