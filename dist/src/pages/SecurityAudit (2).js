"use strict";
`` `typescript
// src/pages/SecurityAudit.tsx
// Security Audit Page
// Displays security-relevant system events and user actions (audit logs).
// --- New: Create a page to display security audit logs --
// --- New: Add Realtime Updates for security events --
// --- Modified: Display security events from LoggingService --
// --- Modified: Enhance display of UserAction data as personal usage logs --
// --- Modified: Add search functionality for User Actions --
// --- Modified: Add Copy button for log/action details --
// --- New: Add AI Analysis button for log/action entries --
// --- New: Add AI Analysis result modal --
// --- New: Add Import/Export/Share placeholders --

import React, { useEffect, useState } from 'react';
import { LoggingService } from '../core/logging/LoggingService'; // To fetch logs
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // To fetch and search user actions
import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // To analyze log entries
import { SystemEvent, UserAction } from '../interfaces'; // Import SystemEvent type, UserAction
import { Shield, Info, AlertTriangle, XCircle, CheckCircle, Loader2, Clock, User as UserIcon, GitCommit, MessageSquare, Zap, BookKey, Target, Cloud, Copy, Brain, FileUp, FileDown, Share2, Search } from 'lucide-react'; // Import icons including Copy, Brain, FileUp, FileDown, Share2, Search


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const loggingService: LoggingService = window.systemContext?.loggingService; // The Logging Service (\u65e5\u8a8c\u670d\u52d9) module
const authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (\u6b0a\u80fd\u935b\u9020) pillar
const wisdomSecretArt: WisdomSecretArt = window.systemContext?.wisdomSecretArt; // The Wisdom Secret Art (\u667a\u6167\u6c89\u6fb1\u79d8\u8853) pillar
const systemContext: any = window.systemContext; // Access the full context for currentUser


const SecurityAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<SystemEvent[]>([]); // State to hold audit logs
  const [userActions, setUserActions] = useState<UserAction[]>([]); // New state to hold user actions
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingActions, setLoadingActions] = useState(true); // New loading state for actions
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({}); // State to track expanded logs
  const [expandedActions, setExpandedActions] = useState<Record<string, boolean>>({}); // New state to track expanded actions

  // --- New: State for User Action Search ---
  const [actionSearchTerm, setActionSearchTerm] = useState('');
  const [isSearchingActions, setIsSearchingActions] = useState(false);
  // --- End New ---

  // --- New: State for AI Analysis Modal ---
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analyzingEntry, setAnalyzingEntry] = useState<UserAction | SystemEvent | null>(null); // The entry being analyzed
  const [analysisResult, setAnalysisResult] = useState<any>(null); // The result of the AI analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  // --- End New ---


  const fetchAuditLogs = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!loggingService || !userId) {
            setError("LoggingService module not initialized or user not logged in.");
            setLoadingLogs(false);
            return;
        }
      setLoadingLogs(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch recent security-relevant system events from LoggingService
          // LoggingService.getRecentLogs can filter by user and type/severity
          // We need to fetch events with type 'security_event_recorded'
          const logs = await loggingService.getRecentLogs(100, userId, undefined); // Get recent 100 logs for the user
          // Filter specifically for security events if LoggingService returns all types
          const securityEvents = logs.filter(log => log.type === 'security_event_recorded');

          // Sort by timestamp descending (newest first)
          securityEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setAuditLogs(securityEvents as SystemEvent[]); // Cast to SystemEvent[]
      } catch (err: any) {
          console.error('Error fetching audit logs:', err);
          setError(`;
Failed;
to;
load;
audit;
logs: $;
{
    err.message;
}
`);
      } finally {
          setLoadingLogs(false);
      }
  };

   // --- New: Fetch User Actions ---
   const fetchUserActions = async (query = '') => {
       const userId = systemContext?.currentUser?.id;
       if (!authorityForgingEngine || !userId) {
           // setError(\"AuthorityForgingEngine module not initialized or user not logged in.\"); // Don't set main error for just actions
           setLoadingActions(false);
           return;
       }
       setLoadingActions(true);
       setGitOpError(null); // Clear Git op error when viewing files
       try {
           // Fetch or search user actions for the current user (Part of \u96d9\u5410\u540c\u6b65\u9818\u57df)
           const actions = query
               ? await authorityForgingEngine.searchUserActions(query, userId, 100) // Search if query provided
               : await authorityForgingEngine.getRecentActions(userId, 100); // Get recent if no query
           setUserActions(actions);
       } catch (err: any) {
           console.error('Error fetching user actions:', err);
           // setError(`;
