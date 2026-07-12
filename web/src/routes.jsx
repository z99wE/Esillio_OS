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

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route
                path="/health"
                element={<HealthIntelligence />}
            />
            <Route
                path="/esiwell"
                element={<Esiwell />}
            />
            <Route
                path="/upload"
                element={<Upload />}
            />
            <Route
                path="/timeline"
                element={<Timeline />}
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