
import React, { useState } from 'react';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { ChoreDraft } from './components/ChoreDraft';
import { ApartmentMap } from './components/ApartmentMap';
import { RulesDoc } from './components/RulesDoc';
import { TrucoCounter } from './components/TrucoCounter';
import { Dashboard } from './components/Dashboard';
import { 
  Receipt, 
  Dices, 
  Map, 
  BookOpen, 
  Trophy, 
  LayoutDashboard, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

type TabType = 'DASHBOARD' | 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine container width based on active tab
  const getContainerWidth = () => {
      switch (activeTab) {
          case 'MAP':
              return 'max-w-3xl';
          case 'RULES':
              return 'max-w-4xl';
          case 'DASHBOARD':
              return 'max-w-6xl';
          default:
              return 'max-w-2xl';
      }
  };

  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard, color: 'text-slate-200', activeBg: 'bg-white/10' },
    { id: 'EXPENSE', label: 'Expenses', icon: Receipt, color: 'text-blue-400', activeBg: 'bg-blue-500/10' },
    { id: 'DRAFT', label: 'Chore Draft', icon: Dices, color: 'text-emerald-400', activeBg: 'bg-emerald-500/10' },
    { id: 'MAP', label: 'Area Map', icon: Map, color: 'text-cyan-400', activeBg: 'bg-cyan-500/10' },
    { id: 'RULES', label: 'Rules Doc', icon: BookOpen, color: 'text-indigo-400', activeBg: 'bg-indigo-500/10' },
    { id: 'TRUCO', label: 'Truco Counter', icon: Trophy, color: 'text-orange-400', activeBg: 'bg-orange-500/10' },
  ] as const;

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLabel = menuItems.find(item => item.id === activeTab)?.label || 'Menu';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500/30">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r border-slate-800/50 
        transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter text-white uppercase">MDQ DASHBOARD</h1>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as TabType)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group
                  ${activeTab === item.id 
                    ? `${item.activeBg} ${item.color} shadow-sm border border-slate-700/50` 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}
                `}
              >
                <item.icon size={18} className={activeTab === item.id ? item.color : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="flex-1 text-left">{item.label}</span>
                {activeTab === item.id && <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800/50">
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session</p>
              <p className="text-xs font-bold text-slate-300">Mar del Plata 2026</p>
              <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 lg:z-20 w-full glass-panel border-b border-slate-800/50 px-4 h-16 sm:h-20 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <Menu size={22} />
            </button>
            <div className="lg:ml-2">
              <h2 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Navigation</h2>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black text-white tracking-tight">{activeLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
               <Receipt size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 py-6 px-4 sm:py-10 sm:px-8">
          <div className={`mx-auto transition-all duration-700 ease-out ${getContainerWidth()}`}>
            {activeTab === 'DASHBOARD' && <Dashboard onNavigate={(tab) => handleNavigate(tab as TabType)} />}
            {activeTab === 'EXPENSE' && <ExpenseSplitter />}
            {activeTab === 'DRAFT' && <ChoreDraft />}
            {activeTab === 'MAP' && <ApartmentMap />}
            {activeTab === 'RULES' && <RulesDoc />}
            {activeTab === 'TRUCO' && <TrucoCounter />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