Failed;
to;
load;
user;
actions: $;
{
    err.message;
}
`); // Don't set main error for just actions
           setUserActions([]); // Clear actions on error
       } finally {
           setLoadingActions(false);
           setIsSearchingActions(false); // Reset search state
       }
   };
   // --- End New ---


  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchAuditLogs(); // Fetch logs on initial load
        // --- New: Fetch User Actions on initial load ---
        fetchUserActions();
        // --- End New ---
    }

    // --- New: Subscribe to realtime updates for security events and user actions ---
    let unsubscribeSecurityEventRecorded: (() => void) | undefined;
    let unsubscribeUserActionRecorded: (() => void) | undefined; // New: Subscribe to user action events


    if (loggingService?.context?.eventBus) { // Check if LoggingService and its EventBus are available
        const eventBus = loggingService.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to security event recorded events
        unsubscribeSecurityEventRecorded = eventBus.subscribe('security_event_recorded', (payload: SystemEvent) => {
             // Add the new event if it's for the current user
             if (payload.user_id === userId) {
                 console.log('SecurityAudit page received security_event_recorded event:', payload);
                 // Add the new event, keep sorted by timestamp (newest first), and limit the list size
                 setAuditLogs(prevLogs => [
                     payload,
                     ...prevLogs.filter(log => log.id !== payload.id) // Ensure no duplicates
                 ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100)); // Keep only the latest 100
             }
         });

        // --- New: Subscribe to user action recorded events ---
        unsubscribeUserActionRecorded = eventBus.subscribe('user_action_recorded', (payload: UserAction) => {
             if (payload.user_id === userId) {
                 console.log('SecurityAudit page received user_action_recorded event:', payload);
                 // Add the new action, keep sorted by timestamp (newest first), and limit the list size
                 // Only update if not currently searching, to avoid interfering with search results
                 if (!isSearchingActions) {
                     setUserActions(prevActions => [
                         payload,
                         ...prevActions.filter(action => action.id !== payload.id) // Ensure no duplicates if an update event is also published
                     ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100)); // Keep only the latest 100
                 } else {
                     console.log('SecurityAudit page received user_action_recorded event while searching. Deferring UI update.');
                 }
             }
         });
        // --- End New ---
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeSecurityEventRecorded?.();
        // --- New: Unsubscribe from user action events ---
        unsubscribeUserActionRecorded?.();
        // --- End New ---
    };

  }, [systemContext?.currentUser?.id, loggingService, authorityForgingEngine, isSearchingActions]); // Add authorityForgingEngine and isSearchingActions to dependencies


    const getSeverityColor = (severity: SystemEvent['severity']) => {
        switch (severity) {
            case 'info': return 'border-blue-500 text-blue-400';
            case 'warning': return 'border-yellow-500 text-yellow-400';
            case 'error': return 'border-red-500 text-red-400';
            default: return 'border-neutral-500 text-neutral-400';
        }
    };

     const getSeverityIcon = (severity: SystemEvent['severity']) => {
        switch (severity) {
            case 'info': return <Info size={16} className="text-blue-400"/>;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-400"/>;
            case 'error': return <XCircle size={16} className="text-red-400"/>;
            default: return <Info size={16} className="text-neutral-400"/>;
        }
    };

    // --- New: Helper to get icon for User Action type ---
    const getUserActionIcon = (type: UserAction['type']) => {
        if (type.startsWith('web:chat:')) return <MessageSquare size={16} className="text-blue-400"/>;
        if (type.startsWith('web:kb:')) return <BookKey size={16} className="text-green-400"/>;
        if (type.startsWith('web:scripts:')) return <Code size={16} className="text-purple-400"/>;
        if (type.startsWith('web:tasks:')) return <Target size={16} className="text-orange-400"/>;
        if (type.startsWith('web:goals:')) return <Target size={16} className="text-yellow-400"/>;
        if (type.startsWith('web:agents:')) return <Zap size={16} className="text-cyan-400"/>;
        if (type.startsWith('web:sync:')) return <Cloud size={16} className="text-indigo-400"/>;
        if (type.startsWith('web:settings:')) return <Settings size={16} className="text-neutral-400"/>;
        if (type.startsWith('web:files:')) return <FileText size={16} className="text-teal-400"/>;
        if (type.startsWith('web:repositories:')) return <GitCommit size={16} className="text-pink-400"/>;
        if (type.startsWith('web:glossary:')) return <BookKey size={16} className="text-lime-400"/>;
        if (type.startsWith('web:collections:')) return <BookKey size={16} className="text-fuchsia-400"/>;
        if (type.startsWith('web:flows:')) return <Workflow size={16} className="text-violet-400"/>;
        // Add other UI action prefixes
        if (type.startsWith('system:action:executed:')) return <CheckCircle size={16} className="text-green-400"/>;
        if (type.startsWith('system:action:failed:')) return <XCircle size={16} className="text-red-400"/>;
        if (type.startsWith('system:webhook:')) return <Webhook size={16} className="text-red-400"/>;
        if (type.startsWith('ability:executed:')) return <Play size={16} className="text-green-400"/>;
        if (type.startsWith('ability:execution_failed:')) return <XCircle size={16} className="text-red-400"/>;
        // Add other system action prefixes
        return <Info size={16} className="text-neutral-400"/>;
    };
    // --- End New ---


    const toggleExpandLog = (logId: string) => {
        setExpandedLogs(prevState => ({
            ...prevState,
            [logId]: !prevState[logId]
        }));
    };

     // --- New: Toggle expand User Action ---
    const toggleExpandAction = (actionId: string) => {
        setExpandedActions(prevState => ({
            ...prevState,
            [actionId]: !prevState[actionId]
        }));
    };
    // --- End New ---

    // --- New: Handle User Action Search ---
    const handleActionSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!authorityForgingEngine || !userId) return; // Should be protected by route, but safety check

        setIsSearchingActions(true);
        setGitOpError(null); // Clear previous errors
        // The fetchUserActions function handles fetching based on searchTerm state
        fetchUserActions(actionSearchTerm);
    };
    // --- End New ---

    // --- New: Handle Copy Details ---
    const handleCopyDetails = (details: any) => {
        const detailsString = JSON.stringify(details, null, 2);
        navigator.clipboard.writeText(detailsString).then(() => {
            alert('Details copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy details:', err);
            alert('Failed to copy details.');
        });
         // Simulate recording user action
        const userId = systemContext?.currentUser?.id;
        if (userId) {
             authorityForgingEngine?.recordAction({
                type: 'web:security_audit:copy_details',
                details: { detailsType: typeof details, detailsLength: detailsString.length },
                context: { platform: 'web', page: 'security_audit' },
                user_id: userId, // Associate action with user
            });
        }
    };
    // --- End New ---

    // --- New: Handle AI Analysis ---
    const handleAIAnalysis = async (entry: UserAction | SystemEvent) => {
        const userId = systemContext?.currentUser?.id;
        if (!wisdomSecretArt || !userId) {
            alert(\"WisdomSecretArt module not initialized or user not logged in.\");
            return;
        }

        console.log(`;
