// 繁中英碼, 矩陣圖說

import React, { useState, useEffect } from 'react';
import { EvolutionaryInsight, SystemContext } from '../interfaces';
import { Lightbulb, AlertTriangle, Wrench } from 'lucide-react'; // Using lucide-react for icons

// Access core modules from the global window object (for MVP simplicity)
declare const window: any;
const systemContext: SystemContext = window.systemContext;

// Mock data for demonstration purposes, matching the EvolutionaryInsight interface
const mockInsights: EvolutionaryInsight[] = [
  {
    id: 'insight-1',
    user_id: 'user-123',
    type: 'automation_opportunity',
    details: {
      pattern: ['git_add', 'git_commit', 'git_push'],
      suggestion: 'You frequently run a git sync sequence. Would you like to create a "Sync to Remote" script to automate this workflow?',
      actions: [{ label: 'Create Script', action: 'forge_ability', params: { name: 'Sync to Remote' } }]
    },
    timestamp: new Date().toISOString(),
    status: 'pending',
    dismissed: false,
  },
  {
    id: 'insight-2',
    user_id: 'user-123',
    type: 'task_failure_diagnosis',
    details: {
      taskId: 'task-abc',
      suggestion: 'A task failed because the API key for an external service was invalid. Please check your credentials in Settings.',
      actions: [{ label: 'Go to Settings', action: 'navigate', params: { path: '/settings/security' } }]
    },
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'pending',
    dismissed: false,
  },
  {
    id: 'insight-3',
    user_id: 'user-123',
    type: 'optimization_recommendation',
    details: {
      suggestion: 'Your knowledge base search performance can be improved by generating embeddings for new records. Enable automatic embedding?',
      actions: [{ label: 'Enable Auto-Embedding', action: 'update_setting', params: { setting: 'auto_embed', value: true } }]
    },
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'actioned',
    dismissed: false,
  }
];

const InsightIcon = ({ type }: { type: EvolutionaryInsight['type'] }) => {
  switch (type) {
    case 'automation_opportunity':
      return <Wrench className="h-6 w-6 text-cyan-400" />;
    case 'task_failure_diagnosis':
      return <AlertTriangle className="h-6 w-6 text-red-400" />;
    case 'optimization_recommendation':
    case 'skill_suggestion':
    default:
      return <Lightbulb className="h-6 w-6 text-yellow-400" />;
  }
};

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<EvolutionaryInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch this from your backend/database
        // e.g., const data = await systemContext.evolutionEngine.getPendingInsights();
        setInsights(mockInsights);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleAction = (insightId: string, action: any) => {
    console.log(`Action triggered for insight ${insightId}:`, action);
    // TODO: Call a service to execute the action, e.g., systemContext.junaiAssistant.processInput(...)
    setInsights(prev => prev.map(i => i.id === insightId ? { ...i, status: 'actioned' } : i));
  };

  const handleDismiss = (insightId: string) => {
    console.log(`Dismissing insight ${insightId}`);
    setInsights(prev => prev.map(i => i.id === insightId ? { ...i, status: 'dismissed' } : i));
  };

  if (loading) {
    return <div className="p-6 text-center text-neutral-400">Loading insights...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Evolutionary Insights</h1>
        <p className="text-neutral-400 mt-1">The system has learned from your actions and found opportunities for evolution.</p>
      </header>

      <div className="space-y-4">
        {insights.filter(i => i.status === 'pending').map(insight => (
          <div key={insight.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1"><InsightIcon type={insight.type} /></div>
              <div className="flex-grow"><p className="text-neutral-200">{insight.details.suggestion}</p><p className="text-xs text-neutral-500 mt-2">{new Date(insight.timestamp).toLocaleString()}</p></div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => handleDismiss(insight.id)} className="px-3 py-1 text-sm bg-neutral-700 hover:bg-neutral-600 rounded-md text-neutral-300 transition-colors">Dismiss</button>
              {insight.details.actions?.map((action: any, index: number) => (<button key={index} onClick={() => handleAction(insight.id, action)} className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-semibold transition-colors">{action.label}</button>))}
            </div>
          </div>
        ))}
        {insights.filter(i => i.status === 'pending').length === 0 && (
           <div className="text-center py-12 text-neutral-500"><Lightbulb className="mx-auto h-12 w-12 mb-4" /><h3 className="text-lg font-semibold">No New Insights</h3><p>The system is continuously learning. Check back later for new suggestions.</p></div>
        )}
      </div>
    </div>
  );
};

export default Insights;