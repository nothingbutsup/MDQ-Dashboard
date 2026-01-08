import React, { useState } from 'react';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { ChoreDraft } from './components/ChoreDraft';
import { ApartmentMap } from './components/ApartmentMap';
import { RulesDoc } from './components/RulesDoc';
import { Receipt, Dices, Map, BookOpen } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES'>('EXPENSE');

  // Determine container width based on active tab
  const getContainerWidth = () => {
      switch (activeTab) {
          case 'MAP':
              return 'max-w-2xl';
          case 'RULES':
              return 'max-w-3xl';
          default:
              return 'max-w-md';
      }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-start bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
      
      {/* Navigation Tabs */}
      <div className="w-full max-w-md mb-8">
        <div className="glass-panel p-1 rounded-xl flex gap-1">
            <button 
                onClick={() => setActiveTab('EXPENSE')}
                className={`flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'EXPENSE' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Receipt size={14} />
                <span className="hidden sm:inline">Expenses</span>
                <span className="sm:hidden">Exp</span>
            </button>
            <button 
                onClick={() => setActiveTab('DRAFT')}
                className={`flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'DRAFT' ? 'bg-emerald-600/20 text-emerald-400 shadow-lg border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Dices size={14} />
                <span>Draft</span>
            </button>
            <button 
                onClick={() => setActiveTab('MAP')}
                className={`flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'MAP' ? 'bg-blue-600/20 text-blue-400 shadow-lg border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <Map size={14} />
                <span>Map</span>
            </button>
            <button 
                onClick={() => setActiveTab('RULES')}
                className={`flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'RULES' ? 'bg-indigo-600/20 text-indigo-400 shadow-lg border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
                <BookOpen size={14} />
                <span>Rules</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`w-full transition-all duration-500 ease-out ${getContainerWidth()}`}>
        {activeTab === 'EXPENSE' && <ExpenseSplitter />}
        {activeTab === 'DRAFT' && <ChoreDraft />}
        {activeTab === 'MAP' && <ApartmentMap />}
        {activeTab === 'RULES' && <RulesDoc />}
      </div>

    </div>
  );
}

export default App;