Attempting;
AI;
analysis;
for (entry; ; )
    : $;
{
    entry.id || entry.timestamp;
}
`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:security_audit:ai_analyze',
            details: { entryId: entry.id || entry.timestamp, entryType: (entry as any).type || (entry as any).payload?.originalType },
            context: { platform: 'web', page: 'security_audit' },
            user_id: userId, // Associate action with user
        });


        setAnalyzingEntry(entry); // Set the entry being analyzed
        setAnalysisResult(null); // Clear previous result
        setAnalysisError(null); // Clear previous error
        setShowAnalysisModal(true); // Show the modal
        setIsAnalyzing(true); // Indicate analysis is in progress

        try {
            // Call WisdomSecretArt to analyze the log entry
            const result = await wisdomSecretArt.analyzeLogEntry(entry, userId); // Pass entry and userId

            console.log('AI analysis result:', result);
            setAnalysisResult(result); // Store the result

        } catch (err: any) {
            console.error('Error during AI analysis:', err);
            setAnalysisError(`;
Failed;
to;
perform;
AI;
analysis: $;
{
    err.message;
}
`);
        } finally {
            setIsAnalyzing(false); // Reset analyzing state
        }
    };
    // --- End New ---


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view the security audit logs.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Activity Vault (\u6d3b\u52d5\u4fdd\u96aa\u6ac3)</h2> {/* Modified title */}
        <p className="text-neutral-300 mb-8">Review security-relevant system events and your personal usage logs. Your personal activity database.</p> {/* Modified description */}

        {/* New: Import/Export/Share Placeholders */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
             <h3 className="text-xl font-semibold text-blue-300 mb-3">Data Management</h3>
             <div className="flex flex-wrap gap-4">
                 <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" disabled>
                     <FileDown size={18} className="inline-block mr-2"/> Export Data (TODO)
                 </button>
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" disabled>
                     <FileUp size={18} className="inline-block mr-2"/> Import Data (TODO)
                 </button>
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" disabled>
                     <Share2 size={18} className="inline-block mr-2"/> Share Data (TODO)
                 </button>
             </div>
        </div>
        {/* End New */}

        {/* Audit Log List */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg"> {/* Added mb-8 */}
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Recent Security Events</h3>
            {loadingLogs ? (
              <p className="text-neutral-400">Loading audit logs...</p>
            ) : error ? (
                 <p className="text-red-400">Error: {error}</p>
            ) : auditLogs.length === 0 ? (
              <p className="text-neutral-400">No security audit logs found yet.</p>
            ) : (
              <ul className="space-y-4">
                {auditLogs.map((log) => (
                  <li key={log.id || log.timestamp} className={`;
