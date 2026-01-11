import React, { useState } from 'react';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { ChoreDraft } from './components/ChoreDraft';
import { ApartmentMap } from './components/ApartmentMap';
import { RulesDoc } from './components/RulesDoc';
import { TrucoCounter } from './components/TrucoCounter';
import { Dashboard } from './components/Dashboard';
import { Receipt, Dices, Map, BookOpen, Trophy, LayoutDashboard } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO'>('DASHBOARD');

  // Determine container width based on active tab
  const getContainerWidth = () => {
      switch (activeTab) {
          case 'MAP':
              return 'max-w-2xl';
          case 'RULES':
              return 'max-w-3xl';
          case 'DASHBOARD':
              return 'max-w-5xl';
          default:
              return 'max-w-md';
      }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-start bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
      
      {/* Navigation Tabs */}
      <div className="w-full max-w-xl mb-12">
        <div className="glass-panel p-1.5 rounded-2xl flex gap-1 overflow-x-auto no-scrollbar shadow-2xl">
            <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'DASHBOARD' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Home</span>
            </button>
            <button 
                onClick={() => setActiveTab('EXPENSE')}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'EXPENSE' ? 'bg-indigo-600/20 text-indigo-400 shadow-lg border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Receipt size={14} />
                <span className="hidden sm:inline">Expenses</span>
            </button>
            <button 
                onClick={() => setActiveTab('DRAFT')}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'DRAFT' ? 'bg-emerald-600/20 text-emerald-400 shadow-lg border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Dices size={14} />
                <span className="hidden sm:inline">Draft</span>
            </button>
            <button 
                onClick={() => setActiveTab('MAP')}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'MAP' ? 'bg-blue-600/20 text-blue-400 shadow-lg border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Map size={14} />
                <span className="hidden sm:inline">Map</span>
            </button>
            <button 
                onClick={() => setActiveTab('RULES')}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'RULES' ? 'bg-slate-700 text-slate-100 shadow-lg border border-slate-600' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <BookOpen size={14} />
                <span className="hidden sm:inline">Rules</span>
            </button>
            <button 
                onClick={() => setActiveTab('TRUCO')}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'TRUCO' ? 'bg-orange-600/20 text-orange-400 shadow-lg border border-orange-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Trophy size={14} />
                <span className="hidden sm:inline">Truco</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`w-full transition-all duration-500 ease-out ${getContainerWidth()}`}>
        {activeTab === 'DASHBOARD' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'EXPENSE' && <ExpenseSplitter />}
        {activeTab === 'DRAFT' && <ChoreDraft />}
        {activeTab === 'MAP' && <ApartmentMap />}
        {activeTab === 'RULES' && <RulesDoc />}
        {activeTab === 'TRUCO' && <TrucoCounter />}
      </div>

    </div>
  );
}

export default App;