import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import HealthIntelligence from "./pages/HealthIntelligence";
import Esiwell from "./pages/Esiwell";
import Upload from "./pages/Upload";
import Timeline from "./pages/Timeline";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Connect from "./pages/Connect";
import Subscription from "./pages/Subscription";

import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
                path="/health"
                element={<ProtectedRoute><HealthIntelligence /></ProtectedRoute>}
            />
            <Route
                path="/esiwell"
                element={<ProtectedRoute><Esiwell /></ProtectedRoute>}
            />
            <Route
                path="/upload"
                element={<ProtectedRoute><Upload /></ProtectedRoute>}
            />
            <Route
                path="/timeline"
                element={<ProtectedRoute><Timeline /></ProtectedRoute>}
            />
            <Route
                path="/settings"
                element={<Settings />}
            />
            <Route
                path="/connect"
                element={<Connect />}
            />
            <Route
                path="/subscription"
                element={<Subscription />}
            />

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}