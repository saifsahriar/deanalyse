import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import type { KPI } from '../../utils/analysisUtils';

interface KPICardProps {
    kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 truncate">{kpi.label}</p>

                {/* Mocking trend icon logic for now, or using real if available */}
                {kpi.trend && (
                    <div className={cn(
                        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                        kpi.trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {kpi.trend.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {kpi.trend.value}%
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {kpi.value}
                </h3>
            </div>
        </Card>
    );
}
