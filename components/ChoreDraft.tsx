import React, { useState } from 'react';
import { USERS, CHORES } from '../constants';
import { Check, TriangleAlert, Dice5, X, Loader2 } from 'lucide-react';
import { User, Chore } from '../types';

export const ChoreDraft: React.FC = () => {
    const [selectedChoreId, setSelectedChoreId] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [flaggedUserIds, setFlaggedUserIds] = useState<Set<string>>(new Set());
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [result, setResult] = useState<{ user: User; chore: Chore; chance: string } | null>(null);

    const toggleUser = (id: string) => {
        const newSet = new Set(selectedUserIds);
        if (newSet.has(id)) {
            newSet.delete(id);
            // If removed, also remove flag
            const newFlags = new Set(flaggedUserIds);
            newFlags.delete(id);
            setFlaggedUserIds(newFlags);
        } else {
            newSet.add(id);
        }
        setSelectedUserIds(newSet);
    };

    const toggleFlag = (id: string) => {
        if (!selectedUserIds.has(id)) return;
        const newFlags = new Set(flaggedUserIds);
        if (newFlags.has(id)) newFlags.delete(id);
        else newFlags.add(id);
        setFlaggedUserIds(newFlags);
    };

    const handleRunDraft = () => {
        if (!selectedChoreId || selectedUserIds.size === 0) return;

        setShowModal(true);
        setIsThinking(true);
        setResult(null);

        // Logic
        const participants = Array.from(selectedUserIds).map(id => {
            const user = USERS.find(u => u.id === id)!;
            const isFlagged = flaggedUserIds.has(id);
            // Flagged = 10 Faltas = 50% weight (less likely to be picked? 
            // The prompt says "10 Faltas (50%)" and previous logic used 0.5 weight for flagged. 
            // Wait, usually draft picks the LOSER (who does the chore). 
            // If I have 10 Faltas, I should be MORE likely to be picked. 
            // BUT, the prompt's provided App 2 implementation specifically used: `weight = isFlagged ? 0.5 : 1.0`.
            // And then selected winner via `random < p.weight`.
            // This means flagged people are LESS likely to be picked.
            // I will STRICTLY follow the provided logic from the prompt's HTML file to ensure "functionalities exactly the same".
            const weight = isFlagged ? 0.5 : 1.0;
            return { user, weight, isFlagged };
        });

        const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        let winner = participants[participants.length - 1];

        for (const p of participants) {
            if (random < p.weight) {
                winner = p;
                break;
            }
            random -= p.weight;
        }

        const chance = ((winner.weight / totalWeight) * 100).toFixed(1);
        const chore = CHORES.find(c => c.id === selectedChoreId)!;

        // Artificial delay
        setTimeout(() => {
            setIsThinking(false);
            setResult({ user: winner.user, chore, chance });
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">DRAFT 2026</h1>
                <p className="text-slate-400 text-xs uppercase tracking-widest">Coexistence Code &bull; Art. 22 BIS</p>
            </div>

            {/* 1. Select Chore */}
            <section>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">1. Select Chore</h2>
                <div className="grid grid-cols-1 gap-3">
                    {CHORES.map(chore => {
                        const isSelected = selectedChoreId === chore.id;
                        return (
                            <div 
                                key={chore.id}
                                onClick={() => setSelectedChoreId(chore.id)}
                                className={`
                                    cursor-pointer glass-panel p-4 rounded-xl flex items-center justify-between transition-all duration-200
                                    ${isSelected ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'hover:bg-slate-800/50 border-slate-700'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                        <chore.Icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-200">{chore.name}</h3>
                                        <p className="text-xs text-slate-400">Compensation: <span className="text-emerald-400 font-bold">{chore.value} Faltas</span></p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'}`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 2. Select People */}
            <section>
                <div className="flex justify-between items-end mb-3 px-1">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Volunteers</h2>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <TriangleAlert size={10} className="text-rose-500" /> = 10 Faltas (50%)
                    </span>
                </div>
                
                <div className="space-y-2">
                    {USERS.map(user => {
                        const isSelected = selectedUserIds.has(user.id);
                        const isFlagged = flaggedUserIds.has(user.id);

                        return (
                            <div key={user.id} className="flex items-center gap-2">
                                {/* Name Card */}
                                <div 
                                    onClick={() => toggleUser(user.id)}
                                    className={`
                                        flex-1 cursor-pointer glass-panel p-3 rounded-xl border flex items-center justify-between transition-all duration-200
                                        ${isSelected ? 'bg-emerald-600 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-700 hover:bg-slate-800/50'}
                                    `}
                                >
                                    <span className={`font-medium ${isSelected ? 'text-white font-bold' : 'text-slate-400'}`}>
                                        {user.name}
                                    </span>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-white bg-white text-emerald-600' : 'border-slate-600'}`}>
                                        {isSelected && <Check size={12} strokeWidth={4} />}
                                    </div>
                                </div>

                                {/* Flag Toggle */}
                                <button 
                                    onClick={() => toggleFlag(user.id)}
                                    disabled={!isSelected}
                                    className={`
                                        w-12 h-[50px] rounded-xl border flex items-center justify-center transition-all
                                        ${isFlagged 
                                            ? 'bg-rose-500 text-white border-rose-500' 
                                            : !isSelected 
                                                ? 'bg-slate-800/50 border-slate-700 text-slate-600 cursor-not-allowed opacity-50'
                                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-rose-400'
                                        }
                                    `}
                                >
                                    <TriangleAlert size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-center z-40">
                <button 
                    onClick={handleRunDraft}
                    disabled={!selectedChoreId || selectedUserIds.size === 0}
                    className="w-full max-w-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:bg-slate-800"
                >
                    <span>START DRAFT</span>
                    <Dice5 size={20} />
                </button>
            </div>

            {/* Result Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-800 border border-slate-600 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative overflow-hidden animate-scale-up">
                        
                        {/* Background Confetti Pattern */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>

                        {isThinking ? (
                            <div className="py-10 text-center">
                                <Loader2 size={48} className="mx-auto text-emerald-500 animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-white">Calculating...</h3>
                                <p className="text-slate-400 text-sm mt-2">Analyzing penalties...</p>
                            </div>
                        ) : result ? (
                            <div className="text-center relative z-10">
                                <div className="mb-2 text-slate-400 text-xs uppercase tracking-wide">Designated Responsible</div>
                                
                                <div className={`text-5xl font-black mb-4 py-2 animate-bounce-slow text-transparent bg-clip-text bg-gradient-to-r ${flaggedUserIds.has(result.user.id) ? 'from-rose-400 to-orange-400' : 'from-emerald-400 to-blue-400'}`}>
                                    {result.user.name.toUpperCase()}
                                </div>
                                
                                <div className="text-lg text-white font-medium mb-6 bg-slate-700/50 py-2 px-4 rounded-lg inline-block border border-slate-600">
                                    {result.chore.name}
                                </div>
                                
                                <div className="bg-slate-900/50 rounded-lg p-3 mb-6 text-sm text-slate-400 border border-slate-700/50">
                                    <div className="flex justify-between border-b border-slate-700 pb-2 mb-2">
                                        <span>Probability:</span>
                                        <span className="text-white font-mono">{result.chance}%</span>
                                    </div>
                                    <div className="text-xs text-left italic opacity-70">
                                        "Non-compliance will result in an increase in the number of FAULTS equivalent to the value." - Art. 22 BIS
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};