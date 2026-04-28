import { useSession } from '../../context/SessionContext';

export default function TopBar() {
  const session = useSession();
  const initials = session.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between h-16 px-8 overflow-hidden">
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 transition-all"
            placeholder="Search requests, IDs, or assignees..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative text-slate-500 hover:text-slate-900 transition-all duration-200">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
          </button>
          <button className="text-slate-500 hover:text-slate-900 transition-all duration-200">
            <span className="material-symbols-outlined">chat_bubble_outline</span>
          </button>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">{session.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{session.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white border border-slate-300">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
