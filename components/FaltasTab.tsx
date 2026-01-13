import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldCheck, X, Loader2, LogOut, Mail } from 'lucide-react';
import { USERS } from '../constants';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { useAuth, auth, db } from '../App';

interface FaltaEvent {
    id: string;
    category: number;
    timestamp: any;
    userId: string;
}

const CATEGORY_COLORS: Record<number, string> = {
    1: 'bg-slate-500', 
    2: 'bg-blue-500', 
    3: 'bg-emerald-500', 
    4: 'bg-yellow-500', 
    5: 'bg-orange-500', 
    6: 'bg-rose-500', 
    7: 'bg-red-700'
};

export const FaltasTab: React.FC = () => {
    // Relying solely on the real Firebase Auth context
    const { currentUser, loading: authLoading } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    // Hardcoded keys for display categories in the UI, but contents are fetched from real DB
    const [records, setRecords] = useState<Record<string, FaltaEvent[]>>({
        mate: [], joako: [], luqui: [], agus: [], mastro: [], roman: []
    });

    // Real-time Firestore sync triggered only when a valid real user session is active
    useEffect(() => {
        if (!currentUser) return;

        setIsLoadingRecords(true);
        const q = query(collection(db, "faltas"), orderBy("timestamp", "desc"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newRecords: Record<string, FaltaEvent[]> = {
                mate: [], joako: [], luqui: [], agus: [], mastro: [], roman: []
            };
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Map database entries to UI columns
                if (newRecords[data.userId]) {
                    newRecords[data.userId].push({
                        id: doc.id,
                        category: data.category,
                        timestamp: data.timestamp,
                        userId: data.userId
                    });
                }
            });
            setRecords(newRecords);
            setIsLoadingRecords(false);
            setError(''); 
        }, (err) => {
            console.error("Firestore Error:", err.code, err.message);
            setIsLoadingRecords(false);
            if (err.code === 'permission-denied') {
                setError('Session expired or unauthorized.');
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            setError('Email and password required.');
            return;
        }

        setIsLoggingIn(true);
        try {
            // Authentic sign-in using actual credentials from the database
            await signInWithEmailAndPassword(auth, trimmedEmail, password);
        } catch (err: any) {
            console.error("Authentication Failed:", err.code);
            // Handle invalid-credential and other common auth errors
            setError('Invalid credentials');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => signOut(auth);

    const addFalta = async (userId: string, category: number) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, "faltas"), {
                userId, 
                category, 
                timestamp: Timestamp.now()
            });
        } catch (e: any) { 
            console.error("DB Write Error:", e.message); 
            if (e.code === 'permission-denied') alert("Write permission denied.");
        }
    };

    const removeFalta = async (docId: string) => {
        if (!currentUser) return;
        try { 
            await deleteDoc(doc(db, "faltas", docId)); 
        } catch (e: any) { 
            console.error("DB Delete Error:", e.message); 
            if (e.code === 'permission-denied') alert("Delete permission denied.");
        }
    };

    if (authLoading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <Loader2 size={40} className="text-[#d0bcfe] animate-spin" />
        </div>
    );

    if (!currentUser) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fade-in">
                <div className="bg-[#2b2930] w-full max-w-sm p-8 rounded-[32px] shadow-2xl border border-rose-500/30 animate-scale-up">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#8c1d18]/20 rounded-2xl flex items-center justify-center text-rose-400 mb-4 border border-rose-500/20 shadow-inner">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#e6e1e5]">Restricted Area</h2>
                        <p className="text-[#cac4d0] text-sm mt-1">Sign in with Roommate Credentials</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#49454f]" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1c1b1f] border-b-2 border-[#49454f] focus:border-rose-400 pl-10 pr-4 py-3 text-[#e6e1e5] focus:outline-none transition-all rounded-t-lg"
                                    placeholder="mate@mdq.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1 ml-1">Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-[#49454f]" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1c1b1f] border-b-2 border-[#49454f] focus:border-rose-400 pl-10 pr-4 py-3 text-[#e6e1e5] focus:outline-none transition-all rounded-t-lg"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {error && <p className="text-[#ffb4ab] text-xs font-medium text-center animate-pulse">{error}</p>}

                        <button 
                            type="submit" 
                            disabled={isLoggingIn}
                            className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : "Authorize Session"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (isLoadingRecords) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in">
            <Loader2 size={40} className="text-rose-400 animate-spin mb-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#cac4d0]">Accessing Records</span>
        </div>
    );

    return (
        <div className="animate-fade-in py-4 lg:py-8 w-full">
            <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-rose-400" size={24} />
                    <h2 className="text-lg font-bold text-[#e6e1e5]">Active Ledger</h2>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2b2930] text-[#cac4d0] hover:bg-[#8c1d18]/20 transition-all text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-rose-500/30">
                    <LogOut size={14} /> Exit Database
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                {USERS.map(user => {
                    const userEvents = records[user.id] || [];
                    const totalScore = userEvents.reduce((acc, ev) => acc + ev.category, 0);
                    return (
                        <div key={user.id} className="bg-[#1c1b1f]/40 border border-[#2b2930] rounded-[32px] overflow-hidden flex flex-col h-[740px] shadow-xl relative group transition-all duration-300">
                            <div className={`absolute top-0 left-0 right-0 h-1 ${user.colorBg} opacity-50`} />
                            <div className="pt-8 pb-4 text-center px-4 relative">
                                <span className="text-sm font-black text-[#e6e1e5] uppercase tracking-[0.3em] mb-2 block">{user.name}</span>
                                <div className="relative inline-block">
                                    <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                                        {String(totalScore).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>

                            <div className="px-5 space-y-2 mb-6">
                                <div className="grid grid-cols-2 gap-2">
                                    {[1, 2, 3, 4].map(cat => (
                                        <button key={cat} onClick={() => addFalta(user.id, cat)} className="bg-[#2b2930] hover:bg-[#332f37] border border-[#49454f] rounded-xl py-2 text-[10px] font-bold text-[#cac4d0] uppercase tracking-wider transition-all active:scale-95">Cat {cat}</button>
                                    ))}
                                </div>
                                <button onClick={() => addFalta(user.id, 5)} className="w-full bg-[#2b2930] hover:bg-[#332f37] border border-[#49454f] rounded-xl py-2 text-[10px] font-bold text-[#ffb4ab]/80 uppercase tracking-widest transition-all active:scale-95">Cat 5</button>
                                <div className="grid grid-cols-2 gap-2">
                                    {[6, 7].map(cat => (
                                        <button key={cat} onClick={() => addFalta(user.id, cat)} className="bg-[#2b2930] hover:bg-[#332f37] border border-[#49454f] rounded-xl py-2 text-[10px] font-bold text-rose-500/80 uppercase tracking-widest transition-all active:scale-95">Cat {cat}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 px-5 pb-8 overflow-hidden flex flex-col border-t border-[#49454f]/10">
                                <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 py-4">
                                    {userEvents.length > 0 ? (
                                        userEvents.map(ev => (
                                            <div key={ev.id} className="group/item flex items-center justify-between gap-3 animate-fade-in py-2 border-b border-[#49454f]/10 last:border-0">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_COLORS[ev.category] || 'bg-slate-500'}`} />
                                                    <span className="text-xs font-bold text-[#e6e1e5] truncate">Cat {ev.category}</span>
                                                </div>
                                                <button onClick={() => removeFalta(ev.id)} className="p-1.5 rounded-md hover:bg-[#8c1d18]/20 text-[#49454f] hover:text-[#ffb4ab] transition-all opacity-0 group-hover/item:opacity-100"><X size={14} /></button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20 space-y-3">
                                            <ShieldCheck size={28} className="text-emerald-400" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Status Clear</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-8 text-center opacity-40">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Official Disciplinary Protocol Enforcement</p>
            </div>
        </div>
    );
};