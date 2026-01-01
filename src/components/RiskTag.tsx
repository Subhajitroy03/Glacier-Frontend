import { cn } from '@/lib/utils';
import { getRiskLabel } from '@/data/lakesData';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const RiskTag = ({ level, score, size = 'md', showIcon = true }) => {
  const getIcon = () => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return AlertCircle;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const Icon = getIcon();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-all',
        sizeClasses[size],
        level === 'high' && 'risk-high animate-pulse-glow',
        level === 'medium' && 'risk-medium',
        level === 'low' && 'risk-low'
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{getRiskLabel(level)}</span>
      {score !== undefined && (
        <span className="opacity-70 ml-1">
          ({(score * 100).toFixed(0)}%)
        </span>
      )}
    </span>
  );
};

export default RiskTag;
