import { Card, CardBody } from '../ui';
import { TrendingUp, ArrowRight, TrendingDown, Minus } from 'lucide-react';

export default function TrendAnalysisCard({ trends }) {
  const getIcon = (trendText) => {
    const text = trendText.toLowerCase();
    if (text.includes('increas')) return <TrendingUp className="w-5 h-5 text-warning mr-3" />;
    if (text.includes('decreas')) return <TrendingDown className="w-5 h-5 text-success mr-3" />;
    return <Minus className="w-5 h-5 text-text-muted mr-3" />;
  };

  return (
    <Card className="h-full">
      <CardBody className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-primary mr-2" />
          Trend Analysis
        </h3>
        {trends && trends.length > 0 ? (
          <ul className="space-y-4">
            {trends.map((trend, idx) => (
              <li key={idx} className="flex items-start">
                {getIcon(trend)}
                <span className="text-text-secondary leading-tight">{trend}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-muted italic">No trend data available.</p>
        )}
      </CardBody>
    </Card>
  );
}
