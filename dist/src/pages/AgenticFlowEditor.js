import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
`` `typescript
// src/pages/AgenticFlowEditor.tsx
// Agentic Flow Editor Page (自我交付編輯器)
// Provides a visual editor for defining and modifying Agentic Flows (Dynamic DAG Workflows).
// --- New: Create a page for Agentic Flow Editor UI ---
// --- New: Implement fetching Agentic Flow data by ID ---
// --- New: Integrate React Flow for DAG visualization and editing ---
// --- New: Add placeholder logic for node/edge operations and property editing ---
// --- New: Add Realtime Updates for Agentic Flow, Nodes, and Edges ---
// --- Modified: Add Run Button functionality ---
// --- New: Implement fetching and displaying Execution History ---
// --- New: Add Realtime Updates for Agentic Flow Executions ---
// --- Modified: Add Edit Button linking to Editor page ---
// --- Modified: Implement Save Button functionality connecting to backend ---
// --- Modified: Implement Run Flow Button functionality ---
// --- Modified: Integrate ActionEditor component into Node Properties panel ---
// --- New: Complete Node/Edge Properties Editor Panel ---
// --- Modified: Implement Add Node, Delete Node, Add Edge, Delete Edge functionality ---\


import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // To get the flow ID from the URL and navigate
import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and update flow details and trigger actions
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes
import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals
import { AgenticFlow, AgenticFlowNode, AgenticFlowEdge, Rune, ForgedAbility, Goal } from '../interfaces'; // Import types
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
  addEdge,
  Connection,
  EdgeTypes,
  NodeTypes,
  OnNodesChange, // Import OnNodesChange type
  OnEdgesChange, // Import OnEdgesChange type
  OnConnect,
  OnNodesDelete,
  OnEdgesDelete,
  applyNodeChanges, // Import applyNodeChanges
  applyEdgeChanges, // Import applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles
import dagre from '@react-flow/dagre'; // Import Dagre layout algorithm
import { ArrowLeft, Save, Loader2, PlusCircle, Trash2, Edit, XCircle, Info, Play } from 'lucide-react'; // Import icons including Play
// --- Modified: Import ActionEditor component ---\
import ActionEditor from '../components/ActionEditor';
// --- End Modified ---\


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
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


// --- New: Custom Node Component (Placeholder) ---\
// This component will render the content of each node in the React Flow graph.
// It should display node details and potentially include inline editing or buttons.
const CustomFlowNode: React.FC<{ data: { label: string, nodeData: AgenticFlowNode, onEditClick: (node: AgenticFlowNode) => void } }> = ({ data }) => {
    const { label, nodeData, onEditClick } = data;
    const isEntryNode = nodeData.node_id_in_flow === (window.systemContext?.currentFlow?.entry_node_id || 'start'); // Check if it's the entry node

    // Determine border color based on execution status
    const borderColor = isEntryNode ? 'border-green-500' : 'border-blue-500'; // Default for other nodes if no execution status

    return (
        <div className={`;
