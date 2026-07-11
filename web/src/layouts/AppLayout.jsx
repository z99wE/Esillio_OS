import Navbar from "../components/Navbar";
import Background from "../components/Background";

export default function AppLayout({ children }) {
    return (
        <div className="app-shell">
            <Background />

            <div className="app-overlay">
                <Navbar />

                <main className="page-container">
                    {children}
                </main>
            </div>
        </div>
    );
}