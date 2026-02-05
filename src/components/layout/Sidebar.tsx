
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, MessageSquare, X, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { signOut } = useAuth();
    const links = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/upload', label: 'Upload Data', icon: UploadCloud },
        { to: '/chat', label: 'AI Chat', icon: MessageSquare },
    ];

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />

            <div
                className={cn(
                    'fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        DeAnalyse
                    </span>
                    <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-primary-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group',
                                    isActive
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                                )
                            }
                        >
                            <link.icon className={cn("w-5 h-5 transition-colors", ({ isActive }: { isActive: boolean }) => isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                            {link.label}
                        </NavLink>
                    ))}

                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group mt-6"
                    >
                        <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                        Sign Out
                    </button>
                </nav>
            </div>
        </>
    );
}
