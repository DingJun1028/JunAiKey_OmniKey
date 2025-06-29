```typescript
// src/pages/Analytics.tsx
// Analytics Page
// Displays calculated KPIs for the user.
// --- New: Add UI for viewing KPIs with timeframe selection ---

import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../modules/analytics/AnalyticsService';
import { BarChart2, CheckCircle, XCircle, Zap, BookKey, Code, Target, Info, Loader2 } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const analyticsService: AnalyticsService = window.systemContext?.analyticsService; // The Analytics (\u5206\u6790\u670d\u52d9) module
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser

// Define available timeframes
const TIMEFRAMES = ['day', 'week', 'month', 'all'] as const;
type Timeframe = typeof TIMEFRAMES[number];

const Analytics: React.FC = () => {
  const [kpis, setKpis] = useState<any>(null); // State to hold calculated KPIs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('month'); // Default timeframe


  const fetchKPIs = async (timeframe: Timeframe) => {
       const userId = systemContext?.currentUser?.id;
       if (!analyticsService || !userId) {
            setError("AnalyticsService module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null);
      try {
          // Fetch KPIs for the current user and selected timeframe
          const calculatedKpis = await analyticsService.calculateKPIs(timeframe, userId); // Pass userId and timeframe
          setKpis(calculatedKpis);
      } catch (err: any) {
          console.error('Error fetching KPIs:', err);
          setError(`Failed to load KPIs: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes or timeframe changes
    if (systemContext?.currentUser?.id) {
        fetchKPIs(selectedTimeframe); // Fetch KPIs on initial load and timeframe change
    }

    // TODO: Subscribe to relevant events (e.g., task_completed, rune_action_executed) to potentially trigger KPI recalculation or updates
    // analyticsService?.context?.eventBus?.subscribe('task_completed', () => fetchKPIs(selectedTimeframe));
    // analyticsService?.context?.eventBus?.subscribe('rune_action_executed', () => fetchKPIs(selectedTimeframe));


    // return () => {
    //     // Unsubscribe on component unmount
    //     // unsubscribe from events
    // };

  }, [systemContext?.currentUser?.id, analyticsService, selectedTimeframe]); // Re-run effect when user ID, service, or timeframe changes


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your analytics.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Analytics (\u5206\u6790\u670d\u52d9)</h2>
        <p className="text-neutral-300 mb-8">View key performance indicators (KPIs) for your Jun.Ai.Key usage.</p>

        {/* Timeframe Selection */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg flex items-center gap-4">
            <h3 className="text-xl font-semibold text-blue-300">Timeframe:</h3>
            <select
                className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as Timeframe)}
                disabled={loading}
            >
                {TIMEFRAMES.map(tf => (
                    <option key={tf} value={tf}>{tf.charAt(0).toUpperCase() + tf.slice(1)}</option>
                ))}
            </select>
             {loading && <Loader2 size={20} className="animate-spin text-blue-400"/>}
        </div>


        {/* KPI Display */}
        {error ? (
             <p className="text-red-400">Error: {error}</p>
        ) : kpis ? (
             <div className="p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Key Performance Indicators ({kpis.timeframe.charAt(0).toUpperCase() + kpis.timeframe.slice(1)})</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* Task Completion Rate */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-green-500">
                         <div className="flex items-center gap-2 mb-2">
                             <CheckCircle size={20} className="text-green-400"/>
                             <h4 className="font-semibold text-green-200">Task Completion Rate</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.taskCompletionRate}%</p>
                         <p className="text-neutral-400 text-sm mt-1">({kpis.totalTasksCompleted} completed out of {kpis.totalTasksStarted} started)</p>
                     </div>

                     {/* Rune Execution Success Rate */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-cyan-500">
                         <div className="flex items-center gap-2 mb-2">
                             <Zap size={20} className="text-cyan-400"/>
                             <h4 className="font-semibold text-cyan-200">Rune Execution Success Rate</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.runeExecutionSuccessRate}%</p>
                         <p className="text-neutral-400 text-sm mt-1">({kpis.successfulRuneExecutions} successful out of {kpis.totalRuneExecutions} total)</p>
                     </div>

                     {/* System Error Rate */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-red-500">
                         <div className="flex items-center gap-2 mb-2">
                             <XCircle size={20} className="text-red-400"/>
                             <h4 className="font-semibold text-red-200">System Error Rate</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.systemErrorRate}%</p>
                         <p className="text-neutral-400 text-sm mt-1">(Based on system events severity)</p>
                     </div>

                     {/* Average Task Duration */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-blue-500">
                         <div className="flex items-center gap-2 mb-2">
                             <BarChart2 size={20} className="text-blue-400"/>
                             <h4 className="font-semibold text-blue-200">Avg Task Duration</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.averageTaskDuration}s</p>
                         <p className="text-neutral-400 text-sm mt-1">(For completed tasks)</p>
                     </div>

                     {/* Knowledge Records Added */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-orange-500">
                         <div className="flex items-center gap-2 mb-2">
                             <BookKey size={20} className="text-orange-400"/>
                             <h4 className="font-semibold text-orange-200">Knowledge Records Added</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.knowledgeRecordsAdded}</p>
                         <p className="text-neutral-400 text-sm mt-1">(Manual or AI-generated)</p>
                     </div>

                     {/* Abilities Forged */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-purple-500">
                         <div className="flex items-center gap-2 mb-2">
                             <Code size={20} className="text-purple-400"/>
                             <h4 className="font-semibold text-purple-200">Abilities Forged</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.forgedAbilities}</p>
                         <p className="text-neutral-400 text-sm mt-1">(Manually or AI-forged)</p>
                     </div>

                     {/* Goals Created */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-yellow-500">
                         <div className="flex items-center gap-2 mb-2">
                             <Target size={20} className="text-yellow-400"/>
                             <h4 className="font-semibold text-yellow-200">Goals Created</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.createdGoals}</p>
                         <p className="text-neutral-400 text-sm mt-1">(SMART or OKR)</p>
                     </div>

                     {/* Goal Completion Rate */}
                     <div className="p-4 bg-neutral-600/50 rounded-md border-l-4 border-teal-500">
                         <div className="flex items-center gap-2 mb-2">
                             <CheckCircle size={20} className="text-teal-400"/>
                             <h4 className="font-semibold text-teal-200">Goal Completion Rate</h4>
                         </div>
                         <p className="text-neutral-300 text-2xl font-bold">{kpis.goalCompletionRate}%</p>
                         <p className="text-neutral-400 text-sm mt-1">(For goals created in timeframe)</p>
                     </div>

                     {/* TODO: Add more KPIs */}
                     {/* Example: Automation Rate, Feature Usage, Sync Success Rate */}

                 </div>
             </div>
        ) : (
             !loading && <p className="text-neutral-400">No KPI data available for the selected timeframe.</p>
        )}

      </div>
    </div>
  );
};

export default Analytics;
```