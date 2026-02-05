import type { DataSet } from './fileParsing';

export interface KPI {
    id: string;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    type: 'count' | 'sum' | 'avg' | 'min' | 'max';
}

export interface ChartConfig {
    id: string;
    type: 'bar' | 'line' | 'pie';
    title: string;
    dataKey: string;
    xAxisKey: string;
    data: unknown[];
}

export interface AnalysisResult {
    kpis: KPI[];
    charts: ChartConfig[];
    columns: {
        numeric: string[];
        categorical: string[];
        date: string[];
    };
}

export function analyzeData(dataSet: DataSet): AnalysisResult {
    const { headers, rows } = dataSet;

    if (rows.length === 0) return { kpis: [], charts: [], columns: { numeric: [], categorical: [], date: [] } };

    const columns = detectColumnTypes(rows, headers);
    const kpis = generateKPIs(dataSet, columns);
    const charts = generateCharts(dataSet, columns);

    return {
        kpis,
        charts,
        columns,
    };
}

function detectColumnTypes(rows: Record<string, unknown>[], headers: string[]) {
    const numeric: string[] = [];
    const categorical: string[] = [];
    const date: string[] = [];

    const sampleSize = Math.min(rows.length, 100);
    const sample = rows.slice(0, sampleSize);

    headers.forEach(header => {
        let numCount = 0;
        let dateCount = 0;

        sample.forEach(row => {
            const val = row[header];
            if (typeof val === 'number') {
                numCount++;
            } else if (typeof val === 'string') {
                // Simple heuristic for numbers in strings
                if (!isNaN(parseFloat(val)) && isFinite(Number(val))) {
                    numCount++;
                }
                // Simple heuristic for dates
                else if (!isNaN(Date.parse(val)) && val.length > 5 && /[0-9]/.test(val)) {
                    dateCount++;
                }
            }
        });

        if (numCount > sampleSize * 0.8) {
            numeric.push(header);
        } else if (dateCount > sampleSize * 0.8) {
            date.push(header);
        } else {
            categorical.push(header);
        }
    });

    return { numeric, categorical, date };
}

function generateKPIs(dataSet: DataSet, columns: { numeric: string[]; categorical: string[]; date: string[] }): KPI[] {
    const kpis: KPI[] = [];

    // 1. Total Rows
    kpis.push({
        id: 'total_count',
        label: 'Total Records',
        value: dataSet.rowCount.toLocaleString(),
        type: 'count',
    });

    // 2. Sum/Avg of first few numeric columns (limiting to 2 to avoid clutter)
    columns.numeric.slice(0, 2).forEach(col => {
        let sum = 0;
        dataSet.rows.forEach(row => {
            const val = parseFloat(row[col] as string);
            if (!isNaN(val)) sum += val;
        });

        // Heuristic: if average is small, show average. If sum is huge, show sum.
        // For now, let's just show Sum for simplicity unless it looks like a rating (avg).

        // Formatting big numbers
        const formatValue = (num: number) => {
            if (num > 1000000) return (num / 1000000).toFixed(2) + 'M';
            if (num > 1000) return (num / 1000).toFixed(2) + 'K';
            return num.toFixed(2);
        };

        kpis.push({
            id: `sum_${col}`,
            label: `Total ${col}`,
            value: formatValue(sum),
            type: 'sum',
        });
    });

    // 3. Unique counts for categorical (Cardinality) - First categorical
    if (columns.categorical.length > 0) {
        const col = columns.categorical[0];
        const unique = new Set(dataSet.rows.map(r => r[col])).size;
        kpis.push({
            id: `unique_${col}`,
            label: `Unique ${col}`,
            value: unique.toLocaleString(),
            type: 'count'
        });
    }

    return kpis;
}

function generateCharts(dataSet: DataSet, columns: { numeric: string[]; categorical: string[]; date: string[] }): ChartConfig[] {
    const charts: ChartConfig[] = [];

    // 1. Bar Chart: Categorical (X) vs Numeric (Y) - Aggregated
    // Look for a categorical column with low cardinality (< 20) and a numeric column
    const categoryCol = columns.categorical.find(col => {
        const unique = new Set(dataSet.rows.map(r => String(r[col]))).size;
        return unique > 1 && unique <= 20;
    });

    const numericCol = columns.numeric[0];

    if (categoryCol && numericCol) {
        // Aggregate
        const agg: Record<string, number> = {};
        dataSet.rows.forEach(row => {
            const cat = String(row[categoryCol]);
            const val = parseFloat(row[numericCol] as string);
            if (cat && !isNaN(val)) {
                agg[cat] = (agg[cat] || 0) + val;
            }
        });

        const data = Object.entries(agg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value); // Sort desc

        charts.push({
            id: `bar_${categoryCol}_${numericCol}`,
            type: 'bar',
            title: `${numericCol} by ${categoryCol}`,
            xAxisKey: 'name',
            dataKey: 'value',
            data
        });
    }

    // 2. Line Chart: Date (X) vs Numeric (Y)
    const dateCol = columns.date[0];
    if (dateCol && numericCol) {
        const agg: Record<string, number> = {};
        dataSet.rows.forEach(row => {
            const d = String(row[dateCol]);
            const val = parseFloat(row[numericCol] as string);
            if (d && !isNaN(val)) {
                agg[d] = (agg[d] || 0) + val;
            }
        });

        const data = Object.entries(agg)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

        charts.push({
            id: `line_${dateCol}_${numericCol}`,
            type: 'line',
            title: `${numericCol} Trend over Time`,
            xAxisKey: 'name',
            dataKey: 'value',
            data
        });
    } else if (!dateCol && numericCol && dataSet.rows.length < 100) {
        // If small dataset, maybe just line chart of items?
        // Skip for now to avoid noise.
    }

    // 3. Pie Chart: Composition of a Category
    if (categoryCol && numericCol && charts.length < 3) {
        // Already calculated agg for bar chart
        const agg: Record<string, number> = {};
        dataSet.rows.forEach(row => {
            const cat = String(row[categoryCol]);
            const val = parseFloat(row[numericCol] as string);
            if (cat && !isNaN(val)) {
                agg[cat] = (agg[cat] || 0) + val;
            }
        });
        const data = Object.entries(agg).map(([name, value]) => ({ name, value }));

        charts.push({
            id: `pie_${categoryCol}`,
            type: 'pie',
            title: `Distribution of ${numericCol} by ${categoryCol}`,
            xAxisKey: 'name', // Not used for pie but good for consistency
            dataKey: 'value',
            data
        });
    }

    return charts;
}
