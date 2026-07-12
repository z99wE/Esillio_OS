import { NavLink } from "react-router-dom";

const items = [

    ["Health", "/health"],

    ["Upload", "/upload"],

    ["Timeline", "/timeline"],

    ["Guardian", "/guardian"],

    ["Settings", "/settings"]

];

export default function Sidebar() {

    return (

        <aside className="sidebar glass">

            <div className="sidebar-logo">

                ESILLIO

            </div>

            <nav>

                {

                    items.map(

                        ([label, path]) => (

                            <NavLink

                                key={path}

                                to={path}

                                className={({ isActive }) =>

                                    isActive

                                        ? "sidebar-link active"

                                        : "sidebar-link"

                                }

                            >

                                {label}

                            </NavLink>

                        )

                    )

                }

            </nav>

        </aside>

    );

}