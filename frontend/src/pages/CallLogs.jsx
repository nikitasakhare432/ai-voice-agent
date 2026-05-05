import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function CallLogs() {
    const [calls, setCalls] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [sentimentFilter, setSentimentFilter] = useState("");
    const [agents, setAgents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const [callsRes, agentsRes] = await Promise.all([
                api.get("/calls/"),
                api.get("/agents/")
            ]);

            setCalls(callsRes.data);
            setAgents(agentsRes.data);

        } catch (err) {
            console.error(err);
        }
    };

    const agentMap = Object.fromEntries(
        agents.map(a => [a.id, a.name])
    );

    const filteredCalls = calls.filter((c) => {
        return (
            (statusFilter ? c.status === statusFilter : true) &&
            (sentimentFilter ? c.sentiment === sentimentFilter : true)
        );
    });

    const statusColor = (status) => {
        if (status === "completed") return "bg-green-100 text-green-600";
        if (status === "failed") return "bg-red-100 text-red-600";
        if (status === "initiated") return "bg-yellow-100 text-yellow-700";
        if (status === "scheduled") return "bg-blue-100 text-blue-600";
        return "bg-slate-100 text-slate-500";
    };

    const sentimentColor = (sentiment) => {
        if (sentiment === "positive") return "text-green-600";
        if (sentiment === "negative") return "text-red-600";
        if (sentiment === "neutral") return "text-slate-500";
        return "text-slate-400";
    };

    const getDuration = (call) => {
        if (!call.started_at || !call.ended_at) return "-";
        const seconds = Math.floor(
            (new Date(call.ended_at) - new Date(call.started_at)) / 1000
        );
        return `${seconds}s`;
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    };

    return (
        <div className="flex min-h-screen bg-slate-100">

            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col p-6">
                <h2 className="text-xl font-semibold text-white mb-8">
                    AI Platform
                </h2>

                <nav className="flex flex-col gap-2">
                    <SidebarItem label="Dashboard" onClick={() => navigate("/dashboard")} />
                    <SidebarItem label="Agents" onClick={() => navigate("/agents")} />
                    <SidebarItem active label="Call Logs" />
                    <SidebarItem label="Analytics" onClick={() => navigate("/analytics")} />
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                >
                    Logout
                </button>
            </div>

            {/* Main */}
            <div className="flex-1 p-6">

                <h1 className="text-2xl font-semibold text-slate-800 mb-6">
                    Call Logs
                </h1>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">

                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="initiated">Initiated</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="failed">Failed</option>
                    </select>

                    <select
                        onChange={(e) => setSentimentFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Sentiment</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                    </select>

                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Agent</th>
                                <th className="p-3 text-left">Direction</th>
                                <th className="p-3 text-left">Duration</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Sentiment</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCalls.map((call) => (
                                <>
                                    {/* Row */}
                                    <tr
                                        key={call.id}
                                        onClick={() =>
                                            setExpandedId(
                                                expandedId === call.id ? null : call.id
                                            )
                                        }
                                        className="border-t hover:bg-slate-50 cursor-pointer transition"
                                    >
                                        <td className="p-3">
                                            {formatDate(call.started_at || call.scheduled_at)}
                                        </td>

                                        <td className="p-3 font-medium text-slate-700">
                                            {agentMap[call.agent_id] || "Unknown Agent"}
                                        </td>

                                        <td className="p-3 capitalize">
                                            {call.direction}
                                        </td>

                                        <td className="p-3">
                                            {getDuration(call)}
                                        </td>

                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(call.status)}`}>
                                                {call.status}
                                            </span>
                                        </td>

                                        <td className={`p-3 font-medium ${sentimentColor(call.sentiment)}`}>
                                            {call.sentiment || "-"}
                                        </td>
                                    </tr>

                                    {/* Expanded */}
                                    {expandedId === call.id && (
                                        <tr>
                                            <td colSpan="6" className="bg-slate-50 p-5">
                                                <div className="grid md:grid-cols-2 gap-4">

                                                    <div className="bg-white border rounded-lg p-4">
                                                        <p className="font-semibold text-slate-800 mb-2">
                                                            Transcript
                                                        </p>
                                                        <div className="text-sm text-slate-600 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                                            {call.transcript || "No transcript available"}
                                                        </div>
                                                    </div>

                                                    <div className="bg-white border rounded-lg p-4">
                                                        <p className="font-semibold text-slate-800 mb-2">
                                                            Summary
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {call.summary || "No summary available"}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Sidebar Item
function SidebarItem({ label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition ${active
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 hover:text-white"
                }`}
        >
            {label}
        </div>
    );
}