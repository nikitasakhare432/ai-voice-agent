import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Dashboard() {
    const [calls, setCalls] = useState([]);
    const [agents, setAgents] = useState([]);
    const [user, setUser] = useState(null);
    const [workspace, setWorkspace] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [callsRes, agentsRes, meRes] = await Promise.all([
                api.get("/calls/"),
                api.get("/agents/"),
                api.get("/me/")
            ]);

            setCalls(callsRes.data);
            setAgents(agentsRes.data);

            // ✅ NEW
            setUser(meRes.data.user);
            setWorkspace(meRes.data.workspace);

        } catch (err) {
            console.error(err);
        }
    };

    // 📊 Stats
    const totalCalls = calls.length;
    const totalAgents = agents.length;

    const completedCalls = calls.filter(c => c.status === "completed").length;

    const successRate = totalCalls
        ? ((completedCalls / totalCalls) * 100).toFixed(1)
        : 0;

    const avgDuration = totalCalls
        ? (
            calls.reduce((sum, c) => sum + (c.duration || 0), 0) /
            totalCalls
        ).toFixed(1)
        : 0;

    // 🧠 Agent Map
    const agentMap = Object.fromEntries(
        agents.map(a => [a.id, a.name])
    );

    // 🔝 Top Agents
    const agentCallCount = {};
    calls.forEach(c => {
        agentCallCount[c.agent_id] =
            (agentCallCount[c.agent_id] || 0) + 1;
    });

    const topAgents = Object.entries(agentCallCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-800">

            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col p-6 shadow-lg">

                <div className="mb-8 p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-md">

                    {/* Workspace */}
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                        Workspace
                    </p>

                    <h2 className="text-white font-semibold text-sm truncate">
                        {workspace?.name || "Loading..."}
                    </h2>

                    {/* Divider */}
                    <div className="my-3 border-t border-slate-700"></div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow">
                            {user?.display_name?.[0]?.toUpperCase() || "U"}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm text-white font-medium truncate">
                                {user?.display_name || "User"}
                            </span>

                            <span className="text-xs text-slate-400 truncate">
                                {user?.email || "email"}
                            </span>
                        </div>

                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <SidebarItem active label="Dashboard" />
                    <SidebarItem label="Agents" onClick={() => navigate("/agents")} />
                    <SidebarItem label="Call Logs" onClick={() => navigate("/calls")} />
                    <SidebarItem label="Analytics" onClick={() => navigate("/analytics")} />
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">

                <h1 className="text-2xl font-semibold mb-6 text-slate-900">
                    Dashboard
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card title="Total Calls" value={totalCalls} />
                    <Card title="Total Agents" value={totalAgents} />
                    <Card title="Success Rate" value={`${successRate}%`} highlight />
                    <Card title="Avg Duration" value={`${avgDuration}s`} />
                </div>

                {/* Top Agents */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        Top Agents
                    </h2>

                    {topAgents.map(([id, count]) => (
                        <div
                            key={id}
                            className="flex justify-between items-center py-1 text-sm text-slate-600"
                        >
                            <span className="font-medium text-slate-800">
                                {agentMap[id] || "Unknown"}
                            </span>

                            <span className="bg-slate-100 px-2 py-0.5 rounded">
                                {count} calls
                            </span>
                        </div>
                    ))}
                </div>

                {/* Recent Calls */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Recent Calls
                    </h2>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Agent</th>
                                <th className="p-3 text-left">Direction</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Sentiment</th>
                            </tr>
                        </thead>

                        <tbody>
                            {calls.slice(0, 5).map(call => (
                                <tr
                                    key={call.id}
                                    className="border-t hover:bg-slate-50 transition-all duration-150"
                                >
                                    <td className="p-3">{call.id}</td>

                                    <td className="p-3">
                                        {agentMap[call.agent_id] || "Unknown"}
                                    </td>

                                    <td className="p-3 capitalize">
                                        {call.direction}
                                    </td>

                                    <td className="p-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${call.status === "completed"
                                            ? "bg-green-100 text-green-600"
                                            : call.status === "scheduled"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-red-100 text-red-600"
                                            }`}>
                                            {call.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <span className={`text-xs font-medium ${call.sentiment === "positive"
                                            ? "text-green-600"
                                            : call.sentiment === "negative"
                                                ? "text-red-600"
                                                : "text-slate-500"
                                            }`}>
                                            {call.sentiment || "-"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

// 🔹 Sidebar Item
function SidebarItem({ label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 ${active
                ? "bg-indigo-600 text-white shadow"
                : "hover:bg-slate-800 hover:text-white"
                }`}
        >
            {label}
        </div>
    );
}

// 🔹 Card Component
function Card({ title, value, highlight }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-slate-500 text-sm">{title}</p>

            <h2 className={`text-2xl font-semibold mt-1 ${highlight ? "text-indigo-600" : "text-slate-900"
                }`}>
                {value}
            </h2>
        </div>
    );
}