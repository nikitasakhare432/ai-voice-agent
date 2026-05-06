import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Chat() {
    const { agentId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [agent, setAgent] = useState(null);

    const ws = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const WS_URL = import.meta.env.VITE_WS_URL;

        ws.current = new WebSocket(
            `${WS_URL}/ws/chat/${agentId}`
        );

        ws.current.onmessage = (event) => {
            const token = event.data;

            if (token === "[END]") {
                setIsThinking(false);
                return;
            }

            setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];

                if (last && last.role === "assistant") {
                    last.text += token;
                } else {
                    updated.push({
                        role: "assistant",
                        text: token,
                    });
                }

                return [...updated];
            });
        };

        return () => ws.current?.close();
    }, [agentId]);
    // 🔥 IMPORTANT (you missed this import)

    useEffect(() => {
        const loadAgent = async () => {
            try {
                const res = await api.get(`/agents/${agentId}`);
                setAgent(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadAgent();
    }, [agentId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", text: input },
        ]);

        setIsThinking(true);
        ws.current?.send(input);
        setInput("");
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">

            {/* HEADER */}
            {/* HEADER */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">

                <div>
                    <h1 className="text-lg font-semibold text-slate-800">
                        AI Voice Agent Chat
                    </h1>

                    <p className="text-xs text-slate-500">
                        Agent: {agent ? agent.name : "Loading..."}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/agents")}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    ← Back to Agents
                </button>

            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                {messages.length === 0 && (
                    <div className="text-center text-slate-400 mt-10">
                        Start chatting with your AI agent
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-end gap-2 ${msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        {/* AI Avatar */}
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                                AI
                            </div>
                        )}

                        <div
                            className={`max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${msg.role === "user"
                                ? "bg-indigo-600 text-white rounded-br-sm"
                                : "bg-white border text-slate-700 rounded-bl-sm"
                                }`}
                        >
                            {msg.text}
                        </div>

                        {/* User Avatar */}
                        {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">
                                U
                            </div>
                        )}
                    </div>
                ))}

                {/* AI typing indicator */}
                {isThinking && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
                        AI is responding...
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* INPUT */}
            <div className="bg-white border-t px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">

                    <input
                        className="flex-1 bg-slate-100 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
                    >
                        Send
                    </button>

                </div>
            </div>

        </div>
    );
}