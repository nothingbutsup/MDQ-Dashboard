import React, { useState } from 'react';
import { RotateCcw, Minus, Plus, Trophy } from 'lucide-react';

type PointGroupProps = {
    value: number; // 0 to 5
    color: string;
};

const Matchsticks: React.FC<PointGroupProps> = ({ value, color }) => {
    if (value === 0) return <div className="w-8 h-8 sm:w-10 sm:h-10" />;
    const strokeWidth = "4";
    
    return (
        <div className="w-8 h-8 sm:w-10 sm:h-10 relative p-1 animate-scale-up">
             <svg width="100%" height="100%" viewBox="0 0 40 40" className="overflow-visible">
                {value >= 1 && <path d="M 5 35 L 35 35" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {value >= 2 && <path d="M 35 35 L 35 5" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {value >= 3 && <path d="M 35 5 L 5 5" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {value >= 4 && <path d="M 5 5 L 5 35" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
                {value >= 5 && <path d="M 5 35 L 35 5" className={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
             </svg>
        </div>
    );
};

export const TrucoCounter: React.FC = () => {
    const [limit, setLimit] = useState<15 | 30>(30);
    const [scoreA, setScoreA] = useState(0); 
    const [scoreB, setScoreB] = useState(0); 

    const changeScore = (team: 'A' | 'B', delta: number) => {
        if (team === 'A') {
            setScoreA(prev => Math.min(limit, Math.max(0, prev + delta)));
        } else {
            setScoreB(prev => Math.min(limit, Math.max(0, prev + delta)));
        }
    };

    const reset = () => {
        if (window.confirm("Reset scores?")) {
            setScoreA(0);
            setScoreB(0);
        }
    };
    
    const toggleLimit = () => {
        const newLimit = limit === 30 ? 15 : 30;
        setLimit(newLimit);
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
            <div className="flex flex-col gap-4 items-center w-full">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {groups.slice(0, 3)}
                </div>
                {groups.length > 3 && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 opacity-80 pt-4 border-t border-[#49454f]">
                        {groups.slice(3)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in space-y-4 sm:space-y-6 max-w-2xl mx-auto pb-24 sm:pb-32">
             {/* Compact Control Bar */}
             <div className="bg-[#2b2930] p-2 rounded-full flex justify-between items-center shadow-lg px-4 sm:px-6">
                <button 
                    onClick={toggleLimit}
                    className="h-8 sm:h-10 px-4 sm:px-6 rounded-full bg-[#49454f] text-[10px] sm:text-xs font-bold text-[#eaddff] transition-all hover:bg-[#4f378b]"
                >
                    {limit} pts
                </button>
                
                <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-[#ffd700] sm:size-5" />
                    <span className="font-bold text-[#e6e1e5] tracking-widest text-[10px] sm:text-xs uppercase">Truco Counter</span>
                </div>

                <button 
                    onClick={reset}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#49454f] flex items-center justify-center text-[#cac4d0] hover:text-[#ffb4ab]"
                >
                    <RotateCcw size={16} />
                </button>
             </div>

             {/* Score Board Card - More Compact */}
             <div className="bg-[#2b2930] rounded-[32px] sm:rounded-[48px] overflow-hidden flex shadow-2xl min-h-[420px] sm:min-h-[500px]">
                
                {/* Team A */}
                <div className="flex-1 flex flex-col border-r border-[#49454f]">
                    <div className="p-4 sm:p-6 text-center bg-[#332f37]">
                        <h3 className="text-[10px] font-bold text-[#d0bcfe] uppercase tracking-[0.2em] mb-1">Team A</h3>
                        <div className="text-4xl sm:text-5xl font-light text-[#e6e1e5]">{scoreA}</div>
                    </div>
                    
                    <div className="flex-1 p-4 sm:p-8 flex flex-col items-center justify-start overflow-y-auto no-scrollbar">
                         {renderPoints(scoreA, "stroke-[#d0bcfe]")}
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 bg-[#332f37]">
                        <button 
                            onClick={() => changeScore('A', 1)}
                            className="w-full h-12 sm:h-14 rounded-[18px] sm:rounded-[24px] bg-[#d0bcfe] text-[#381e72] flex items-center justify-center shadow-md active:scale-95"
                        >
                            <Plus size={28} />
                        </button>
                        <button 
                            onClick={() => changeScore('A', -1)}
                            className="w-full h-10 rounded-[18px] sm:rounded-[24px] bg-[#49454f] text-[#cac4d0] flex items-center justify-center active:scale-95"
                        >
                            <Minus size={20} />
                        </button>
                    </div>
                </div>

                {/* Team B */}
                <div className="flex-1 flex flex-col">
                    <div className="p-4 sm:p-6 text-center bg-[#332f37]">
                        <h3 className="text-[10px] font-bold text-[#b2f2bb] uppercase tracking-[0.2em] mb-1">Team B</h3>
                        <div className="text-4xl sm:text-5xl font-light text-[#e6e1e5]">{scoreB}</div>
                    </div>
                    
                    <div className="flex-1 p-4 sm:p-8 flex flex-col items-center justify-start overflow-y-auto no-scrollbar">
                         {renderPoints(scoreB, "stroke-[#b2f2bb]")}
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 bg-[#332f37]">
                        <button 
                            onClick={() => changeScore('B', 1)}
                            className="w-full h-12 sm:h-14 rounded-[18px] sm:rounded-[24px] bg-[#b2f2bb] text-[#00391c] flex items-center justify-center shadow-md active:scale-95"
                        >
                            <Plus size={28} />
                        </button>
                        <button 
                            onClick={() => changeScore('B', -1)}
                            className="w-full h-10 rounded-[18px] sm:rounded-[24px] bg-[#49454f] text-[#cac4d0] flex items-center justify-center active:scale-95"
                        >
                            <Minus size={20} />
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};
