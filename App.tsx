import React, { useState, useEffect, createContext, useContext } from 'react';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { ChoreDraft } from './components/ChoreDraft';
import { ApartmentMap } from './components/ApartmentMap';
import { RulesDoc } from './components/RulesDoc';
import { TrucoCounter } from './components/TrucoCounter';
import { Dashboard } from './components/Dashboard';
import { FaltasTab } from './components/FaltasTab';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, User, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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
    ShieldAlert
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDq6hJJMZxCfFuVcpT3qdictsmzl9LHNE4",
  authDomain: "faults-count.firebaseapp.com",
  projectId: "faults-count",
  storageBucket: "faults-count.firebasestorage.app",
  messagingSenderId: "551093405800",
  appId: "1:551093405800:web:a32b1c537cbbee0e9e13dd"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Context - Strictly using Firebase User type
interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });
export const useAuth = () => useContext(AuthContext);

type TabType = 'DASHBOARD' | 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO' | 'FALTAS';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Unified Auth Tracking
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
        unsubscribe();
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Enforce tab-based session expiration:
  // When leaving the Faltas tab, sign out immediately to force re-login on return.
  useEffect(() => {
    if (activeTab !== 'FALTAS' && currentUser) {
        signOut(auth).catch(err => console.debug("Auto sign-out on tab change:", err.message));
    }
  }, [activeTab, currentUser]);

  const getContainerWidth = () => {
      switch (activeTab) {
          case 'MAP': return 'max-w-3xl';
          case 'RULES': return 'max-w-4xl';
          case 'DASHBOARD': return 'max-w-6xl';
          case 'FALTAS': return 'max-w-[1400px]';
          default: return 'max-w-2xl';
      }
  };

  const menuItems = [
      { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'EXPENSE', label: 'Expenses', icon: Receipt },
      { id: 'DRAFT', label: 'Chore Draft', icon: Dices },
      { id: 'MAP', label: 'Area Map', icon: MapIcon },
      { id: 'RULES', label: 'Rules Doc', icon: BookOpen },
      { id: 'TRUCO', label: 'Truco Counter', icon: Trophy },
      { id: 'FALTAS', label: 'Faltas', icon: ShieldAlert },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
        <div className="flex h-screen bg-[#1c1b1f] text-[#e6e1e5] overflow-hidden font-inter">
        
        {/* Sidebar */}
        <aside className={`
            fixed lg:relative inset-y-0 left-0 z-50 bg-[#2b2930] transition-all duration-300 ease-in-out shadow-2xl
            ${isSidebarOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 -translate-x-full lg:translate-x-0 opacity-0 overflow-hidden'}
        `}>
            <div className="flex flex-col h-full w-80">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#d0bcfe] rounded-2xl flex items-center justify-center">
                            <LayoutGrid size={24} className="text-[#381e72]" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-[#e6e1e5]">MDQ 2026</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-[#cac4d0] lg:hidden">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const isFaltas = item.id === 'FALTAS';
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id as TabType)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-4 rounded-[28px] transition-all duration-200 relative group
                                    ${isActive 
                                        ? (isFaltas ? 'bg-[#8c1d18] text-white shadow-[0_0_25px_rgba(239,68,68,0.3)]' : 'bg-[#4f378b] text-[#eaddff]') 
                                        : (isFaltas 
                                            ? 'text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15' 
                                            : 'text-[#cac4d0] hover:bg-[#49454f]/40')
                                    }
                                `}
                            >
                                <item.icon size={24} className={`${isActive ? (isFaltas ? 'text-white' : 'text-[#eaddff]') : (isFaltas ? 'text-rose-400' : 'text-[#cac4d0]')}`} />
                                <span className="text-sm font-medium tracking-wide">{item.label}</span>
                                {isFaltas && !isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-8 text-[10px] text-[#49454f] font-bold uppercase tracking-[0.2em] text-center">
                    Apartment Edition 2.5
                </div>
            </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#1c1b1f] overflow-hidden relative">
            <header className="h-16 flex items-center justify-between px-6 bg-[#1c1b1f] sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(true)} className={`p-2 hover:bg-[#49454f] rounded-full transition-all ${isSidebarOpen ? 'hidden' : 'block'}`}>
                        <Menu size={24} className="text-[#e6e1e5]" />
                    </button>
                    <h1 className="text-xl font-normal text-[#e6e1e5]">{menuItems.find(m => m.id === activeTab)?.label}</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 sm:p-8 custom-scrollbar">
                <div className={`w-full mx-auto ${getContainerWidth()}`}>
                    {activeTab === 'DASHBOARD' && <Dashboard onNavigate={(tab) => handleTabChange(tab)} />}
                    {activeTab === 'EXPENSE' && <ExpenseSplitter />}
                    {activeTab === 'DRAFT' && <ChoreDraft isSidebarOpen={isSidebarOpen} />}
                    {activeTab === 'MAP' && <ApartmentMap />}
                    {activeTab === 'RULES' && <RulesDoc />}
                    {activeTab === 'TRUCO' && <TrucoCounter />}
                    {activeTab === 'FALTAS' && <FaltasTab />}
                </div>
            </div>
        </main>
        </div>
    </AuthContext.Provider>
  );
}

export default App;