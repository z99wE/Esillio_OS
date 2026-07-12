import { NavLink } from "react-router-dom";
const links = [
    {
        title: "Timeline",
        path: "/timeline",
    },
    {
        title: "Upload",
        path: "/upload",
    },
    {
        title: "Intelligence",
        path: "/health",
    },
    {
        title: "EsiWell",
        path: "/esiwell",
    },
    {
        title: "Connect",
        path: "/connect",
    },
    {
        title: "Settings",
        path: "/settings",
    },
    {
        title: "Pro",
        path: "/subscription",
    },
];

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 py-4 sm:py-6 transform-gpu transition-transform duration-500">
            <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-center items-center">
                <div className="relative top-0 left-0 w-full md:w-auto glass-panel rounded-full p-6 md:py-3 md:px-6 flex flex-col md:flex-row items-center gap-4 shadow-xl">
                    <NavLink to="/" className="flex items-center gap-2">
                        <span className="font-primary text-xl tracking-wide text-text-primary">Esillio</span>
                    </NavLink>
                    
                    <ul className="flex flex-col md:flex-row items-center gap-0.5 mt-6 md:mt-0 md:ml-2">
                        {links.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3.5 py-2 text-sm font-medium transition-colors ${
                                            isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                                        }`
                                    }
                                >
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    
                    <NavLink
                        to="/upload"
                        className="mt-4 md:mt-0 md:ml-2 bg-brand-primary text-text-primary font-medium text-sm px-6 py-3 rounded-sm hover:bg-red-700 transition-colors w-full md:w-auto text-center"
                    >
                        Start Memory
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}