import { Card, CardBody } from '../ui';
import { BarChart2 } from 'lucide-react';

export default function HealthCharts() {
  return (
    <Card className="h-full mt-6">
      <CardBody className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
          <BarChart2 className="w-5 h-5 text-primary mr-2" />
          Health Charts
        </h3>
        <div className="bg-background rounded-xl border border-border h-64 flex items-center justify-center">
          <p className="text-text-muted italic text-sm">Visual charts will be available soon.</p>
        </div>
      </CardBody>
    </Card>
  );
}
