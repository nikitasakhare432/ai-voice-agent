import { useEffect, useRef, useState } from "react";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const ws = useRef(null);

    useEffect(() => {
        // 👉 connect to your backend
        ws.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/1");

        ws.current.onmessage = (event) => {
            const token = event.data;

            // append tokens live
            setMessages((prev) => {
                const last = prev[prev.length - 1];

                if (last && last.role === "assistant") {
                    last.text += token;
                    return [...prev];
                } else {
                    return [...prev, { role: "assistant", text: token }];
                }
            });
        };

        return () => ws.current.close();
    }, []);

    const sendMessage = () => {
        if (!input) return;

        // show user message
        setMessages((prev) => [...prev, { role: "user", text: input }]);

        ws.current.send(input);
        setInput("");
    };

    return (
        <div className="p-6">
            <h1 className="text-xl mb-4">Chat</h1>

            {/* Chat Box */}
            <div className="h-96 overflow-y-auto border p-4 mb-4">
                {messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                        <b>{msg.role}:</b> {msg.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    className="border p-2 flex-1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4"
                >
                    Send
                </button>
            </div>
        </div>
    );
}