p - 3;
rounded - md;
border - l - 4;
$;
{
    borderColor;
}
bg - neutral - 700 / 70;
shadow - md;
w - [$, { nodeWidth }, px];
h - [$, { nodeHeight }, px];
overflow - hidden;
flex;
flex - col `}>
            <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-semibold text-blue-200 overflow-hidden text-ellipsis whitespace-nowrap">
                    Node: {nodeData.node_id_in_flow} ({nodeData.type})
                </div>
                <button onClick={() => onEditClick(nodeData)} className="text-neutral-400 hover:text-white transition">
                    <Edit size={16} />
                </button>
            </div>
            <div className="text-neutral-300 text-xs flex-grow overflow-hidden">
                {nodeData.description || 'No description.'}
            </div>
            {/* TODO: Add visual indicators for action/decision logic presence */}
            {nodeData.action && <span className="text-neutral-400 text-xs mt-1">Action: {nodeData.action.type}</span>}
            {nodeData.decision_logic && <span className="text-neutral-400 text-xs mt-1">Decision Logic Present</span>}
        </div>
    );
};

// Define custom node types
const nodeTypes: NodeTypes = {
    default: CustomFlowNode, // Use our custom component for the default type
    // TODO: Define specific node types if needed (e.g., 'decision', 'action')
};
// --- End Custom Node Component ---


const AgenticFlowEditor: React.FC = () => {
  const { flowId } = useParams<{ flowId: string }>(); // Get flowId from URL params
  const navigate = useNavigate(); // Hook for navigation

  const [flow, setFlow] = useState<AgenticFlow | null>(null); // State for the flow details
  const [nodes, setNodes, onNodesChange] = useNodesState([]); // React Flow nodes state
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // React Flow edges state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // --- New: State for running flow ---\
  const [isRunningFlow, setIsRunningFlow] = useState(false);
  // --- End New ---\


  // --- New: State for editing node/edge properties ---\
  const [editingNode, setEditingNode] = useState<Node | null>(null); // The React Flow node being edited
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null); // The React Flow edge being edited
  const [nodeProperties, setNodeProperties] = useState<Partial<AgenticFlowNode>>({}); // Properties of the node being edited
  const [edgeProperties, setEdgeProperties] = useState<Partial<AgenticFlowEdge>>({}); // Properties of the edge being edited
  const [propertiesError, setPropertiesError] = useState<string | null>(null); // Error for properties form
  // --- End New ---\

  // --- New: States for data needed by ActionEditor and Node/Edge forms ---\
  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);
  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);
  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results
  // --- End New ---\


  // --- New: Layout function using Dagre ---\
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
  // --- End New ---\


  // --- New: Convert Agentic Flow Data to React Flow format with Layout ---\
  const flowToReactFlowData = useCallback((agenticFlow: AgenticFlow) => {
      // Store the flow definition in the global context for access by custom nodes
      window.systemContext.currentFlow = agenticFlow;

      const reactFlowNodes: Node[] = agenticFlow.nodes.map((node) => {
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
                  onEditClick: handleEditNodeClick, // Pass the edit handler
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
                  onEditClick: handleEditEdgeClick, // Pass the edit handler
              }
          };
      });

      // Apply layout algorithm
      const layouted = getLayoutedElements(reactFlowNodes, reactFlowEdges, 'TB'); // Use 'TB' for top-to-bottom layout

      return { nodes: layouted.nodes, edges: layouted.edges };
  }, [getLayoutedElements]); // Re-generate React Flow data if layout function changes


  const fetchFlowData = useCallback(async () => {
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
              // Convert fetched flow data to React Flow format and apply layout
              const reactFlowData = flowToReactFlowData(fetchedFlow);
              setNodes(reactFlowData.nodes);
              setEdges(reactFlowData.edges);
          } else {
              // If flow not found
              setFlow(null);
              setNodes([]); // Clear React Flow state
              setEdges([]); // Clear React Flow state
          }

      } catch (err: any) {
          console.error(`;
Error;
fetching;
data;
for (flow; $; { flowId })
    : `, err);
          setError(`;
Failed;
to;
load;
flow;
data: $;
{
    err.message;
}
`);
          setFlow(null);
          setNodes([]); // Clear React Flow state
          setEdges([]); // Clear React Flow state
      } finally {
          setLoading(false);
      }
  }, [selfNavigationEngine, systemContext?.currentUser?.id, flowId, setFlow, setNodes, setEdges, setLoading, setError, flowToReactFlowData]); // Dependencies for useCallback


    // --- New: Fetch data needed by ActionEditor and Node/Edge forms ---\
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
            // setError(`;
Failed;
to;
load;
data;
for (action; editor; )
    : $;
{
    err.message;
}
`);
            setAvailableRunes([]);
            setAvailableAbilities([]);
            setAvailableGoals([]);
        } finally {
             // Ensure loading state is false even if fetching secondary data fails
             // setLoading(false); // This is handled by fetchFlowData
        }
    }, [systemContext?.currentUser?.id, sacredRuneEngraver, authorityForgingEngine, goalManagementService]);
    // --- End New ---\


  useEffect(() => {
    // Fetch data when the component mounts or when the user changes or flowId changes
    if (systemContext?.currentUser?.id && flowId) {
        fetchFlowData(); // Fetch data for the specific flow
        // --- New: Fetch data needed by ActionEditor ---\
        fetchActionEditorData();
        // --- End New ---\
    }

    // TODO: Subscribe to realtime updates for this specific flow, its nodes, and edges
    // If updates happen externally, we need to refetch and re-layout the graph.
    // This is complex and deferred for MVP.

    return () => {
        // Unsubscribe on component unmount
        // Clear the currentFlow from global context
        window.systemContext.currentFlow = null;
    };

  }, [flowId, systemContext?.currentUser?.id, selfNavigationEngine, fetchFlowData, fetchActionEditorData]); // Re-run effect when flowId, user ID, services, or fetch functions change


    // --- New: Handle Node/Edge Changes from React Flow ---\
    // These handlers update the local React Flow state.
    // Saving to the backend happens explicitly via the Save button.
    const onNodesChangeHandler: OnNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
        // Clear editing state if the edited node is deleted or changed significantly
        if (editingNode) {
            const deletedChange = changes.find(c => c.type === 'remove' && c.id === editingNode.id);
            const positionChange = changes.find(c => c.type === 'position' && c.id === editingNode.id);
            if (deletedChange || positionChange) { // Clear edit state on delete or move
                 setEditingNode(null);
                 setNodeProperties({});;
                 setPropertiesError(null);
            }
        }
    }, [setNodes, editingNode]);

    const onEdgesChangeHandler: OnEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
         // Clear editing state if the edited edge is deleted or changed significantly
        if (editingEdge) {
            const deletedChange = changes.find(c => c.type === 'remove' && c.id === editingEdge.id);
             if (deletedChange) { // Clear edit state on delete
                 setEditingEdge(null);
                 setEdgeProperties({});
                 setPropertiesError(null);
             }
        }
    }, [setEdges, editingEdge]);

    const onConnect: OnConnect = useCallback((connection) => {
        // Add a new edge when nodes are connected
        // Generate a simple ID for the new edge
        const newEdgeId = `;
