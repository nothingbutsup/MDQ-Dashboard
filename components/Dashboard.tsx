
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
        { id: 'EXPENSE', label: 'EXPENSES', icon: Receipt, desc: 'Split costs and manage debts', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'DRAFT', label: 'DRAFT', icon: Dices, desc: 'Randomized task allocation', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { id: 'TRUCO', label: 'TRUCO', icon: Trophy, desc: 'Traditional matchstick scoring', color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { id: 'MAP', label: 'MAP', icon: MapIcon, desc: 'Explore the neighborhood', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { id: 'RULES', label: 'RULES', icon: BookOpen, desc: 'Official apartment rules', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    ] as const;

    return (
        <div className="animate-fade-in w-full max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-12 px-2">
            
            {/* Timeline info - Vertically stacked dates for mobile, consistent bar */}
            <div className="glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-slate-700/50 flex flex-col justify-center shadow-xl">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 text-indigo-400">
                        <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">MDQ 2026 Official Timeline</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    {/* Departure Block */}
                    <div className="text-left sm:text-center shrink-0 flex flex-col items-start sm:items-center">
                        <p className="text-[9px] sm:text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Departure</p>
                        <p className="text-lg sm:text-2xl font-black text-white whitespace-nowrap leading-tight">Jan 16</p>
                        <p className="text-slate-400 text-[10px] sm:text-sm font-bold mt-0.5">06:00 AM</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full relative overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-1000"
                            style={{ 
                                width: (new Date() < OUTBOUND_DATE) ? '0%' : 
                                       (new Date() > RETURN_DATE) ? '100%' : 
                                       `${((new Date().getTime() - OUTBOUND_DATE.getTime()) / (RETURN_DATE.getTime() - OUTBOUND_DATE.getTime())) * 100}%`
                            }}
                        />
                    </div>

                    {/* Return Block */}
                    <div className="text-right sm:text-center shrink-0 flex flex-col items-end sm:items-center">
                        <p className="text-[9px] sm:text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Return</p>
                        <p className="text-lg sm:text-2xl font-black text-white whitespace-nowrap leading-tight">Jan 27</p>
                        <p className="text-slate-400 text-[10px] sm:text-sm font-bold mt-0.5">01:20 PM</p>
                    </div>
                </div>
            </div>

            {/* Hero: Countdown */}
            <div className="text-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
                    <h2 className="text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">{countdownLabel}</h2>
                </div>
                <div className="flex justify-center items-center gap-4 sm:gap-8">
                    <div className="flex flex-col">
                        <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2">Days</span>
                    </div>
                    <span className="text-xl sm:text-4xl font-black text-slate-800 animate-pulse">:</span>
                    <div className="flex flex-col">
                        <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2">Hours</span>
                    </div>
                    <span className="text-xl sm:text-4xl font-black text-slate-800 animate-pulse">:</span>
                    <div className="flex flex-col">
                        <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2">Mins</span>
                    </div>
                </div>
            </div>

            {/* Navigation Grid - Universal Horizontal Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className="group relative glass-panel p-4 sm:p-5 rounded-xl sm:rounded-2xl border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/40 transition-all duration-500 text-left overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3 sm:gap-4"
                    >
                        {/* Background decoration - subtle hint */}
                        <div className={`absolute -top-3 -right-3 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 ${item.color} hidden lg:block`}>
                            <item.icon size={80} />
                        </div>
                        
                        {/* Icon - Beside the text */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${item.bg} flex items-center justify-center transition-all duration-500 group-hover:scale-105 shadow-inner shrink-0`}>
                            <item.icon className={`${item.color} w-5 h-5 sm:w-6 sm:h-6`} size={24} />
                        </div>
                        
                        {/* Labels & Metadata */}
                        <div className="flex flex-col overflow-hidden flex-1">
                            <h3 className="text-[12px] sm:text-base lg:text-lg font-black text-white tracking-tight truncate uppercase">
                                {item.label}
                            </h3>
                            {/* Short description shown on larger screens */}
                            <p className="text-[10px] text-slate-500 leading-tight font-medium line-clamp-1 mt-0.5 hidden sm:block">
                                {item.desc}
                            </p>
                        </div>

                        {/* Arrow indicator */}
                        <ChevronRight size={16} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                ))}
            </div>
        </div>
    );
};
