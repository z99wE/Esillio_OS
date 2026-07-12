import { BrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes";
import { HealthProvider } from "./context/HealthContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <HealthProvider>
                    <AppLayout>
                        <AppRoutes />
                    </AppLayout>
                </HealthProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}