e - $;
{
    connection.source;
}
-$;
{
    connection.target;
}
-$;
{
    Date.now();
}
`;
        const newEdge: Edge = {
            id: newEdgeId,
            source: connection.source,
            target: connection.target,
            type: 'default', // Default edge type
            label: 'New Edge', // Default label
            // Add default condition if needed (e.g., null for unconditional)
            data: {
                 edgeData: { // Store placeholder edge data
                     id: 'temp-edge-' + Date.now() + '-' + Math.random().toString(16).slice(2), // Temporary DB ID
                     flow_id: flow?.id || 'temp', // Link to the current flow (temp if flow not loaded)
                     edge_id_in_flow: newEdgeId, // Use the generated ID as ID in flow for now
                     source_node_id: connection.source, // Source node ID from React Flow
                     target_node_id: connection.target, // Target node ID from React Flow
                     condition: null, // Default to unconditional
                 } as AgenticFlowEdge,
                 onEditClick: handleEditEdgeClick, // Pass the edit handler
            }
        };
        setEdges((eds) => addEdge(newEdge, eds));
        console.log('Added new edge:', newEdge);
        // Automatically select and open properties for the new edge
        // handleEditEdgeClick(null as any, newEdge); // Pass null event for now
    }, [setEdges, flow]); // Re-run if flow changes

    const onNodesDelete: OnNodesDelete = useCallback((deletedNodes) => {
        console.log('Nodes deleted:', deletedNodes);
        // Clear editing state if the edited node was deleted
        if (editingNode && deletedNodes.some(node => node.id === editingNode.id)) {
            setEditingNode(null);
            setNodeProperties({});;
            setPropertiesError(null);
        }
        // Deletion from backend happens on Save
    }, [editingNode]);

    const onEdgesDelete: OnEdgesDelete = useCallback((deletedEdges) => {
        console.log('Edges deleted:', deletedEdges);
        // Clear editing state if the edited edge was deleted
        if (editingEdge && deletedEdges.some(edge => edge.id === editingEdge.id)) {
            setEditingEdge(null);
            setEdgeProperties({});
            setPropertiesError(null);
        }
    }, [editingEdge]);

    // --- End New ---\


    // --- New: Handle Add Node ---\
    const handleAddNode = () => {
        const newNodeId = `;
node - $;
{
    nodes.length + 1;
}
`; // Simple sequential ID
        const newNode: Node = {
            id: newNodeId,
            // Position it near the center of the view, or relative to an existing node
            position: { x: window.innerWidth / 2 - nodeWidth / 2, y: window.innerHeight / 2 - nodeHeight / 2 }, // Center of viewport (rough)
            data: {
                label: newNodeId,
                nodeData: { // Store placeholder node data
                    id: 'temp-node-' + Date.now() + '-' + Math.random().toString(16).slice(2), // Temporary DB ID
                    flow_id: flow?.id || 'temp', // Link to the current flow (temp if flow not loaded)
                    node_id_in_flow: newNodeId, // Use the generated ID as ID in flow
                    type: 'task_step', // Default node type
                    description: `;
