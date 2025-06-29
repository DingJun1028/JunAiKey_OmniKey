```typescript
// src/components/ActionEditor.tsx
// 可重用組件 (Reusable Component) - 動作編輯器 (Action Editor)
// Provides a structured UI for editing TaskStep or AgenticFlowNode actions based on action type.

import React, { useState, useEffect } from 'react';
import { TaskStep, Rune, ForgedAbility, Goal, KeyResult } from '../interfaces';
import { Loader2, Info } from 'lucide-react';

// Define the props for the ActionEditor component
interface ActionEditorProps {
    action: TaskStep['action']; // The action object to edit
    onChange: (newAction: TaskStep['action']) => void; // Callback for when the action changes
    disabled?: boolean; // Whether the editor is disabled
    // Data needed to populate dropdowns for certain action types
    availableRunes: Rune[];
    availableAbilities: ForgedAbility[];
    availableGoals: Goal[]; // Goals including Key Results
}

const ActionEditor: React.FC<ActionEditorProps> = ({
    action,
    onChange,
    disabled = false,
    availableRunes,
    availableAbilities,
    availableGoals,
}) => {
    // Internal state for action details, managed as JSON string for simplicity in MVP
    // A more complex implementation would manage structured state per action type
    const [detailsJson, setDetailsJson] = useState(JSON.stringify(action.details || {}, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Update internal JSON state when the action prop changes externally
    useEffect(() => {
        try {
            const jsonString = JSON.stringify(action.details || {}, null, 2);
            setDetailsJson(jsonString);
            setJsonError(null); // Clear JSON error on prop change
        } catch (err: any) {
            console.error("Error stringifying action details for editor:", err);
            setDetailsJson(JSON.stringify({ error: "Failed to display details" }));
            setJsonError("Error displaying details: Invalid structure.");
        }
    }, [action.details]);

    // Handle changes to the action type dropdown
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as TaskStep['action']['type'];
        // Reset details when type changes, provide default structure if known
        let newDetails = {};
        switch (newType) {
            case 'log': newDetails = { message: '' }; break;
            case 'callAPI': newDetails = { url: '', method: 'GET' }; break;
            case 'runScript': newDetails = { scriptId: '', params: {} }; break;
            case 'executeRune': newDetails = { runeId: '', action: '', params: {} }; break;
            case 'waitForUserInput': newDetails = { prompt: '' }; break;
            case 'syncKnowledge': newDetails = { query: '' }; break;
            case 'sendNotification': newDetails = { type: 'info', message: '', channel: 'ui' }; break;
            case 'updateGoalProgress': newDetails = { krId: '', currentValue: 0 }; break;
            case 'create_agentic_flow': newDetails = { name: '', entry_node_id: '', nodes: [], edges: [] }; break; // Default for create_agentic_flow
            case 'create_task': newDetails = { description: '', steps: [] }; break; // Default for create_task
            case 'search_knowledge': newDetails = { query: '', useSemanticSearch: false }; break; // Default for search_knowledge
            case 'sync_mobile_git': newDetails = { direction: 'bidirectional' }; break; // Default for sync_mobile_git
            case 'present_suggestion': newDetails = { message: '', suggestionType: 'info' }; break; // Default for present_suggestion
            // Add other default structures here
            default: newDetails = {}; break;
        }
        const newAction = { type: newType, details: newDetails };
        onChange(newAction); // Notify parent component
        setDetailsJson(JSON.stringify(newDetails, null, 2)); // Update internal JSON state
        setJsonError(null); // Clear JSON error
    };

    // Handle changes to the JSON textarea for action details
    const handleDetailsJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const jsonString = e.target.value;
        setDetailsJson(jsonString);
        try {
            const details = JSON.parse(jsonString);
            onChange({ ...action, details }); // Notify parent component with parsed details
            setJsonError(null); // Clear error if parsing is successful
        } catch (parseError: any) {
            // Do not notify parent if JSON is invalid, just set error state
            setJsonError(`Invalid JSON: ${parseError.message}`);
        }
    };

    // --- New: Render structured form based on action type (MVP simplified) ---
    // This function renders specific input fields for known action types
    const renderStructuredDetails = () => {
        // Use a unique key for the details state based on action type
        const detailsKey = `action-details-${action.type}`;

        // For MVP, we'll only implement structured forms for a few key types
        // and fallback to JSON for others.
        switch (action.type) {
            case 'log':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor={`${detailsKey}-message`} className="block text-neutral-400 text-xs font-semibold mb-1">Message:</label>
                        <input
                            id={`${detailsKey}-message`}
                            type="text"
                            className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={action.details?.message || ''}
                            onChange={(e) => onChange({ ...action, details: { ...action.details, message: e.target.value } })}
                            placeholder="Enter log message"
                            disabled={disabled}
                            required
                        />
                    </div>
                );
            case 'callAPI':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md space-y-2">
                        <div>
                            <label htmlFor={`${detailsKey}-url`} className="block text-neutral-400 text-xs font-semibold mb-1">URL:</label>
                            <input
                                id={`${detailsKey}-url`}
                                type="url"
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={action.details?.url || ''}
                                onChange={(e) => onChange({ ...action, details: { ...action.details, url: e.target.value } })}
                                placeholder="Enter API URL"
                                disabled={disabled}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`${detailsKey}-method`} className="block text-neutral-400 text-xs font-semibold mb-1">Method:</label>
                            <select
                                id={`${detailsKey}-method`}
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={action.details?.method || 'GET'}
                                onChange={(e) => onChange({ ...action, details: { ...action.details, method: e.target.value } })}
                                disabled={disabled}
                                required
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                            </select>
                        </div>
                        {/* TODO: Add structured input for data/headers based on method */}
                        {(action.details?.method === 'POST' || action.details?.method === 'PUT' || action.details?.method === 'PATCH') && (
                             <div className="mt-2 p-2 bg-neutral-700/50 rounded-md">
                                 <label htmlFor={`${detailsKey}-data-json`} className="block text-neutral-400 text-xs font-semibold mb-1">Request Body (JSON):</label>
                                  <textarea
                                     id={`${detailsKey}-data-json`}
                                     className={`w-full p-1 rounded-md bg-neutral-800 text-white border ${jsonError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs`}
                                     value={detailsJson} // Use internal JSON state for editing
                                     onChange={handleDetailsJsonChange} // Use JSON change handler
                                     rows={3}
                                     disabled={disabled}
                                  />
                                  {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
                             </div>
                         )}
                         {/* TODO: Add Headers JSON input */}
                    </div>
                );
            case 'runScript':
                 // Need dropdown for available abilities (scripts)
                 const availableScripts = availableAbilities.filter(a => a.script); // Filter for abilities with scripts

                 return (
                     <div className="mt-2 p-2 bg-neutral-600/50 rounded-md space-y-2">
                         <div>
                             <label htmlFor={`${detailsKey}-scriptId`} className="block text-neutral-400 text-xs font-semibold mb-1">Script (Ability):</label>
                             <select
                                 id={`${detailsKey}-scriptId`}
                                 className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                 value={action.details?.scriptId || ''}
                                 onChange={(e) => onChange({ ...action, details: { scriptId: e.target.value, params: {} } })} // Reset params when script changes
                                 disabled={disabled}
                                 required
                             >
                                 <option value="">-- Select Script --</option>
                                 {availableScripts.map(ability => (
                                     <option key={ability.id} value={ability.id}>{ability.name} ({ability.id})</option>
                                 ))}\
                             </select>\
                         </div>\
                          {action.details?.scriptId && (\
                              <div className="mt-2 p-2 bg-neutral-700/50 rounded-md">\
                                  <label htmlFor={`${detailsKey}-params-json`} className="block text-neutral-400 text-xs font-semibold mb-1">Parameters (JSON):</label>\
                                   <textarea\
                                      id={`${detailsKey}-params-json`}\
                                      className={`w-full p-1 rounded-md bg-neutral-800 text-white border ${jsonError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs`}\
                                      value={detailsJson} // Use internal JSON state for editing\
                                      onChange={handleDetailsJsonChange} // Use JSON change handler\
                                      rows={3}\
                                      disabled={disabled}\
                                   />\
                                   {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}\
                              </div>\
                          )}\
                     </div>\
                 );\
            case 'executeRune':
                 // Need dropdowns for available runes and their actions
                 const selectedRune = availableRunes.find(r => r.id === action.details?.runeId);
                 const availableRuneActions = selectedRune?.manifest?.methods ? Object.keys(selectedRune.manifest.methods) : [];

                 return (
                     <div className="mt-2 p-2 bg-neutral-600/50 rounded-md space-y-2">
                         <div>
                             <label htmlFor={`${detailsKey}-runeId`} className="block text-neutral-400 text-xs font-semibold mb-1">Rune:</label>
                             <select
                                 id={`${detailsKey}-runeId`}
                                 className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                 value={action.details?.runeId || ''}
                                 onChange={(e) => onChange({ ...action, details: { runeId: e.target.value, action: '', params: {} } })} // Reset action/params when rune changes
                                 disabled={disabled}
                                 required
                             >
                                 <option value="">-- Select Rune --</option>
                                 {availableRunes.map(rune => (
                                     <option key={rune.id} value={rune.id}>{rune.name} ({rune.id})</option>
                                 ))}
                             </select>
                         </div>
                          {action.details?.runeId && (
                              <div>
                                  <label htmlFor={`${detailsKey}-action`} className="block text-neutral-400 text-xs font-semibold mb-1">Action:</label>
                                  <select
                                      id={`${detailsKey}-action`}
                                      className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                      value={action.details?.action || ''}
                                      onChange={(e) => onChange({ ...action, details: { ...action.details, action: e.target.value, params: {} } })} // Reset params when action changes
                                      disabled={disabled || availableRuneActions.length === 0}
                                      required
                                  >
                                      <option value="">-- Select Action --</option>
                                      {availableRuneActions.map(actionName => (
                                          <option key={actionName} value={actionName}>{actionName}</option>
                                      ))}
                                  </select>
                              </div>
                          )}
                          {action.details?.action && (
                              <div className="mt-2 p-2 bg-neutral-700/50 rounded-md">
                                  <label htmlFor={`${detailsKey}-params-json`} className="block text-neutral-400 text-xs font-semibold mb-1">Parameters (JSON):</label>
                                   <textarea
                                      id={`${detailsKey}-params-json`}
                                      className={`w-full p-1 rounded-md bg-neutral-800 text-white border ${jsonError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs`}
                                      value={detailsJson} // Use internal JSON state for editing
                                      onChange={handleDetailsJsonChange} // Use JSON change handler
                                      rows={3}
                                      disabled={disabled}
                                   />
                                   {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
                              </div>
                          )}
                     </div>
                 );
            case 'waitForUserInput':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor={`${detailsKey}-prompt`} className="block text-neutral-400 text-xs font-semibold mb-1">Prompt:</label>
                        <input
                            id={`${detailsKey}-prompt`}
                            type="text"
                            className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={action.details?.prompt || ''}
                            onChange={(e) => onChange({ ...action, details: { ...action.details, prompt: e.target.value } })}
                            placeholder="Enter prompt for user input"
                            disabled={disabled}
                            required
                        />
                    </div>
                );
            case 'syncKnowledge':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor={`${detailsKey}-query`} className="block text-neutral-400 text-xs font-semibold mb-1">Query (Optional):</label>
                        <input
                            id={`${detailsKey}-query`}
                            type="text"
                            className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={action.details?.query || ''}
                            onChange={(e) => onChange({ ...action, details: { ...action.details, query: e.target.value } })}
                            placeholder="Enter query for specific sync"
                            disabled={disabled}
                        />
                         <small className="text-neutral-400 text-xs mt-1 block">Leave empty for full knowledge sync.</small>
                    </div>
                );
            case 'sendNotification':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md space-y-2">
                        <div>
                            <label htmlFor={`${detailsKey}-notif-type`} className="block text-neutral-400 text-xs font-semibold mb-1">Type:</label>
                            <select
                                id={`${detailsKey}-notif-type`}
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={action.details?.type || 'info'}
                                onChange={(e) => onChange({ ...action, details: { ...action.details, type: e.target.value } })}
                                disabled={disabled}
                                required
                            >
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                                <option value="success">Success</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`${detailsKey}-notif-message`} className="block text-neutral-400 text-xs font-semibold mb-1">Message:</label>
                            <input
                                id={`${detailsKey}-notif-message`}
                                type="text"
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={action.details?.message || ''}
                                onChange={(e) => onChange({ ...action, details: { ...action.details, message: e.target.value } })}
                                placeholder="Enter notification message"
                                disabled={disabled}
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor={`${detailsKey}-notif-channel`} className="block text-neutral-400 text-xs font-semibold mb-1">Channel:</label>
                            <select
                                id={`${detailsKey}-notif-channel`}
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={action.details?.channel || 'ui'}
                                onChange={(e) => onChange({ ...action, details: { ...action.details, channel: e.target.value } })}
                                disabled={disabled}
                                required
                            >
                                <option value="ui">UI</option>
                                <option value="email">Email (Simulated)</option>
                                <option value="webhook">Webhook (Simulated)</option>
                                <option value="push">Push (Simulated)</option>
                            </select>
                        </div>
                         {/* TODO: Add details JSON input */}
                    </div>
                );
            case 'updateGoalProgress':
                 // Need dropdowns for available goals and their key results
                 const selectedGoal = availableGoals.find(g => g.id === action.details?.goalId); // Assuming goalId might be in details
                 const availableKrs = selectedGoal?.key_results || [];

                 return (
                     <div className="mt-2 p-2 bg-neutral-600/50 rounded-md space-y-2">
                         <div>
                             <label htmlFor={`${detailsKey}-goalId`} className="block text-neutral-400 text-xs font-semibold mb-1">Goal:</label>
                             <select
                                 id={`${detailsKey}-goalId`}
                                 className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                 value={action.details?.goalId || ''}
                                 onChange={(e) => onChange({ ...action, details: { ...action.details, goalId: e.target.value, krId: '' } })} // Reset KR when goal changes
                                 disabled={disabled}
                             >
                                 <option value="">-- Select Goal --</option>
                                 {availableGoals.map(goal => (
                                     <option key={goal.id} value={goal.id}>{goal.description}</option>
                                 ))}
                             </select>
                         </div>
                          {action.details?.goalId && (
                              <div>
                                  <label htmlFor={`${detailsKey}-krId`} className="block text-neutral-400 text-xs font-semibold mb-1">Key Result:</label>
                                  <select
                                      id={`${detailsKey}-krId`}
                                      className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                      value={action.details?.krId || ''}
                                      onChange={(e) => onChange({ ...action, details: { ...action.details, krId: e.target.value } })}
                                      disabled={disabled || availableKrs.length === 0}
                                      required
                                  >
                                      <option value="">-- Select Key Result --</option>
                                      {availableKrs.map(kr => (
                                          <option key={kr.id} value={kr.id}>{kr.description} ({kr.current_value}/{kr.target_value} {kr.unit})</option>
                                      ))}\
                                  </select>\
                              </div>\
                          )}\
                          {action.details?.krId && (\
                              <div>\
                                  <label htmlFor={`${detailsKey}-currentValue`} className="block text-neutral-400 text-xs font-semibold mb-1">Current Value:</label>\
                                  <input\
                                      id={`${detailsKey}-currentValue`}\
                                      type="number"\
                                      step="0.1"\
                                      className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"\
                                      value={action.details?.currentValue || 0}\
                                      onChange={(e) => onChange({ ...action, details: { ...action.details, currentValue: parseFloat(e.target.value) } })}\
                                      disabled={disabled}\
                                      required\
                                  />\
                              </div>\
                          )}\
                     </div>\
                 );\
            // Add more cases for other action types with structured forms\
            // case 'callAPI': ...\
            // case 'sendNotification': ...\
            // case 'waitForUserInput': ...\
            // case 'syncKnowledge': ...\

            default:
                // Fallback to generic JSON textarea for unknown or unimplemented types
                return (
                     <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                         <label htmlFor={`${detailsKey}-json`} className="block text-neutral-400 text-xs font-semibold mb-1">Action Details (JSON):</label>
                         <textarea
                             id={`${detailsKey}-json`}
                             className={`w-full p-1 rounded-md bg-neutral-800 text-white border ${jsonError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs`}
                             value={detailsJson} // Use internal JSON state for editing
                             onChange={handleDetailsJsonChange} // Use JSON change handler
                             rows={4}
                             disabled={disabled}
                             required
                          />
                          {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
                     </div>
                );
        }
    };
    // --- End New ---


    return (
        <div className="space-y-2">
            {/* Action Type Dropdown */}
            <div>
                <label htmlFor={`action-type-${action.id}`} className="block text-neutral-400 text-xs font-semibold mb-1">Action Type:</label>
                <select
                    id={`action-type-${action.id}`}
                    className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    value={action.type}
                    onChange={handleTypeChange}
                    disabled={disabled}
                    required
                >
                    <option value="log">log</option>
                    <option value="callAPI">callAPI</option>
                    <option value="runScript">runScript</option>
                    <option value="executeRune">executeRune</option>
                    <option value="waitForUserInput">waitForUserInput</option>
                    <option value="syncKnowledge">syncKnowledge</option>
                    <option value="sendNotification">sendNotification</option>
                    <option value="updateGoalProgress">updateGoalProgress</option>
                    {/* Add other action types as needed */}
                    <option value="create_agentic_flow">create_agentic_flow</option>
                    <option value="create_task">create_task</option>
                    <option value="search_knowledge">search_knowledge</option>
                    <option value="sync_mobile_git">sync_mobile_git</option>
                    <option value="present_suggestion">present_suggestion</option>
                </select>
            </div>

            {/* Action Details Input (Structured or JSON fallback) */}
            {renderStructuredDetails()}

        </div>
    );
};

export default ActionEditor;
```