import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { DataSet } from '../../utils/fileParsing';
import { Button } from '../ui/Button';

interface DataTableProps {
    data: DataSet;
}

export function DataTable({ data }: DataTableProps) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalPages = Math.ceil(data.rows.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const visibleRows = data.rows.slice(startIndex, startIndex + pageSize);

    const goToPage = (p: number) => {
        setPage(Math.min(Math.max(1, p), totalPages));
    };

    return (
        <div className="space-y-4">
            {/* Table Container */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                {data.headers.map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {visibleRows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                                    {data.headers.map((header) => (
                                        <td
                                            key={`${rowIndex}-${header}`}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 max-w-xs overflow-hidden text-ellipsis"
                                        >
                                            {row[header]?.toString() || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-slate-500 hidden sm:block">
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + pageSize, data.rows.length)}</span> of <span className="font-medium">{data.rows.length}</span> entries
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="mr-4 rounded-md border-slate-300 text-sm focus:ring-primary-500 focus:border-primary-500 py-1.5"
                    >
                        {[10, 20, 50, 100].map(size => (
                            <option key={size} value={size}>Show {size}</option>
                        ))}
                    </select>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => goToPage(page - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-slate-700 min-w-[3ch] text-center">
                        {page}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => goToPage(page + 1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
