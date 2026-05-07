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

    // ---------------- FETCH ----------------
    const fetchAgents = async () => {
        try {
            const res = await api.get("/agents/");
            setAgents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

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

        const interval = setInterval(fetchCalls, 3000);
        return () => clearInterval(interval);
    }, []);

    // ---------------- MAP ----------------
    const agentMap = useMemo(() => {
        return Object.fromEntries(agents.map(a => [a.id, a.name]));
    }, [agents]);

    // ---------------- SCHEDULE ----------------
    const scheduleCall = async () => {
        if (!form.agent_id || !form.phone_number || !form.scheduled_at) {
            alert("Fill all fields");
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- TIME LEFT ----------------
    const timeLeft = (scheduledAt) => {
        const diff = new Date(scheduledAt) - new Date();

        if (diff <= 0) return "Starting...";

        const totalMinutes = Math.floor(diff / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    // ---------------- FORMAT ----------------
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-GB");
    };

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                Scheduled Calls
            </h1>

            {/* FORM */}
            <div className="bg-white p-6 rounded-xl border space-y-4">

                <select
                    className="w-full p-3 border rounded-lg"
                    value={form.agent_id}
                    onChange={(e) =>
                        setForm({ ...form, agent_id: e.target.value })
                    }
                >
                    <option value="">Select Agent</option>
                    {agents.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>

                <input
                    className="w-full p-3 border rounded-lg"
                    placeholder="Phone Number"
                    value={form.phone_number}
                    onChange={(e) =>
                        setForm({ ...form, phone_number: e.target.value })
                    }
                />

                <input
                    type="datetime-local"
                    className="w-full p-3 border rounded-lg"
                    value={form.scheduled_at}
                    onChange={(e) =>
                        setForm({ ...form, scheduled_at: e.target.value })
                    }
                />

                <button
                    onClick={scheduleCall}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                    {loading ? "Scheduling..." : "Schedule Call"}
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white p-4 border rounded-xl">

                <h2 className="font-semibold mb-3">
                    Upcoming Calls
                </h2>

                {tableLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full text-sm">

                        <thead className="text-left border-b">
                            <tr>
                                <th className="p-2">Agent</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2">Time</th>
                                <th className="p-2">Left</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {calls.map(c => (
                                <tr key={c.id} className="border-t">

                                    <td className="p-2">
                                        {agentMap[c.agent_id] || "Unknown"}
                                    </td>

                                    <td className="p-2">
                                        {c.phone_number}
                                    </td>

                                    <td className="p-2">
                                        {formatDate(c.scheduled_at)}
                                    </td>

                                    <td className="p-2 text-blue-600">
                                        {c.status === "scheduled"
                                            ? timeLeft(c.scheduled_at)
                                            : c.status === "processing"
                                                ? "Running AI..."
                                                : "Done"
                                        }
                                    </td>

                                    <td className="p-2">
                                        <span className={
                                            c.status === "completed"
                                                ? "text-green-600"
                                                : c.status === "processing"
                                                    ? "text-blue-600"
                                                    : "text-yellow-600"
                                        }>
                                            {c.status}
                                        </span>
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