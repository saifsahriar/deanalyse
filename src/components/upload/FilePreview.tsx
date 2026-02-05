import { FileText, BarChart3, GripVertical, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { DataSet } from '../../utils/fileParsing';

interface FilePreviewProps {
    data: DataSet;
    onRemove: () => void;
    onAnalyze: () => void;
}

export function FilePreview({ data, onRemove, onAnalyze }: FilePreviewProps) {
    return (
        <Card className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-900">{data.fileName}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <GripVertical className="w-3 h-3" /> {data.rowCount.toLocaleString()} rows
                            </span>
                            <span className="flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" /> {data.headers.length} columns
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onRemove} className="text-slate-500 hover:text-red-500">
                        Remove
                    </Button>
                    <Button onClick={onAnalyze}>
                        Analyze Data
                    </Button>
                </div>
            </div>

            {data.rowCount > 4000 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <span className="font-semibold">Large dataset detected.</span> Analysis might take a few seconds longer. The system is optimized for up to 5,000 rows.
                    </div>
                </div>
            )}
        </Card>
    );
}
