import { cn } from '@axira/shared/utils';

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'donut';
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
    trend?: number;
  }>;
  unit?: string;
  comparison?: {
    period: string;
    change: number;
  };
}

interface ResponseChartProps {
  chart: ChartData;
  className?: string;
}

export function ResponseChart({ chart, className }: ResponseChartProps) {
  return (
    <div className={cn('bg-gray-800/50 rounded-lg p-4 border border-gray-700', className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white">{chart.title}</h4>
        {chart.comparison && (
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            chart.comparison.change >= 0
              ? 'bg-green-900/50 text-green-400'
              : 'bg-red-900/50 text-red-400'
          )}>
            {chart.comparison.change >= 0 ? '+' : ''}{chart.comparison.change}% {chart.comparison.period}
          </span>
        )}
      </div>

      {chart.type === 'bar' && <BarChart data={chart.data} unit={chart.unit} />}
      {chart.type === 'line' && <LineChart data={chart.data} unit={chart.unit} />}
      {(chart.type === 'pie' || chart.type === 'donut') && (
        <PieChart data={chart.data} unit={chart.unit} isDonut={chart.type === 'donut'} />
      )}
    </div>
  );
}

// Bar Chart Component
function BarChart({ data, unit }: { data: ChartData['data']; unit?: string }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-gray-300 font-medium">
              {item.value}{unit ? ` ${unit}` : ''}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#3b82f6',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Line Chart Component (simplified visual)
function LineChart({ data, unit }: { data: ChartData['data']; unit?: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 80 - 10; // 10-90% range
    return { x, y, value: item.value, label: item.label };
  });

  // Create SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Create area path
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="space-y-2">
      {/* Chart */}
      <div className="relative h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#374151"
              strokeWidth="0.5"
            />
          ))}

          {/* Area under line */}
          <path
            d={areaD}
            fill="url(#lineGradient)"
            opacity="0.3"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#3b82f6"
              stroke="#1e3a8a"
              strokeWidth="1"
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-400">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">
          Range: {minValue.toFixed(1)} - {maxValue.toFixed(1)} {unit}
        </span>
        <span className="text-gray-300">
          Latest: {data[data.length - 1].value} {unit}
        </span>
      </div>
    </div>
  );
}

// Pie/Donut Chart Component
function PieChart({
  data,
  unit,
  isDonut = false
}: {
  data: ChartData['data'];
  unit?: string;
  isDonut?: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate segments
  let currentAngle = -90; // Start from top
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: startAngle + angle,
    };
  });

  // Create arc path
  const createArcPath = (startAngle: number, endAngle: number, radius: number, innerRadius: number = 0) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (innerRadius > 0) {
      // Donut
      const x3 = 50 + innerRadius * Math.cos(endRad);
      const y3 = 50 + innerRadius * Math.sin(endRad);
      const x4 = 50 + innerRadius * Math.cos(startRad);
      const y4 = 50 + innerRadius * Math.sin(startRad);

      return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    }

    // Pie
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex items-center gap-4">
      {/* Chart */}
      <div className="w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createArcPath(segment.startAngle, segment.endAngle, 45, isDonut ? 25 : 0)}
              fill={segment.color || `hsl(${index * 60}, 70%, 50%)`}
              stroke="#1f2937"
              strokeWidth="1"
            />
          ))}
          {isDonut && (
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-white text-xs font-medium"
              fill="white"
            >
              {total.toFixed(0)}{unit}
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-1.5">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: segment.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-gray-400">{segment.label}</span>
            </div>
            <span className="text-gray-300 font-medium">
              {segment.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Grid Component for multiple charts
export function ResponseChartGrid({ charts, className }: { charts: ChartData[]; className?: string }) {
  if (!charts || charts.length === 0) return null;

  return (
    <div className={cn('grid gap-3', charts.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2', className)}>
      {charts.map((chart, index) => (
        <ResponseChart key={index} chart={chart} />
      ))}
    </div>
  );
}
