import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { analyzeData, type AnalysisResult } from '../utils/analysisUtils';
import type { DataSet } from '../utils/fileParsing';
import { Loading } from '../components/ui/Loading';

export function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        // In a real app, we would get this from Context or a Store.
        // For this pilot, we can assume the data was passed via location state or
        // we can mock it/fetch from session storage if we had persistence.
        // To make it fully functional for the demo flow, let's mock the data transfer 
        // OR we can implement a simple text upload context later.
        // BUT for now, since we haven't implemented Global State, let's simulate 
        // "No Data" state if accessed directly, and maybe add a mock data loader 
        // for testing if needed. 
        // ACTUALLY, I should pass data from UploadPage.
        // Let's implement a quick sessionStorage check for the pilot.

        const loadData = async () => {
            // Check for data in localStorage (passed from UploadPage)
            const storedResults = localStorage.getItem('analysis_results');

            if (storedResults) {
                try {
                    const backendSummary = JSON.parse(storedResults);

                    // Map BackendSummary to AnalysisResult
                    // We need to re-construct a generic 'AnalysisResult' compat object 
                    // or adapt 'analyzeData' to work with BackendSummary.
                    // For now, let's map it quickly to visualize it.

                    const kpis = backendSummary.ai_kpis
                        ? backendSummary.ai_kpis.map((k: any) => ({
                            title: k.title,
                            value: "N/A", // Backend needs to calculate values or we calculate here
                            change: "+0%", // Placeholder
                            trend: 'neutral'
                        }))
                        : [];

                    // Fallback to client-side calc if no AI KPIs or just specific ones
                    // Actually, let's try to infer some basic stats from 'columns' stats
                    // e.g. Row Count
                    kpis.unshift({
                        title: "Total Records",
                        value: backendSummary.rowCount.toString(),
                        change: "0%",
                        trend: "neutral"
                    });

                    // We need charts. The backend summary has 'preview' data. 
                    // We can use 'analyzeData' logic on the preview data for charts?
                    // Better yet, let's just use the 'analyzeData' utility on the 'preview' rows
                    // treating it as the full dataset for the purpose of visualization in this fix.

                    const dataSet: DataSet = {
                        fileName: 'Uploaded File',
                        headers: backendSummary.columns.map((c: any) => c.name),
                        rows: backendSummary.preview,
                        rowCount: backendSummary.rowCount
                    };

                    // Generate frontend analysis based on the available preview data
                    const frontendAnalysis = analyzeData(dataSet);

                    // Merge with Backend AI KPIs if available (replacing simple ones)
                    // For now, let's just use the frontend analysis of the preview data
                    // combined with the accurate row count from backend.

                    setAnalysis({
                        ...frontendAnalysis,
                        kpis: [
                            {
                                title: "Total Rows",
                                value: backendSummary.rowCount.toLocaleString(),
                                change: "",
                                trend: "neutral"
                            },
                            ...frontendAnalysis.kpis.filter(k => k.title !== "Total Records")
                        ]
                    });

                } catch (e) {
                    console.error("Failed to parse analysis results", e);
                }
            }

            setLoading(false);
        };

        loadData();
    }, []);

    // Temporary function to simulate data for testing visual components immediately
    const loadDemoData = () => {
        setLoading(true);
        setTimeout(() => {
            const demoRows = Array.from({ length: 50 }, (_, i) => ({
                Region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
                Category: ['Electronics', 'Furniture', 'Office'][Math.floor(Math.random() * 3)],
                Sales: Math.floor(Math.random() * 1000) + 100,
                Date: new Date(2023, 0, i + 1).toISOString().split('T')[0]
            }));

            const demoData: DataSet = {
                fileName: 'Demo Sales Data.csv',
                headers: ['Region', 'Category', 'Sales', 'Date'],
                rows: demoRows,
                rowCount: 50
            };

            const result = analyzeData(demoData);
            setAnalysis(result);
            setLoading(false);
        }, 500);
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (!analysis) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <BarChart2 className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Data Available</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    You haven't uploaded any data yet. Upload a file to generate insights and visualizations.
                </p>
                <div className="flex gap-4">
                    <Link to="/upload">
                        <Button size="lg">
                            <UploadCloud className="mr-2 w-5 h-5" />
                            Upload Data
                        </Button>
                    </Link>
                    <Button variant="secondary" size="lg" onClick={loadDemoData}>
                        View Demo Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Business Overview</h1>
                <p className="text-slate-600">
                    Analysis based on <span className="font-medium text-slate-900">Demo Data</span>
                </p>
            </div>

            <DashboardGrid kpis={analysis.kpis} charts={analysis.charts} />
        </div>
    );
}
