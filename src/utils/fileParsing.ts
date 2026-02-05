/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface DataSet {
    fileName: string;
    headers: string[];
    rows: Record<string, unknown>[];
    rowCount: number;
}

export type ParseResult = {
    data: DataSet | null;
    error: string | null;
};

const MAX_ROWS = 5000;

export async function parseFile(file: File): Promise<ParseResult> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
        return parseCSV(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
        return parseExcel(file);
    } else {
        return { data: null, error: 'Unsupported file format. Please upload CSV or Excel files.' };
    }
}

function parseCSV(file: File): Promise<ParseResult> {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    resolve({ data: null, error: `Error parsing CSV: ${results.errors[0].message}` });
                    return;
                }

                const rows = results.data as Record<string, any>[];
                if (rows.length === 0) {
                    resolve({ data: null, error: 'The file appears to be empty.' });
                    return;
                }

                if (rows.length > MAX_ROWS) {
                    resolve({ data: null, error: `File exceeds the maximum limit of ${MAX_ROWS} rows.` });
                    return;
                }

                const headers = results.meta.fields || Object.keys(rows[0]);

                resolve({
                    data: {
                        fileName: file.name,
                        headers,
                        rows: rows,
                        rowCount: rows.length,
                    },
                    error: null,
                });
            },
            error: (error) => {
                resolve({ data: null, error: error.message });
            },
        });
    });
}

function parseExcel(file: File): Promise<ParseResult> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const rowsObjects = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

                if (rowsObjects.length > MAX_ROWS) {
                    resolve({ data: null, error: `File exceeds the maximum limit of ${MAX_ROWS} rows.` });
                    return;
                }

                if (rowsObjects.length === 0) {
                    resolve({ data: null, error: 'The sheet appears to be empty or headers are missing.' });
                    return;
                }

                const extractedHeaders = Object.keys(rowsObjects[0]);

                resolve({
                    data: {
                        fileName: file.name,
                        headers: extractedHeaders,
                        rows: rowsObjects,
                        rowCount: rowsObjects.length,
                    },
                    error: null,
                });
            } catch (err) {
                console.error(err);
                resolve({ data: null, error: 'Failed to parse Excel file. It might be corrupted.' });
            }
        };

        reader.onerror = () => {
            resolve({ data: null, error: 'Failed to read file.' });
        };

        reader.readAsBinaryString(file);
    });
}
