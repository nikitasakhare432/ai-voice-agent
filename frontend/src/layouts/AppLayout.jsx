import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import api from "../api/client";
import WorkspaceCard from "../components/WorkspaceCard";

export default function AppLayout() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

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

            {/* SIDEBAR (fixed, never reloads) */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col p-6 fixed h-screen">

                {/* Workspace (ONLY ONCE HERE) */}
                <WorkspaceCard workspace={workspace} user={user} />

                <h2 className="text-xl font-semibold text-white mt-6 mb-8">
                    AI Platform
                </h2>

                <nav className="flex flex-col gap-2">

                    <SidebarItem label="Dashboard" onClick={() => navigate("/dashboard")} />
                    <SidebarItem label="Agents" onClick={() => navigate("/agents")} />
                    <SidebarItem label="Call Logs" onClick={() => navigate("/calls")} />
                    <SidebarItem label="Analytics" onClick={() => navigate("/analytics")} />

                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                >
                    Logout
                </button>
            </div>

            {/* MAIN CONTENT (scroll only here) */}
            <div className="flex-1 ml-64 h-screen overflow-y-auto p-6">

                <Outlet />

            </div>
        </div>
    );
}

/* Sidebar Item */
function SidebarItem({ label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition hover:bg-slate-800 hover:text-white"
        >
            {label}
        </div>
    );
}