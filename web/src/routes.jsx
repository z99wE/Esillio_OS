import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import HealthIntelligence from "./pages/HealthIntelligence";
import Upload from "./pages/Upload";
import Timeline from "./pages/Timeline";
import Guardian from "./pages/Guardian";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route
                path="/health"
                element={<HealthIntelligence />}
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
                path="/guardian"
                element={<Guardian />}
            />
            <Route
                path="/profile"
                element={<Profile />}
            />
            <Route
                path="/settings"
                element={<Settings />}
            />
            <Route
                path="/privacy"
                element={<Privacy />}
            />
            <Route
                path="/disclaimer"
                element={<Disclaimer />}
            />
            <Route
                path="/about"
                element={<About />}
            />
            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}