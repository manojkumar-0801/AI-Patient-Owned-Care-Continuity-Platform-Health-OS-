import { Card, CardBody } from '../ui';
import { CheckCircle2, ListChecks } from 'lucide-react';

export default function RecommendationsCard({ recommendations }) {
  return (
    <Card className="h-full">
      <CardBody className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
          <ListChecks className="w-5 h-5 text-primary mr-2" />
          Recommendations
        </h3>
        {recommendations && recommendations.length > 0 ? (
          <ul className="space-y-4">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-success mr-3 shrink-0 mt-0.5" />
                <span className="text-text-primary leading-tight font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-muted italic">No specific recommendations at this time.</p>
        )}
      </CardBody>
    </Card>
  );
}
