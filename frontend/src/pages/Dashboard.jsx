import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import WorkspaceCard from "../components/WorkspaceCard"; // ✅ added

export default function Dashboard() {
    const [calls, setCalls] = useState([]);
    const [agents, setAgents] = useState([]);

    const [user, setUser] = useState(null);           // ✅ added
    const [workspace, setWorkspace] = useState(null); // ✅ added

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchData();
        fetchUserData(); // ✅ added
    }, []);

    const fetchData = async () => {
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

    // ✅ added
    const fetchUserData = async () => {
        try {
            const res = await api.get("/me/");
            setUser(res.data.user);
            setWorkspace(res.data.workspace);
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

    const agentMap = Object.fromEntries(
        agents.map(a => [a.id, a.name])
    );

    const agentCallCount = {};
    calls.forEach(c => {
        agentCallCount[c.agent_id] =
            (agentCallCount[c.agent_id] || 0) + 1;
    });

    const topAgents = Object.entries(agentCallCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="space-y-6">

            {/* ✅ Workspace Card added */}


            <h1 className="text-2xl font-semibold text-slate-900">
                Dashboard
            </h1>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <Card title="Total Calls" value={totalCalls} />
                <Card title="Total Agents" value={totalAgents} />
                <Card title="Success Rate" value={`${successRate}%`} highlight />
                <Card title="Avg Duration" value={`${avgDuration}s`} />

            </div>

            {/* TOP AGENTS */}
            <div className="bg-white p-6 rounded-2xl border shadow-md">

                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Top Agents
                </h2>

                {topAgents.map(([id, count]) => (
                    <div
                        key={id}
                        className="flex justify-between items-center py-2 text-sm"
                    >
                        <span className="font-medium text-slate-800">
                            {agentMap[id] || "Unknown"}
                        </span>

                        <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                            {count} calls
                        </span>
                    </div>
                ))}
            </div>

            {/* RECENT CALLS */}
            <div className="bg-white p-6 rounded-2xl border shadow-md">

                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Recent Calls
                </h2>

                <table className="w-full text-sm">

                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
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
                                className="border-t hover:bg-slate-50 transition"
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
    );
}

/* Card */
function Card({ title, value, highlight }) {
    return (
        <div className="bg-white p-5 rounded-2xl border shadow-md hover:shadow-xl transition">
            <p className="text-slate-500 text-sm">{title}</p>
            <h2 className={`text-2xl font-semibold mt-1 ${highlight ? "text-indigo-600" : "text-slate-900"
                }`}>
                {value}
            </h2>
        </div>
    );
}