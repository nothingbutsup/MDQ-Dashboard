import React, { useState } from 'react';
import { USERS, CHORES } from '../constants';
import { Check, TriangleAlert, Dice5, X, Loader2 } from 'lucide-react';
import { User, Chore } from '../types';

interface ChoreDraftProps {
    isSidebarOpen: boolean;
}

export const ChoreDraft: React.FC<ChoreDraftProps> = ({ isSidebarOpen }) => {
    const [selectedChoreId, setSelectedChoreId] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [flaggedUserIds, setFlaggedUserIds] = useState<Set<string>>(new Set());
    
    const [showModal, setShowModal] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [result, setResult] = useState<{ user: User; chore: Chore; chance: string } | null>(null);

    const toggleUser = (id: string) => {
        const newSet = new Set(selectedUserIds);
        if (newSet.has(id)) {
            newSet.delete(id);
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

        const participants = Array.from(selectedUserIds).map(id => {
            const user = USERS.find(u => u.id === id)!;
            const isFlagged = flaggedUserIds.has(id);
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

        setTimeout(() => {
            setIsThinking(false);
            setResult({ user: winner.user, chore, chance });
        }, 1500);
    };

    return (
        <div className="animate-fade-in pb-24 sm:pb-32 max-w-xl mx-auto flex flex-col gap-6 sm:gap-8">
            {/* Chore Selection */}
            <section>
                <h2 className="text-[10px] sm:text-xs font-bold text-[#cac4d0] uppercase tracking-widest mb-3 sm:mb-4 px-2">1. The Mission</h2>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                    {CHORES.map(chore => {
                        const isSelected = selectedChoreId === chore.id;
                        return (
                            <div 
                                key={chore.id}
                                onClick={() => setSelectedChoreId(chore.id)}
                                className={`
                                    cursor-pointer p-3 sm:p-5 rounded-2xl sm:rounded-[28px] flex items-center justify-between transition-all duration-200 shadow-sm
                                    ${isSelected ? 'bg-[#4f378b] text-[#eaddff]' : 'bg-[#2b2930] hover:bg-[#332f37] border border-transparent'}
                                `}
                            >
                                <div className="flex items-center gap-3 sm:gap-5">
                                    <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${isSelected ? 'bg-[#eaddff] text-[#381e72]' : 'bg-[#49454f] text-[#cac4d0]'}`}>
                                        <chore.Icon className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base leading-tight">{chore.name}</h3>
                                        <p className={`text-[9px] sm:text-xs ${isSelected ? 'text-[#eaddff]/80' : 'text-[#cac4d0]'}`}>Value: {Math.abs(chore.value)} Faltas</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#eaddff] bg-[#eaddff]' : 'border-[#49454f]'}`}>
                                    {isSelected && <Check size={12} className="text-[#381e72] sm:w-3.5 sm:h-3.5" strokeWidth={4} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* User Selection */}
            <section className="mb-4">
                <div className="flex justify-between items-end mb-3 sm:mb-4 px-2">
                    <h2 className="text-[10px] sm:text-xs font-bold text-[#cac4d0] uppercase tracking-widest">2. Candidates</h2>
                    <span className="text-[9px] sm:text-[10px] text-[#49454f] font-bold flex items-center gap-1">
                        <TriangleAlert size={10} className="text-[#ffb4ab] sm:size-3" /> = PENALTY
                    </span>
                </div>
                
                <div className="space-y-2.5 sm:space-y-3">
                    {USERS.map(user => {
                        const isSelected = selectedUserIds.has(user.id);
                        const isFlagged = flaggedUserIds.has(user.id);

                        return (
                            <div key={user.id} className="flex items-center gap-2.5 sm:gap-3">
                                <div 
                                    onClick={() => toggleUser(user.id)}
                                    className={`
                                        flex-1 cursor-pointer p-3 sm:p-4 rounded-xl sm:rounded-[28px] flex items-center justify-between transition-all duration-200 shadow-sm
                                        ${isSelected ? 'bg-[#4f378b] text-[#eaddff]' : 'bg-[#2b2930] hover:bg-[#332f37]'}
                                    `}
                                >
                                    <span className="font-bold text-sm tracking-wide">{user.name}</span>
                                    <div className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#eaddff] border-[#eaddff] text-[#381e72]' : 'border-[#49454f]'}`}>
                                        {isSelected && <Check size={12} className="sm:size-[14px]" strokeWidth={4} />}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => toggleFlag(user.id)}
                                    disabled={!isSelected}
                                    className={`
                                        w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shadow-md shrink-0
                                        ${isFlagged 
                                            ? 'bg-[#8c1d18] text-[#f2b8b5]' 
                                            : !isSelected 
                                                ? 'bg-[#1c1b1f] text-[#49454f] cursor-not-allowed border border-[#49454f]'
                                                : 'bg-[#49454f] text-[#cac4d0] hover:text-[#ffb4ab]'
                                        }
                                    `}
                                >
                                    <TriangleAlert size={18} className="sm:size-[22px]" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Action Bar - Fixed Position centering with Sidebar consideration */}
            <div 
                className={`
                    fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40 transition-all duration-300
                    ${isSidebarOpen ? 'lg:ml-[160px]' : 'lg:ml-0'}
                `}
            >
                <button 
                    onClick={handleRunDraft}
                    disabled={!selectedChoreId || selectedUserIds.size === 0}
                    className="w-full bg-[#d0bcfe] hover:bg-[#eaddff] text-[#381e72] font-bold py-4 sm:py-5 px-8 rounded-[24px] sm:rounded-[28px] shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3 border border-[#381e72]/10"
                >
                    <Dice5 size={22} className="sm:size-6" />
                    <span className="tracking-widest uppercase text-sm sm:text-base">Start Draft</span>
                </button>
            </div>

            {/* Material Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#2b2930] w-full max-w-sm p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl animate-scale-up relative">
                        {isThinking ? (
                            <div className="py-8 sm:py-12 text-center">
                                <Loader2 size={48} className="mx-auto text-[#d0bcfe] animate-spin mb-6 sm:size-14" />
                                <h3 className="text-xl sm:text-2xl font-normal text-[#e6e1e5]">Processing...</h3>
                                <p className="text-[#cac4d0] text-xs sm:text-sm mt-3 font-mono">Running simulation</p>
                            </div>
                        ) : result ? (
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-[#d0bcfe] uppercase tracking-[0.3em] block mb-3 sm:mb-4">Result</span>
                                
                                <div className="mb-4 sm:mb-6">
                                    <div className="text-4xl sm:text-5xl font-normal text-[#e6e1e5] mb-1 sm:mb-2">{result.user.name}</div>
                                    <div className="text-xs sm:text-sm font-medium text-[#cac4d0] uppercase tracking-widest">{result.chore.name}</div>
                                </div>
                                
                                <div className="bg-[#1c1b1f] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#49454f]">
                                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                                        <span className="text-[10px] sm:text-xs text-[#cac4d0] font-bold uppercase">Odd of Pick</span>
                                        <span className="text-lg sm:text-xl font-mono text-[#d0bcfe]">{result.chance}%</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-[#cac4d0] leading-relaxed italic text-left">
                                        Per Art. 22 BIS: Failure to perform assigned chores doubles the initial penalty.
                                    </p>
                                </div>

                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-[#49454f] hover:bg-[#4f378b] text-[#eaddff] font-bold py-3.5 sm:py-4 rounded-full transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};