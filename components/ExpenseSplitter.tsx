import React, { useState, useEffect, useMemo } from 'react';
import { User, SplitMode, Settlement } from '../types';
import { USERS } from '../constants';
import { Check, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';

export const ExpenseSplitter: React.FC = () => {
    const [mode, setMode] = useState<SplitMode>('EQUAL');
    const [title, setTitle] = useState('');
    const [amounts, setAmounts] = useState<Record<string, number>>({});
    const [shares, setShares] = useState<Record<string, number>>({});
    const [splitting, setSplitting] = useState<Record<string, boolean>>(
        USERS.reduce((acc, user) => ({ ...acc, [user.id]: true }), {})
    );

    // Reset values when switching modes to avoid confusion (matching original app behavior)
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
        // Note: The original app cleared amounts if unchecked in Unequal mode.
        if (mode === 'UNEQUAL' && splitting[userId]) {
            setAmounts(prev => ({ ...prev, [userId]: 0 }));
            setShares(prev => ({ ...prev, [userId]: 0 }));
        }
    };

    const { settlements, totalSpent, totalConsumed, isValid, allocationStatus } = useMemo(() => {
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
            consumedSum = totalPaid; // In equal mode, we assume consumption matches payment perfectly
        } else {
            // UNEQUAL MODE
            consumedSum = USERS.reduce<number>((sum, u) => {
                return sum + (splitting[u.id] ? (shares[u.id] || 0) : 0);
            }, 0);
            
            USERS.forEach(u => {
                calculatedConsumption[u.id] = splitting[u.id] ? (shares[u.id] || 0) : 0;
            });

            // Validation (Paid must equal Consumed)
            const diff = totalPaid - consumedSum;
            if (Math.abs(diff) > 0.1) valid = false;
        }

        // Calculate Settlements
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

        let allocationStatus = { diff: 0, percent: 0, message: '', type: 'neutral' };
        if (mode === 'UNEQUAL') {
             const diff = totalPaid - consumedSum;
             let percent = 0;
             if (consumedSum > 0) percent = (totalPaid / consumedSum) * 100;
             else if (totalPaid > 0) percent = 100;

             if (Math.abs(diff) < 0.1) {
                 allocationStatus = { diff: 0, percent: 100, message: 'Balanced', type: 'success' };
             } else if (diff > 0) {
                 allocationStatus = { diff, percent: Math.min(percent, 100), message: `$${diff.toFixed(2)} over`, type: 'warning' };
             } else {
                 allocationStatus = { diff, percent: Math.min(percent, 100), message: `Missing $${Math.abs(diff).toFixed(2)}`, type: 'error' };
             }
        }

        return {
            settlements: results,
            totalSpent: totalPaid,
            totalConsumed: consumedSum,
            isValid: valid,
            allocationStatus
        };

    }, [amounts, shares, splitting, mode]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Input Section */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-indigo-400" />
                        Details
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${mode === 'EQUAL' ? 'text-slate-400' : 'text-indigo-400'}`}>
                            {mode === 'EQUAL' ? 'Equal Split' : 'Dutch Split'}
                        </span>
                        <button 
                            onClick={() => setMode(m => m === 'EQUAL' ? 'UNEQUAL' : 'EQUAL')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${mode === 'UNEQUAL' ? 'bg-indigo-600' : 'bg-slate-600'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${mode === 'UNEQUAL' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Saturday BBQ"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                        <div className="col-span-5">Member</div>
                        {mode === 'EQUAL' ? (
                            <>
                                <div className="col-span-4 text-right">Paid</div>
                                <div className="col-span-3 text-center">Split?</div>
                            </>
                        ) : (
                            <>
                                <div className="col-span-3 text-right text-indigo-400">Consumed</div>
                                <div className="col-span-3 text-right text-slate-400">Paid</div>
                                <div className="col-span-1 text-center">Inc?</div>
                            </>
                        )}
                    </div>

                    {/* User Rows */}
                    <div className="space-y-3">
                        {USERS.map(user => {
                            const isIncluded = splitting[user.id];
                            const paidVal = amounts[user.id] > 0 ? amounts[user.id] : '';
                            const consumedVal = shares[user.id] > 0 ? shares[user.id] : '';

                            return (
                                <div key={user.id} className={`grid grid-cols-12 gap-2 items-center group transition-opacity ${!isIncluded ? 'opacity-50' : 'opacity-100'}`}>
                                    {/* Name */}
                                    <div className={`${mode === 'EQUAL' ? 'col-span-5' : 'col-span-5'} flex items-center gap-3`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${user.colorBg} ${user.colorText} ${user.colorBorder}`}>
                                            <span className="text-xs font-bold">{user.name.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                        <span className="text-sm font-medium text-slate-300 truncate hidden sm:block">{user.name}</span>
                                        <span className="text-sm font-medium text-slate-300 truncate sm:hidden">{user.name.substring(0,3)}</span>
                                    </div>

                                    {mode === 'EQUAL' ? (
                                        <>
                                            <div className="col-span-4 relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="0"
                                                    value={paidVal}
                                                    onChange={(e) => handleAmountChange(user.id, e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 pl-6 pr-2 text-right text-sm font-mono text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-slate-700"
                                                />
                                            </div>
                                            <div className="col-span-3 flex justify-center">
                                                <button 
                                                    onClick={() => handleSplitToggle(user.id)}
                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isIncluded ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-transparent'}`}
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Consumed Input */}
                                            <div className="col-span-3 relative">
                                                <input 
                                                    type="number" min="0" placeholder="0"
                                                    disabled={!isIncluded}
                                                    value={consumedVal}
                                                    onChange={(e) => handleShareChange(user.id, e.target.value)}
                                                    className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded-md py-1.5 px-1 text-right text-sm font-mono text-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-indigo-900/50 disabled:opacity-50"
                                                />
                                            </div>
                                            {/* Paid Input */}
                                            <div className="col-span-3 relative">
                                                <input 
                                                    type="number" min="0" placeholder="0"
                                                    disabled={!isIncluded}
                                                    value={paidVal}
                                                    onChange={(e) => handleAmountChange(user.id, e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-1 text-right text-sm font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-slate-700 disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button 
                                                    onClick={() => handleSplitToggle(user.id)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isIncluded ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-transparent'}`}
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Unequal Tools */}
                    {mode === 'UNEQUAL' && (
                        <div className={`mt-6 p-4 rounded-xl border ${allocationStatus.type === 'success' ? 'bg-emerald-900/20 border-emerald-900/50' : allocationStatus.type === 'warning' ? 'bg-yellow-900/20 border-yellow-900/50' : 'bg-rose-900/20 border-rose-900/50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-bold uppercase tracking-wide ${allocationStatus.type === 'success' ? 'text-emerald-400' : allocationStatus.type === 'warning' ? 'text-yellow-400' : 'text-rose-400'}`}>
                                    Allocation Status
                                </span>
                                <span className="font-mono text-sm font-bold text-slate-300">{allocationStatus.message}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 mb-1 overflow-hidden">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${allocationStatus.type === 'success' ? 'bg-emerald-500' : allocationStatus.type === 'warning' ? 'bg-yellow-500' : 'bg-rose-500'}`} 
                                    style={{ width: `${allocationStatus.percent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-dashed border-slate-700 flex justify-between items-center">
                        <span className="font-bold text-slate-500 text-sm">TOTAL {mode === 'EQUAL' ? 'SPENT' : 'BILL'}</span>
                        <span className="font-mono text-xl font-bold text-white">${(mode === 'EQUAL' ? totalSpent : totalConsumed).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="bg-slate-800/50 px-6 py-5 border-b border-slate-700/50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-200 text-lg">{title.trim() || 'Settlements'}</h2>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                        {isValid ? settlements.length : 'Error'} Payments
                    </span>
                </div>

                <div className="p-6 bg-slate-900/30">
                    {!isValid && mode === 'UNEQUAL' ? (
                        <div className="text-center py-8 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                            <p className="font-bold text-rose-400">Amounts don't match!</p>
                            <p className="text-xs mt-1 text-rose-300/70">Total Consumed must equal Total Paid.</p>
                        </div>
                    ) : settlements.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-sm">
                            <p>Enter amounts above to generate a split.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {settlements.map((s, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${s.from.colorBg} ${s.from.colorText} ${s.from.colorBorder}`}>
                                                <span className="text-xs font-bold">{s.from.name.substring(0,2).toUpperCase()}</span>
                                            </div>
                                            <div className="absolute -right-1 -bottom-1 bg-slate-800 rounded-full p-0.5 border border-slate-700">
                                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-300">
                                            <span className="font-bold text-white">{s.from.name}</span> pays <span className="font-bold text-white">{s.to.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-emerald-400">${s.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Per Person Summary (Equal Mode Only) */}
                    {mode === 'EQUAL' && totalSpent > 0 && settlements.length >= 0 && (
                        <div className="mt-5 bg-slate-950/50 rounded-xl p-4 flex justify-between items-center border border-slate-800">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-400 font-medium text-sm">Per person</span>
                            </div>
                            <span className="text-slate-200 font-bold font-mono text-lg">
                                ${(totalSpent / USERS.filter(u => splitting[u.id]).length).toFixed(2)}
                            </span>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};