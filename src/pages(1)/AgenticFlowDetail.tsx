```typescript
// src/pages/AgenticFlowDetail.tsx
// Agentic Flow Detail Page (自我交付詳情)
// Displays the details of a single Agentic Flow and its execution history.
// Allows triggering execution, pausing, resuming, and cancelling.
// --- New: Create a page to display Agentic Flow details ---
// --- New: Implement fetching Agentic Flow data by ID ---
// --- New: Implement fetching and displaying Execution History ---
// --- New: Add UI for actions (run, edit, delete) ---
// --- New: Add Realtime Updates for Agentic Flow and Executions ---
// --- Modified: Add Pause, Resume, Cancel buttons and handlers ---
// --- New: Integrate React Flow for DAG visualization ---
// --- New: Display Node Status based on latest Execution ---
// --- Modified: Implement Start, Pause, Resume, Cancel, Delete button handlers ---
// --- Modified: Integrate ActionEditor component into Node Details Modal ---


import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // To get the flow ID from the URL and navigate
import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and update flow details and trigger actions
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes
import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals
import { AgenticFlow, AgenticFlowNode, AgenticFlowEdge, AgenticFlowExecution, Rune, ForgedAbility, Goal } from '../interfaces'; // Import types
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  applyNodeChanges, // Import applyNodeChanges
  applyEdgeChanges, // Import applyEdgeChanges
  OnNodesChange, // Import OnNodesChange type
  OnEdgesChange, // Import OnEdgesChange type
  NodeMouseHandler, // Import NodeMouseHandler type
  NodeTypes, // Import NodeTypes type
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles
import dagre from '@react-flow/dagre'; // Import Dagre layout algorithm
import { Workflow, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Play, Loader2, Info, XCircle, Pause, RotateCcw, ArrowLeft } from 'lucide-react'; // Import icons including Pause, RotateCcw, ArrowLeft
import ReactMarkdown from 'react-markdown'; // For rendering markdown
// --- Modified: Import ActionEditor component ---
import ActionEditor from '../components/ActionEditor';
// --- End Modified ---


// Access core modules from the global window object (for MVP simplicity)
declare const window: any;
const selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (自我導航) pillar
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (聖符文匠) pillar
const goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (目標管理) module
const systemContext: any = window.systemContext; // Access the full context for currentUser


// --- New: Initialize Dagre graph for layout ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Define node and edge dimensions for layout calculation
const nodeWidth = 250; // Approximate width of the node div
const nodeHeight = 150; // Approximate height of the node div (adjust based on content)
// --- End New ---


// --- New: Custom Node Component for Detail View ---
// This component will render the content of each node in the React Flow graph on the detail page.
// It should display node details and indicate execution status.
const DetailFlowNode: React.FC<{ data: { label: string, nodeData: AgenticFlowNode, executionStatus?: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled' } }> = ({ data }) => {
    const { label, nodeData, executionStatus } = data;
    const isEntryNode = nodeData.node_id_in_flow === (window.systemContext?.currentFlow?.entry_node_id || 'start'); // Check if it's the entry node

    // Determine border color based on execution status
    const borderColor = executionStatus === 'completed' ? 'border-green-500' :
                        executionStatus === 'failed' ? 'border-red-500' :
                        executionStatus === 'in-progress' ? 'border-blue-500 animate-pulse' : // Animate current node
                        executionStatus === 'paused' ? 'border-yellow-500' :
                        executionStatus === 'cancelled' ? 'border-neutral-500' :
                        isEntryNode ? 'border-green-500' : // Default for entry node if no execution status
                        'border-blue-500'; // Default for other nodes if no execution status

    const statusText = executionStatus ? `Status: ${executionStatus.toUpperCase()}` : 'Pending';
    const statusColor = executionStatus ? getFlowStatusColor(executionStatus) : 'text-neutral-400';


    return (
        <div className={`p-3 rounded-md border-l-4 ${borderColor} bg-neutral-700/70 shadow-md w-[${nodeWidth}px] h-[${nodeHeight}px] overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-semibold text-blue-200 overflow-hidden text-ellipsis whitespace-nowrap">
                    Node: {nodeData.node_id_in_flow} ({nodeData.type})
                </div>
                {/* No edit button here, editing is on the editor page */}
            </div>
            <div className="text-neutral-300 text-xs flex-grow overflow-hidden">
                {nodeData.description || 'No description.'}
            </div>
            {/* TODO: Add visual indicators for action/decision logic presence */}
            {/* nodeData.action && <span className="text-neutral-400 text-xs mt-1">Action: {nodeData.action.type}</span> */}
            {/* nodeData.decision_logic && <span className="text-neutral-400 text-xs mt-1">Decision Logic Present</span> */}
        </div>
    );
};

