
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Receipt, Dices, Map, BookOpen, Trophy, ChevronRight, ShieldAlert } from 'lucide-react';
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../App';
import { USERS } from '../constants';

interface DashboardProps {
    onNavigate: (tab: 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO' | 'FALTAS') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const departureDate = new Date('2026-01-16T06:00:00');
    const returnDate = new Date('2026-01-27T13:20:00');
    
    const [faultScores, setFaultScores] = useState<Record<string, number>>(
        USERS.reduce((acc, u) => ({ ...acc, [u.id]: 0 }), {})
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

    // Initialize state with immediate calculation
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

        // Fetch fault scores for summary
        const q = query(collection(db, "faltas"));
        const unsubscribeFaltas = onSnapshot(q, (snapshot) => {
            const scores: Record<string, number> = USERS.reduce((acc, u) => ({ ...acc, [u.id]: 0 }), {});
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (scores[data.userId] !== undefined) {
                    scores[data.userId] += data.category || 0;
                }
            });
            setFaultScores(scores);
        });

        return () => {
            clearInterval(timer);
            unsubscribeFaltas();
        };
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
        <div className="animate-fade-in space-y-8 pb-12">
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

            {/* Countdown - Now full width */}
            <div className="w-full text-center py-10 bg-[#211f26] rounded-[32px] border border-[#49454f]/40 flex flex-col justify-center shadow-lg">
                <div className="inline-block px-4 py-1.5 bg-[#49454f] rounded-full mb-8 self-center">
                    <span className="text-[10px] font-bold text-[#eaddff] uppercase tracking-widest">
                        {tripStatus === 'BEFORE' ? 'Until Departure' : tripStatus === 'DURING' ? 'Until Return' : 'Trip Finished'}
                    </span>
                </div>
                
                <div className="flex justify-center items-center gap-4 sm:gap-12">
                    <div className="text-center">
                        <div className="text-5xl sm:text-7xl font-normal text-[#e6e1e5] tabular-nums tracking-tighter">
                            {String(timeLeft.days).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-bold text-[#cac4d0] uppercase tracking-widest mt-1">Days</div>
                    </div>
                    <div className="text-3xl text-[#49454f] font-light mb-6">:</div>
                    <div className="text-center">
                        <div className="text-5xl sm:text-7xl font-normal text-[#e6e1e5] tabular-nums tracking-tighter">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-bold text-[#cac4d0] uppercase tracking-widest mt-1">Hours</div>
                    </div>
                    <div className="text-3xl text-[#49454f] font-light mb-6">:</div>
                    <div className="text-center">
                        <div className="text-5xl sm:text-7xl font-normal text-[#e6e1e5] tabular-nums tracking-tighter">
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
                    title="Faltas" 
                    desc="View disciplinary ledger" 
                    tab="FALTAS" 
                    colorHex="#f2b8b5" 
                />
            </div>

            {/* Faults Overview - Moved to bottom and reformatted */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 px-2">
                    <ShieldAlert className="text-[#f2b8b5]" size={18} />
                    <h2 className="text-[11px] font-bold text-[#f2b8b5] tracking-widest uppercase">
                        Current Faults Count
                    </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {USERS.map(user => (
                        <div key={user.id} className="bg-[#2b2930] p-4 rounded-[24px] border border-[#49454f]/30 flex flex-col items-center gap-3 shadow-md hover:border-rose-500/20 transition-all">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black ${user.colorBg} ${user.colorText}`}>
                                {user.name[0]}
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] font-bold text-[#cac4d0] uppercase tracking-widest mb-1">{user.name}</span>
                                <span className="text-3xl font-bold text-white font-mono leading-none">
                                    {String(faultScores[user.id] || 0).padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="text-center opacity-30 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.5em]">MDQ Dashboard v2.5</p>
            </div>
        </div>
    );
};
