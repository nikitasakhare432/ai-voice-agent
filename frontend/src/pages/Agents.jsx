import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import WorkspaceCard from "../components/WorkspaceCard";

export default function Agents() {
    const [agents, setAgents] = useState([]);

    const [name, setName] = useState("");
    const [prompt, setPrompt] = useState("");
    const [voice, setVoice] = useState("");
    const [language, setLanguage] = useState("");
    const [user, setUser] = useState(null);
    const [workspace, setWorkspace] = useState(null);

    // EDIT STATES
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
        fetchUserData(); // 👈 add this
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await api.get("/me/");
            setUser(res.data.user);
            setWorkspace(res.data.workspace);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAgents = async () => {
        try {
            const res = await api.get("/agents/");
            setAgents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // CREATE
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

    // DELETE
    const deleteAgent = async (id) => {
        try {
            await api.delete(`/agents/${id}`);
            fetchAgents();
        } catch (err) {
            console.error(err);
        }
    };

    // OPEN EDIT MODAL
    const openEditModal = (agent) => {
        setEditId(agent.id);
        setEditName(agent.name);
        setEditPrompt(agent.system_prompt);
        setEditVoice(agent.voice);
        setEditLanguage(agent.language);
        setIsEditOpen(true);
    };

    // UPDATE AGENT
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
        <div className="flex min-h-screen bg-slate-100 text-slate-800">

            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col p-6 shadow-lg sticky top-0 h-screen">
                <WorkspaceCard workspace={workspace} user={user} />

                <h2 className="text-xl font-semibold text-white mb-8">
                    AI Platform
                </h2>

                <nav className="flex flex-col gap-2">
                    <SidebarItem label="Dashboard" onClick={() => navigate("/dashboard")} />
                    <SidebarItem active label="Agents" />
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

            {/* MAIN */}
            <div className="flex-1 p-8">

                <h1 className="text-2xl font-semibold mb-6">
                    Agents
                </h1>

                {/* CREATE */}
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border shadow-lg mb-8">

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
                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl"
                    >
                        Create Agent
                    </button>
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
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
                                    className="text-indigo-600 text-sm"
                                >
                                    Test Chat
                                </button>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() => openEditModal(agent)}
                                        className="text-green-600 text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteAgent(agent.id)}
                                        className="text-red-500 text-sm"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white w-full max-w-lg p-6 rounded-2xl">

                        <h2 className="text-xl font-semibold mb-4">
                            Edit Agent
                        </h2>

                        <input
                            className="w-full p-3 border rounded-lg mb-3"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                        />

                        <input
                            className="w-full p-3 border rounded-lg mb-3"
                            value={editVoice}
                            onChange={(e) => setEditVoice(e.target.value)}
                            placeholder="Voice"
                        />

                        <input
                            className="w-full p-3 border rounded-lg mb-3"
                            value={editLanguage}
                            onChange={(e) => setEditLanguage(e.target.value)}
                            placeholder="Language"
                        />

                        <textarea
                            className="w-full p-3 border rounded-lg mb-4"
                            rows={4}
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="System Prompt"
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

/* Sidebar */
function SidebarItem({ label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-2 rounded-md cursor-pointer text-sm ${active ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
                }`}
        >
            {label}
        </div>
    );
}