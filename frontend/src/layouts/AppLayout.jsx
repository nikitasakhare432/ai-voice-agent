import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import api from "../api/client";
import WorkspaceCard from "../components/WorkspaceCard";

export default function AppLayout() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    // MOBILE SIDEBAR
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchMe();
    }, []);

    const fetchMe = async () => {
        try {
            const res = await api.get("/me/");

            setUser(res.data.user);
            setWorkspace(res.data.workspace);

        } catch (err) {
            console.error("Failed to load user:", err);

            localStorage.removeItem("token");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">

            {/* MOBILE TOPBAR */}
            <div className="
                md:hidden
                fixed
                top-0
                left-0
                right-0
                z-40
                bg-white
                border-b
                px-4
                py-3
                flex
                items-center
                justify-between
            ">

                <h1 className="font-semibold text-slate-900">
                    AI Platform
                </h1>

                {/* HAMBURGER */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-slate-700 text-2xl"
                >
                    ☰
                </button>

            </div>

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`
                    fixed
                    top-0
                    left-0
                    z-50
                    h-screen
                    w-72
                    md:w-64
                    bg-slate-900
                    text-slate-300
                    flex
                    flex-col
                    p-6
                    transition-transform
                    duration-300

                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

                    md:translate-x-0
                `}
            >

                {/* MOBILE CLOSE BUTTON */}
                <div className="flex items-center justify-between md:hidden mb-4">

                    <h2 className="text-lg font-semibold text-white">
                        Menu
                    </h2>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white text-2xl"
                    >
                        ✕
                    </button>

                </div>

                {/* WORKSPACE */}
                <WorkspaceCard
                    workspace={workspace}
                    user={user}
                />

                {/* TITLE */}
                <h2 className="text-xl font-semibold text-white mt-6 mb-8">
                    AI Platform
                </h2>

                {/* NAVIGATION */}
                <nav className="flex flex-col gap-2">

                    <SidebarItem
                        label="Dashboard"
                        onClick={() => {
                            navigate("/dashboard");
                            setSidebarOpen(false);
                        }}
                    />

                    <SidebarItem
                        label="Agents"
                        onClick={() => {
                            navigate("/agents");
                            setSidebarOpen(false);
                        }}
                    />

                    <SidebarItem
                        label="Scheduled Calls"
                        onClick={() => {
                            navigate("/scheduled-calls");
                            setSidebarOpen(false);
                        }}
                    />

                    <SidebarItem
                        label="Call Logs"
                        onClick={() => {
                            navigate("/calls");
                            setSidebarOpen(false);
                        }}
                    />

                    <SidebarItem
                        label="Analytics"
                        onClick={() => {
                            navigate("/analytics");
                            setSidebarOpen(false);
                        }}
                    />

                </nav>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="
                        mt-auto
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        p-2
                        rounded-md
                        transition
                    "
                >
                    Logout
                </button>

            </div>

            {/* MAIN CONTENT */}
            <div
                className="
                    flex-1
                    md:ml-64
                    h-screen
                    overflow-y-auto
                    p-4
                    sm:p-6
                    pt-20
                    md:pt-6
                "
            >

                <Outlet />

            </div>

        </div>
    );
}

/* SIDEBAR ITEM */
function SidebarItem({ label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="
                px-4
                py-3
                rounded-md
                cursor-pointer
                text-sm
                font-medium
                transition
                hover:bg-slate-800
                hover:text-white
            "
        >
            {label}
        </div>
    );
}