New;
$;
{
    newNodeId;
}
`, // Default description
                    action: { type: 'log', details: { message: '' } }, // Default action
                    decision_logic: null, // Default to no decision logic
                } as AgenticFlowNode,
                onEditClick: handleEditNodeClick, // Pass the edit handler
            },
            type: 'default', // Use our custom node type
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
             style: {
                padding: 0,
                backgroundColor: 'transparent',
                width: nodeWidth,
                height: nodeHeight,
                border: 'none',
            },
        };
        setNodes((nds) => nds.concat(newNode));
        console.log('Added new node:', newNode);
        // Automatically select and open properties for the new node
        setEditingNode(newNode); // Set the React Flow node for editing
        setNodeProperties(newNode.data.nodeData); // Set the underlying AgenticFlowNode data for the form
        setEditingEdge(null); // Ensure edge editing is closed
        setEdgeProperties({});
        setPropertiesError(null);
    };
    // --- End New ---\


    // --- New: Handle Edit Node/Edge ---\
    const handleEditNodeClick = (nodeData: AgenticFlowNode) => {
        // Find the corresponding React Flow node
        const node = nodes.find(n => n.id === nodeData.node_id_in_flow); // Find by node_id_in_flow
        if (node) {
            setEditingNode(node); // Set the React Flow node for editing
            // Deep copy node data for editing
            setNodeProperties(JSON.parse(JSON.stringify(nodeData))); // Set the underlying AgenticFlowNode data for the form
            setEditingEdge(null); // Ensure edge editing is closed
            setEdgeProperties({});
            setPropertiesError(null);
        }
    };

    const handleEditEdgeClick = (event: React.MouseEvent, edge: Edge) => {
         // Prevent default behavior (e.g., opening context menu)
         event.preventDefault();
        // Find the original edge data (stored in edge.data.edgeData)
        const edgeData = edge.data?.edgeData; // Use optional chaining
        if (edgeData) {
            setEditingEdge(edge); // Set the React Flow edge for editing
            // Deep copy edge data for editing
            setEdgeProperties(JSON.parse(JSON.stringify(edgeData))); // Set the underlying AgenticFlowEdge data for the form
            setEditingNode(null); // Ensure node editing is closed
            setNodeProperties({});
            setPropertiesError(null);
        }
    };

    const handleSaveProperties = () => {
        if (editingNode) {
            // Validate node properties before saving
            if (!nodeProperties.node_id_in_flow || !nodeProperties.type || !nodeProperties.description) {
                 setPropertiesError('Node ID, Type, and Description are required.');
                 return;
            }
            // TODO: Add more specific validation based on node type (e.g., action for task_step, logic for decision)

            // Update the node in the React Flow state
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === editingNode.id
                        ? {
                              ...node,
                              data: {
                                  ...node.data,
                                  label: nodeProperties.description || nodeProperties.node_id_in_flow, // Update label
                                  nodeData: nodeProperties as AgenticFlowNode, // Update the stored node data
                              },
                          }
                        : node
                )
            );
            console.log('Updated node properties locally:', editingNode.id, nodeProperties);
            setEditingNode(null); // Close properties panel
            setNodeProperties({});
            setPropertiesError(null);

        } else if (editingEdge) {
            // Validate edge properties before saving
            // TODO: Add validation for edge properties (e.g., condition format)

            // Update the edge in the React Flow state
            setEdges((eds) =>
                eds.map((edge) =>
                    edge.id === editingEdge.id
                        ? {
                              ...edge,
                              label: edgeProperties.condition ? 'Conditional' : 'Unconditional', // Update label based on condition
                              style: { ...edge.style, stroke: edgeProperties.condition ? '#ffcc00' : '#999' }, // Update color
                              data: {
                                  ...edge.data,
                                  edgeData: edgeProperties as AgenticFlowEdge, // Update the stored edge data
                              },
                          }
                        : edge
                )
            );
            console.log('Updated edge properties locally:', editingEdge.id, edgeProperties);
            setEditingEdge(null); // Close properties panel
            setEdgeProperties({});
            setPropertiesError(null);
        }
    };

    const handleCancelProperties = () => {
        setEditingNode(null);
        setNodeProperties({});
        setEditingEdge(null);
        setEdgeProperties({});
        setPropertiesError(null);
        // Note: Changes made in the form are lost if cancelled
    };
    // --- End New ---\


    // --- New: Handle Save Flow to Backend ---\
    const handleSaveFlow = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !flow) {
            alert("SelfNavigationEngine module not initialized, user not logged in, or flow data is missing.");
            return;
        }

        // Convert React Flow nodes and edges back to Agentic Flow format
        // Extract the underlying AgenticFlowNode/Edge data stored in the 'data' property
        const updatedNodes: AgenticFlowNode[] = nodes.map(node => node.data.nodeData);
        const updatedEdges: AgenticFlowEdge[] = edges.map(edge => edge.data?.edgeData || { // Use stored edgeData or reconstruct basic edge
             // If edgeData is missing, it's likely a newly drawn edge without properties edited yet.
             // Reconstruct basic edge data using React Flow edge properties.
             // Note: the 'id' here is the React Flow edge ID, which might be a temporary client-side ID.
             // The backend's updateAgenticFlowStructure should handle assigning DB UUIDs for new entries.
             id: edge.id, // Use React Flow ID as temporary identifier
             flow_id: flow.id, // Link to the current flow (temp if flow not loaded)
             edge_id_in_flow: edge.id, // Use the React Flow ID as the ID within the flow structure
             source_node_id: edge.source, // Source node ID from React Flow
             target_node_id: edge.target, // Target node ID from React Flow
             condition: null, // Default to unconditional if not set
        });

        // Basic validation before saving
        if (updatedNodes.length === 0) {
             alert('Cannot save flow: Must have at least one node.');
             return;
        }
        const entryNodeExists = updatedNodes.some(node => node.node_id_in_flow === flow.entry_node_id); // Check if the original entry node ID still exists
        if (!entryNodeExists) {
             // If the original entry node was deleted, maybe prompt the user to select a new one
             alert(`;
