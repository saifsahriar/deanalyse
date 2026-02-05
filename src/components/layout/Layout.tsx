import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
