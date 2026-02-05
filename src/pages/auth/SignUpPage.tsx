import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await signUp(email, password, fullName);
            if (error) throw error;
            // Usually check for email confirmation requirement, but for dev we might auto-confirm
            navigate('/login');
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Get started with your free account today"
        >
            <form className="space-y-6" onSubmit={handleSignUp}>
                {error && (
                    <Alert variant="error" title="Error">
                        {error}
                    </Alert>
                )}

                <Input
                    label="Full Name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

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

                <Button type="submit" className="w-full" isLoading={loading}>
                    Sign Up
                </Button>

                <div className="text-center text-sm">
                    <span className="text-slate-500">Already have an account? </span>
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
