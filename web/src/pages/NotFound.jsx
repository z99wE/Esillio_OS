import { Link } from "react-router-dom";
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-text-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-transparent blur-3xl -z-10"></div>
            <h1 className="text-9xl font-primary text-brand-primary opacity-20 select-none">404</h1>
            <h2 className="text-3xl font-medium mt-4 -tracking-[0.02em]">Page not found</h2>
            <p className="mt-2 text-text-secondary">The link you followed may be broken, or the page may have been removed.</p>
            <a href="/" className="mt-8 px-6 py-3 rounded-sm font-medium text-sm bg-brand-primary text-text-primary hover:bg-red-700 transition-colors">
                Return to home
            </a>
        </div>
    );
}
