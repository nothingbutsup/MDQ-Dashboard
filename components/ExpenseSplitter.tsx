import React, { useState, useEffect, useMemo } from 'react';
import { User, SplitMode, Settlement } from '../types';
import { USERS } from '../constants';
import { Check, Receipt } from 'lucide-react';

export const ExpenseSplitter: React.FC = () => {
    const [mode, setMode] = useState<SplitMode>('EQUAL');
    const [title, setTitle] = useState('');
    const [amounts, setAmounts] = useState<Record<string, number>>({});
    const [shares, setShares] = useState<Record<string, number>>({});
    const [splitting, setSplitting] = useState<Record<string, boolean>>(
        USERS.reduce((acc, user) => ({ ...acc, [user.id]: true }), {})
    );

    useEffect(() => {
        setAmounts({});
        setShares({});
    }, [mode]);

    const handleAmountChange = (userId: string, val: string) => {
        setAmounts(prev => ({ ...prev, [userId]: parseFloat(val) || 0 }));
    };

    const handleShareChange = (userId: string, val: string) => {
        setShares(prev => ({ ...prev, [userId]: parseFloat(val) || 0 }));
    };

    const handleSplitToggle = (userId: string) => {
        setSplitting(prev => {
            const newState = { ...prev, [userId]: !prev[userId] };
            return newState;
        });
        if (mode === 'UNEQUAL' && splitting[userId]) {
            setAmounts(prev => ({ ...prev, [userId]: 0 }));
            setShares(prev => ({ ...prev, [userId]: 0 }));
        }
    };

    const { settlements, totalConsumed, isValid, allocationStatus } = useMemo(() => {
        const totalPaid = (Object.values(amounts) as number[]).reduce((a, b) => a + b, 0);
        let calculatedConsumption: Record<string, number> = {};
        let valid = true;
        let consumedSum = 0;

        if (mode === 'EQUAL') {
            const splitters = USERS.filter(u => splitting[u.id]);
            const splitCount = splitters.length;
            const fairShare = splitCount > 0 ? totalPaid / splitCount : 0;
            
            USERS.forEach(u => {
                calculatedConsumption[u.id] = splitting[u.id] ? fairShare : 0;
            });
            consumedSum = totalPaid;
        } else {
            consumedSum = USERS.reduce<number>((sum, u) => {
                return sum + (splitting[u.id] ? (shares[u.id] || 0) : 0);
            }, 0);
            
            USERS.forEach(u => {
                calculatedConsumption[u.id] = splitting[u.id] ? (shares[u.id] || 0) : 0;
            });

            const diff = totalPaid - consumedSum;
            if (Math.abs(diff) > 0.1) valid = false;
        }

        const balancesMap: Record<string, number> = {};
        USERS.forEach(u => balancesMap[u.id] = 0);

        USERS.forEach(u => {
            const paid = amounts[u.id] || 0;
            const consumed = calculatedConsumption[u.id] || 0;
            balancesMap[u.id] += (paid - consumed);
        });

        const activeBalances = USERS.map(u => ({
            user: u,
            balance: balancesMap[u.id]
        })).filter(u => Math.abs(u.balance) > 0.01);

        const debtors = activeBalances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
        const creditors = activeBalances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);

        const results: Settlement[] = [];
        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            let amount = Math.min(Math.abs(debtor.balance), creditor.balance);
            amount = Math.round(amount * 100) / 100;

            if (amount > 0) {
                results.push({
                    from: debtor.user,
                    to: creditor.user,
                    amount: amount
                });
            }

            debtor.balance += amount;
            creditor.balance -= amount;

            if (Math.abs(debtor.balance) < 0.01) i++;
            if (Math.abs(creditor.balance) < 0.01) j++;
        }

        let allocStatus = { diff: 0, percent: 100, message: 'Balanced', type: 'success' };
        if (mode === 'UNEQUAL') {
            const diff = totalPaid - consumedSum;
            const percent = totalPaid > 0 ? (consumedSum / totalPaid) * 100 : 0;
            
            if (Math.abs(diff) < 0.1) {
                allocStatus = { diff: 0, percent: 100, message: 'Balanced', type: 'success' };
            } else if (diff > 0) {
                allocStatus = { diff, percent: Math.min(percent, 100), message: `$${diff.toFixed(2)} missing`, type: 'error' };
            } else {
                allocStatus = { diff, percent: 100, message: `$${Math.abs(diff).toFixed(2)} over`, type: 'warning' };
            }
        }

        return {
            settlements: results,
            totalConsumed: consumedSum,
            isValid: valid,
            allocationStatus: allocStatus
        };

    }, [amounts, shares, splitting, mode]);

    return (
        <div className="space-y-6 animate-fade-in max-w-lg mx-auto pb-12">
            {/* Input Card */}
            <div className="bg-[#2b2930] rounded-[32px] overflow-hidden shadow-md">
                <div className="px-6 py-4 border-b border-[#49454f] flex justify-between items-center bg-[#332f37]">
                    <h2 className="font-bold text-[#e6e1e5] text-lg flex items-center gap-3">
                        <Receipt className="w-6 h-6 text-[#d0bcfe]" />
                        New Expense
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] xs:text-xs font-bold text-[#cac4d0] uppercase tracking-wider">
                            {mode === 'EQUAL' ? 'Split Equal' : 'Dutch'}
                        </span>
                        <button 
                            onClick={() => setMode(m => m === 'EQUAL' ? 'UNEQUAL' : 'EQUAL')}
                            className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${mode === 'UNEQUAL' ? 'bg-[#d0bcfe]' : 'bg-[#49454f]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-[#1c1b1f] shadow-sm transition-transform duration-300 ${mode === 'UNEQUAL' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Material Text Field */}
                    <div className="relative group">
                        <label className="block text-xs font-bold text-[#d0bcfe] uppercase tracking-widest mb-2 px-1">Description</label>
                        <input 
                            type="text" 
                            placeholder="What did you buy?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#1c1b1f] border-b-2 border-[#49454f] focus:border-[#d0bcfe] px-3 py-4 text-base text-[#e6e1e5] placeholder-[#49454f] focus:outline-none transition-all rounded-t-lg"
                        />
                    </div>

                    {/* Member List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <span className="text-xs font-bold text-[#e6e1e5] uppercase tracking-widest opacity-90">Participants</span>
                            <div className="flex gap-4">
                                <span className="text-[9px] xs:text-[11px] text-white uppercase font-black w-20 xs:w-24 text-right">Paid</span>
                                {mode === 'UNEQUAL' && (
                                    <span className="text-[9px] xs:text-[11px] text-white uppercase font-black w-20 xs:w-24 text-right">Consumed</span>
                                )}
                            </div>
                        </div>
                        
                        {USERS.map(user => {
                            const isIncluded = splitting[user.id];
                            const paidVal = amounts[user.id] > 0 ? amounts[user.id] : '';
                            const consumedVal = shares[user.id] > 0 ? shares[user.id] : '';

                            return (
                                <div key={user.id} className="flex items-center gap-2 xs:gap-3 group">
                                    <div 
                                        onClick={() => handleSplitToggle(user.id)}
                                        className={`w-5 xs:w-6 h-5 xs:h-6 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${isIncluded ? 'bg-[#d0bcfe] border-[#d0bcfe] text-[#381e72]' : 'border-[#49454f] text-transparent'}`}
                                    >
                                        <Check className="w-3.5 xs:w-4 h-3.5 xs:h-4" strokeWidth={3} />
                                    </div>

                                    <div className="flex-grow flex items-center gap-2 min-w-0">
                                        <div className={`w-7 xs:w-8 h-7 xs:h-8 rounded-full flex items-center justify-center border shrink-0 ${user.colorBg} ${user.colorText} ${user.colorBorder}`}>
                                            <span className="text-[10px] xs:text-[11px] font-black">{user.name.substring(0, 1)}</span>
                                        </div>
                                        <span className={`text-xs xs:text-sm font-bold transition-colors truncate ${isIncluded ? 'text-[#e6e1e5]' : 'text-[#49454f]'}`}>{user.name}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
                                        <div className="w-20 xs:w-24 relative">
                                            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[#49454f] text-[9px] xs:text-[10px] font-bold">$</span>
                                            <input 
                                                type="number" min="0" placeholder="0"
                                                disabled={!isIncluded}
                                                value={paidVal}
                                                onChange={(e) => handleAmountChange(user.id, e.target.value)}
                                                className="w-full bg-[#1c1b1f] border border-[#49454f] focus:border-[#d0bcfe] rounded-lg py-1.5 xs:py-2 pl-3 xs:pl-4 pr-1 text-right text-xs xs:text-sm font-mono text-white focus:outline-none placeholder-[#49454f] disabled:opacity-30"
                                            />
                                        </div>
                                        {mode === 'UNEQUAL' && (
                                            <div className="w-20 xs:w-24 relative">
                                                <input 
                                                    type="number" min="0" placeholder="0"
                                                    disabled={!isIncluded}
                                                    value={consumedVal}
                                                    onChange={(e) => handleShareChange(user.id, e.target.value)}
                                                    className="w-full bg-[#1c1b1f] border border-[#49454f] focus:border-[#d0bcfe] rounded-lg py-1.5 xs:py-2 px-1 text-right text-xs xs:text-sm font-mono text-[#d0bcfe] focus:outline-none placeholder-[#49454f] disabled:opacity-30"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {mode === 'UNEQUAL' && (
                        <div className="pt-2 space-y-3">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest px-1">
                                <span className="text-[#cac4d0]">Progress</span>
                                <span className={`${allocationStatus.type === 'success' ? 'text-emerald-400' : allocationStatus.type === 'warning' ? 'text-yellow-400' : 'text-rose-400'}`}>
                                    {allocationStatus.message}
                                </span>
                            </div>
                            <div className="h-2 bg-[#1c1b1f] rounded-full overflow-hidden border border-[#49454f]">
                                <div 
                                    className={`h-full transition-all duration-500 rounded-full ${allocationStatus.type === 'success' ? 'bg-emerald-500' : allocationStatus.type === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`}
                                    style={{ width: `${allocationStatus.percent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-[#49454f] flex flex-col items-center">
                        <div className="text-center space-y-1">
                            <span className="block text-xs font-black text-[#cac4d0] uppercase tracking-[0.2em]">Total</span>
                            <span className="text-3xl xs:text-4xl font-light text-[#d0bcfe] tracking-tighter">${totalConsumed.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Card */}
            {settlements.length > 0 && isValid && (
                <div className="bg-[#4f378b] rounded-[32px] p-6 xs:p-8 shadow-lg animate-scale-up">
                    <h3 className="text-xl xs:text-2xl font-black text-[#eaddff] tracking-tighter mb-6 px-1 truncate">
                        {title.trim() ? title : "Settlements"}
                    </h3>
                    <div className="space-y-3">
                        {settlements.map((s, idx) => (
                            <div key={idx} className="flex flex-wrap items-center justify-between gap-3 bg-[#2b2930] p-4 rounded-2xl shadow-sm border border-transparent hover:border-[#d0bcfe]/20 transition-all">
                                <div className="flex items-center gap-3 xs:gap-4 min-w-0">
                                    <div className="flex -space-x-2 shrink-0">
                                        <div className={`w-8 xs:w-9 h-8 xs:h-9 rounded-full flex items-center justify-center border-2 border-[#2b2930] ${s.from.colorBg} ${s.from.colorText} ${s.from.colorBorder}`}>
                                            <span className="text-[9px] xs:text-[10px] font-black">{s.from.name.substring(0,1)}</span>
                                        </div>
                                        <div className={`w-8 xs:w-9 h-8 xs:h-9 rounded-full flex items-center justify-center border-2 border-[#2b2930] ${s.to.colorBg} ${s.to.colorText} ${s.to.colorBorder}`}>
                                            <span className="text-[9px] xs:text-[10px] font-black">{s.to.name.substring(0,1)}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs xs:text-sm min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2">
                                            <span className="text-[#eaddff] font-bold truncate">{s.from.name}</span>
                                            <span className="text-[#cac4d0] opacity-50 shrink-0">→</span>
                                            <span className="text-[#eaddff] font-bold truncate">{s.to.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-[#b2f2bb] text-sm xs:text-base whitespace-nowrap">${s.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