Cannot;
save;
flow: the;
original;
entry;
node;
'${flow.entry_node_id}';
was;
deleted.Please;
set;
a;
new entry;
node;
before;
saving. `);
             // TODO: Implement UI to select a new entry node
             return;
        }
        // TODO: Add more robust validation (e.g., check for orphaned nodes, invalid edge targets, cycles if not allowed)


        // Create the updated flow object (only flow-level fields that can be edited here, plus nodes/edges)
        // For MVP, we are not editing flow name/description/entry_node_id on this page.
        // The `;
updateAgenticFlowStructure ` method handles updating nodes/edges based on the provided lists.
        // It also implicitly updates the flow's last_updated_timestamp.

        console.log('Attempting to save flow structure:', flow.id);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:flows:save_editor',
            details: { flowId: flow.id, flowName: flow.name, nodeCount: updatedNodes.length, edgeCount: updatedEdges.length },
            context: { platform: 'web', page: 'flow_editor' },
            user_id: userId, // Associate action with user
        });


        setIsSaving(true);
        setError(null); // Clear main error
        try {
            // Call the SelfNavigationEngine method to update the flow structure
            // This method handles inserting new, updating existing, and deleting removed nodes/edges.
            const savedFlow = await selfNavigationEngine.updateAgenticFlowStructure(flow.id, updatedNodes, updatedEdges, userId); // Pass flowId, updatedNodes, updatedEdges, userId

            if (savedFlow) {
                alert(`;
