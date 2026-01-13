import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Receipt, Dices, Map, BookOpen, Trophy, ChevronRight, ShieldAlert } from 'lucide-react';
import { USERS } from '../constants';
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../App';

interface DashboardProps {
    onNavigate: (tab: 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO' | 'FALTAS') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const departureDate = new Date('2026-01-16T06:00:00');
    const returnDate = new Date('2026-01-27T13:20:00');
    
    const [userScores, setUserScores] = useState<Record<string, number>>(
        USERS.reduce((acc, user) => ({ ...acc, [user.id]: 0 }), {})
    );

    const calculateTime = useCallback(() => {
        const now = new Date();
        let diff = 0;
        let status: 'BEFORE' | 'DURING' | 'AFTER' = 'BEFORE';
        
        if (now < departureDate) {
            status = 'BEFORE';
            diff = departureDate.getTime() - now.getTime();
        } else if (now < returnDate) {
            status = 'DURING';
            diff = returnDate.getTime() - now.getTime();
        } else {
            status = 'AFTER';
            diff = 0;
        }

        const totalTripTime = returnDate.getTime() - departureDate.getTime();
        const elapsedSinceDeparture = now.getTime() - departureDate.getTime();
        const progress = Math.max(0, Math.min(100, (elapsedSinceDeparture / totalTripTime) * 100));

        return {
            days: diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0,
            hours: diff > 0 ? Math.floor((diff / (1000 * 60 * 60)) % 24) : 0,
            mins: diff > 0 ? Math.floor((diff / 1000 / 60) % 60) : 0,
            status,
            progress
        };
    }, [departureDate, returnDate]);

    // Real-time scores listener
    useEffect(() => {
        const q = query(collection(db, "faltas"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const scores: Record<string, number> = USERS.reduce((acc, user) => ({ ...acc, [user.id]: 0 }), {});
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (scores[data.userId] !== undefined) {
                    scores[data.userId] += (data.category || 0);
                }
            });
            setUserScores(scores);
        }, (err) => {
            console.debug("Dashboard score listener error (likely unauth):", err.message);
        });

        return () => unsubscribe();
    }, []);

    const initialData = calculateTime();
    const [timeLeft, setTimeLeft] = useState({ days: initialData.days, hours: initialData.hours, mins: initialData.mins });
    const [tripStatus, setTripStatus] = useState<'BEFORE' | 'DURING' | 'AFTER'>(initialData.status);
    const [progress, setProgress] = useState(initialData.progress);

    useEffect(() => {
        const timer = setInterval(() => {
            const data = calculateTime();
            setTimeLeft({ days: data.days, hours: data.hours, mins: data.mins });
            setTripStatus(data.status);
            setProgress(data.progress);
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTime]);

    const QuickLink = ({ icon: Icon, title, desc, tab, colorHex }: any) => (
        <button 
            onClick={() => onNavigate(tab)}
            className="bg-[#2b2930] hover:bg-[#332f37] group relative p-4 rounded-[20px] transition-all duration-200 text-left flex items-center gap-4 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: `${colorHex}22`, color: colorHex }}>
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#e6e1e5] text-sm tracking-tight truncate">{title}</h3>
                <p className="text-[#cac4d0] text-[11px] truncate">{desc}</p>
            </div>
            
            <div className="w-6 h-6 rounded-full bg-[#49454f] flex items-center justify-center text-[#eaddff] shrink-0">
                <ChevronRight size={14} />
            </div>
        </button>
    );

    return (
        <div className="animate-fade-in space-y-6 pb-12">
            {/* Timeline Card */}
            <div className="bg-[#2b2930] p-6 rounded-[28px] shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="text-[#d0bcfe] shrink-0" size={18} />
                    <h2 className="text-[11px] font-bold text-[#d0bcfe] tracking-widest uppercase">
                        Trip Timeline
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center relative">
                    <div className="space-y-0.5 z-10 bg-[#2b2930]">
                        <span className="text-[10px] font-medium text-[#cac4d0] uppercase tracking-wide">Departure</span>
                        <div className="text-3xl font-bold text-[#e6e1e5]">Jan 16</div>
                        <div className="text-[#cac4d0] font-mono text-[11px]">06:00 AM</div>
                    </div>

                    <div className="text-right space-y-0.5 z-10 bg-[#2b2930]">
                        <span className="text-[10px] font-medium text-[#cac4d0] uppercase tracking-wide">Return</span>
                        <div className="text-3xl font-bold text-[#e6e1e5]">Jan 27</div>
                        <div className="text-[#cac4d0] font-mono text-[11px]">01:20 PM</div>
                    </div>

                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#49454f] rounded-full -translate-y-1/2 z-0 pointer-events-none mx-24 sm:mx-40 hidden xs:block">
                        <div 
                            className="h-full bg-[#d0bcfe] rounded-full shadow-[0_0_8px_rgba(208,188,254,0.4)] transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Countdown */}
            <div className="text-center py-6 bg-[#211f26] rounded-[32px] border border-[#49454f]/40">
                <div className="inline-block px-4 py-1.5 bg-[#49454f] rounded-full mb-6">
                    <span className="text-[10px] font-bold text-[#eaddff] uppercase tracking-widest">
                        {tripStatus === 'BEFORE' ? 'Until Departure' : tripStatus === 'DURING' ? 'Until Return' : 'Trip Finished'}
                    </span>
                </div>
                
                <div className="flex justify-center items-center gap-4 sm:gap-8">
                    <div className="text-center">
                        <div className="text-4xl sm:text-6xl font-normal text-[#e6e1e5] tabular-nums tracking-tighter">
                            {String(timeLeft.days).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-bold text-[#cac4d0] uppercase tracking-widest mt-1">Days</div>
                    </div>
                    <div className="text-2xl text-[#49454f] font-light mb-4">:</div>
                    <div className="text-center">
                        <div className="text-4xl sm:text-6xl font-normal text-[#e6e1e5] tabular-nums tracking-tighter">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-bold text-[#cac4d0] uppercase tracking-widest mt-1">Hours</div>
                    </div>
                    <div className="text-2xl text-[#49454f] font-light mb-4">:</div>
                    <div className="text-center">
                        <div className="text-4xl sm:text-6xl font-normal text-[#e6e1e5] tabular-nums tracking-tighter">
                            {String(timeLeft.mins).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-bold text-[#cac4d0] uppercase tracking-widest mt-1">Mins</div>
                    </div>
                </div>
            </div>

            {/* Quick Link Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickLink 
                    icon={Receipt} 
                    title="Expenses" 
                    desc="Split costs and settle up" 
                    tab="EXPENSE" 
                    colorHex="#d0bcfe" 
                />
                <QuickLink 
                    icon={Dices} 
                    title="Chore Draft" 
                    desc="Randomized task allocation" 
                    tab="DRAFT" 
                    colorHex="#b2f2bb" 
                />
                <QuickLink 
                    icon={Trophy} 
                    title="Truco" 
                    desc="Traditional matchstick scoring" 
                    tab="TRUCO" 
                    colorHex="#ffb4ab" 
                />
                <QuickLink 
                    icon={Map} 
                    title="Area Map" 
                    desc="Explore the neighborhood" 
                    tab="MAP" 
                    colorHex="#91d1ff" 
                />
                <QuickLink 
                    icon={BookOpen} 
                    title="Rules Doc" 
                    desc="Official apartment rules" 
                    tab="RULES" 
                    colorHex="#cac4d0" 
                />
                <QuickLink 
                    icon={ShieldAlert} 
                    title="Roommate Ledger" 
                    desc="Faltas and disciplinary status" 
                    tab="FALTAS" 
                    colorHex="#f43f5e" 
                />
            </div>

            {/* Disciplinary Summary Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 px-2">
                    <ShieldAlert className="text-rose-400" size={18} />
                    <h2 className="text-[11px] font-bold text-rose-400 tracking-widest uppercase">
                        Disciplinary Status
                    </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {USERS.map(user => (
                        <div key={user.id} className="bg-[#2b2930] p-4 rounded-[24px] border border-[#49454f]/30 flex flex-col items-center gap-2 shadow-sm">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${user.colorBg} ${user.colorText} ${user.colorBorder}`}>
                                <span className="text-xs font-black">{user.name.substring(0, 1)}</span>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-[#e6e1e5] uppercase tracking-wider mb-1">{user.name}</p>
                                <p className={`text-xl font-mono font-bold leading-none ${userScores[user.id] > 10 ? 'text-rose-400' : userScores[user.id] > 5 ? 'text-orange-400' : 'text-[#cac4d0]'}`}>
                                    {String(userScores[user.id]).padStart(2, '0')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
