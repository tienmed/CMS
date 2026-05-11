'use client';

import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { AIInsight } from '@/services/AIService';
import { MaintenancePrediction } from '@/services/MaintenanceService';

interface MaintenanceInsightProps {
    insight: AIInsight;
    totalCritical: number;
}

const MaintenanceInsight: React.FC<MaintenanceInsightProps> = ({ insight, totalCritical }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
            {/* Header with AI Brand */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-purple-200">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">AI Predictive Insight</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by {insight.model}</p>
                    </div>
                </div>
                {totalCritical > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-[11px] font-black text-red-600 uppercase tracking-tighter">{totalCritical} Rủi ro cao</span>
                    </div>
                )}
            </div>

            {/* AI Content */}
            <div className="p-6">
                <div className="prose prose-sm max-w-none">
                    <div className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                        {insight.content}
                    </div>
                </div>
                
                {/* Action Footer */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
                    <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors flex items-center gap-2 group">
                        Chi tiết bảo trì
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
        </div>
    );
};

export default MaintenanceInsight;
