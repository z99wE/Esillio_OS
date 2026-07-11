import { NavLink } from "react-router-dom";

const links = [
    {
        title: "Health Intelligence",
        path: "/health",
    },
    {
        title: "Timeline",
        path: "/timeline",
    },
    {
        title: "Upload",
        path: "/upload",
    },
    {
        title: "Guardian",
        path: "/guardian",
    },
];

export default function Navbar() {
    return (
        <header className="navbar-wrapper">

            <nav className="navbar glass">

                <NavLink
                    to="/"
                    className="brand"
                >
                    <div className="brand-logo">
                        E
                    </div>

                    <div className="brand-text">

                        <span className="brand-name">
                            Esillio
                        </span>

                        <span className="brand-tag">
                            Health Intelligence
                        </span>

                    </div>

                </NavLink>

                <div className="nav-links">

                    {links.map((link) => (

                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-item active"
                                    : "nav-item"
                            }
                        >
                            {link.title}
                        </NavLink>

                    ))}

                </div>

                <div className="nav-actions">

                    <NavLink
                        to="/about"
                        className="nav-secondary"
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className="primary-button"
                    >
                        Settings
                    </NavLink>

                </div>

            </nav>

        </header>
    );
}