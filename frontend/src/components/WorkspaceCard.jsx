const WorkspaceCard = ({ workspace, user }) => {
    return (
        <div className="
            mb-6
            p-4 sm:p-5
            bg-slate-800/80
            backdrop-blur-md
            rounded-2xl
            border border-slate-700
            shadow-md
            w-full
            overflow-hidden
        ">

            {/* Workspace */}
            <p className="
                text-[10px] sm:text-xs
                uppercase
                tracking-wider
                text-slate-400
                mb-1
            ">
                Workspace
            </p>

            <h2 className="
                text-white
                font-semibold
                text-sm sm:text-base
                truncate
            ">
                {workspace?.name || "Loading..."}
            </h2>

            {/* Divider */}
            <div className="my-3 border-t border-slate-700"></div>

            {/* User Info */}
            <div className="flex items-center gap-3 min-w-0">

                {/* Avatar */}
                <div className="
                    w-10 h-10 sm:w-11 sm:h-11
                    rounded-full
                    bg-gradient-to-br
                    from-indigo-500
                    to-purple-600
                    flex items-center justify-center
                    text-white
                    text-sm sm:text-base
                    font-semibold
                    shadow
                    shrink-0
                ">
                    {user?.display_name?.[0]?.toUpperCase() || "U"}
                </div>

                {/* Text */}
                <div className="flex flex-col overflow-hidden min-w-0">

                    <span className="
                        text-sm sm:text-base
                        text-white
                        font-medium
                        truncate
                    ">
                        {user?.display_name || "User"}
                    </span>

                    <span className="
                        text-xs sm:text-sm
                        text-slate-400
                        truncate
                    ">
                        {user?.email || "email"}
                    </span>

                </div>

            </div>
        </div>
    );
};

export default WorkspaceCard;