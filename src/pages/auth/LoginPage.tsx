import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            const err = error as Error;
            setMessage({
                type: 'error',
                text: err.message || 'Failed to sign in'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle="Or start your 14-day free trial"
        >
            <form className="space-y-6" onSubmit={handleLogin}>
                {message && (
                    <Alert
                        variant={message.type === 'error' ? 'error' : 'success'}
                        title={message.type === 'error' ? 'Error' : 'Success'}
                    >
                        {message.text}
                    </Alert>
                )}

                <Input
                    label="Email address"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={loading}>
                    Sign in
                </Button>

                <div className="text-center text-sm">
                    <span className="text-slate-500">Don't have an account? </span>
                    <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign up
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
