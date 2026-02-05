
import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
    acceptedFileTypes?: Record<string, string[]>;
}

export function FileUpload({
    onFileSelect,
    isProcessing,
    acceptedFileTypes = {
        'text/csv': ['.csv'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    }
}: FileUploadProps) {
    const [dragError, setDragError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setDragError(null);

        if (fileRejections.length > 0) {
            setDragError('Invalid file type. Please upload a CSV or Excel file.');
            return;
        }

        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        multiple: false,
        disabled: isProcessing
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    'relative border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer text-center group bg-white',
                    isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50',
                    isProcessing && 'opacity-50 cursor-not-allowed pointer-events-none',
                    dragError && 'border-red-300 bg-red-50'
                )}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={cn(
                        "p-4 rounded-full bg-slate-100 transition-colors group-hover:bg-primary-100",
                        isDragActive && "bg-primary-200"
                    )}>
                        {isProcessing ? (
                            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                        ) : (
                            <UploadCloud className={cn("w-8 h-8 text-slate-400 group-hover:text-primary-600", isDragActive && "text-primary-700")} />
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="text-lg font-medium text-slate-700">
                            {isDragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-slate-500">
                            Excel (.xlsx, .xls) or CSV files up to 5,000 rows
                        </p>
                    </div>

                    {!isProcessing && (
                        <Button variant="secondary" size="sm" className="mt-2 pointer-events-none">
                            Select File
                        </Button>
                    )}
                </div>
            </div>

            {dragError && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    <span>{dragError}</span>
                </div>
            )}
        </div>
    );
}