Flow;
"${savedFlow.name}\\\" saved successfully!`);;
console.log('Flow saved:', savedFlow);
// Refetch data to ensure UI is consistent with the backend (especially for new DB IDs)
fetchFlowData(); // This will update the local state (flow, nodes, edges)
{
    setError('Failed to save flow.');
}
try { }
catch (err) {
    console.error('Error saving flow:', err);
    setError(`Failed to save flow: ${err.message}`);
}
finally {
    setIsSaving(false);
}
;
// --- End New ---\
// --- New: Handle Run Flow ---\
const handleRunFlow = async () => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId || !flowId || !flow) {
        alert("SelfNavigationEngine module not initialized or user not logged in, or flow data is missing.");
        return;
    }
    // Basic check: Cannot run if flow is already in progress
    if (flow.status === 'in-progress') {
        alert('Flow is already in progress.');
        return;
    }
    console.log(`Attempting to run flow: ${flow.name} (${flowId}) from editor.`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:flows:run_editor',
        details: { flowId: flow.id, flowName: flow.name },
        context: { platform: 'web', page: 'flow_editor' },
        user_id: userId, // Associate action with user
    });
    setIsRunningFlow(true); // Indicate running state
    setError(null); // Clear previous errors
    try {
        // Call the SelfNavigationEngine method to start the flow
        // Pass initialParams if needed (not implemented in UI yet)
        await selfNavigationEngine.startAgenticFlow(flowId, userId, {}); // Pass flowId, userId, initialParams
        console.log(`Flow ${flow.name} execution initiated.`);
        // Status and execution history updates will be handled by event listeners on the detail page.
        // Navigate to the detail page to view the execution progress.
        navigate(`/flows/${flowId}`);
    }
    catch (err) {
        console.error('Error running flow from editor:', err);
        setError(`Failed to run flow: ${err.message}`);
        alert(`Failed to run flow: ${err.message}`);
    }
    finally {
        setIsRunningFlow(false);
    }
};
// --- End New ---\
// Ensure user is logged in before rendering content
if (!systemContext?.currentUser) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (_jsx("div", { className: "container mx-auto p-4 flex justify-center", children: _jsx("div", { className: "bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300", children: _jsx("p", { children: "Please log in to edit Agentic Flows." }) }) }));
}
return (_jsxs("div", { className: "container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]", children: [" ", _jsxs("div", { className: "bg-neutral-800/50 p-6 rounded-lg shadow-xl flex flex-col flex-grow", children: [" ", loading ? (_jsx("p", { className: "text-neutral-400", children: "Loading flow details..." })) : error ? (_jsxs("p", { className: "text-red-400", children: ["Error: ", error] })) : !flow ? (_jsx("p", { className: "text-neutral-400", children: "Agentic Flow not found." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(Link, { to: `/flows/${flow.id}`, className: "text-neutral-400 hover:text-white transition", children: _jsx(ArrowLeft, { size: 24 }) }), _jsxs("h2", { className: "text-3xl font-bold text-blue-400", children: ["Editing Flow: ", flow.name] })] }), _jsx("p", { className: "text-neutral-300 mb-4", children: flow.description || 'No description.' }), _jsxs("small", { className: "text-neutral-400 text-xs block mb-4", children: ["ID: ", flow.id, " | Entry Node: ", flow.entry_node_id, flow.user_id && ` | Owner: ${flow.user_id}`, flow.creation_timestamp && ` | Created: ${new Date(flow.creation_timestamp).toLocaleString()}`, "\\", flow.start_timestamp && ` | Started: ${new Date(flow.start_timestamp).toLocaleString()}`, "\\", flow.completion_timestamp && ` | Finished: ${new Date(flow.completion_timestamp).toLocaleString()}`, "\\"] }), "\\ \\", "\\", _jsxs("div", { className: "mb-4 flex flex-wrap gap-2", children: [" ", "\\", "\\", _jsx("button", {}), "\\ className=\"px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\\ onClick=", handleAddNode, "\\ disabled=", isSaving || isRunningFlow, "\\ >\\", _jsx(PlusCircle, { size: 16, className: "inline-block mr-1" }), " Add Node\\"] }), "\\", "\\", _jsx("button", {}), "\\ className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\\ onClick=", handleSaveFlow, "\\ disabled=", isSaving || isRunningFlow, "\\ >\\", isSaving ? _jsx(Loader2, { size: 18, className: "inline-block mr-2 animate-spin" }) : _jsx(Save, { size: 18, className: "inline-block mr-2" }), ")}\\", isSaving ? 'Saving...' : 'Save Flow', "\\"] })), "button>\\", "\\", _jsx("button", {}), "\\ className=\"px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\\ onClick=", handleRunFlow, "\\ disabled=", isSaving || isRunningFlow || flow.status === 'in-progress', " // Disable if saving, already running, or flow status is in-progress\\ >\\", isRunningFlow ? _jsx(Loader2, { size: 18, className: "inline-block mr-2 animate-spin" }) : _jsx(Play, { size: 18, className: "inline-block mr-2" }), ")}\\", isRunningFlow ? 'Running...' : 'Run Flow', "\\"] }), "\\", "\\", "\\"] }));
{ /* React Flow Canvas */ }
_jsxs("div", { className: "flex-grow border border-neutral-600 rounded-md overflow-hidden", style: { height: '500px' }, children: [" ", "\\", _jsxs(ReactFlowProvider, { children: [" ", "\\", _jsx(ReactFlow, {}), "\\ nodes=", nodes, "\\ edges=", edges, "\\ onNodesChange=", onNodesChangeHandler, " // Use our handler\\ onEdgesChange=", onEdgesChangeHandler, " // Use our handler\\ onConnect=", onConnect, " // Handle new connections\\ onNodesDelete=", onNodesDelete, " // Handle node deletion\\ onEdgesDelete=", onEdgesDelete, " // Handle edge deletion\\ nodeTypes=", nodeTypes, " // Use custom node types\\ fitView // Automatically fit the view to the nodes\\ attributionPosition=\"bottom-left\"\\ // Enable interactive features for editing\\ nodesDraggable=", true, "\\ nodesConnectable=", true, "\\ elementsSelectable=", true, "\\ panOnDrag=", true, "\\ zoomOnScroll=", true, "\\ deleteKeyCode=", ['Backspace', 'Delete'], " // Enable delete key\\ onNodeClick=", (event, node) => handleEditNodeClick(node.data.nodeData), " // Handle click to edit node\\ onEdgeClick=", (event, edge) => handleEditEdgeClick(event, edge), " // Handle click to edit edge\\ >\\", _jsx(MiniMap, {}), "\\", _jsx(Controls, {}), "\\", _jsx(Background, { variant: "dots", gap: 12, size: 1 }), "\\"] }), "\\"] });
{ /* End Provider */ }
div > ;
{ /* New: Node/Edge Properties Editor Panel */ }
{
    (editingNode || editingEdge) && ();
    _jsxs("div", { className: "mt-4 p-4 bg-neutral-700/50 rounded-lg", children: ["\\", _jsxs("div", { className: "flex justify-between items-center mb-3", children: ["\\", _jsx("h3", { className: "text-xl font-semibold text-blue-300", children: editingNode ? `Edit Node: ${editingNode.id}` : `Edit Edge: ${editingEdge?.id}` }), "\\", _jsxs("button", { onClick: handleCancelProperties, className: "text-neutral-400 hover:text-white transition", children: ["\\", _jsx(XCircle, { size: 20 }), "\\"] }), "\\"] }), "\\", propertiesError && _jsxs("p", { className: "text-red-400 text-sm mb-4", children: ["Error: ", propertiesError] }), "\\ \\", editingNode && nodeProperties && (), "\\", _jsxs("div", { className: "space-y-4", children: ["\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "node-id", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Node ID:" }), "\\", _jsx("input", { id: "node-id", type: "text", value: nodeProperties.node_id_in_flow || '', className: "w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed", disabled: true }), "\\"] }), "\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "node-type", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Type:" }), "\\", _jsx("select", {}), "\\ id=\"node-type\"\\ className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\\ value=", nodeProperties.type || '', "\\ onChange=", (e) => setNodeProperties({ ...nodeProperties, type: e.target.value, action: undefined, decision_logic: undefined }), " // Reset action/logic when type changes\\ disabled=", isSaving, "\\ required\\ >\\", _jsx("option", { value: "task_step", children: "task_step" }), "\\", _jsx("option", { value: "decision", children: "decision" }), "\\", _jsx("option", { value: "parallel", children: "parallel" }), "\\", _jsx("option", { value: "sub_workflow", children: "sub_workflow" }), "\\", _jsx("option", { value: "rune_action", children: "rune_action" }), " ", "\\", _jsx("option", { value: "ability_execution", children: "ability_execution" }), " ", "\\", _jsx("option", { value: "manual_input", children: "manual_input" }), "\\", "\\"] }), "\\"] }), "\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "node-description", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Description:" }), "\\", _jsx("input", {}), "\\ id=\"node-description\"\\ type=\"text\"\\ className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\\ value=", nodeProperties.description || '', "\\ onChange=", (e) => setNodeProperties({ ...nodeProperties, description: e.target.value }), "\\ placeholder=\"Enter node description\"\\ disabled=", isSaving, "\\ required\\ />\\"] }), "\\ \\", "\\", (nodeProperties.type === 'task_step' || nodeProperties.type === 'rune_action' || nodeProperties.type === 'ability_execution') && (()), "\\", _jsxs("div", { className: "p-3 bg-neutral-600/50 rounded-md", children: ["\\", _jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Action Configuration:" }), "\\", _jsx(ActionEditor, {}), "\\ action=", nodeProperties.action || { type: 'log', details: { message: '' } }, " // Provide default action if none exists\\ onChange=", (newAction) => setNodeProperties({ ...nodeProperties, action: newAction, decision_logic: undefined }), " // Update action, clear decision logic\\ disabled=", isSaving, "\\ availableRunes=", availableRunes, "\\ availableAbilities=", availableAbilities, "\\ availableGoals=", availableGoals, " // Pass available goals\\ />\\"] }), "\\ ))}\\ \\", "\\", nodeProperties.type === 'decision' && (()), "\\", _jsxs("div", { className: "p-3 bg-neutral-600/50 rounded-md", children: ["\\", _jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Decision Logic (JSON):" }), "\\", _jsx("textarea", {}), "\\ className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs\"\\ value=", JSON.stringify(nodeProperties.decision_logic || {}, null, 2), "\\ onChange=", (e) => { }, "\\ try ", , "\\ const logic = JSON.parse(e.target.value);\\ setNodeProperties(", ...(nodeProperties, decision_logic), ": logic, action: undefined }); // Update logic, clear action\\ setPropertiesError(null); // Clear error if parsing is successful\\ } catch (parseError: any) ", , "\\ setPropertiesError(`Invalid JSON: $", parseError.message, "`);\\ }\\ }}\\ rows=", 4, "\\ disabled=", isSaving, "\\ />\\", propertiesError && _jsxs("p", { className: "text-red-400 text-xs mt-1", children: ["Error: ", propertiesError] }), "\\"] }), "\\ ))}\\ \\", "\\", nodeProperties.type === 'parallel' && (()), "\\", _jsxs("div", { className: "p-3 bg-neutral-600/50 rounded-md", children: ["\\", _jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Parallel Configuration:" }), "\\", _jsx("p", { className: "text-neutral-400 text-sm", children: "Configuration for parallel execution branches goes here." }), "\\", "\\"] }), "\\ ))}\\ \\", nodeProperties.type === 'sub_workflow' && (()), "\\", _jsxs("div", { className: "p-3 bg-neutral-600/50 rounded-md space-y-2", children: ["\\", _jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Sub-Workflow Configuration:" }), "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "subflow-id", className: "block text-neutral-400 text-xs font-semibold mb-1", children: "Sub-Workflow ID:" }), "\\", _jsx("input", {}), "\\ id=\"subflow-id\"\\ type=\"text\"\\ className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\\ value=", nodeProperties.action?.details?.subFlowId || '', " // Assuming subFlowId is in action.details\\ onChange=", (e) => setNodeProperties({ ...nodeProperties, action: { type: 'runSubFlow', details: { ...nodeProperties.action?.details, subFlowId: e.target.value } } }), " // Update action details\\ placeholder=\"Enter Sub-Workflow ID\"\\ disabled=", isSaving, "\\ required // Sub-workflow ID is required\\ />\\"] }), "\\", "\\", _jsxs("div", { className: "mt-2 p-2 bg-neutral-700/50 rounded-md", children: ["\\", _jsx("label", { htmlFor: "subflow-params-json", className: "block text-neutral-400 text-xs font-semibold mb-1", children: "Parameters (JSON):" }), "\\", _jsx("textarea", {}), "\\ id=\"subflow-params-json\"\\ className=", `w-full p-1 rounded-md bg-neutral-800 text-white border ${propertiesError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs`, "\\ value=", JSON.stringify(nodeProperties.action?.details?.params || {}, null, 2), "\\ onChange=", (e) => { }, "\\ try ", , "\\ const params = JSON.parse(e.target.value);\\ setNodeProperties(", ...(nodeProperties, action), ": ", type, ": 'runSubFlow', details: ", ...(nodeProperties.action?.details, params), " } }); // Update action details\\ setPropertiesError(null); // Clear error if parsing is successful\\ } catch (parseError: any) ", , "\\ setPropertiesError(`Invalid JSON: $", parseError.message, "`);\\ }\\ }}\\ rows=", 3, "\\ disabled=", isSaving, "\\ />\\", propertiesError && _jsxs("p", { className: "text-red-400 text-xs mt-1", children: ["Error: ", propertiesError] }), "\\"] }), "\\"] }), "\\ ))}\\ \\", nodeProperties.type === 'manual_input' && (()), "\\", _jsxs("div", { className: "p-3 bg-neutral-600/50 rounded-md space-y-2", children: ["\\", _jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Manual Input Configuration:" }), "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "manual-input-prompt", className: "block text-neutral-400 text-xs font-semibold mb-1", children: "Prompt:" }), "\\", _jsx("input", {}), "\\ id=\"manual-input-prompt\"\\ type=\"text\"\\ className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\\ value=", nodeProperties.action?.details?.prompt || '', " // Assuming prompt is in action.details\\ onChange=", (e) => setNodeProperties({ ...nodeProperties, action: { type: 'waitForUserInput', details: { ...nodeProperties.action?.details, prompt: e.target.value } } }), " // Update action details\\ placeholder=\"Enter prompt for user\"\\ disabled=", isSaving, "\\ required // Prompt is required\\ />\\"] }), "\\", "\\"] }), "\\ ))}\\", "\\ \\"] });
}
{
    editingEdge && edgeProperties && ();
    _jsxs("div", { className: "space-y-4", children: ["\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "edge-id", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Edge ID:" }), "\\", _jsx("input", { id: "edge-id", type: "text", value: edgeProperties.edge_id_in_flow || edgeProperties.id || '', className: "w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed", disabled: true }), "\\"] }), "\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "edge-source", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Source Node:" }), "\\", _jsx("input", { id: "edge-source", type: "text", value: edgeProperties.source_node_id || '', className: "w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed", disabled: true }), "\\"] }), "\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "edge-target", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Target Node:" }), "\\", _jsx("input", { id: "edge-target", type: "text", value: edgeProperties.target_node_id || '', className: "w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed", disabled: true }), "\\"] }), "\\", "\\", _jsxs("div", { children: ["\\", _jsx("label", { htmlFor: "edge-condition", className: "block text-neutral-300 text-sm font-semibold mb-1", children: "Condition (JSON):" }), "\\", _jsx("textarea", {}), "\\ id=\"edge-condition\"\\ className=", `w-full p-2 rounded-md bg-neutral-800 text-white border ${propertiesError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`, "\\ value=", JSON.stringify(edgeProperties.condition || null, null, 2), "\\ onChange=", (e) => { }, "\\ try ", , "\\ const condition = JSON.parse(e.target.value);\\ setEdgeProperties(", ...(edgeProperties, condition), "); // Update condition\\ setPropertiesError(null); // Clear error if parsing is successful\\ } catch (parseError: any) ", , "\\ setPropertiesError(`Invalid JSON: $", parseError.message, "`);\\ }\\ }}\\ rows=", 4, "\\ disabled=", isSaving, "\\ />\\", _jsxs("small", { className: "text-neutral-400 text-xs mt-1 block", children: ["Define the condition for this edge (e.g., `", ` \\\"result_is\\\": \\\"success\\\" `, "`). Set to `null` for unconditional."] }), "\\"] }), "\\", "\\"] });
}
_jsxs("div", { className: "flex gap-4 justify-end mt-4", children: ["\\", _jsx("button", {}), "\\ type=\"button\"\\ onClick=", handleCancelProperties, "\\ className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\\ disabled=", isSaving, "\\ >\\ Cancel\\"] });
_jsx("button", { type: "button", onClick: handleSaveProperties, className: "px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", disabled: isSaving || !!propertiesError, children: "\\ Save Properties\\" });
div > ;
div > ;
{ /* End New */ }
 > ;
div > ;
div > ;
;
;
export default AgenticFlowEditor;
`` `;
