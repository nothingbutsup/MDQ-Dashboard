import React from 'react';

export const ApartmentMap: React.FC = () => {
    return (
        <div className="space-y-4 animate-fade-in">
             <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl w-full aspect-[4/5] md:aspect-[4/3] relative border border-slate-700/50">
                <iframe
                    src="https://www.google.com/maps/d/u/1/embed?mid=1l8C46K5CJ0OExq1oddvQq0IMRS7L9cY&ehbc=2E312F&noprof=1"
                    className="w-full border-0 absolute left-0"
                    style={{ 
                        height: 'calc(100% + 64px)', 
                        top: '-64px' 
                    }}
                    title="Apartment Map"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Interactive Area Map
                </p>
            </div>
        </div>
    );
};