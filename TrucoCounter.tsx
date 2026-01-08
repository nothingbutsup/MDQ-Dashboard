import React, { useState } from 'react';
import { RotateCcw, Minus, Plus, Trophy } from 'lucide-react';

type PointGroupProps = {
    value: number; // 0 to 5
    color: string;
};

const Matchsticks: React.FC<PointGroupProps> = ({ value, color }) => {
    if (value === 0) return <div className="w-12 h-12" />;

    const strokeWidth = "3";
    
    // Traditional "Casita" / Box method
    // 1: Bottom
    // 2: + Right
    // 3: + Top
    // 4: + Left (Box closed)
    // 5: Diagonal
    
    return (
        <div className="w-12 h-12 relative p-1 animate-scale-up">
             <svg width="100%" height="100%" viewBox="0 0 40 40" className="overflow-visible">
                {/* 1: Bottom */}
                {value >= 1 && <path d="M 5 35 L 35 35" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {/* 2: Right */}
                {value >= 2 && <path d="M 35 35 L 35 5" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {/* 3: Top */}
                {value >= 3 && <path d="M 35 5 L 5 5" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {/* 4: Left */}
                {value >= 4 && <path d="M 5 5 L 5 35" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {/* 5: Diagonal */}
                {value >= 5 && <path d="M 5 35 L 35 5" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
             </svg>
        </div>
    );
};

export const TrucoCounter: React.FC = () => {
    const [limit, setLimit] = useState<15 | 30>(30);
    const [scoreA, setScoreA] = useState(0); // Puberos
    const [scoreB, setScoreB] = useState(0); // Mixeros

    const changeScore = (team: 'A' | 'B', delta: number) => {
        if (team === 'A') {
            setScoreA(prev => Math.min(limit, Math.max(0, prev + delta)));
        } else {
            setScoreB(prev => Math.min(limit, Math.max(0, prev + delta)));
        }
    };

    const reset = () => {
        setScoreA(0);
        setScoreB(0);
    };
    
    const toggleLimit = () => {
        const newLimit = limit === 30 ? 15 : 30;
        setLimit(newLimit);
        // Cap scores if switching down
        if (scoreA > newLimit) setScoreA(newLimit);
        if (scoreB > newLimit) setScoreB(newLimit);
    };

    const renderPoints = (score: number, color: string) => {
        const groups = [];
        const fullGroups = Math.floor(score / 5);
        const remainder = score % 5;
        
        for (let i = 0; i < fullGroups; i++) {
            groups.push(<Matchsticks key={`full-${i}`} value={5} color={color} />);
        }
        if (remainder > 0) {
            groups.push(<Matchsticks key="remainder" value={remainder} color={color} />);
        }
        
        return (
            <div className="flex flex-col gap-4 items-center">
                {/* First 15 points (0-15) */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-4 justify-items-center">
                    {groups.slice(0, 3)}
                </div>
                
                {/* Divider if we have more than 15 points (Second Half) */}
                {groups.length > 3 && (
                    <>
                        <div className="w-full h-px bg-slate-700/50 my-1" />
                        <div className="grid grid-cols-3 gap-x-4 gap-y-4 justify-items-center">
                            {groups.slice(3)}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in space-y-6 pb-20">
             {/* Header / Controls */}
             <div className="glass-panel p-4 rounded-xl flex justify-between items-center shadow-lg">
                <button 
                    onClick={toggleLimit}
                    className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors uppercase tracking-wider"
                >
                    Max: {limit}
                </button>
                
                <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-500 w-5 h-5" />
                    <h2 className="text-xl font-black italic tracking-tighter text-slate-100">
                        TRUCO
                    </h2>
                </div>

                <button 
                    onClick={reset}
                    className="p-2 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <RotateCcw size={18} />
                </button>
             </div>

             {/* Score Board */}
             <div className="glass-panel rounded-2xl overflow-hidden relative min-h-[500px] flex shadow-2xl border border-slate-700/50">
                <div className="absolute inset-y-16 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-slate-700/50 to-transparent -translate-x-1/2"></div>
                
                {/* Team A: Puberos */}
                <div className="flex-1 flex flex-col relative bg-gradient-to-b from-indigo-900/10 to-transparent">
                    <div className="p-4 pt-6 text-center border-b border-indigo-500/10">
                        <h3 className="font-bold text-lg text-indigo-400 uppercase tracking-wider">Puberos</h3>
                        <div className="text-4xl font-mono font-bold text-white mt-1 drop-shadow-lg">{scoreA}</div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col items-center">
                         {renderPoints(scoreA, "stroke-indigo-300")}
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2 mt-auto border-t border-indigo-500/10 bg-indigo-950/20">
                        <button 
                            onClick={() => changeScore('A', -1)}
                            className="bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/30 border border-slate-700 rounded-lg h-14 flex justify-center items-center transition-all active:scale-95 group"
                        >
                            <Minus size={20} className="text-slate-400 group-hover:text-rose-400" />
                        </button>
                        <button 
                            onClick={() => changeScore('A', 1)}
                            className="bg-indigo-600/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg h-14 flex justify-center items-center transition-all active:scale-95"
                        >
                            <Plus size={24} className="text-indigo-400" />
                        </button>
                    </div>
                </div>

                {/* Team B: Mixeros */}
                <div className="flex-1 flex flex-col relative bg-gradient-to-b from-emerald-900/10 to-transparent">
                    <div className="p-4 pt-6 text-center border-b border-emerald-500/10">
                        <h3 className="font-bold text-lg text-emerald-400 uppercase tracking-wider">Mixeros</h3>
                        <div className="text-4xl font-mono font-bold text-white mt-1 drop-shadow-lg">{scoreB}</div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col items-center">
                         {renderPoints(scoreB, "stroke-emerald-300")}
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2 mt-auto border-t border-emerald-500/10 bg-emerald-950/20">
                        <button 
                            onClick={() => changeScore('B', -1)}
                            className="bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/30 border border-slate-700 rounded-lg h-14 flex justify-center items-center transition-all active:scale-95 group"
                        >
                            <Minus size={20} className="text-slate-400 group-hover:text-rose-400" />
                        </button>
                        <button 
                            onClick={() => changeScore('B', 1)}
                            className="bg-emerald-600/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg h-14 flex justify-center items-center transition-all active:scale-95"
                        >
                            <Plus size={24} className="text-emerald-400" />
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};