import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/upload/FileUpload';
import { FilePreview } from '../components/upload/FilePreview';
import { DataTable } from '../components/data/DataTable';
import { Alert } from '../components/ui/Alert';
import { uploadFile, type BackendSummary } from '../lib/api';
// Keeping DataSet type for compatibility for now, or we can adapt
// Actually, let's look at how DataSet is used in DataTable/FilePreview.
// It expects: { fileName, headers, rows, rowCount }
// BackendSummary has: { rowCount, columnCount, columns: [...], preview: [...] }
// We need to map BackendSummary -> DataSet structure to keep using existing components.
import type { DataSet } from '../utils/fileParsing';

// Mapper function
function mapBackendToDataSet(filename: string, summary: BackendSummary): DataSet {
    return {
        fileName: filename,
        rowCount: summary.rowCount,
        headers: summary.columns.map(c => c.name),
        rows: summary.preview, // The backend only returns preview rows!
        // This is a limitation for the "DataTable" if it expected full data.
        // For Phase 7, we'll accept that we only show the preview rows in the frontend for now,
        // or we need a backend endpoint to fetch paginated data (Phase 8+).
        // Let's stick to preview for the Table.
    };
}

export function UploadPage() {
    const navigate = useNavigate();
    const [dataSet, setDataSet] = useState<DataSet | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (file: File) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Use Backend API
            const summary = await uploadFile(file);

            // Map to Frontend Structure
            const data = mapBackendToDataSet(file.name, summary);
            setDataSet(data);

            // Save to local storage for Dashboard to pick up (simulating global state for now)
            // In a real app, this would be Redux/Context or the Backend saving it to DB.
            // We'll save the raw backend summary for the Dashboard to use its advanced fields (anomalies etc).
            localStorage.setItem('analysis_results', JSON.stringify(summary));

        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Failed to process file with backend.";
            setError(errorMessage);
            // Fallback logic could go here if we wanted to support offline mode still, 
            // but let's strictly test backend integration.
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProceed = () => {
        if (dataSet) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Upload Data</h1>
                <p className="text-slate-500">
                    Upload your CSV or Excel file to get started with AI-powered analysis.
                </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />

            {error && (
                <Alert variant="error" title="Processing Error">
                    {error}
                </Alert>
            )}

            {dataSet && (
                <div className="space-y-6 animate-fade-in">
                    <FilePreview
                        data={dataSet}
                        onRemove={() => setDataSet(null)}
                        onAnalyze={handleProceed}
                    />

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-900">Data Preview (First 5 Rows)</h3>
                        </div>
                        <DataTable data={dataSet} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleProceed}
                            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                            Proceed to Analysis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
