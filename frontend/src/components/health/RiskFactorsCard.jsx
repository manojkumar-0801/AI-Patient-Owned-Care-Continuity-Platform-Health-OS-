import { Card, CardBody, Badge } from '../ui';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function RiskFactorsCard({ riskFactors }) {
  const getBadgeVariant = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'outline';
    }
  };

  const getEmoji = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <Card className="h-full">
      <CardBody className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-error mr-2" />
          Risk Factors
        </h3>
        {riskFactors && riskFactors.length > 0 ? (
          <ul className="space-y-4">
            {riskFactors.map((rf, idx) => (
              <li key={idx} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
                <span className="text-text-primary font-medium">{rf.factor}</span>
                <div className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-text-muted mx-2" />
                  <span className="mr-2 text-sm">{getEmoji(rf.risk)}</span>
                  <Badge variant={getBadgeVariant(rf.risk)}>{rf.risk}</Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-muted italic">No risk factors identified.</p>
        )}
      </CardBody>
    </Card>
  );
}
