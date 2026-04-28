import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onCreateNew: () => void;
}

const navItems = [
  { to: '/', icon: 'grid_view', label: 'Dashboard' },
  { to: '/tickets', icon: 'list_alt', label: 'Request List' },
];

export default function Sidebar({ onCreateNew }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-slate-50 flex flex-col py-6 px-4 gap-8 z-50">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-sm">token</span>
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tighter text-slate-900 leading-none">Enterprise Ops</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Request Management</p>
        </div>
      </div>

      <button
        onClick={onCreateNew}
        className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 px-4 rounded-lg font-sans text-sm tracking-tight font-medium hover:bg-slate-800 transition-all active:scale-95 duration-100"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Create New
      </button>

      <nav className="flex flex-col gap-1 grow">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-3 rounded-lg font-sans text-sm tracking-tight font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-blue-600 bg-slate-100 border-r-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-slate-200 pt-6">
        {[
          { icon: 'settings', label: 'Settings' },
          { icon: 'help_outline', label: 'Support' },
        ].map(({ icon, label }) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-3 py-2 px-3 rounded-lg font-sans text-sm tracking-tight font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150"
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </a>
        ))}
      </div>
    </aside>
  );
}
