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
        <div className="animate-fade-in w-full max-w-5xl mx-auto space-y-16 pb-12">
            
            {/* Timeline info - Full Width & Bigger */}
            <div className="glass-panel p-8 rounded-[2rem] border-slate-700/50 flex flex-col justify-center shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <Calendar size={20} />
                        <span className="text-sm font-black uppercase tracking-[0.3em]">MDQ 2026 Official Timeline</span>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Departure</p>
                        <p className="text-2xl font-black text-white">Jan 16 <span className="text-slate-500 text-sm ml-1">06:00 AM</span></p>
                    </div>
                    
                    <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-1000"
                            style={{ 
                                width: (new Date() < OUTBOUND_DATE) ? '0%' : 
                                       (new Date() > RETURN_DATE) ? '100%' : 
                                       `${((new Date().getTime() - OUTBOUND_DATE.getTime()) / (RETURN_DATE.getTime() - OUTBOUND_DATE.getTime())) * 100}%`
                            }}
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Return</p>
                        <p className="text-2xl font-black text-white">Jan 27 <span className="text-slate-500 text-sm ml-1">13:20 PM</span></p>
                    </div>
                </div>
            </div>

            {/* Hero: Countdown */}
            <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                    <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">{countdownLabel}</h2>
                </div>
                <div className="flex justify-center items-center gap-4 sm:gap-10">
                    <div className="flex flex-col">
                        <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-3">Days</span>
                    </div>
                    <span className="text-3xl sm:text-5xl font-black text-slate-800 animate-pulse">:</span>
                    <div className="flex flex-col">
                        <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-3">Hours</span>
                    </div>
                    <span className="text-3xl sm:text-5xl font-black text-slate-800 animate-pulse">:</span>
                    <div className="flex flex-col">
                        <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-3">Mins</span>
                    </div>
                </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className="group relative glass-panel p-8 rounded-[2rem] border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/40 transition-all duration-500 text-left overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
                    >
                        <div className={`absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700 ${item.color}`}>
                            <item.icon size={120} />
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                            <item.icon className={item.color} size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{item.label}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium">{item.desc}</p>
                        
                        <div className="flex items-center gap-1 text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-all">
                            Open Module <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>

            <div className="text-center pt-12">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] opacity-50 italic">Mar del Plata 2026 • Project Hub</p>
            </div>
        </div>
    );
};