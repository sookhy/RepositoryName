import React, { useState, useEffect } from 'react';
import { JournalEntry, AnalysisResult } from '../types';
import { analyzeJournalEntries } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, TrendingUp, Quote, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface InsightsViewProps {
  entries: JournalEntry[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ entries }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeJournalEntries(entries);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically analyze if entries exist and we don't have data yet
  // But to save API calls on navigation, let's make it manual or persisted (manual for now)

  if (entries.length < 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-indigo-50 text-indigo-500 p-4 rounded-full mb-4">
          <BarChart3 size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Need more data</h3>
        <p className="text-slate-500">Write at least 3 journal entries to unlock AI-powered insights.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 pb-24 max-w-lg mx-auto w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Insights</h2>
          <p className="text-slate-500 text-sm">Powered by Gemini</p>
        </div>
        {!analysis && (
          <Button 
            size="sm" 
            onClick={handleAnalyze} 
            isLoading={isLoading}
            className="text-sm px-4 py-2"
          >
            Analyze Now
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
          {error}
          <button onClick={handleAnalyze} className="ml-2 underline font-semibold">Retry</button>
        </div>
      )}

      {!analysis && !isLoading && !error && (
         <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 mb-6 text-center">
           <Sparkles className="mx-auto mb-3 opacity-80" size={32} />
           <h3 className="font-bold text-lg mb-2">Discover Your Patterns</h3>
           <p className="text-indigo-100 text-sm mb-4">
             Let AI analyze your recent entries to detect mood trends and offer personalized advice.
           </p>
           <Button variant="secondary" onClick={handleAnalyze} fullWidth className="text-indigo-600 border-none">
             Generate Insights
           </Button>
         </div>
      )}

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        </div>
      )}

      {analysis && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Vibe Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Current Vibe</span>
            </div>
            <h3 className="text-3xl font-bold capitalize">{analysis.overallVibe}</h3>
          </div>

          {/* Mood Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-6 text-slate-500">
              <TrendingUp size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Mood Trend</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.moodTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 10, fill: '#94a3b8'}} 
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{color: '#4f46e5', fontWeight: 'bold'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Themes */}
          <div className="grid grid-cols-3 gap-3">
            {analysis.topThemes.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center aspect-square">
                 <div className="text-2xl font-bold text-slate-800 mb-1">{item.count}</div>
                 <div className="text-xs text-slate-500 capitalize leading-tight">{item.theme}</div>
              </div>
            ))}
          </div>

          {/* Advice */}
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-orange-600">
              <Quote size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Reflection</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-sm italic">
              "{analysis.personalizedAdvice}"
            </p>
          </div>

           <Button variant="secondary" fullWidth onClick={handleAnalyze} className="mt-4 text-sm">
             Refresh Analysis
           </Button>
        </div>
      )}
    </div>
  );
};
