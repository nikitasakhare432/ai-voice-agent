import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WorkspaceCard from "../components/WorkspaceCard";
import api from "../api/client"; // ✅ FIXED IMPORT

export default function Chat() {
    const { agentId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const [user, setUser] = useState(null);
    const [workspace, setWorkspace] = useState(null);

    const ws = useRef(null);
    const chatEndRef = useRef(null);

    // 🔹 Fetch user + workspace
    const fetchUserData = async () => {
        try {
            const res = await api.get("/me/");
            setUser(res.data.user);
            setWorkspace(res.data.workspace);
        } catch (err) {
            console.error(err);
        }
    };

    // 🔹 Setup WebSocket + Auth Check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        fetchUserData();

        if (!agentId) return;

        ws.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat/${agentId}`
        );

        ws.current.onmessage = (event) => {
            const token = event.data;

            setMessages((prev) => {
                const newMessages = [...prev];

                if (
                    newMessages.length > 0 &&
                    newMessages[newMessages.length - 1].role === "assistant"
                ) {
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        text:
                            newMessages[newMessages.length - 1].text + token,
                    };
                } else {
                    newMessages.push({
                        role: "assistant",
                        text: token,
                    });
                }

                return newMessages;
            });
        };

        return () => ws.current?.close();
    }, [agentId]);

    // 🔹 Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 🔹 Send message
    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", text: input },
        ]);

        ws.current?.send(input);
        setInput("");
    };

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">

            {/* Sidebar */}
            <div className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col p-6 shadow-lg">

                <WorkspaceCard workspace={workspace} user={user} />

                <h2 className="text-xl font-semibold text-white mb-8">
                    AI Platform
                </h2>

                <nav className="flex flex-col gap-2">
                    <SidebarItem label="Dashboard" onClick={() => navigate("/dashboard")} />
                    <SidebarItem label="Agents" onClick={() => navigate("/agents")} />
                    <SidebarItem label="Call Logs" onClick={() => navigate("/calls")} />
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

            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-full">

                {/* Header */}
                <div className="bg-white border-b p-4 flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-slate-800">
                        Chat with Agent {agentId}
                    </h1>

                    <button
                        onClick={() => navigate("/agents")}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        ← Back
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-md px-4 py-2 rounded-xl text-sm shadow ${msg.role === "user"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white border text-slate-700"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="bg-white border-t px-6 py-4">
                    <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-2 shadow-sm">

                        <input
                            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Send
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}

// 🔹 Sidebar Item
function SidebarItem({ label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="px-4 py-2 rounded-md cursor-pointer text-sm font-medium hover:bg-slate-800 hover:text-white transition"
        >
            {label}
        </div>
    );
}