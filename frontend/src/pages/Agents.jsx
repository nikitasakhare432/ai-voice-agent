import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Agents() {
    const [agents, setAgents] = useState([]);

    const [name, setName] = useState("");
    const [prompt, setPrompt] = useState("");
    const [voice, setVoice] = useState("");
    const [language, setLanguage] = useState("");

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrompt, setEditPrompt] = useState("");
    const [editVoice, setEditVoice] = useState("");
    const [editLanguage, setEditLanguage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const res = await api.get("/agents/");
            setAgents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const createAgent = async () => {
        try {
            await api.post("/agents/", {
                name,
                system_prompt: prompt,
                voice,
                language,
            });

            setName("");
            setPrompt("");
            setVoice("");
            setLanguage("");

            fetchAgents();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteAgent = async (id) => {
        try {
            await api.delete(`/agents/${id}`);
            fetchAgents();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (agent) => {
        setEditId(agent.id);
        setEditName(agent.name);
        setEditPrompt(agent.system_prompt);
        setEditVoice(agent.voice);
        setEditLanguage(agent.language);
        setIsEditOpen(true);
    };

    const updateAgent = async () => {
        try {
            await api.put(`/agents/${editId}`, {
                name: editName,
                system_prompt: editPrompt,
                voice: editVoice,
                language: editLanguage,
            });

            setIsEditOpen(false);
            fetchAgents();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-semibold text-slate-800">
                Agents
            </h1>

            {/* CREATE */}
            <div className="bg-white p-6 rounded-2xl border shadow-md">

                <h2 className="text-xl font-semibold mb-4">
                    Create New Agent
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        className="p-3 border rounded-xl"
                        placeholder="Agent Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="p-3 border rounded-xl"
                        placeholder="Voice"
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                    />

                    <input
                        className="p-3 border rounded-xl"
                        placeholder="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />

                    <textarea
                        className="p-3 border rounded-xl md:col-span-2"
                        placeholder="System Prompt"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                </div>

                <button
                    onClick={createAgent}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl"
                >
                    Create Agent
                </button>

            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {agents.map((agent) => (
                    <div
                        key={agent.id}
                        className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border"
                    >

                        <h2 className="text-lg font-semibold">
                            {agent.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {agent.language} • {agent.voice}
                        </p>

                        <div className="flex justify-between mt-4">

                            <button
                                onClick={() => navigate(`/chat/${agent.id}`)}
                                className="text-indigo-600 text-sm hover:underline"
                            >
                                Test Chat
                            </button>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => openEditModal(agent)}
                                    className="text-green-600 text-sm hover:underline"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteAgent(agent.id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                ))}

            </div>

            {/* EDIT MODAL */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                    <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">

                        <h2 className="text-xl font-semibold mb-4">
                            Edit Agent
                        </h2>

                        <input
                            className="w-full p-3 border rounded-lg mb-3"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <input
                            className="w-full p-3 border rounded-lg mb-3"
                            value={editVoice}
                            onChange={(e) => setEditVoice(e.target.value)}
                        />

                        <input
                            className="w-full p-3 border rounded-lg mb-3"
                            value={editLanguage}
                            onChange={(e) => setEditLanguage(e.target.value)}
                        />

                        <textarea
                            className="w-full p-3 border rounded-lg mb-4"
                            rows={4}
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateAgent}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                            >
                                Update
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}