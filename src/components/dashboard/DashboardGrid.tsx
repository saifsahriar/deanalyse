import type { KPI, ChartConfig } from '../../utils/analysisUtils';
import { KPICard } from './KPICard';
import { AutoBarChart } from './charts/AutoBarChart';
import { AutoLineChart } from './charts/AutoLineChart';
import { AutoPieChart } from './charts/AutoPieChart';

interface DashboardGridProps {
    kpis: KPI[];
    charts: ChartConfig[];
}

export function DashboardGrid({ kpis, charts }: DashboardGridProps) {
    return (
        <div className="space-y-8 animate-slide-up">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, index) => (
                    <KPICard key={kpi.id || index} kpi={kpi} />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart, index) => {
                    switch (chart.type) {
                        case 'bar':
                            return <AutoBarChart key={chart.id || index} config={chart} />;
                        case 'line':
                            return <AutoLineChart key={chart.id || index} config={chart} />;
                        case 'pie':
                            return <AutoPieChart key={chart.id || index} config={chart} />;
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
}
