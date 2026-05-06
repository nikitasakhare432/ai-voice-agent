import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

export default function ScheduledCalls() {
    const [calls, setCalls] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);

    const [form, setForm] = useState({
        agent_id: "",
        phone_number: "",
        scheduled_at: "",
    });

    // ---------------- FETCH AGENTS ----------------
    const fetchAgents = async () => {
        try {
            const res = await api.get("/agents/");
            setAgents(res.data);
        } catch (err) {
            console.error("Agents fetch failed:", err);
        }
    };

    // ---------------- FETCH CALLS ----------------
    const fetchCalls = async () => {
        try {
            setTableLoading(true);
            const res = await api.get("/calls/");
            setCalls(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
        fetchCalls();

        const interval = setInterval(fetchCalls, 5000);
        return () => clearInterval(interval);
    }, []);

    // ---------------- AGENT MAP (OPTIMIZED) ----------------
    const agentMap = useMemo(() => {
        return Object.fromEntries(
            agents.map(a => [a.id, a.name])
        );
    }, [agents]);

    // ---------------- SCHEDULE CALL ----------------
    const scheduleCall = async () => {
        if (!form.agent_id || !form.phone_number || !form.scheduled_at) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            await api.post("/calls/schedule", {
                agent_id: Number(form.agent_id),
                phone_number: form.phone_number,
                scheduled_at: form.scheduled_at,
            });

            setForm({
                agent_id: "",
                phone_number: "",
                scheduled_at: "",
            });

            fetchCalls();
        } catch (err) {
            console.error("Schedule failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- CANCEL CALL ----------------
    const cancelCall = async (id) => {
        try {
            await api.delete(`/calls/scheduled/${id}`);
            fetchCalls();
        } catch (err) {
            console.error("Cancel failed:", err);
        }
    };

    // ---------------- TIME LEFT ----------------
    const timeLeft = (scheduledAt) => {
        const diff = new Date(scheduledAt) - new Date();

        if (diff <= 0) return "Starting...";

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ${minutes % 60}m left`;
        return `${minutes}m left`;
    };

    // ---------------- FORMAT DATE ----------------
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <h1 className="text-2xl font-semibold text-slate-800">
                Scheduled Calls
            </h1>

            {/* FORM */}
            <div className="bg-white p-6 rounded-2xl border shadow-md space-y-4">

                <h2 className="text-lg font-semibold">
                    Schedule New Call
                </h2>

                <select
                    className="w-full p-3 border rounded-xl"
                    value={form.agent_id}
                    onChange={(e) =>
                        setForm({ ...form, agent_id: e.target.value })
                    }
                >
                    <option value="">Select Agent</option>
                    {agents.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>

                <input
                    className="w-full p-3 border rounded-xl"
                    placeholder="Phone Number"
                    value={form.phone_number}
                    onChange={(e) =>
                        setForm({ ...form, phone_number: e.target.value })
                    }
                />

                <input
                    type="datetime-local"
                    className="w-full p-3 border rounded-xl"
                    value={form.scheduled_at}
                    onChange={(e) =>
                        setForm({ ...form, scheduled_at: e.target.value })
                    }
                />

                <button
                    onClick={scheduleCall}
                    disabled={loading}
                    className={`px-6 py-2 rounded-xl text-white transition ${loading
                        ? "bg-gray-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {loading ? "Scheduling..." : "Schedule Call"}
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-2xl border shadow-md">

                <h2 className="text-lg font-semibold mb-4">
                    Upcoming Calls
                </h2>

                {tableLoading ? (
                    <p className="text-slate-500 text-sm">Loading calls...</p>
                ) : calls.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                        No calls scheduled yet
                    </p>
                ) : (
                    <table className="w-full text-sm">

                        {/* HEADER */}
                        <thead className="text-left text-slate-500 border-b">
                            <tr>
                                <th className="p-3">Agent</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Scheduled Time</th>
                                <th className="p-3">Time Left</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {calls.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-slate-50">

                                    {/* AGENT */}
                                    <td className="p-3 font-medium">
                                        {agentMap[c.agent_id] || "Unknown"}
                                    </td>

                                    {/* PHONE */}
                                    <td className="p-3">
                                        {c.phone_number}
                                    </td>

                                    {/* SCHEDULED TIME */}
                                    <td className="p-3 text-slate-700">
                                        {formatDate(c.scheduled_at)}
                                    </td>

                                    {/* TIME LEFT */}
                                    <td className="p-3 text-blue-600">
                                        {c.status === "scheduled"
                                            ? timeLeft(c.scheduled_at)
                                            : c.status === "completed"
                                                ? "Done"
                                                : "Processing"
                                        }
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-3">
                                        <span
                                            className={`text-xs px-3 py-1 rounded-full ${c.status === "completed"
                                                ? "bg-green-100 text-green-600"
                                                : c.status === "scheduled"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-blue-100 text-blue-600"
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                    </td>

                                    {/* ACTION */}
                                    <td className="p-3">
                                        <button
                                            onClick={() => cancelCall(c.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>
        </div>
    );
}