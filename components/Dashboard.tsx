
import React, { useState, useEffect } from 'react';
import { 
    Receipt, 
    Dices, 
    Map as MapIcon, 
    BookOpen, 
    Trophy, 
    Calendar,
    ChevronRight
} from 'lucide-react';

interface DashboardProps {
    onNavigate: (tab: 'EXPENSE' | 'DRAFT' | 'MAP' | 'RULES' | 'TRUCO') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [countdownLabel, setCountdownLabel] = useState('Until Departure');

    const OUTBOUND_DATE = new Date('2026-01-16T06:00:00');
    const RETURN_DATE = new Date('2026-01-27T13:20:00');

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            let target: Date;
            
            if (now < OUTBOUND_DATE) {
                target = OUTBOUND_DATE;
                setCountdownLabel('Until Departure');
            } else if (now < RETURN_DATE) {
                target = RETURN_DATE;
                setCountdownLabel('Until Return');
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                setCountdownLabel('Trip Completed');
                return;
            }

            const diff = target.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);

            setTimeLeft({ days, hours, minutes });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const navItems = [
        { id: 'EXPENSE', label: 'Expenses', icon: Receipt, desc: 'Split costs and manage debts', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'DRAFT', label: 'Chore Draft', icon: Dices, desc: 'Randomized task allocation', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { id: 'TRUCO', label: 'Truco Counter', icon: Trophy, desc: 'Traditional matchstick scoring', color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { id: 'MAP', label: 'Area Map', icon: MapIcon, desc: 'Explore the neighborhood', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { id: 'RULES', label: 'Coexistence Code', icon: BookOpen, desc: 'Official apartment rules', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    ] as const;

    return (
        <div className="animate-fade-in w-full max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-12">
            
            {/* Timeline info - Full Width & Bigger */}
            <div className="glass-panel p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-slate-700/50 flex flex-col justify-center shadow-xl">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-indigo-400">
                        <Calendar size={14} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[9px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">MDQ 2026 Official Timeline</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-8">
                    <div className="text-center shrink-0">
                        <p className="text-[8px] sm:text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Departure</p>
                        <p className="text-sm sm:text-2xl font-black text-white whitespace-nowrap">Jan 16 <span className="text-slate-500 text-[8px] sm:text-sm ml-0.5 sm:ml-1 font-bold">06:00 AM</span></p>
                    </div>
                    
                    <div className="flex-1 h-1 sm:h-2 bg-slate-800 rounded-full relative overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-1000"
                            style={{ 
                                width: (new Date() < OUTBOUND_DATE) ? '0%' : 
                                       (new Date() > RETURN_DATE) ? '100%' : 
                                       `${((new Date().getTime() - OUTBOUND_DATE.getTime()) / (RETURN_DATE.getTime() - OUTBOUND_DATE.getTime())) * 100}%`
                            }}
                        />
                    </div>

                    <div className="text-center shrink-0">
                        <p className="text-[8px] sm:text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Return</p>
                        <p className="text-sm sm:text-2xl font-black text-white whitespace-nowrap">Jan 27 <span className="text-slate-500 text-[8px] sm:text-sm ml-0.5 sm:ml-1 font-bold">13:20 PM</span></p>
                    </div>
                </div>
            </div>

            {/* Hero: Countdown */}
            <div className="text-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
                    <h2 className="text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">{countdownLabel}</h2>
                </div>
                <div className="flex justify-center items-center gap-3 sm:gap-8">
                    <div className="flex flex-col">
                        <span className="text-3xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2">Days</span>
                    </div>
                    <span className="text-xl sm:text-4xl font-black text-slate-800 animate-pulse">:</span>
                    <div className="flex flex-col">
                        <span className="text-3xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2">Hours</span>
                    </div>
                    <span className="text-xl sm:text-4xl font-black text-slate-800 animate-pulse">:</span>
                    <div className="flex flex-col">
                        <span className="text-3xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2">Mins</span>
                    </div>
                </div>
            </div>

            {/* Navigation Grid - 2 columns on mobile, 3 on lg */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-1 sm:px-0">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className="group relative glass-panel p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/40 transition-all duration-500 text-left overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className={`absolute -top-3 -right-3 p-4 sm:p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 ${item.color}`}>
                            <item.icon size={60} className="sm:w-20 sm:h-20" />
                        </div>
                        <div className={`w-8 h-8 sm:w-10 h-10 rounded-lg sm:rounded-xl ${item.bg} flex items-center justify-center mb-2 sm:mb-3 transition-all duration-500 group-hover:scale-105 shadow-inner`}>
                            {/* Fixed multiple className attributes by merging them */}
                            <item.icon className={`${item.color} sm:w-5 sm:h-5`} size={16} />
                        </div>
                        <h3 className="text-xs sm:text-lg font-black text-white mb-0.5 sm:mb-1 tracking-tight truncate">{item.label}</h3>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 leading-snug mb-2 sm:mb-4 font-medium line-clamp-2 sm:line-clamp-2 h-6 sm:h-auto">{item.desc}</p>
                        
                        <div className="flex items-center gap-1 text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-all mt-auto">
                            Access <ChevronRight size={8} className="sm:w-[10px] sm:h-[10px] group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>

            <div className="text-center pt-4 sm:pt-6">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-50 italic">Mar del Plata 2026 • Project Hub</p>
            </div>
        </div>
    );
};
