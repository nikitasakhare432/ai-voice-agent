import { useState } from "react";
import api from "../api/client";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [workspace, setWorkspace] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/register", {
                email,
                password,
                workspace_name: workspace,
            });

            localStorage.setItem("token", res.data.access_token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Create your account
                </h2>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {/* Workspace */}
                <input
                    placeholder="Workspace name"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Button */}
                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className={`w-full p-3 rounded-md text-white font-medium transition ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>

                {/* Footer */}
                <p className="text-sm text-gray-500 text-center mt-4">
                    Already have an account?{" "}
                    <span
                        className="text-indigo-600 cursor-pointer hover:underline"
                        onClick={() => (window.location.href = "/")}
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}