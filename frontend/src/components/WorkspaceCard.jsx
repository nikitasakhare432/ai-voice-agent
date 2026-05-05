const WorkspaceCard = ({ workspace, user }) => {
    return (
        <div className="mb-8 p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-md">

            {/* Workspace */}
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                Workspace
            </p>

            <h2 className="text-white font-semibold text-sm truncate">
                {workspace?.name || "Loading..."}
            </h2>

            {/* Divider */}
            <div className="my-3 border-t border-slate-700"></div>

            {/* User Info */}
            <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow">
                    {user?.display_name?.[0]?.toUpperCase() || "U"}
                </div>

                {/* Text */}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-white font-medium truncate">
                        {user?.display_name || "User"}
                    </span>

                    <span className="text-xs text-slate-400 truncate">
                        {user?.email || "email"}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default WorkspaceCard;