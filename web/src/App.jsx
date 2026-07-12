import { BrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes";
import { HealthProvider } from "./context/HealthContext";

export default function App() {
    return (
        <BrowserRouter>
            <HealthProvider>
                <AppLayout>
                    <AppRoutes />
                </AppLayout>
            </HealthProvider>
        </BrowserRouter>
    );
}