// Define custom node types for the detail view
const nodeTypes: NodeTypes = {
    default: DetailFlowNode, // Use our custom component for the default type
    // TODO: Define specific node types if needed (e.g., 'decision', 'action')
};
// --- End Custom Node Component ---


const AgenticFlowDetail: React.FC = () => {
  const { flowId } = useParams<{ flowId: string }>(); // Get flowId from URL params
  const navigate = useNavigate(); // Hook for navigation

  const [flow, setFlow] = useState<AgenticFlow | null>(null); // State to hold the flow details
  const [executions, setExecutions] = useState<AgenticFlowExecution[]>([]); // State to hold execution history
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedExecutions, setExpandedExecutions] = useState<Record<string, boolean>>({}); // State to track expanded executions

  // --- New: React Flow states for visualization ---
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  // --- End New ---

  // State for triggering actions
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- New: State for selected node details modal ---
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<AgenticFlowNode | null>(null);
  // --- New: States for data needed by ActionEditor (for display) ---
  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);
  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);
  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results
  // --- End New ---


  // --- New: Layout function using Dagre (copied from editor) ---
  const getLayoutedElements = useCallback(
      (nodes: Node[], edges: Edge[], direction = 'TB') => {
          const isHorizontal = direction === 'LR';
          dagreGraph.setGraph({ rankdir: direction });

          nodes.forEach((node) => {
              // Set nodes with dimensions for layout calculation
              dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
          });

          edges.forEach((edge) => {
              dagreGraph.setEdge(edge.source, edge.target);
          });

          dagre.layout(dagreGraph);

          const layoutedNodes = nodes.map((node) => {
              const nodeWithPosition = dagreGraph.node(node.id);
              // We need to pass a node object with at least position.
              // Node is passed by reference, so we modify it directly.
              node.position = {
                  x: nodeWithPosition.x - nodeWidth / 2,
                  y: nodeWithPosition.y - nodeHeight / 2,
              };

              return node;
          });

          return { nodes: layoutedNodes, edges }; // Return edges as is, layout only affects nodes
      },
      [] // Dependencies for useCallback - empty as it only depends on imported constants/libraries
  );
  // --- End New ---


  // --- New: Convert Agentic Flow Data to React Flow format with Layout and Execution Status ---
  const flowToReactFlowData = useCallback((agenticFlow: AgenticFlow, latestExecution?: AgenticFlowExecution) => {
      // Store the flow definition in the global context for access by custom nodes
      window.systemContext.currentFlow = agenticFlow;

      // Determine node statuses based on the latest execution
      // This is a simplified approach for MVP. A real system might track status per node per execution.
      // For now, we'll highlight the current node and maybe mark completed/failed based on log summary (if possible).
      // Since log summary is text, let's just highlight the current node and rely on overall execution status.
      const latestExecutionNodeId = latestExecution?.current_node_id;
      const latestExecutionStatus = latestExecution?.status;
      const executionLog = latestExecution?.execution_log_summary || '';

      const reactFlowNodes: Node[] = agenticFlow.nodes.map((node) => {
          let nodeExecutionStatus: AgenticFlowNode['status'] | undefined = undefined;

          // Determine status based on latest execution
          if (latestExecutionStatus && latestExecutionNodeId) {
              if (node.node_id_in_flow === latestExecutionNodeId) {
                  // This is the current node in the latest execution
                  nodeExecutionStatus = latestExecutionStatus; // Use the overall execution status for the current node
              } else if (latestExecutionStatus === 'completed' && executionLog.includes(`Executing node: ${node.node_id_in_flow} (${node.type})`)) { // Check log for execution
                  // If the overall execution completed and the node is mentioned as executed in the log
                  nodeExecutionStatus = 'completed';
              } else if (latestExecutionStatus === 'failed' && executionLog.includes(`Node ${node.node_id_in_flow} (${node.type}) failed.`)) { // Check log for failure
                   // If the overall execution failed and the node is mentioned with an error
                   nodeExecutionStatus = 'failed';
              } else if (latestExecutionStatus === 'paused' && executionLog.includes(`Executing node: ${node.node_id_in_flow} (${node.type})`)) { // Check log for execution before pause
                   // If paused and the node was reached/processed before the pause
                   nodeExecutionStatus = 'completed'; // Assume completed if processed before pause
              } else if (latestExecutionStatus === 'cancelled' && executionLog.includes(`Executing node: ${node.node_id_in_flow} (${node.type})`)) { // Check log for execution before cancellation
                   // If cancelled and the node was reached/processed before cancellation
                   nodeExecutionStatus = 'completed'; // Assume completed if processed before cancellation
              }
              // Nodes not yet reached in an in-progress/paused/cancelled flow are implicitly 'pending'
              // Nodes in a completed/failed flow that weren't executed are also implicitly 'pending' (or 'skipped')
          }


          return {
              id: node.node_id_in_flow, // Use node_id_in_flow as React Flow node ID
              // Position will be calculated by the layout algorithm
              position: { x: 0, y: 0 }, // Placeholder position
              data: {
                  label: (
                      <div className="p-2 bg-neutral-700/70 rounded-md border border-neutral-600 text-neutral-200 text-xs w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                          <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">Node: {node.node_id_in_flow} ({node.type})</div>
                          <div className="text-neutral-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">Desc: {node.description}</div>
                          {/* Add more details like source, tags if needed */}
                      </div>
                  ),
                  // Store the original node data
                  nodeData: node,
                  // Pass the execution status for this node
                  executionStatus: nodeExecutionStatus,
              },
              type: 'default', // Use our custom node type
              sourcePosition: Position.Bottom, // Default source handle position
              targetPosition: Position.Top, // Default target handle position
              style: {
                  padding: 0, // Remove default padding as label has its own
                  backgroundColor: 'transparent', // Make node background transparent
                  width: nodeWidth, // Set width for layout calculation
                  height: nodeHeight, // Set height for layout calculation
                  border: 'none', // No border on the container, let the custom node handle it
              },
          };
      });

      const reactFlowEdges: Edge[] = agenticFlow.edges.map(edge => {
          return {
              id: edge.edge_id_in_flow || edge.id, // Use edge_id_in_flow or DB ID as React Flow edge ID
              source: edge.source_node_id,
              target: edge.target_node_id,
              type: 'default', // Use default edge type
              label: edge.condition ? 'Conditional' : 'Unconditional', // Show relation type as label
              style: { strokeWidth: 1, stroke: edge.condition ? '#ffcc00' : '#999' }, // Yellow for conditional, gray for unconditional
              // animated: true, // Optional: animate edges
              data: { // Store the original edge data
                  edgeData: edge,
                  // onEditClick: handleEditEdgeClick, // Pass the edit handler (not needed in detail view)
              }
          };
      });

      // Apply layout algorithm
      const layouted = getLayoutedElements(reactFlowNodes, reactFlowEdges, 'TB'); // Use 'TB' for top-to-bottom layout

      return { nodes: layouted.nodes, edges: layouted.edges };
  }, [getLayoutedElements]); // Re-generate React Flow data if layout function changes
  // --- End New ---


  const fetchGraphData = useCallback(async () => {
       const userId = systemContext?.currentUser?.id;
       if (!selfNavigationEngine || !userId || !flowId) {
            setError("SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch the specific flow details, including nodes and edges
          const fetchedFlow = await selfNavigationEngine.getAgenticFlowById(flowId, userId); // Pass flowId and userId

          if (fetchedFlow) {
              setFlow(fetchedFlow);
              // Fetch execution history for this flow
              const flowExecutions = await selfNavigationEngine.getAgenticFlowExecutions(flowId, userId); // Pass flowId and userId
              setExecutions(flowExecutions);

              // --- New: Convert fetched flow data to React Flow format and apply layout, including latest execution status ---
              const latestExecution = flowExecutions.length > 0 ? flowExecutions[0] : undefined; // Get the most recent execution
              const reactFlowData = flowToReactFlowData(fetchedFlow, latestExecution);
              setNodes(reactFlowData.nodes);
              setEdges(reactFlowData.edges);
              // --- End New ---

          } else {
              // If flow not found
              setFlow(null);
              setExecutions([]);
              setNodes([]); // Clear React Flow state
              setEdges([]); // Clear React Flow state
          }

      } catch (err: any) {
          console.error(`Error fetching data for flow ${flowId}:`, err);
          setError(`Failed to load flow data: ${err.message}`);
          setFlow(null);
          setExecutions([]);
          setNodes([]); // Clear React Flow state
          setEdges([]); // Clear React Flow state
      } finally {
          setLoading(false);
      }
  }, [selfNavigationEngine, systemContext?.currentUser?.id, flowId, setFlow, setExecutions, setNodes, setEdges, setLoading, setError, flowToReactFlowData]); // Dependencies for useCallback


    // --- New: Fetch data needed by ActionEditor (for display) ---
    const fetchActionEditorData = useCallback(async () => {
        const userId = systemContext?.currentUser?.id;
        if (!userId || !sacredRuneEngraver || !authorityForgingEngine || !goalManagementService) {
             console.warn("Cannot fetch ActionEditor data: Core modules not initialized or user not logged in.");
             setAvailableRunes([]);
             setAvailableAbilities([]);
             setAvailableGoals([]);
             return;
        }
        try {
            // Fetch available runes (user's and public)
            const runes = await sacredRuneEngraver.listRunes(undefined, userId);
            setAvailableRunes(runes);

            // Fetch available abilities (user's and public)
            const abilities = await authorityForgingEngine.getAbilities(undefined, userId);
            setAvailableAbilities(abilities);

            // Fetch available goals (including KRs) for linking
            const goals = await goalManagementService.getGoals(userId);
            setAvailableGoals(goals);

        } catch (err: any) {
            console.error('Error fetching ActionEditor data:', err);
            // Don't set a critical error for the whole page
            // setError(`Failed to load data for action editor: ${err.message}`);
            setAvailableRunes([]);
            setAvailableAbilities([]);
            setAvailableGoals([]);
        } finally {
             // Ensure loading state is false even if fetching secondary data fails
             // setLoading(false); // This is handled by fetchFlowData
        }
    }, [systemContext?.currentUser?.id, sacredRuneEngraver, authorityForgingEngine, goalManagementService]);
    // --- End New ---


  useEffect(() => {
    // Fetch data when the component mounts or when the user changes or flowId changes
    if (systemContext?.currentUser?.id && flowId) {
        fetchGraphData(); // Fetch data for the specific flow
        // --- New: Fetch data needed by ActionEditor ---
        fetchActionEditorData();
        // --- End New ---
    }

    // --- New: Subscribe to realtime updates for agentic_flows, agentic_flow_nodes, agentic_flow_edges ---
    // Note: SelfNavigationEngine subscribes to general agentic_flow and execution events and publishes them via EventBus.
    // We need to listen to those events here and refetch if they are for the current flow.
    let unsubscribeFlowUpdate: (() => void) | undefined;
    let unsubscribeFlowDelete: (() => void) | undefined;
    let unsubscribeExecutionInsert: (() => void) | undefined;
    let unsubscribeExecutionUpdate: (() => void) | undefined;
    let unsubscribeExecutionDelete: (() => void) | undefined;

    // --- New: Subscribe to flow execution status events ---
    // These events are published by SelfNavigationEngine.executeAgenticFlow
    // They trigger a refetch of the flow data to update the overall flow status displayed on the page
    let unsubscribeFlowStarted: (() => void) | undefined;
    let unsubscribeFlowCompleted: (() => void) | undefined;
    let unsubscribeFlowFailed: (() => void) | undefined;
    let unsubscribeFlowPaused: (() => void) | undefined;
    let unsubscribeFlowResumed: (() => void) | undefined;
    let unsubscribeFlowCancelled: (() => void) | undefined;
    // --- End New ---


    if (selfNavigationEngine?.context?.eventBus) { // Check if SelfNavigationEngine and its EventBus are available
        const eventBus = selfNavigationEngine.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to flow update events
        unsubscribeFlowUpdate = eventBus.subscribe('agentic_flow_update', (payload: AgenticFlow) => {
            // Check if the event is for the current flow and user
            if (payload.id === flowId && payload.user_id === userId) {
                console.log('AgenticFlowDetail page received agentic_flow_update event:', payload);
                setFlow(payload); // Update the flow state directly
                // Refetch executions to ensure latest status is reflected in the list and graph
                selfNavigationEngine.getAgenticFlowExecutions(flowId, userId).then(setExecutions).catch(err => console.error('Error refetching executions:', err));
            }
        });

         // Subscribe to flow delete events
         unsubscribeFlowDelete = eventBus.subscribe('agentic_flow_delete', (payload: { flowId: string, userId: string }) => {
             // Check if the event is for the current flow and user
             if (payload.flowId === flowId && payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_delete event:', payload);
                 // If the current flow is deleted, navigate back to the flows list
                 navigate('/flows');
             }
         });

        // Subscribe to execution insert events
        unsubscribeExecutionInsert = eventBus.subscribe('agentic_flow_execution_insert', (payload: AgenticFlowExecution) => {
            // Check if the event is for the current flow and user
            if (payload.flow_id === flowId && payload.user_id === userId) {
                console.log('AgenticFlowDetail page received agentic_flow_execution_insert event:', payload);
                // Add the new execution to the list and keep sorted by start_timestamp (newest first)
                setExecutions(prevExecutions => [payload, ...prevExecutions].sort((a, b) => new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime()));
                // Update the graph visualization with the new latest execution
                if (flow) { // Ensure flow data is loaded
                     const updatedExecutions = [...executions, payload].sort((a, b) => new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime()); // Include the new payload
                     flowToReactFlowData(flow, updatedExecutions[0]); // Re-layout with the new latest execution
                }
            }
        });

         unsubscribeExecutionUpdate = eventBus.subscribe('agentic_flow_execution_update', (payload: AgenticFlowExecution) => {
             // Check if the event is for the current flow and user
             if (payload.flow_id === flowId && payload.user_id === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_execution_update event:', payload);
                 // Update the specific execution in the list
                 setExecutions(prevExecutions => prevExecutions.map(exec => exec.id === payload.id ? payload : exec));
                 // If this is the latest execution, update the graph visualization
                 if (executions.length > 0 && executions[0].id === payload.id && flow) { // Check if it's the latest and flow data is loaded
                     flowToReactFlowData(flow, payload); // Re-layout with the updated execution
                 }
             }
         });

          unsubscribeExecutionDelete = eventBus.subscribe('agentic_flow_execution_delete', (payload: { executionId: string, flowId: string, userId: string }) => {
             // Check if the event is for the current flow and user
             if (payload.flowId === flowId && payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_execution_delete event:', payload);
                 // Remove the deleted execution from the list
                 setExecutions(prevExecutions => prevExecutions.filter(exec => exec.id !== payload.executionId));
                 // If the deleted execution was the latest, update the graph visualization (might show previous latest or idle state)
                 if (executions.length > 0 && executions[0].id === payload.executionId && flow) { // Check if it was the latest and flow data is loaded
                     const remainingExecutions = executions.filter(exec => exec.id !== payload.executionId);
                     const newLatestExecution = remainingExecutions.length > 0 ? remainingExecutions[0] : undefined;
                     flowToReactFlowData(flow, newLatestExecution); // Re-layout with the new latest execution or idle state
                 }
             }
         });

        // --- New: Subscribe to flow execution status events ---
        // These events are published by SelfNavigationEngine.executeAgenticFlow
        // They trigger a refetch of the flow data to update the overall flow status displayed on the page
        unsubscribeFlowStarted = eventBus.subscribe('agentic_flow_started', (payload: { flowId: string, userId: string, executionId: string }) => { // Added executionId
             if (payload.flowId === flowId && payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_started event:', payload);
                 fetchGraphData(); // Refetch to update overall status
             }
         });
         unsubscribeFlowCompleted = eventBus.subscribe('agentic_flow_completed', (payload: { flowId: string, userId: string, executionId: string, lastNodeResult: any }) => { // Added executionId
             if (payload.flowId === flowId && payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_completed event:', payload);
                 fetchGraphData(); // Refetch to update overall status/timestamps/result
             }
         });
          unsubscribeFlowFailed = eventBus.subscribe('agentic_flow_failed', (payload: { flowId: string, userId: string, executionId: string, error: string }) => { // Added executionId
             if (payload.flowId === flowId && payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_failed event:', payload);
                 fetchGraphData(); // Refetch to update overall status/timestamps/error
             }
         });
          unsubscribeFlowPaused = eventBus.subscribe('agentic_flow_paused', (payload: { flowId: string, userId: string, executionId: string }) => { // Added executionId
             if (payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_paused event:', payload);
                 fetchGraphData(); // Refetch to update overall status
             }
         });
          unsubscribeFlowResumed = eventBus.subscribe('agentic_flow_resumed', (payload: { flowId: string, userId: string, executionId: string }) => { // Added executionId
             if (payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_resumed event:', payload);
                 fetchGraphData(); // Refetch to update overall status
             }
         });
          unsubscribeFlowCancelled = eventBus.subscribe('agentic_flow_cancelled', (payload: { flowId: string, userId: string, executionId: string }) => {
             if (payload.userId === userId) {
                 console.log('AgenticFlowDetail page received agentic_flow_cancelled event:', payload);
                 fetchGraphData(); // Refetch to update overall status
             }
         });
        // --- End New ---


    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeFlowUpdate?.();
        unsubscribeFlowDelete?.();
        unsubscribeExecutionInsert?.();
        unsubscribeExecutionUpdate?.();
        unsubscribeExecutionDelete?.();
        // --- New: Unsubscribe from flow execution status events ---
        unsubscribeFlowStarted?.();
        unsubscribeFlowCompleted?.();
        unsubscribeFlowFailed?.();
        unsubscribeFlowPaused?.();
        unsubscribeFlowResumed?.();
        unsubscribeFlowCancelled?.();
        // --- End New ---
    };

  }, [flowId, systemContext?.currentUser?.id, selfNavigationEngine, fetchGraphData, navigate, executions, flow, flowToReactFlowData]); // Re-run effect when flowId, user ID, service, fetch function, navigate, executions, flow, or flowToReactFlowData changes


    const getFlowStatusColor = (status: AgenticFlow['status'] | AgenticFlowExecution['status']) => { // Added AgenticFlowExecution status
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'failed': return 'text-red-400';
            case 'in-progress': return 'text-blue-400';
            case 'paused': return 'text-yellow-400';
            case 'cancelled': return 'text-neutral-400';
            case 'idle': return 'text-neutral-300';
            case 'pending': return 'text-neutral-300';
            default: return 'text-neutral-300';
        }
    };

    const toggleExpandExecution = (executionId: string) => {
        setExpandedExecutions(prevState => ({
            ...prevState,
            [executionId]: !prevState[executionId]
        }));
    };

    // --- New: Handle Flow Actions (Start, Pause, Resume, Cancel, Delete) ---
    const handleStartFlow = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !flowId) {
            alert("SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.");
            return;
        }
        console.log(`Attempting to start flow: ${flowId}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:flows:start',
            details: { flowId },
            context: { platform: 'web', page: 'flow_detail' },
            user_id: userId, // Associate action with user
        });

        setIsStarting(true);
        setError(null); // Clear previous errors
        try {
            // Call the SelfNavigationEngine method to start the flow
            // Pass initialParams if needed (not implemented in UI yet)
            await selfNavigationEngine.startAgenticFlow(flowId, userId, {}); // Pass flowId, userId, initialParams
            // Status and execution history updates handled by event listeners

        } catch (err: any) {
            console.error('Error starting flow:', err);
            setError(`Failed to start flow: ${err.message}`);
        } finally {
            setIsStarting(false); // State updated by event listener, but reset local flag
        }
    };

    const handlePauseFlow = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !flowId) {
            alert("SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.");
            return;
        }
        console.log(`Attempting to pause flow: ${flowId}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:flows:pause',
            details: { flowId },
            context: { platform: 'web', page: 'flow_detail' },
            user_id: userId, // Associate action with user
        });

        setIsPausing(true);
        setError(null); // Clear previous errors
        try {
            // Call the SelfNavigationEngine method to pause the flow
            await selfNavigationEngine.pauseAgenticFlow(flowId, userId); // Pass flowId, userId
            // Status update handled by event listener
        } catch (err: any) {
            console.error('Error pausing flow:', err);
            setError(`Failed to pause flow: ${err.message}`);
        } finally {
            setIsPausing(false); // State updated by event listener, but reset local flag
        }
    };

    const handleResumeFlow = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !flowId) {
            alert("SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.");
            return;
        }
        console.log(`Attempting to resume flow: ${flowId}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:flows:resume',
            details: { flowId },
            context: { platform: 'web', page: 'flow_detail' },
            user_id: userId, // Associate action with user
        });

        setIsResuming(true);
        setError(null); // Clear previous errors
        try {
            // Call the SelfNavigationEngine method to resume the flow
            await selfNavigationEngine.resumeAgenticFlow(flowId, userId); // Pass flowId, userId
            // Status update handled by event listener
        } catch (err: any) {
            console.error('Error resuming flow:', err);
            setError(`Failed to resume flow: ${err.message}`);
        } finally {
            setIsResuming(false); // State updated by event listener, but reset local flag
        }
    };

    const handleCancelFlow = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !flowId) {
            alert("SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.");
            return;
        }
        if (!confirm(`Are you sure you want to cancel this flow?`)) return;

        console.log(`Attempting to cancel flow: ${flowId}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:flows:cancel',
            details: { flowId },
            context: { platform: 'web', page: 'flow_detail' },
            user_id: userId, // Associate action with user
        });

        setIsCancelling(true);
        setError(null); // Clear previous errors
        try {
            // Call the SelfNavigationEngine method to cancel the flow
            await selfNavigationEngine.cancelAgenticFlow(flowId, userId); // Pass flowId, userId
            // Status update handled by event listener
        } catch (err: any) {
            console.error('Error cancelling flow:', err);
            setError(`Failed to cancel flow: ${err.message}`);
        } finally {
            setIsCancelling(false); // State updated by event listener, but reset local flag
        }
    };

    const handleDeleteFlow = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !flowId || !flow) {
            alert("SelfNavigationEngine module not initialized or user not logged in, or flow data is missing.");
            return;
        }
        if (flow.status === 'in-progress') {
             alert('Cannot delete a flow that is currently in progress.');
             return;
        }
        if (!confirm(`Are you sure you want to delete Agentic Flow \"${flow.name}\"? This action cannot be undone and will delete all associated nodes, edges, and execution history.`)) return;

        console.log(`Attempting to delete flow: ${flow.name} (${flowId})`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:flows:delete',
            details: { flowId: flow.id, flowName: flow.name },
            context: { platform: 'web', page: 'flow_detail' },
            user_id: userId, // Associate action with user
        });


        setIsDeleting(true);
        setError(null); // Clear previous errors
        try {
            // Call the SelfNavigationEngine method to delete the flow
            const success = await selfNavigationEngine.deleteAgenticFlow(flowId, userId); // Pass flowId and userId

            if (success) {
                console.log(`Flow ${flow.name} deleted successfully.`);
                // The agentic_flow_delete event listener will handle navigation away from this page
                alert(`Agentic Flow \"${flow.name}\" deleted successfully!`);
            } else {
                setError('Failed to delete flow.');
                alert('Failed to delete flow.');
            }

        } catch (err: any) {
            console.error(`Error deleting flow ${flow.name}:`, err);
            setError(`Failed to delete flow: ${err.message}`);
            alert(`Failed to delete flow: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };
    // --- End New ---


    // --- New: Handle Node Click to show details ---
    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        console.log('Node clicked:', node);
        // Find the full node data from the node data
        const nodeData = node.data?.nodeData;
        if (nodeData) {
            setSelectedNodeDetails(nodeData);
        } else {
            setSelectedNodeDetails(null);
        }
    }, []);
    // --- End New ---


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view Agentic Flows.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]"> {/* Adjust height to fit within viewport below nav */}
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl flex flex-col flex-grow"> {/* Use flex-grow to fill space */}
        {loading ? (
          <p className="text-neutral-400">Loading flow details...</p>
        ) : error ? (
             <p className="text-red-400">Error: {error}</p>
        ) : !flow ? (
             <p className="text-neutral-400">Agentic Flow not found.</p>
        ) : (
            <>
                <div className="flex items-center gap-4 mb-4">
                    <Link to={`/flows`} className="text-neutral-400 hover:text-white transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-3xl font-bold text-blue-400">Flow: {flow.name}</h2>
                </div>
                <p className="text-neutral-300 mb-4">{flow.description || 'No description.'}</p>
                <p className="text-neutral-300 text-sm">Status: <span className={getFlowStatusColor(flow.status)}>{flow.status}</span></p>
                <small className="text-neutral-400 text-xs block mb-4">
                    ID: {flow.id} | Entry Node: {flow.entry_node_id}
                     {flow.user_id && ` | Owner: ${flow.user_id}`}
                     {flow.creation_timestamp && ` | Created: ${new Date(flow.creation_timestamp).toLocaleString()}`}
                     {flow.start_timestamp && ` | Started: ${new Date(flow.start_timestamp).toLocaleString()}`}
                     {flow.completion_timestamp && ` | Finished: ${new Date(flow.completion_timestamp).toLocaleString()}`}
                </small>

                {/* Flow Actions */}
                <div className="mb-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}
                     {/* Start Button */}
                     {(flow.status === 'idle' || flow.status === 'completed' || flow.status === 'failed' || flow.status === 'cancelled') && ((
                         <button
                             className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={handleStartFlow}
                             disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}
                         >
                             {isStarting ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Play size={18} className="inline-block mr-2"/>)}
                             {isStarting ? 'Starting...' : 'Start'}
                         </button>
                     ))}
                      {/* Pause Button */}
                     {flow.status === 'in-progress' && ((
                         <button
                             className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={handlePauseFlow}
                             disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}
                         >
                             {isPausing ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Pause size={18} className="inline-block mr-2"/>)}
                             {isPausing ? 'Pausing...' : 'Pause'}
                         </button>
                     ))}
                      {/* Resume Button */}
                     {flow.status === 'paused' && ((
                         <button
                             className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={handleResumeFlow}
                             disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}
                         >
                             {isResuming ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Play size={18} className="inline-block mr-2"/>)}
                             {isResuming ? 'Resuming...' : 'Resume'}
                         </button>
                     ))}
                      {/* Cancel Button */}
                     {(flow.status === 'pending' || flow.status === 'in-progress' || flow.status === 'paused') && ((
                         <button
                             className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={handleCancelFlow}
                             disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}
                         >
                             {isCancelling ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <XCircle size={18} className="inline-block mr-2"/>)}
                             {isCancelling ? 'Cancelling...' : 'Cancel'}
                         </button>
                     ))}
                     {/* Retry Button */}
                     {(flow.status === 'failed' || flow.status === 'cancelled') && ((
                         <button
                             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={() => handleStartFlow()} // Retry is just starting again
                             disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}
                         >
                             {isStarting ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <RotateCcw size={18} className="inline-block mr-2"/>)}
                             Retry
                         </button>
                     ))}
                     {/* Edit Structure Button */}
                     <Link to={`/flows/${flow.id}/edit`} className="px-6 py-2 text-sm bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition disabled:opacity-50">
                         <Edit size={18} className="inline-block mr-2"/> Edit Structure
                     </Link>
                      {/* Delete Flow Button */}
                     <button
                        className="px-6 py-2 bg-red-800 text-white font-semibold rounded-md hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDeleteFlow}
                        disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting || flow.status === 'in-progress'} // Disable if running or other ops are running
                     >
                        {isDeleting ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Trash2 size={18} className="inline-block mr-2"/>)}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                     </button>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-grow border border-neutral-600 rounded-md overflow-hidden" style={{ height: '500px' }}> {/* Fixed height for visualization */}
                    <ReactFlowProvider> {/* Wrap with provider */}
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesState}
                            nodeTypes={nodeTypes} // Use custom node types
                            fitView // Automatically fit the view to the nodes
                            attributionPosition="bottom-left"
                            // Disable interactive features for viewing
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={true}
                            panOnDrag={true}
                            zoomOnScroll={true}
                            // Disable delete key in viewer
                            // deleteKeyCode={['Backspace', 'Delete']}
                            // Add node click handler to show details
                            onNodeClick={onNodeClick}
                        >
                            <MiniMap />
                            <Controls />
                            <Background variant="dots" gap={12} size={1} />
                        </ReactFlow>
                    </ReactFlowProvider> {/* End Provider */}
                </div>

                {/* New: Node Details Modal/Sidebar */}
                {selectedNodeDetails && (
                    <div className="absolute top-4 right-4 bg-neutral-800/90 p-4 rounded-lg shadow-xl max-w-sm max-h-[95%] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 z-10"> {/* Added absolute positioning and z-index */}
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-semibold text-blue-300">Node Details</h4>
                            <button onClick={() => setSelectedNodeDetails(null)} className="text-neutral-400 hover:text-white"><XCircle size={20} /></button>
                        </div>
                        <div className="text-neutral-300 text-sm space-y-4"> {/* Increased space-y */}
                            <div>
                                <p><span className="font-semibold">ID:</span> {selectedNodeDetails.node_id_in_flow}</p>
                                <p><span className="font-semibold">Type:</span> {selectedNodeDetails.type}</p>
                                <p><span className="font-semibold">Description:</span> {selectedNodeDetails.description}</p>
                            </div>
                            {selectedNodeDetails.action && (
                                 <div className="p-3 bg-neutral-700/50 rounded-md"> {/* Added background/padding */}
                                     <h5 className="text-neutral-300 text-sm font-semibold mb-2">Action Configuration:</h5>
                                     {/* --- Modified: Use ActionEditor component here --- */}
                                     <ActionEditor
                                         action={selectedNodeDetails.action}
                                         onChange={() => {}} // No-op for onChange as this is view-only
                                         disabled={true} // Disable editing
                                         availableRunes={availableRunes} // Pass data for display context
                                         availableAbilities={availableAbilities} // Pass data for display context
                                         availableGoals={availableGoals} // Pass data for display context
                                     />
                                     {/* --- End Modified --- */}
                                 </div>
                            )}
                            {selectedNodeDetails.decision_logic && (
                                 <div className="p-3 bg-neutral-700/50 rounded-md"> {/* Added background/padding */}
                                     <h5 className="text-neutral-300 text-sm font-semibold mb-2">Decision Logic (JSON):</h5>
                                     <pre className="bg-neutral-900 p-2 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-700">
                                         {JSON.stringify(selectedNodeDetails.decision_logic, null, 2)}
                                     </pre>
                                 </div>
                            )}
                            {/* TODO: Add buttons to view/edit the full record in the KB page */}
                        </div>
                    </div>
                )}
                {/* End New */}

                {/* Execution History */}
                <div className="mt-8 p-4 bg-neutral-700/50 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">Execution History ({executions.length})</h3>
                    {executions.length === 0 ? (
                        <p className="text-neutral-400">No execution history found for this flow.</p>
                    ) : (
                        <ul className="space-y-4">
                            {executions.map((execution) => (
                                <li key={execution.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 ${getFlowStatusColor(execution.status).replace('text-', 'border-')}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Workflow size={20} className="text-blue-400"/>
                                            <h4 className={`font-semibold mb-1 ${getFlowStatusColor(execution.status)}`}>Execution ID: {execution.id.substring(0, 8)}...</h4>
                                        </div>
                                         <button onClick={() => toggleExpandExecution(execution.id)} className="text-neutral-400 hover:text-white transition">
                                            {expandedExecutions[execution.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                         </button>
                                    </div>
                                    <p className="text-neutral-300 text-sm">Status: <span className={getFlowStatusColor(execution.status)}>{execution.status}</span></p>
                                    <small className="text-neutral-400 text-xs block mt-1">
                                        Started: {new Date(execution.start_timestamp).toLocaleString()}
                                         {execution.completion_timestamp && ` | Finished: ${new Date(execution.completion_timestamp).toLocaleString()}`}
                                          {execution.current_node_id && execution.status === 'in-progress' && ` | Current Node: ${execution.current_node_id}`}
                                    </small>

                                    {/* Execution Details (Collapsible) */}
                                    {expandedExecutions[execution.id] && ((
                                        <div className="mt-4 border-t border-neutral-600 pt-4">
                                            {execution.error && (
                                                <div className="mb-4">
                                                    <h5 className="text-red-400 text-sm font-semibold mb-2">Error:</h5>
                                                    <p className="text-red-300 text-sm">{execution.error}</p>
                                                </div>
                                            )}
                                             {execution.result && (
                                                <div className="mb-4">
                                                    <h5 className="text-neutral-300 text-sm font-semibold mb-2">Result:</h5>
                                                    <pre className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-600">
                                                        {JSON.stringify(execution.result, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                            {execution.execution_log_summary && (
                                                <div className="mb-4">
                                                    <h5 className="text-neutral-300 text-sm font-semibold mb-2">Log Summary:</h5>
                                                    <pre className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-600">
                                                        {execution.execution_log_summary}
                                                    </pre>
                                                </div>
                                            )}
                                            {/* TODO: Add more detailed execution steps/node results if available */}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default AgenticFlowDetail;
```