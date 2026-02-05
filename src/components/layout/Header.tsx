
import { Menu, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuth();
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 ring-2 ring-white shadow-sm">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-slate-700">{user?.email || 'User'}</p>
                        <p className="text-xs text-slate-400">Account</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
