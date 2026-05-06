import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell,
    LineChart, Line, CartesianGrid, Legend,
    ResponsiveContainer
} from "recharts";

// 🎨 Color palette
const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

export default function Analytics() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get("/analytics/");
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) {
        return (
            <div className="p-6">
                Loading analytics...
            </div>
        );
    }

    if (!data.calls_per_day.length) {
        return (
            <div className="p-6">
                No analytics data yet
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-semibold text-slate-800">
                Analytics Dashboard
            </h1>

            {/* Calls per Day */}
            <Card title="Calls per Day (Last 7 Days)">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.calls_per_day}>
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "none",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />
                        <Bar dataKey="calls" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Sentiment */}
            <Card title="Sentiment Breakdown">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data.sentiment}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={110}
                            innerRadius={60}
                            paddingAngle={4}
                            label
                        >
                            {data.sentiment.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "none",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />

                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            {/* Success Rate */}
            <Card title="Success Rate Over Time">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.success_rate}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "none",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Top Agents */}
            <Card title="Top Agents by Call Volume">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.top_agents}>
                        <XAxis dataKey="agent" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "none",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />
                        <Bar dataKey="calls" fill="#f97316" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

        </div>
    );
}

/* Card */
function Card({ title, children }) {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}