import React, { useState } from 'react';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { ChoreDraft } from './components/ChoreDraft';
import { ApartmentMap } from './components/ApartmentMap';
import { RulesDoc } from './components/RulesDoc';
import { TrucoCounter } from './components/TrucoCounter';
import { Dashboard } from './components/Dashboard';
import { 
    LayoutDashboard, 
    Receipt, 
    Dices, 
    Map as MapIcon, 
    BookOpen, 
    Trophy, 
    Menu, 
    X,
    LayoutGrid,
    ChevronLeft,
    CircleDot
} from 'lucide-react';

type TabType = 'DASHBOARD' | 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'EXPENSE', label: 'Expenses', icon: Receipt },
      { id: 'DRAFT', label: 'Chore Draft', icon: Dices },
      { id: 'MAP', label: 'Area Map', icon: MapIcon },
      { id: 'RULES', label: 'Rules Doc', icon: BookOpen },
      { id: 'TRUCO', label: 'Truco Counter', icon: Trophy },
  ];

  return (
    <div className="flex h-screen bg-[#1c1b1f] text-[#e6e1e5] overflow-hidden font-inter">
      
      {/* Sidebar (Material Navigation Drawer) */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 bg-[#2b2930] transition-all duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 -translate-x-full lg:translate-x-0 opacity-0 overflow-hidden'}
      `}>
        <div className="flex flex-col h-full w-80">
            {/* Drawer Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#d0bcfe] rounded-2xl flex items-center justify-center">
                        <LayoutGrid size={24} className="text-[#381e72]" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[#e6e1e5]">MDQ 2026</span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-2 text-[#cac4d0] hover:text-white hover:bg-[#49454f] rounded-full transition-all"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as TabType);
                                if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-4 rounded-[28px] transition-all duration-200 relative
                                ${isActive 
                                    ? 'bg-[#4f378b] text-[#eaddff]' 
                                    : 'text-[#cac4d0] hover:bg-[#49454f]/40'
                                }
                            `}
                        >
                            <item.icon size={24} className={isActive ? 'text-[#eaddff]' : 'text-[#cac4d0]'} />
                            <span className="text-sm font-medium tracking-wide">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            
            <div className="p-8 text-[10px] text-[#49454f] font-bold uppercase tracking-[0.2em] text-center">
                Apartment Edition 2.5
            </div>
        </div>
      </aside>

      {/* Main Content (Material Scaffold) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#1c1b1f] overflow-hidden relative">
        
        {/* Top App Bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#1c1b1f] sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className={`p-2 hover:bg-[#49454f] rounded-full transition-all ${isSidebarOpen ? 'hidden' : 'block'}`}
                >
                    <Menu size={24} className="text-[#e6e1e5]" />
                </button>
                <h1 className="text-xl font-normal text-[#e6e1e5]">
                    {menuItems.find(m => m.id === activeTab)?.label}
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Syncing indicator removed */}
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:p-8 custom-scrollbar">
            <div className={`w-full mx-auto ${getContainerWidth()}`}>
                {activeTab === 'DASHBOARD' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
                {activeTab === 'EXPENSE' && <ExpenseSplitter />}
                {activeTab === 'DRAFT' && <ChoreDraft isSidebarOpen={isSidebarOpen} />}
                {activeTab === 'MAP' && <ApartmentMap />}
                {activeTab === 'RULES' && <RulesDoc />}
                {activeTab === 'TRUCO' && <TrucoCounter />}
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;