bg - neutral - 600 / 50;
p - 4;
rounded - md;
border - l - 4;
$;
{
    getSeverityColor(log.severity);
}
`}> {/* Use timestamp as fallback key */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            {getSeverityIcon(log.severity)}
                            <h4 className={`;
font - semibold;
$;
{
    getSeverityColor(log.severity);
}
`}>{log.type.replace(/_/g, ' ').toUpperCase()}</h4> {/* Display event type */}
                        </div>
                         {/* New: Actions for log entries */}
                         <div className="flex gap-2">
                             {/* Copy Details Button */}
                             <button
                                 className="px-3 py-1 text-xs bg-neutral-600 text-white rounded hover:bg-neutral-700 transition"
                                 onClick={() => handleCopyDetails(log.payload)}
                             >
                                 <Copy size={14} className="inline-block mr-1"/> Copy
                             </button>
                              {/* AI Analyze Button */}
                             <button
                                 className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleAIAnalysis(log)}
                                 disabled={isAnalyzing}
                             >
                                 {isAnalyzing && analyzingEntry?.id === log.id ? <Loader2 size={14} className="inline-block mr-1 animate-spin"/> : <Brain size={14} className="inline-block mr-1"/>)}
                                 Analyze
                             </button>
                             {/* Expand/Collapse Button */}
                             <button onClick={() => toggleExpandLog(log.id || log.timestamp)} className="text-neutral-400 hover:text-white transition">
                                {expandedLogs[log.id || log.timestamp] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                             </button>
                         </div>
                         {/* End New */}
                    </div>
                    <p className="text-neutral-300 text-sm mb-2">Message: {log.payload?.details?.message || log.payload?.error || log.payload?.details?.error || 'No message.'}</p> {/* Display relevant message/error */}
                    <small className="text-neutral-400 text-xs block mt-1">
                        ID: {log.id || 'N/A'} | Severity: {log.severity?.toUpperCase() || 'N/A'} | Timestamp: {new Date(log.timestamp).toLocaleString()}
                         {log.user_id && ` | User;
$;
{
    log.user_id;
}
`}
                    </small>

                    {/* Log Details (Collapsible) */}
                    {expandedLogs[log.id || log.timestamp] && ((
                        <div className="mt-4 border-t border-neutral-600 pt-4">
                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Full Payload:</h5>
                            <div className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-600">
                                {/* Display full payload JSON */}
                                <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                            </div>
                        </div>
                    ))}
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* New: Personal Usage Log List (User Actions) */}
        <div className="p-4 bg-neutral-700/50 rounded-lg"> {/* Added mb-8 */}
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Recent Personal Usage Logs</h3>
            {/* New: Search Form for User Actions */}
            <form onSubmit={handleActionSearch} className="mb-4 flex gap-4 items-center">
              <input
                id="action-search"
                type="text"
                className="flex-grow p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={actionSearchTerm}
                onChange={(e) => setActionSearchTerm(e.target.value)}
                placeholder="Search usage logs..."
                disabled={isSearchingActions}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSearchingActions}
              >
                {isSearchingActions ? <Loader2 size={18} className="animate-spin"/> : <Search size={18} className="inline-block mr-1"/>)}
                Search
              </button>
               {actionSearchTerm && (
                  <button
                      type="button"
                      onClick={() => { setActionSearchTerm(''); fetchUserActions(''); }} // Clear search and refetch all
                      className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                      disabled={isSearchingActions}
                  >
                      Clear
                  </button>
               )}
            </form>
            {/* End New */}
            {loadingActions ? (
                <p className="text-neutral-400">Loading usage logs...</p>
            ) : userActions.length === 0 ? (
                <p className="text-neutral-400">{actionSearchTerm ? 'No usage logs found matching your search.' : 'No recent usage logs found.'}</p>
            ) : ((
                <ul className="space-y-4">
                    {userActions.map((action) => (
                        <li key={action.id} className={`;
