import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import HealthIntelligence from "./pages/HealthIntelligence";
import Esiwell from "./pages/Esiwell";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import Timeline from "./pages/Timeline";
import ActionPlan from "./pages/ActionPlan";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Connect from "./pages/Connect";
import Subscription from "./pages/Subscription";
import EducationCards from "./pages/EducationCards";
import ClinicianQueue from "./pages/ClinicianQueue";
import Sharing from "./pages/Sharing";
import SharedPatientView from "./pages/SharedPatientView";
import Waitlist from "./pages/Waitlist";
import Onboarding from "./pages/Onboarding";
import FAQ from "./pages/FAQ";
import DemoFlow from "./pages/DemoFlow";
import AdminConsole from "./pages/AdminConsole";
import ClinicianWorkspace from "./pages/ClinicianWorkspace";

import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Legal from "./pages/Legal";
import ICEProfile from "./pages/ICEProfile";
import MedicationReminders from "./pages/MedicationReminders";
import DoctorPacket from "./pages/DoctorPacket";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/demo" element={<DemoFlow />} />
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
                path="/action-plan"
                element={<ProtectedRoute><ActionPlan /></ProtectedRoute>}
            />
            <Route
                path="/documents"
                element={<ProtectedRoute><Documents /></ProtectedRoute>}
            />
            <Route
                path="/education"
                element={<ProtectedRoute><EducationCards /></ProtectedRoute>}
            />
            <Route
                path="/clinician-queue"
                element={<ProtectedRoute><ClinicianQueue /></ProtectedRoute>}
            />
            <Route
                path="/clinician-workspace"
                element={<ProtectedRoute><ClinicianWorkspace /></ProtectedRoute>}
            />
            <Route
                path="/admin"
                element={<ProtectedRoute><AdminConsole /></ProtectedRoute>}
            />
            <Route
                path="/sharing"
                element={<ProtectedRoute><Sharing /></ProtectedRoute>}
            />
            <Route
                path="/patient/:id"
                element={<ProtectedRoute><SharedPatientView /></ProtectedRoute>}
            />
            <Route
                path="/settings"
                element={<Settings />}
            />
            <Route
                path="/ice/:id?"
                element={<ICEProfile />}
            />
            <Route
                path="/med-reminders"
                element={<MedicationReminders />}
            />
            <Route
                path="/doctor-packet"
                element={<DoctorPacket />}
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
                path="/privacy"
                element={<Privacy />}
            />
            <Route
                path="/disclaimer"
                element={<Disclaimer />}
            />
            <Route
                path="/legal"
                element={<Legal />}
            />

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}