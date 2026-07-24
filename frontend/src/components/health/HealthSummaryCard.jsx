import { Card, CardBody } from '../ui';
import { Activity, AlertTriangle } from 'lucide-react';

export default function HealthSummaryCard({ status, risk }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardBody className="p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Overall Health</p>
            <p className="text-2xl font-bold text-text-primary">{status}</p>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-error/5 border-error/20">
        <CardBody className="p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center mr-4">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Overall Risk</p>
            <p className="text-2xl font-bold text-text-primary">{risk}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
