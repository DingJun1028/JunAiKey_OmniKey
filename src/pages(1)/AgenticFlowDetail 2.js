"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/AgenticFlowDetail.tsx\n// Agentic Flow Detail Page (\u81EA\u6211\u4EA4\u4ED8\u8A73\u60C5)\n// Displays the details of a single Agentic Flow and its execution history.\n// Allows triggering execution, pausing, resuming, and cancelling.\n// --- New: Create a page to display Agentic Flow details ---\n// --- New: Implement fetching Agentic Flow data by ID ---\n// --- New: Implement fetching and displaying Execution History ---\n// --- New: Add UI for actions (run, edit, delete) ---\n// --- New: Add Realtime Updates for Agentic Flow and Executions ---\n// --- Modified: Add Pause, Resume, Cancel buttons and handlers ---\n// --- New: Integrate React Flow for DAG visualization ---\n// --- New: Display Node Status based on latest Execution ---\n// --- Modified: Implement Start, Pause, Resume, Cancel, Delete button handlers ---\n// --- Modified: Integrate ActionEditor component into Node Details Modal ---\n\n\nimport React, { useEffect, useState, useCallback } from 'react';\nimport { useParams, useNavigate, Link } from 'react-router-dom'; // To get the flow ID from the URL and navigate\nimport { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and update flow details and trigger actions\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes\nimport { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals\nimport { AgenticFlow, AgenticFlowNode, AgenticFlowEdge, AgenticFlowExecution, Rune, ForgedAbility, Goal } from '../interfaces'; // Import types\nimport ReactFlow, {\n  MiniMap,\n  Controls,\n  Background,\n  Node,\n  Edge,\n  Position,\n  ReactFlowProvider,\n  useNodesState,\n  useEdgesState,\n  applyNodeChanges, // Import applyNodeChanges\n  applyEdgeChanges, // Import applyEdgeChanges\n  OnNodesChange, // Import OnNodesChange type\n  OnEdgesChange, // Import OnEdgesChange type\n  NodeMouseHandler, // Import NodeMouseHandler type\n  NodeTypes, // Import NodeTypes type\n} from 'reactflow';\nimport 'reactflow/dist/style.css'; // Import React Flow styles\nimport dagre from '@react-flow/dagre'; // Import Dagre layout algorithm\nimport { Workflow, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Play, Loader2, Info, XCircle, Pause, RotateCcw, ArrowLeft } from 'lucide-react'; // Import icons including Pause, RotateCcw, ArrowLeft\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown\n// --- Modified: Import ActionEditor component ---\nimport ActionEditor from '../components/ActionEditor';\n// --- End Modified ---\n\n\n// Access core modules from the global window object (for MVP simplicity)\ndeclare const window: any;\nconst selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (\u81EA\u6211\u5C0E\u822A) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\nconst goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (\u76EE\u6A19\u7BA1\u7406) module\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// --- New: Initialize Dagre graph for layout ---\nconst dagreGraph = new dagre.graphlib.Graph();\ndagreGraph.setDefaultEdgeLabel(() => ({}));\n\n// Define node and edge dimensions for layout calculation\nconst nodeWidth = 250; // Approximate width of the node div\nconst nodeHeight = 150; // Approximate height of the node div (adjust based on content)\n// --- End New ---\n\n\n// --- New: Custom Node Component for Detail View ---\n// This component will render the content of each node in the React Flow graph on the detail page.\n// It should display node details and indicate execution status.\nconst DetailFlowNode: React.FC<{ data: { label: string, nodeData: AgenticFlowNode, executionStatus?: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled' } }> = ({ data }) => {\n    const { label, nodeData, executionStatus } = data;\n    const isEntryNode = nodeData.node_id_in_flow === (window.systemContext?.currentFlow?.entry_node_id || 'start'); // Check if it's the entry node\n\n    // Determine border color based on execution status\n    const borderColor = executionStatus === 'completed' ? 'border-green-500' :\n                        executionStatus === 'failed' ? 'border-red-500' :\n                        executionStatus === 'in-progress' ? 'border-blue-500 animate-pulse' : // Animate current node\n                        executionStatus === 'paused' ? 'border-yellow-500' :\n                        executionStatus === 'cancelled' ? 'border-neutral-500' :\n                        isEntryNode ? 'border-green-500' : // Default for entry node if no execution status\n                        'border-blue-500'; // Default for other nodes if no execution status\n\n    const statusText = executionStatus ? "], ["typescript\n// src/pages/AgenticFlowDetail.tsx\n// Agentic Flow Detail Page (\u81EA\u6211\u4EA4\u4ED8\u8A73\u60C5)\n// Displays the details of a single Agentic Flow and its execution history.\n// Allows triggering execution, pausing, resuming, and cancelling.\n// --- New: Create a page to display Agentic Flow details ---\n// --- New: Implement fetching Agentic Flow data by ID ---\n// --- New: Implement fetching and displaying Execution History ---\n// --- New: Add UI for actions (run, edit, delete) ---\n// --- New: Add Realtime Updates for Agentic Flow and Executions ---\n// --- Modified: Add Pause, Resume, Cancel buttons and handlers ---\n// --- New: Integrate React Flow for DAG visualization ---\n// --- New: Display Node Status based on latest Execution ---\n// --- Modified: Implement Start, Pause, Resume, Cancel, Delete button handlers ---\n// --- Modified: Integrate ActionEditor component into Node Details Modal ---\n\n\nimport React, { useEffect, useState, useCallback } from 'react';\nimport { useParams, useNavigate, Link } from 'react-router-dom'; // To get the flow ID from the URL and navigate\nimport { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and update flow details and trigger actions\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes\nimport { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals\nimport { AgenticFlow, AgenticFlowNode, AgenticFlowEdge, AgenticFlowExecution, Rune, ForgedAbility, Goal } from '../interfaces'; // Import types\nimport ReactFlow, {\n  MiniMap,\n  Controls,\n  Background,\n  Node,\n  Edge,\n  Position,\n  ReactFlowProvider,\n  useNodesState,\n  useEdgesState,\n  applyNodeChanges, // Import applyNodeChanges\n  applyEdgeChanges, // Import applyEdgeChanges\n  OnNodesChange, // Import OnNodesChange type\n  OnEdgesChange, // Import OnEdgesChange type\n  NodeMouseHandler, // Import NodeMouseHandler type\n  NodeTypes, // Import NodeTypes type\n} from 'reactflow';\nimport 'reactflow/dist/style.css'; // Import React Flow styles\nimport dagre from '@react-flow/dagre'; // Import Dagre layout algorithm\nimport { Workflow, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Play, Loader2, Info, XCircle, Pause, RotateCcw, ArrowLeft } from 'lucide-react'; // Import icons including Pause, RotateCcw, ArrowLeft\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown\n// --- Modified: Import ActionEditor component ---\nimport ActionEditor from '../components/ActionEditor';\n// --- End Modified ---\n\n\n// Access core modules from the global window object (for MVP simplicity)\ndeclare const window: any;\nconst selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (\u81EA\u6211\u5C0E\u822A) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\nconst goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (\u76EE\u6A19\u7BA1\u7406) module\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// --- New: Initialize Dagre graph for layout ---\nconst dagreGraph = new dagre.graphlib.Graph();\ndagreGraph.setDefaultEdgeLabel(() => ({}));\n\n// Define node and edge dimensions for layout calculation\nconst nodeWidth = 250; // Approximate width of the node div\nconst nodeHeight = 150; // Approximate height of the node div (adjust based on content)\n// --- End New ---\n\n\n// --- New: Custom Node Component for Detail View ---\n// This component will render the content of each node in the React Flow graph on the detail page.\n// It should display node details and indicate execution status.\nconst DetailFlowNode: React.FC<{ data: { label: string, nodeData: AgenticFlowNode, executionStatus?: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled' } }> = ({ data }) => {\n    const { label, nodeData, executionStatus } = data;\n    const isEntryNode = nodeData.node_id_in_flow === (window.systemContext?.currentFlow?.entry_node_id || 'start'); // Check if it's the entry node\n\n    // Determine border color based on execution status\n    const borderColor = executionStatus === 'completed' ? 'border-green-500' :\n                        executionStatus === 'failed' ? 'border-red-500' :\n                        executionStatus === 'in-progress' ? 'border-blue-500 animate-pulse' : // Animate current node\n                        executionStatus === 'paused' ? 'border-yellow-500' :\n                        executionStatus === 'cancelled' ? 'border-neutral-500' :\n                        isEntryNode ? 'border-green-500' : // Default for entry node if no execution status\n                        'border-blue-500'; // Default for other nodes if no execution status\n\n    const statusText = executionStatus ? "])));
Status: $;
{
    executionStatus.toUpperCase();
}
" : 'Pending';\n    const statusColor = executionStatus ? getFlowStatusColor(executionStatus) : 'text-neutral-400';\n\n\n    return (\n        <div className={";
p - 3;
rounded - md;
border - l - 4;
$;
{
    borderColor;
}
bg - neutral - 700 / 70;
shadow - md;
w - [$, { nodeWidth: nodeWidth }, px];
h - [$, { nodeHeight: nodeHeight }, px];
overflow - hidden;
flex;
flex - col(templateObject_2 || (templateObject_2 = __makeTemplateObject(["}>\n            <div className=\"flex justify-between items-center mb-1\">\n                <div className=\"text-sm font-semibold text-blue-200 overflow-hidden text-ellipsis whitespace-nowrap\">\n                    Node: {nodeData.node_id_in_flow} ({nodeData.type})\n                </div>\n                {/* No edit button here, editing is on the editor page */}\n            </div>\n            <div className=\"text-neutral-300 text-xs flex-grow overflow-hidden\">\n                {nodeData.description || 'No description.'}\n            </div>\n            {/* TODO: Add visual indicators for action/decision logic presence */}\n            {/* nodeData.action && <span className=\"text-neutral-400 text-xs mt-1\">Action: {nodeData.action.type}</span> */}\n            {/* nodeData.decision_logic && <span className=\"text-neutral-400 text-xs mt-1\">Decision Logic Present</span> */}\n        </div>\n    );\n};\n\n// Define custom node types for the detail view\nconst nodeTypes: NodeTypes = {\n    default: DetailFlowNode, // Use our custom component for the default type\n    // TODO: Define specific node types if needed (e.g., 'decision', 'action')\n};\n// --- End Custom Node Component ---\n\n\nconst AgenticFlowDetail: React.FC = () => {\n  const { flowId } = useParams<{ flowId: string }>(); // Get flowId from URL params\n  const navigate = useNavigate(); // Hook for navigation\n\n  const [flow, setFlow] = useState<AgenticFlow | null>(null); // State to hold the flow details\n  const [executions, setExecutions] = useState<AgenticFlowExecution[]>([]); // State to hold execution history\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedExecutions, setExpandedExecutions] = useState<Record<string, boolean>>({}); // State to track expanded executions\n\n  // --- New: React Flow states for visualization ---\n  const [nodes, setNodes] = useNodesState([]);\n  const [edges, setEdges] = useEdgesState([]);\n  // --- End New ---\n\n  // State for triggering actions\n  const [isStarting, setIsStarting] = useState(false);\n  const [isPausing, setIsPausing] = useState(false);\n  const [isResuming, setIsResuming] = useState(false);\n  const [isCancelling, setIsCancelling] = useState(false);\n  const [isDeleting, setIsDeleting] = useState(false);\n\n  // --- New: State for selected node details modal ---\n  const [selectedNodeDetails, setSelectedNodeDetails] = useState<AgenticFlowNode | null>(null);\n  // --- New: States for data needed by ActionEditor (for display) ---\n  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\n  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results\n  // --- End New ---\n\n\n  // --- New: Layout function using Dagre (copied from editor) ---\n  const getLayoutedElements = useCallback(\n      (nodes: Node[], edges: Edge[], direction = 'TB') => {\n          const isHorizontal = direction === 'LR';\n          dagreGraph.setGraph({ rankdir: direction });\n\n          nodes.forEach((node) => {\n              // Set nodes with dimensions for layout calculation\n              dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });\n          });\n\n          edges.forEach((edge) => {\n              dagreGraph.setEdge(edge.source, edge.target);\n          });\n\n          dagre.layout(dagreGraph);\n\n          const layoutedNodes = nodes.map((node) => {\n              const nodeWithPosition = dagreGraph.node(node.id);\n              // We need to pass a node object with at least position.\n              // Node is passed by reference, so we modify it directly.\n              node.position = {\n                  x: nodeWithPosition.x - nodeWidth / 2,\n                  y: nodeWithPosition.y - nodeHeight / 2,\n              };\n\n              return node;\n          });\n\n          return { nodes: layoutedNodes, edges }; // Return edges as is, layout only affects nodes\n      },\n      [] // Dependencies for useCallback - empty as it only depends on imported constants/libraries\n  );\n  // --- End New ---\n\n\n  // --- New: Convert Agentic Flow Data to React Flow format with Layout and Execution Status ---\n  const flowToReactFlowData = useCallback((agenticFlow: AgenticFlow, latestExecution?: AgenticFlowExecution) => {\n      // Store the flow definition in the global context for access by custom nodes\n      window.systemContext.currentFlow = agenticFlow;\n\n      // Determine node statuses based on the latest execution\n      // This is a simplified approach for MVP. A real system might track status per node per execution.\n      // For now, we'll highlight the current node and maybe mark completed/failed based on log summary (if possible).\n      // Since log summary is text, let's just highlight the current node and rely on overall execution status.\n      const latestExecutionNodeId = latestExecution?.current_node_id;\n      const latestExecutionStatus = latestExecution?.status;\n      const executionLog = latestExecution?.execution_log_summary || '';\n\n      const reactFlowNodes: Node[] = agenticFlow.nodes.map((node) => {\n          let nodeExecutionStatus: AgenticFlowNode['status'] | undefined = undefined;\n\n          // Determine status based on latest execution\n          if (latestExecutionStatus && latestExecutionNodeId) {\n              if (node.node_id_in_flow === latestExecutionNodeId) {\n                  // This is the current node in the latest execution\n                  nodeExecutionStatus = latestExecutionStatus; // Use the overall execution status for the current node\n              } else if (latestExecutionStatus === 'completed' && executionLog.includes("], ["}>\n            <div className=\"flex justify-between items-center mb-1\">\n                <div className=\"text-sm font-semibold text-blue-200 overflow-hidden text-ellipsis whitespace-nowrap\">\n                    Node: {nodeData.node_id_in_flow} ({nodeData.type})\n                </div>\n                {/* No edit button here, editing is on the editor page */}\n            </div>\n            <div className=\"text-neutral-300 text-xs flex-grow overflow-hidden\">\n                {nodeData.description || 'No description.'}\n            </div>\n            {/* TODO: Add visual indicators for action/decision logic presence */}\n            {/* nodeData.action && <span className=\"text-neutral-400 text-xs mt-1\">Action: {nodeData.action.type}</span> */}\n            {/* nodeData.decision_logic && <span className=\"text-neutral-400 text-xs mt-1\">Decision Logic Present</span> */}\n        </div>\n    );\n};\n\n// Define custom node types for the detail view\nconst nodeTypes: NodeTypes = {\n    default: DetailFlowNode, // Use our custom component for the default type\n    // TODO: Define specific node types if needed (e.g., 'decision', 'action')\n};\n// --- End Custom Node Component ---\n\n\nconst AgenticFlowDetail: React.FC = () => {\n  const { flowId } = useParams<{ flowId: string }>(); // Get flowId from URL params\n  const navigate = useNavigate(); // Hook for navigation\n\n  const [flow, setFlow] = useState<AgenticFlow | null>(null); // State to hold the flow details\n  const [executions, setExecutions] = useState<AgenticFlowExecution[]>([]); // State to hold execution history\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedExecutions, setExpandedExecutions] = useState<Record<string, boolean>>({}); // State to track expanded executions\n\n  // --- New: React Flow states for visualization ---\n  const [nodes, setNodes] = useNodesState([]);\n  const [edges, setEdges] = useEdgesState([]);\n  // --- End New ---\n\n  // State for triggering actions\n  const [isStarting, setIsStarting] = useState(false);\n  const [isPausing, setIsPausing] = useState(false);\n  const [isResuming, setIsResuming] = useState(false);\n  const [isCancelling, setIsCancelling] = useState(false);\n  const [isDeleting, setIsDeleting] = useState(false);\n\n  // --- New: State for selected node details modal ---\n  const [selectedNodeDetails, setSelectedNodeDetails] = useState<AgenticFlowNode | null>(null);\n  // --- New: States for data needed by ActionEditor (for display) ---\n  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\n  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results\n  // --- End New ---\n\n\n  // --- New: Layout function using Dagre (copied from editor) ---\n  const getLayoutedElements = useCallback(\n      (nodes: Node[], edges: Edge[], direction = 'TB') => {\n          const isHorizontal = direction === 'LR';\n          dagreGraph.setGraph({ rankdir: direction });\n\n          nodes.forEach((node) => {\n              // Set nodes with dimensions for layout calculation\n              dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });\n          });\n\n          edges.forEach((edge) => {\n              dagreGraph.setEdge(edge.source, edge.target);\n          });\n\n          dagre.layout(dagreGraph);\n\n          const layoutedNodes = nodes.map((node) => {\n              const nodeWithPosition = dagreGraph.node(node.id);\n              // We need to pass a node object with at least position.\n              // Node is passed by reference, so we modify it directly.\n              node.position = {\n                  x: nodeWithPosition.x - nodeWidth / 2,\n                  y: nodeWithPosition.y - nodeHeight / 2,\n              };\n\n              return node;\n          });\n\n          return { nodes: layoutedNodes, edges }; // Return edges as is, layout only affects nodes\n      },\n      [] // Dependencies for useCallback - empty as it only depends on imported constants/libraries\n  );\n  // --- End New ---\n\n\n  // --- New: Convert Agentic Flow Data to React Flow format with Layout and Execution Status ---\n  const flowToReactFlowData = useCallback((agenticFlow: AgenticFlow, latestExecution?: AgenticFlowExecution) => {\n      // Store the flow definition in the global context for access by custom nodes\n      window.systemContext.currentFlow = agenticFlow;\n\n      // Determine node statuses based on the latest execution\n      // This is a simplified approach for MVP. A real system might track status per node per execution.\n      // For now, we'll highlight the current node and maybe mark completed/failed based on log summary (if possible).\n      // Since log summary is text, let's just highlight the current node and rely on overall execution status.\n      const latestExecutionNodeId = latestExecution?.current_node_id;\n      const latestExecutionStatus = latestExecution?.status;\n      const executionLog = latestExecution?.execution_log_summary || '';\n\n      const reactFlowNodes: Node[] = agenticFlow.nodes.map((node) => {\n          let nodeExecutionStatus: AgenticFlowNode['status'] | undefined = undefined;\n\n          // Determine status based on latest execution\n          if (latestExecutionStatus && latestExecutionNodeId) {\n              if (node.node_id_in_flow === latestExecutionNodeId) {\n                  // This is the current node in the latest execution\n                  nodeExecutionStatus = latestExecutionStatus; // Use the overall execution status for the current node\n              } else if (latestExecutionStatus === 'completed' && executionLog.includes("])));
Executing;
node: $;
{
    node.node_id_in_flow;
}
($);
{
    node.type;
}
")) { // Check log for execution\n                  // If the overall execution completed and the node is mentioned as executed in the log\n                  nodeExecutionStatus = 'completed';\n              } else if (latestExecutionStatus === 'failed' && executionLog.includes(";
Node;
$;
{
    node.node_id_in_flow;
}
($);
{
    node.type;
}
failed.(templateObject_3 || (templateObject_3 = __makeTemplateObject([")) { // Check log for failure\n                   // If the overall execution failed and the node is mentioned with an error\n                   nodeExecutionStatus = 'failed';\n              } else if (latestExecutionStatus === 'paused' && executionLog.includes("], [")) { // Check log for failure\n                   // If the overall execution failed and the node is mentioned with an error\n                   nodeExecutionStatus = 'failed';\n              } else if (latestExecutionStatus === 'paused' && executionLog.includes("])));
Executing;
node: $;
{
    node.node_id_in_flow;
}
($);
{
    node.type;
}
")) { // Check log for execution before pause\n                   // If paused and the node was reached/processed before the pause\n                   nodeExecutionStatus = 'completed'; // Assume completed if processed before pause\n              } else if (latestExecutionStatus === 'cancelled' && executionLog.includes(";
Executing;
node: $;
{
    node.node_id_in_flow;
}
($);
{
    node.type;
}
")) { // Check log for execution before cancellation\n                   // If cancelled and the node was reached/processed before cancellation\n                   nodeExecutionStatus = 'completed'; // Assume completed if processed before cancellation\n              }\n              // Nodes not yet reached in an in-progress/paused/cancelled flow are implicitly 'pending'\n              // Nodes in a completed/failed flow that weren't executed are also implicitly 'pending' (or 'skipped')\n          }\n\n\n          return {\n              id: node.node_id_in_flow, // Use node_id_in_flow as React Flow node ID\n              // Position will be calculated by the layout algorithm\n              position: { x: 0, y: 0 }, // Placeholder position\n              data: {\n                  label: (\n                      <div className=\"p-2 bg-neutral-700/70 rounded-md border border-neutral-600 text-neutral-200 text-xs w-[180px] overflow-hidden text-ellipsis whitespace-nowrap\">\n                          <div className=\"font-semibold overflow-hidden text-ellipsis whitespace-nowrap\">Node: {node.node_id_in_flow} ({node.type})</div>\n                          <div className=\"text-neutral-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap\">Desc: {node.description}</div>\n                          {/* Add more details like source, tags if needed */}\n                      </div>\n                  ),\n                  // Store the original node data\n                  nodeData: node,\n                  // Pass the execution status for this node\n                  executionStatus: nodeExecutionStatus,\n              },\n              type: 'default', // Use our custom node type\n              sourcePosition: Position.Bottom, // Default source handle position\n              targetPosition: Position.Top, // Default target handle position\n              style: {\n                  padding: 0, // Remove default padding as label has its own\n                  backgroundColor: 'transparent', // Make node background transparent\n                  width: nodeWidth, // Set width for layout calculation\n                  height: nodeHeight, // Set height for layout calculation\n                  border: 'none', // No border on the container, let the custom node handle it\n              },\n          };\n      });\n\n      const reactFlowEdges: Edge[] = agenticFlow.edges.map(edge => {\n          return {\n              id: edge.edge_id_in_flow || edge.id, // Use edge_id_in_flow or DB ID as React Flow edge ID\n              source: edge.source_node_id,\n              target: edge.target_node_id,\n              type: 'default', // Use default edge type\n              label: edge.condition ? 'Conditional' : 'Unconditional', // Show relation type as label\n              style: { strokeWidth: 1, stroke: edge.condition ? '#ffcc00' : '#999' }, // Yellow for conditional, gray for unconditional\n              // animated: true, // Optional: animate edges\n              data: { // Store the original edge data\n                  edgeData: edge,\n                  // onEditClick: handleEditEdgeClick, // Pass the edit handler (not needed in detail view)\n              }\n          };\n      });\n\n      // Apply layout algorithm\n      const layouted = getLayoutedElements(reactFlowNodes, reactFlowEdges, 'TB'); // Use 'TB' for top-to-bottom layout\n\n      return { nodes: layouted.nodes, edges: layouted.edges };\n  }, [getLayoutedElements]); // Re-generate React Flow data if layout function changes\n  // --- End New ---\n\n\n  const fetchGraphData = useCallback(async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!selfNavigationEngine || !userId || !flowId) {\n            setError(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch the specific flow details, including nodes and edges\n          const fetchedFlow = await selfNavigationEngine.getAgenticFlowById(flowId, userId); // Pass flowId and userId\n\n          if (fetchedFlow) {\n              setFlow(fetchedFlow);\n              // Fetch execution history for this flow\n              const flowExecutions = await selfNavigationEngine.getAgenticFlowExecutions(flowId, userId); // Pass flowId and userId\n              setExecutions(flowExecutions);\n\n              // --- New: Convert fetched flow data to React Flow format and apply layout, including latest execution status ---\n              const latestExecution = flowExecutions.length > 0 ? flowExecutions[0] : undefined; // Get the most recent execution\n              const reactFlowData = flowToReactFlowData(fetchedFlow, latestExecution);\n              setNodes(reactFlowData.nodes);\n              setEdges(reactFlowData.edges);\n              // --- End New ---\n\n          } else {\n              // If flow not found\n              setFlow(null);\n              setExecutions([]);\n              setNodes([]); // Clear React Flow state\n              setEdges([]); // Clear React Flow state\n          }\n\n      } catch (err: any) {\n          console.error(";
Error;
fetching;
data;
for (flow; $; { flowId: flowId })
    : ", err);\n          setError(";