bg - neutral - 600 / 50;
p - 4;
rounded - md;
border - l - 4;
border - orange - 500 `}> {/* Use orange border for usage logs */}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    {getUserActionIcon(action.type)} {/* Use action type icon */}
                                    <h4 className={`;
font - semibold;
text - orange - 200 `}>Action Type: {action.type.replace(/_/g, ' ').toUpperCase()}</h4> {/* Display action type */}
                                </div>
                                {/* New: Actions for user actions */}
                                <div className="flex gap-2">
                                     {/* Copy Details Button */}
                                     <button
                                         className="px-3 py-1 text-xs bg-neutral-600 text-white rounded hover:bg-neutral-700 transition"
                                         onClick={() => handleCopyDetails({ details: action.details, context: action.context })}
                                     >
                                         <Copy size={14} className="inline-block mr-1"/> Copy
                                     </button>
                                      {/* AI Analyze Button */}
                                     <button
                                         className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                         onClick={() => handleAIAnalysis(action)}
                                         disabled={isAnalyzing}
                                     >
                                         {isAnalyzing && analyzingEntry?.id === action.id ? <Loader2 size={14} className="inline-block mr-1 animate-spin"/> : <Brain size={14} className="inline-block mr-1"/>)}
                                         Analyze
                                     </button>
                                     {/* Expand/Collapse Button */}
                                     <button onClick={() => toggleExpandAction(action.id)} className="text-neutral-400 hover:text-white transition">
                                        {expandedActions[action.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                     </button>
                                </div>
                                {/* End New */}
                            </div>
                            <small className="text-neutral-400 text-xs block mt-1">
                                ID: {action.id} | Timestamp: {new Date(action.timestamp).toLocaleString()}
                                 {action.user_id && ` | User;
$;
{
    action.user_id;
}
`}
                            </small>

                            {/* Action Details (Collapsible) */}
                            {expandedActions[action.id] && ((
                                <div className="mt-4 border-t border-neutral-600 pt-4">
                                    {action.details && Object.keys(action.details).length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Details:</h5>
                                            <div className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-600">
                                                <pre>{JSON.stringify(action.details, null, 2)}</pre>
                                            </div>
                                        </div>
                                    )}
                                     {action.context && Object.keys(action.context).length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Context:</h5>
                                            <div className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-600">
                                                <pre>{JSON.stringify(action.context, null, 2)}</pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ))}
        </div>
        {/* End New */}

        {/* New: AI Analysis Result Modal */}
        {showAnalysisModal && analyzingEntry && ((
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">AI Analysis Result</h3>
                         <button
                             type="button"
                             onClick={() => { setShowAnalysisModal(false); setAnalyzingEntry(null); setAnalysisResult(null); setAnalysisError(null); }}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isAnalyzing}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     {isAnalyzing ? (
                         <div className="flex justify-center items-center py-8">
                             <Loader2 size={32} className="animate-spin text-blue-400"/>
                             <span className="text-neutral-400 ml-3">Analyzing...</span>
                         </div>
                     ) : analysisError ? (
                         <div className="text-red-400 text-sm mb-4">
                             <p>Error: {analysisError}</p>
                         </div>
                     ) : analysisResult ? (
                         <div className="space-y-4 text-neutral-300 text-sm">
                             <div>
                                 <h4 className="font-semibold mb-1">Title:</h4>
                                 <p>{analysisResult.title}</p>
                             </div>
                             <div>
                                 <h4 className="font-semibold mb-1">Summary:</h4>
                                 <p>{analysisResult.summary}</p>
                             </div>
                             {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                                 <div>
                                     <h4 className="font-semibold mb-1">Keywords:</h4>
                                     <p>{analysisResult.keywords.join(', ')}</p>
                                 </div>
                             )}
                             {/* TODO: Add buttons to create KB entry, task, etc. from analysis */}
                         </div>
                     ) : (
                         <p className="text-neutral-400">No analysis result available.</p>
                     )}
                     <div className="flex justify-end mt-6">
                         <button
                             type="button"
                             onClick={() => { setShowAnalysisModal(false); setAnalyzingEntry(null); setAnalysisResult(null); setAnalysisError(null); }}
                             className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                             disabled={isAnalyzing}
                         >
                             Close
                         </button>
                     </div>
                 </div>
             </div>
        ))}
        {/* End New */}

      </div>
    </div>
  );
};

export default SecurityAudit;
` ``;
