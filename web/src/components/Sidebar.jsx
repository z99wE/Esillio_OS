import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user } = useAuth();
    const isClinician = user?.role === "clinician";

    const items = [
        ["Health", "/health"],
        ["Upload", "/upload"],
        ["Timeline", "/timeline"],
        ["Documents", "/documents"],
        ["Guardian", "/guardian"],
        ["Education", "/education"],
        ...(isClinician ? [["Clinician Queue", "/clinician-queue"]] : []),
        ["Settings", "/settings"]
    ];

    return (
        <aside className="sidebar glass">
            <div className="sidebar-logo">
                ESILLIO
            </div>
            <nav>
                {items.map(([label, path]) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}