Failed;
to;
load;
flow;
data: $;
{
    err.message;
}
");\n          setFlow(null);\n          setExecutions([]);\n          setNodes([]); // Clear React Flow state\n          setEdges([]); // Clear React Flow state\n      } finally {\n          setLoading(false);\n      }\n  }, [selfNavigationEngine, systemContext?.currentUser?.id, flowId, setFlow, setExecutions, setNodes, setEdges, setLoading, setError, flowToReactFlowData]); // Dependencies for useCallback\n\n\n    // --- New: Fetch data needed by ActionEditor (for display) ---\n    const fetchActionEditorData = useCallback(async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!userId || !sacredRuneEngraver || !authorityForgingEngine || !goalManagementService) {\n             console.warn(\"Cannot fetch ActionEditor data: Core modules not initialized or user not logged in.\");\n             setAvailableRunes([]);\n             setAvailableAbilities([]);\n             setAvailableGoals([]);\n             return;\n        }\n        try {\n            // Fetch available runes (user's and public)\n            const runes = await sacredRuneEngraver.listRunes(undefined, userId);\n            setAvailableRunes(runes);\n\n            // Fetch available abilities (user's and public)\n            const abilities = await authorityForgingEngine.getAbilities(undefined, userId);\n            setAvailableAbilities(abilities);\n\n            // Fetch available goals (including KRs) for linking\n            const goals = await goalManagementService.getGoals(userId);\n            setAvailableGoals(goals);\n\n        } catch (err: any) {\n            console.error('Error fetching ActionEditor data:', err);\n            // Don't set a critical error for the whole page\n            // setError(";
Failed;
to;
load;
data;
for (action; editor; )
    : $;
{
    err.message;
}
");\n            setAvailableRunes([]);\n            setAvailableAbilities([]);\n            setAvailableGoals([]);\n        } finally {\n             // Ensure loading state is false even if fetching secondary data fails\n             // setLoading(false); // This is handled by fetchFlowData\n        }\n    }, [systemContext?.currentUser?.id, sacredRuneEngraver, authorityForgingEngine, goalManagementService]);\n    // --- End New ---\n\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes or flowId changes\n    if (systemContext?.currentUser?.id && flowId) {\n        fetchGraphData(); // Fetch data for the specific flow\n        // --- New: Fetch data needed by ActionEditor ---\n        fetchActionEditorData();\n        // --- End New ---\n    }\n\n    // --- New: Subscribe to realtime updates for agentic_flows, agentic_flow_nodes, agentic_flow_edges ---\n    // Note: SelfNavigationEngine subscribes to general agentic_flow and execution events and publishes them via EventBus.\n    // We need to listen to those events here and refetch if they are for the current flow.\n    let unsubscribeFlowUpdate: (() => void) | undefined;\n    let unsubscribeFlowDelete: (() => void) | undefined;\n    let unsubscribeExecutionInsert: (() => void) | undefined;\n    let unsubscribeExecutionUpdate: (() => void) | undefined;\n    let unsubscribeExecutionDelete: (() => void) | undefined;\n\n    // --- New: Subscribe to flow execution status events ---\n    // These events are published by SelfNavigationEngine.executeAgenticFlow\n    // They trigger a refetch of the flow data to update the overall flow status displayed on the page\n    let unsubscribeFlowStarted: (() => void) | undefined;\n    let unsubscribeFlowCompleted: (() => void) | undefined;\n    let unsubscribeFlowFailed: (() => void) | undefined;\n    let unsubscribeFlowPaused: (() => void) | undefined;\n    let unsubscribeFlowResumed: (() => void) | undefined;\n    let unsubscribeFlowCancelled: (() => void) | undefined;\n    // --- End New ---\n\n\n    if (selfNavigationEngine?.context?.eventBus) { // Check if SelfNavigationEngine and its EventBus are available\n        const eventBus = selfNavigationEngine.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to flow update events\n        unsubscribeFlowUpdate = eventBus.subscribe('agentic_flow_update', (payload: AgenticFlow) => {\n            // Check if the event is for the current flow and user\n            if (payload.id === flowId && payload.user_id === userId) {\n                console.log('AgenticFlowDetail page received agentic_flow_update event:', payload);\n                setFlow(payload); // Update the flow state directly\n                // Refetch executions to ensure latest status is reflected in the list and graph\n                selfNavigationEngine.getAgenticFlowExecutions(flowId, userId).then(setExecutions).catch(err => console.error('Error refetching executions:', err));\n            }\n        });\n\n         // Subscribe to flow delete events\n         unsubscribeFlowDelete = eventBus.subscribe('agentic_flow_delete', (payload: { flowId: string, userId: string }) => {\n             // Check if the event is for the current flow and user\n             if (payload.flowId === flowId && payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_delete event:', payload);\n                 // If the current flow is deleted, navigate back to the flows list\n                 navigate('/flows');\n             }\n         });\n\n        // Subscribe to execution insert events\n        unsubscribeExecutionInsert = eventBus.subscribe('agentic_flow_execution_insert', (payload: AgenticFlowExecution) => {\n            // Check if the event is for the current flow and user\n            if (payload.flow_id === flowId && payload.user_id === userId) {\n                console.log('AgenticFlowDetail page received agentic_flow_execution_insert event:', payload);\n                // Add the new execution to the list and keep sorted by start_timestamp (newest first)\n                setExecutions(prevExecutions => [payload, ...prevExecutions].sort((a, b) => new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime()));\n                // Update the graph visualization with the new latest execution\n                if (flow) { // Ensure flow data is loaded\n                     const updatedExecutions = [...executions, payload].sort((a, b) => new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime()); // Include the new payload\n                     flowToReactFlowData(flow, updatedExecutions[0]); // Re-layout with the new latest execution\n                }\n            }\n        });\n\n         unsubscribeExecutionUpdate = eventBus.subscribe('agentic_flow_execution_update', (payload: AgenticFlowExecution) => {\n             // Check if the event is for the current flow and user\n             if (payload.flow_id === flowId && payload.user_id === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_execution_update event:', payload);\n                 // Update the specific execution in the list\n                 setExecutions(prevExecutions => prevExecutions.map(exec => exec.id === payload.id ? payload : exec));\n                 // If this is the latest execution, update the graph visualization\n                 if (executions.length > 0 && executions[0].id === payload.id && flow) { // Check if it's the latest and flow data is loaded\n                     flowToReactFlowData(flow, payload); // Re-layout with the updated execution\n                 }\n             }\n         });\n\n          unsubscribeExecutionDelete = eventBus.subscribe('agentic_flow_execution_delete', (payload: { executionId: string, flowId: string, userId: string }) => {\n             // Check if the event is for the current flow and user\n             if (payload.flowId === flowId && payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_execution_delete event:', payload);\n                 // Remove the deleted execution from the list\n                 setExecutions(prevExecutions => prevExecutions.filter(exec => exec.id !== payload.executionId));\n                 // If the deleted execution was the latest, update the graph visualization (might show previous latest or idle state)\n                 if (executions.length > 0 && executions[0].id === payload.executionId && flow) { // Check if it was the latest and flow data is loaded\n                     const remainingExecutions = executions.filter(exec => exec.id !== payload.executionId);\n                     const newLatestExecution = remainingExecutions.length > 0 ? remainingExecutions[0] : undefined;\n                     flowToReactFlowData(flow, newLatestExecution); // Re-layout with the new latest execution or idle state\n                 }\n             }\n         });\n\n        // --- New: Subscribe to flow execution status events ---\n        // These events are published by SelfNavigationEngine.executeAgenticFlow\n        // They trigger a refetch of the flow data to update the overall flow status displayed on the page\n        unsubscribeFlowStarted = eventBus.subscribe('agentic_flow_started', (payload: { flowId: string, userId: string, executionId: string }) => { // Added executionId\n             if (payload.flowId === flowId && payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_started event:', payload);\n                 fetchGraphData(); // Refetch to update overall status\n             }\n         });\n         unsubscribeFlowCompleted = eventBus.subscribe('agentic_flow_completed', (payload: { flowId: string, userId: string, executionId: string, lastNodeResult: any }) => { // Added executionId\n             if (payload.flowId === flowId && payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_completed event:', payload);\n                 fetchGraphData(); // Refetch to update overall status/timestamps/result\n             }\n         });\n          unsubscribeFlowFailed = eventBus.subscribe('agentic_flow_failed', (payload: { flowId: string, userId: string, executionId: string, error: string }) => { // Added executionId\n             if (payload.flowId === flowId && payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_failed event:', payload);\n                 fetchGraphData(); // Refetch to update overall status/timestamps/error\n             }\n         });\n          unsubscribeFlowPaused = eventBus.subscribe('agentic_flow_paused', (payload: { flowId: string, userId: string, executionId: string }) => { // Added executionId\n             if (payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_paused event:', payload);\n                 fetchGraphData(); // Refetch to update overall status\n             }\n         });\n          unsubscribeFlowResumed = eventBus.subscribe('agentic_flow_resumed', (payload: { flowId: string, userId: string, executionId: string }) => { // Added executionId\n             if (payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_resumed event:', payload);\n                 fetchGraphData(); // Refetch to update overall status\n             }\n         });\n          unsubscribeFlowCancelled = eventBus.subscribe('agentic_flow_cancelled', (payload: { flowId: string, userId: string, executionId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('AgenticFlowDetail page received agentic_flow_cancelled event:', payload);\n                 fetchGraphData(); // Refetch to update overall status\n             }\n         });\n        // --- End New ---\n\n\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeFlowUpdate?.();\n        unsubscribeFlowDelete?.();\n        unsubscribeExecutionInsert?.();\n        unsubscribeExecutionUpdate?.();\n        unsubscribeExecutionDelete?.();\n        // --- New: Unsubscribe from flow execution status events ---\n        unsubscribeFlowStarted?.();\n        unsubscribeFlowCompleted?.();\n        unsubscribeFlowFailed?.();\n        unsubscribeFlowPaused?.();\n        unsubscribeFlowResumed?.();\n        unsubscribeFlowCancelled?.();\n        // --- End New ---\n    };\n\n  }, [flowId, systemContext?.currentUser?.id, selfNavigationEngine, fetchGraphData, navigate, executions, flow, flowToReactFlowData]); // Re-run effect when flowId, user ID, service, fetch function, navigate, executions, flow, or flowToReactFlowData changes\n\n\n    const getFlowStatusColor = (status: AgenticFlow['status'] | AgenticFlowExecution['status']) => { // Added AgenticFlowExecution status\n        switch (status) {\n            case 'completed': return 'text-green-400';\n            case 'failed': return 'text-red-400';\n            case 'in-progress': return 'text-blue-400';\n            case 'paused': return 'text-yellow-400';\n            case 'cancelled': return 'text-neutral-400';\n            case 'idle': return 'text-neutral-300';\n            case 'pending': return 'text-neutral-300';\n            default: return 'text-neutral-300';\n        }\n    };\n\n    const toggleExpandExecution = (executionId: string) => {\n        setExpandedExecutions(prevState => ({\n            ...prevState,\n            [executionId]: !prevState[executionId]\n        }));\n    };\n\n    // --- New: Handle Flow Actions (Start, Pause, Resume, Cancel, Delete) ---\n    const handleStartFlow = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !flowId) {\n            alert(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            return;\n        }\n        console.log(";
Attempting;
to;
start;
flow: $;
{
    flowId;
}
");\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:flows:start',\n            details: { flowId },\n            context: { platform: 'web', page: 'flow_detail' },\n            user_id: userId, // Associate action with user\n        });\n\n        setIsStarting(true);\n        setError(null); // Clear previous errors\n        try {\n            // Call the SelfNavigationEngine method to start the flow\n            // Pass initialParams if needed (not implemented in UI yet)\n            await selfNavigationEngine.startAgenticFlow(flowId, userId, {}); // Pass flowId, userId, initialParams\n            // Status and execution history updates handled by event listeners\n\n        } catch (err: any) {\n            console.error('Error starting flow:', err);\n            setError(";
Failed;
to;
start;
flow: $;
{
    err.message;
}
");\n        } finally {\n            setIsStarting(false); // State updated by event listener, but reset local flag\n        }\n    };\n\n    const handlePauseFlow = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !flowId) {\n            alert(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            return;\n        }\n        console.log(";
Attempting;
to;
pause;
flow: $;
{
    flowId;
}
");\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:flows:pause',\n            details: { flowId },\n            context: { platform: 'web', page: 'flow_detail' },\n            user_id: userId, // Associate action with user\n        });\n\n        setIsPausing(true);\n        setError(null); // Clear previous errors\n        try {\n            // Call the SelfNavigationEngine method to pause the flow\n            await selfNavigationEngine.pauseAgenticFlow(flowId, userId); // Pass flowId, userId\n            // Status update handled by event listener\n        } catch (err: any) {\n            console.error('Error pausing flow:', err);\n            setError(";
Failed;
to;
pause;
flow: $;
{
    err.message;
}
");\n        } finally {\n            setIsPausing(false); // State updated by event listener, but reset local flag\n        }\n    };\n\n    const handleResumeFlow = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !flowId) {\n            alert(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            return;\n        }\n        console.log(";
Attempting;
to;
resume;
flow: $;
{
    flowId;
}
");\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:flows:resume',\n            details: { flowId },\n            context: { platform: 'web', page: 'flow_detail' },\n            user_id: userId, // Associate action with user\n        });\n\n        setIsResuming(true);\n        setError(null); // Clear previous errors\n        try {\n            // Call the SelfNavigationEngine method to resume the flow\n            await selfNavigationEngine.resumeAgenticFlow(flowId, userId); // Pass flowId, userId\n            // Status update handled by event listener\n        } catch (err: any) {\n            console.error('Error resuming flow:', err);\n            setError(";
Failed;
to;
resume;
flow: $;
{
    err.message;
}
");\n        } finally {\n            setIsResuming(false); // State updated by event listener, but reset local flag\n        }\n    };\n\n    const handleCancelFlow = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !flowId) {\n            alert(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            return;\n        }\n        if (!confirm(";
Are;
you;
sure;
you;
want;
to;
cancel;
this;
flow ? ")) return;\n\n        console.log(" : ;
Attempting;
to;
cancel;
flow: $;
{
    flowId;
}
");\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:flows:cancel',\n            details: { flowId },\n            context: { platform: 'web', page: 'flow_detail' },\n            user_id: userId, // Associate action with user\n        });\n\n        setIsCancelling(true);\n        setError(null); // Clear previous errors\n        try {\n            // Call the SelfNavigationEngine method to cancel the flow\n            await selfNavigationEngine.cancelAgenticFlow(flowId, userId); // Pass flowId, userId\n            // Status update handled by event listener\n        } catch (err: any) {\n            console.error('Error cancelling flow:', err);\n            setError(";
Failed;
to;
cancel;
flow: $;
{
    err.message;
}
");\n        } finally {\n            setIsCancelling(false); // State updated by event listener, but reset local flag\n        }\n    };\n\n    const handleDeleteFlow = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !flowId || !flow) {\n            alert(\"SelfNavigationEngine module not initialized or user not logged in, or flow data is missing.\");\n            return;\n        }\n        if (flow.status === 'in-progress') {\n             alert('Cannot delete a flow that is currently in progress.');\n             return;\n        }\n        if (!confirm(";
Are;
you;
sure;
you;
want;
to;
delete Agentic;
Flow;
"${flow.name}\"? This action cannot be undone and will delete all associated nodes, edges, and execution history.`)) return;;
console.log("Attempting to delete flow: ".concat(flow.name, " (").concat(flowId, ")"));
// Simulate recording user action
authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
    type: 'web:flows:delete',
    details: { flowId: flow.id, flowName: flow.name },
    context: { platform: 'web', page: 'flow_detail' },
    user_id: userId, // Associate action with user
});
setIsDeleting(true);
setError(null); // Clear previous errors
try {
    // Call the SelfNavigationEngine method to delete the flow
    var success_1 = await selfNavigationEngine.deleteAgenticFlow(flowId, userId); // Pass flowId and userId
    if (success_1) {
        console.log("Flow ".concat(flow.name, " deleted successfully."));
        // The agentic_flow_delete event listener will handle navigation away from this page
        alert("Agentic Flow \"".concat(flow.name, "\" deleted successfully!"));
    }
    else {
        setError('Failed to delete flow.');
        alert('Failed to delete flow.');
    }
}
catch (err) {
    console.error("Error deleting flow ".concat(flow.name, ":"), err);
    setError("Failed to delete flow: ".concat(err.message));
    alert("Failed to delete flow: ".concat(err.message));
}
finally {
    setIsDeleting(false);
}
;
// --- End New ---
// --- New: Handle Node Click to show details ---
var onNodeClick = useCallback(function (event, node) {
    var _a;
    console.log('Node clicked:', node);
    // Find the full node data from the node data
    var nodeData = (_a = node.data) === null || _a === void 0 ? void 0 : _a.nodeData;
    if (nodeData) {
        setSelectedNodeDetails(nodeData);
    }
    else {
        setSelectedNodeDetails(null);
    }
}, []);
// --- End New ---
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view Agentic Flows.</p>
               </div>
            </div>);
}
return (<div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]"> {/* Adjust height to fit within viewport below nav */}
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl flex flex-col flex-grow"> {/* Use flex-grow to fill space */}
        {loading ? (<p className="text-neutral-400">Loading flow details...</p>) : error ? (<p className="text-red-400">Error: {error}</p>) : !flow ? (<p className="text-neutral-400">Agentic Flow not found.</p>) : (<>
                <div className="flex items-center gap-4 mb-4">
                    <Link to={"/flows"} className="text-neutral-400 hover:text-white transition">
                        <ArrowLeft size={24}/>
                    </Link>
                    <h2 className="text-3xl font-bold text-blue-400">Flow: {flow.name}</h2>
                </div>
                <p className="text-neutral-300 mb-4">{flow.description || 'No description.'}</p>
                <p className="text-neutral-300 text-sm">Status: <span className={getFlowStatusColor(flow.status)}>{flow.status}</span></p>
                <small className="text-neutral-400 text-xs block mb-4">
                    ID: {flow.id} | Entry Node: {flow.entry_node_id}
                     {flow.user_id && " | Owner: ".concat(flow.user_id)}
                     {flow.creation_timestamp && " | Created: ".concat(new Date(flow.creation_timestamp).toLocaleString())}
                     {flow.start_timestamp && " | Started: ".concat(new Date(flow.start_timestamp).toLocaleString())}
                     {flow.completion_timestamp && " | Finished: ".concat(new Date(flow.completion_timestamp).toLocaleString())}
                </small>

                {/* Flow Actions */}
                <div className="mb-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}
                     {/* Start Button */}
                     {(flow.status === 'idle' || flow.status === 'completed' || flow.status === 'failed' || flow.status === 'cancelled') && ((<button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleStartFlow} disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}>
                             {isStarting ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Play size={18} className="inline-block mr-2"/>})}
                             {isStarting ? 'Starting...' : 'Start'}
                         </button>))}
                      {/* Pause Button */}
                     {flow.status === 'in-progress' && ((<button className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handlePauseFlow} disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}>
                             {isPausing ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Pause size={18} className="inline-block mr-2"/>})}
                             {isPausing ? 'Pausing...' : 'Pause'}
                         </button>))}
                      {/* Resume Button */}
                     {flow.status === 'paused' && ((<button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleResumeFlow} disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}>
                             {isResuming ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Play size={18} className="inline-block mr-2"/>})}
                             {isResuming ? 'Resuming...' : 'Resume'}
                         </button>))}
                      {/* Cancel Button */}
                     {(flow.status === 'pending' || flow.status === 'in-progress' || flow.status === 'paused') && ((<button className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCancelFlow} disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}>
                             {isCancelling ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <XCircle size={18} className="inline-block mr-2"/>})}
                             {isCancelling ? 'Cancelling...' : 'Cancel'}
                         </button>))}
                     {/* Retry Button */}
                     {(flow.status === 'failed' || flow.status === 'cancelled') && ((<button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleStartFlow(); }} // Retry is just starting again
         disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting}>
                             {isStarting ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <RotateCcw size={18} className="inline-block mr-2"/>})}
                             Retry
                         </button>))}
                     {/* Edit Structure Button */}
                     <Link to={"/flows/".concat(flow.id, "/edit")} className="px-6 py-2 text-sm bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition disabled:opacity-50">
                         <Edit size={18} className="inline-block mr-2"/> Edit Structure
                     </Link>
                      {/* Delete Flow Button */}
                     <button className="px-6 py-2 bg-red-800 text-white font-semibold rounded-md hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleDeleteFlow} disabled={isStarting || isPausing || isResuming || isCancelling || isDeleting || flow.status === 'in-progress'} // Disable if running or other ops are running
    >
                        {isDeleting ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Trash2 size={18} className="inline-block mr-2"/>})}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                     </button>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-grow border border-neutral-600 rounded-md overflow-hidden" style={{ height: '500px' }}> {/* Fixed height for visualization */}
                    <ReactFlowProvider> {/* Wrap with provider */}
                        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesState} nodeTypes={nodeTypes} // Use custom node types
     fitView // Automatically fit the view to the nodes
     attributionPosition="bottom-left" 
    // Disable interactive features for viewing
    nodesDraggable={false} nodesConnectable={false} elementsSelectable={true} panOnDrag={true} zoomOnScroll={true} 
    // Disable delete key in viewer
    // deleteKeyCode={['Backspace', 'Delete']}
    // Add node click handler to show details
    onNodeClick={onNodeClick}>
                            <MiniMap />
                            <Controls />
                            <Background variant="dots" gap={12} size={1}/>
                        </ReactFlow>
                    </ReactFlowProvider> {/* End Provider */}
                </div>

                {/* New: Node Details Modal/Sidebar */}
                {selectedNodeDetails && (<div className="absolute top-4 right-4 bg-neutral-800/90 p-4 rounded-lg shadow-xl max-w-sm max-h-[95%] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 z-10"> {/* Added absolute positioning and z-index */}
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-semibold text-blue-300">Node Details</h4>
                            <button onClick={function () { return setSelectedNodeDetails(null); }} className="text-neutral-400 hover:text-white"><XCircle size={20}/></button>
                        </div>
                        <div className="text-neutral-300 text-sm space-y-4"> {/* Increased space-y */}
                            <div>
                                <p><span className="font-semibold">ID:</span> {selectedNodeDetails.node_id_in_flow}</p>
                                <p><span className="font-semibold">Type:</span> {selectedNodeDetails.type}</p>
                                <p><span className="font-semibold">Description:</span> {selectedNodeDetails.description}</p>
                            </div>
                            {selectedNodeDetails.action && (<div className="p-3 bg-neutral-700/50 rounded-md"> {/* Added background/padding */}
                                     <h5 className="text-neutral-300 text-sm font-semibold mb-2">Action Configuration:</h5>
                                     {/* --- Modified: Use ActionEditor component here --- */}
                                     <ActionEditor action={selectedNodeDetails.action} onChange={function () { }} // No-op for onChange as this is view-only
             disabled={true} // Disable editing
             availableRunes={availableRunes} // Pass data for display context
             availableAbilities={availableAbilities} // Pass data for display context
             availableGoals={availableGoals} // Pass data for display context
            />
                                     {/* --- End Modified --- */}
                                 </div>)}
                            {selectedNodeDetails.decision_logic && (<div className="p-3 bg-neutral-700/50 rounded-md"> {/* Added background/padding */}
                                     <h5 className="text-neutral-300 text-sm font-semibold mb-2">Decision Logic (JSON):</h5>
                                     <pre className="bg-neutral-900 p-2 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-700">
                                         {JSON.stringify(selectedNodeDetails.decision_logic, null, 2)}
                                     </pre>
                                 </div>)}
                            {/* TODO: Add buttons to view/edit the full record in the KB page */}
                        </div>
                    </div>)}
                {/* End New */}

                {/* Execution History */}
                <div className="mt-8 p-4 bg-neutral-700/50 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">Execution History ({executions.length})</h3>
                    {executions.length === 0 ? (<p className="text-neutral-400">No execution history found for this flow.</p>) : (<ul className="space-y-4">
                            {executions.map(function (execution) { return (<li key={execution.id} className={"bg-neutral-600/50 p-4 rounded-md border-l-4 ".concat(getFlowStatusColor(execution.status).replace('text-', 'border-'))}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Workflow size={20} className="text-blue-400"/>
                                            <h4 className={"font-semibold mb-1 ".concat(getFlowStatusColor(execution.status))}>Execution ID: {execution.id.substring(0, 8)}...</h4>
                                        </div>
                                         <button onClick={function () { return toggleExpandExecution(execution.id); }} className="text-neutral-400 hover:text-white transition">
                                            {expandedExecutions[execution.id] ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                                         </button>
                                    </div>
                                    <p className="text-neutral-300 text-sm">Status: <span className={getFlowStatusColor(execution.status)}>{execution.status}</span></p>
                                    <small className="text-neutral-400 text-xs block mt-1">
                                        Started: {new Date(execution.start_timestamp).toLocaleString()}
                                         {execution.completion_timestamp && " | Finished: ".concat(new Date(execution.completion_timestamp).toLocaleString())}
                                          {execution.current_node_id && execution.status === 'in-progress' && " | Current Node: ".concat(execution.current_node_id)}
                                    </small>

                                    {/* Execution Details (Collapsible) */}
                                    {expandedExecutions[execution.id] && ((<div className="mt-4 border-t border-neutral-600 pt-4">
                                            {execution.error && (<div className="mb-4">
                                                    <h5 className="text-red-400 text-sm font-semibold mb-2">Error:</h5>
                                                    <p className="text-red-300 text-sm">{execution.error}</p>
                                                </div>)}
                                             {execution.result && (<div className="mb-4">
                                                    <h5 className="text-neutral-300 text-sm font-semibold mb-2">Result:</h5>
                                                    <pre className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-600">
                                                        {JSON.stringify(execution.result, null, 2)}
                                                    </pre>
                                                </div>)}
                                            {execution.execution_log_summary && (<div className="mb-4">
                                                    <h5 className="text-neutral-300 text-sm font-semibold mb-2">Log Summary:</h5>
                                                    <pre className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-600">
                                                        {execution.execution_log_summary}
                                                    </pre>
                                                </div>)}
                                            {/* TODO: Add more detailed execution steps/node results if available */}
                                        </div>))}
                                </li>); })}
                        </ul>)}
                </div>
            </>)}

      </div>
    </div>);
;
exports.default = AgenticFlowDetail;
""(templateObject_4 || (templateObject_4 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
