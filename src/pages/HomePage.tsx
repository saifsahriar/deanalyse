
import { ArrowRight, BarChart2, Upload, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative isolate pt-14">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>

                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            Data Insights for Everyone
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Upload your spreadsheets and let AI analyze your business data. Get instant charts, KPIs, and answers in plain English.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/upload">
                                <Button size="lg" className="rounded-full">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/#features">
                                <Button variant="ghost" size="lg" className="rounded-full">Learn more</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 sm:py-32 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary-600">Analyze Faster</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need to understand your data
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {[
                                {
                                    name: 'Instant Visualization',
                                    description: 'Automatically generate charts and graphs from your Excel or CSV files.',
                                    icon: BarChart2,
                                },
                                {
                                    name: 'AI-Powered Insights',
                                    description: 'Ask questions about your data in natural language and get immediate answers.',
                                    icon: Zap,
                                },
                                {
                                    name: 'Easy Upload',
                                    description: 'Drag and drop your files. We handle the formatting and processing for you.',
                                    icon: Upload,
                                },
                            ].map((feature) => (
                                <Card key={feature.name} className="flex flex-col p-6 hover:shadow-lg transition-all">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                        <div className="h-10 w-10 items-center justify-center rounded-lg bg-primary-600 flex text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
