"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/AgenticFlowEditor.tsx\n// Agentic Flow Editor Page (\u81EA\u6211\u4EA4\u4ED8\u7DE8\u8F2F\u5668)\n// Provides a visual editor for defining and modifying Agentic Flows (Dynamic DAG Workflows).\n// --- New: Create a page for Agentic Flow Editor UI ---\n// --- New: Implement fetching Agentic Flow data by ID ---\n// --- New: Integrate React Flow for DAG visualization and editing ---\n// --- New: Add placeholder logic for node/edge operations and property editing ---\n// --- New: Add Realtime Updates for Agentic Flow, Nodes, and Edges ---\n// --- Modified: Add Run Button functionality ---\n// --- New: Implement fetching and displaying Execution History ---\n// --- New: Add Realtime Updates for Agentic Flow Executions ---\n// --- Modified: Add Edit Button linking to Editor page ---\n// --- Modified: Implement Save Button functionality connecting to backend ---\n// --- Modified: Implement Run Flow Button functionality ---\n// --- Modified: Integrate ActionEditor component into Node Properties panel ---\n// --- New: Complete Node/Edge Properties Editor Panel ---\n// --- Modified: Implement Add Node, Delete Node, Add Edge, Delete Edge functionality ---\n\nimport React, { useEffect, useState, useCallback } from 'react';\nimport { useParams, useNavigate, Link } from 'react-router-dom'; // To get the flow ID from the URL and navigate\nimport { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and update flow details and trigger actions\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes\nimport { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals\nimport { AgenticFlow, AgenticFlowNode, AgenticFlowEdge, Rune, ForgedAbility, Goal } from '../interfaces'; // Import types\nimport ReactFlow, {\n  MiniMap,\n  Controls,\n  Background,\n  Node,\n  Edge,\n  Position,\n  ReactFlowProvider,\n  useNodesState,\n  useEdgesState,\n  addEdge,\n  Connection,\n  EdgeTypes,\n  NodeTypes,\n  OnNodesChange, // Import OnNodesChange type\n  OnEdgesChange, // Import OnEdgesChange type\n  OnConnect,\n  OnNodesDelete,\n  OnEdgesDelete,\n  applyNodeChanges, // Import applyNodeChanges\n  applyEdgeChanges, // Import applyEdgeChanges\n} from 'reactflow';\nimport 'reactflow/dist/style.css'; // Import React Flow styles\nimport dagre from '@react-flow/dagre'; // Import Dagre layout algorithm\nimport { ArrowLeft, Save, Loader2, PlusCircle, Trash2, Edit, XCircle, Info, Play } from 'lucide-react'; // Import icons including Play\n// --- Modified: Import ActionEditor component ---import ActionEditor from '../components/ActionEditor';\n// --- End Modified ---\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (\u81EA\u6211\u5C0E\u822A) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\nconst goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (\u76EE\u6A19\u7BA1\u7406) module\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// --- New: Initialize Dagre graph for layout ---\nconst dagreGraph = new dagre.graphlib.Graph();\ndagreGraph.setDefaultEdgeLabel(() => ({}));\n\n// Define node and edge dimensions for layout calculation\nconst nodeWidth = 250; // Approximate width of the node div\nconst nodeHeight = 150; // Approximate height of the node div (adjust based on content)\n// --- End New ---\n\n\n// --- New: Custom Node Component (Placeholder) ---// This component will render the content of each node in the React Flow graph.\n// It should display node details and potentially include inline editing or buttons.\nconst CustomFlowNode: React.FC<{ data: { label: string, nodeData: AgenticFlowNode, onEditClick: (node: AgenticFlowNode) => void } }> = ({ data }) => {\n    const { label, nodeData, onEditClick } = data;\n    const isEntryNode = nodeData.node_id_in_flow === (window.systemContext?.currentFlow?.entry_node_id || 'start'); // Check if it's the entry node\n\n    // Determine border color based on execution status\n    const borderColor = isEntryNode ? 'border-green-500' : 'border-blue-500'; // Default for other nodes if no execution status\n\n    return (\n        <div className={"], ["typescript\n// src/pages/AgenticFlowEditor.tsx\n// Agentic Flow Editor Page (\u81EA\u6211\u4EA4\u4ED8\u7DE8\u8F2F\u5668)\n// Provides a visual editor for defining and modifying Agentic Flows (Dynamic DAG Workflows).\n// --- New: Create a page for Agentic Flow Editor UI ---\n// --- New: Implement fetching Agentic Flow data by ID ---\n// --- New: Integrate React Flow for DAG visualization and editing ---\n// --- New: Add placeholder logic for node/edge operations and property editing ---\n// --- New: Add Realtime Updates for Agentic Flow, Nodes, and Edges ---\n// --- Modified: Add Run Button functionality ---\n// --- New: Implement fetching and displaying Execution History ---\n// --- New: Add Realtime Updates for Agentic Flow Executions ---\n// --- Modified: Add Edit Button linking to Editor page ---\n// --- Modified: Implement Save Button functionality connecting to backend ---\n// --- Modified: Implement Run Flow Button functionality ---\n// --- Modified: Integrate ActionEditor component into Node Properties panel ---\n// --- New: Complete Node/Edge Properties Editor Panel ---\n// --- Modified: Implement Add Node, Delete Node, Add Edge, Delete Edge functionality ---\\\n\n\nimport React, { useEffect, useState, useCallback } from 'react';\nimport { useParams, useNavigate, Link } from 'react-router-dom'; // To get the flow ID from the URL and navigate\nimport { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and update flow details and trigger actions\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes\nimport { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals\nimport { AgenticFlow, AgenticFlowNode, AgenticFlowEdge, Rune, ForgedAbility, Goal } from '../interfaces'; // Import types\nimport ReactFlow, {\n  MiniMap,\n  Controls,\n  Background,\n  Node,\n  Edge,\n  Position,\n  ReactFlowProvider,\n  useNodesState,\n  useEdgesState,\n  addEdge,\n  Connection,\n  EdgeTypes,\n  NodeTypes,\n  OnNodesChange, // Import OnNodesChange type\n  OnEdgesChange, // Import OnEdgesChange type\n  OnConnect,\n  OnNodesDelete,\n  OnEdgesDelete,\n  applyNodeChanges, // Import applyNodeChanges\n  applyEdgeChanges, // Import applyEdgeChanges\n} from 'reactflow';\nimport 'reactflow/dist/style.css'; // Import React Flow styles\nimport dagre from '@react-flow/dagre'; // Import Dagre layout algorithm\nimport { ArrowLeft, Save, Loader2, PlusCircle, Trash2, Edit, XCircle, Info, Play } from 'lucide-react'; // Import icons including Play\n// --- Modified: Import ActionEditor component ---\\\nimport ActionEditor from '../components/ActionEditor';\n// --- End Modified ---\\\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (\u81EA\u6211\u5C0E\u822A) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\nconst goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (\u76EE\u6A19\u7BA1\u7406) module\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// --- New: Initialize Dagre graph for layout ---\nconst dagreGraph = new dagre.graphlib.Graph();\ndagreGraph.setDefaultEdgeLabel(() => ({}));\n\n// Define node and edge dimensions for layout calculation\nconst nodeWidth = 250; // Approximate width of the node div\nconst nodeHeight = 150; // Approximate height of the node div (adjust based on content)\n// --- End New ---\n\n\n// --- New: Custom Node Component (Placeholder) ---\\\n// This component will render the content of each node in the React Flow graph.\n// It should display node details and potentially include inline editing or buttons.\nconst CustomFlowNode: React.FC<{ data: { label: string, nodeData: AgenticFlowNode, onEditClick: (node: AgenticFlowNode) => void } }> = ({ data }) => {\n    const { label, nodeData, onEditClick } = data;\n    const isEntryNode = nodeData.node_id_in_flow === (window.systemContext?.currentFlow?.entry_node_id || 'start'); // Check if it's the entry node\n\n    // Determine border color based on execution status\n    const borderColor = isEntryNode ? 'border-green-500' : 'border-blue-500'; // Default for other nodes if no execution status\n\n    return (\n        <div className={"])));
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
flex - col(templateObject_2 || (templateObject_2 = __makeTemplateObject(["}>\n            <div className=\"flex justify-between items-center mb-1\">\n                <div className=\"text-sm font-semibold text-blue-200 overflow-hidden text-ellipsis whitespace-nowrap\">\n                    Node: {nodeData.node_id_in_flow} ({nodeData.type})\n                </div>\n                <button onClick={() => onEditClick(nodeData)} className=\"text-neutral-400 hover:text-white transition\">\n                    <Edit size={16} />\n                </button>\n            </div>\n            <div className=\"text-neutral-300 text-xs flex-grow overflow-hidden\">\n                {nodeData.description || 'No description.'}\n            </div>\n            {/* TODO: Add visual indicators for action/decision logic presence */}\n            {nodeData.action && <span className=\"text-neutral-400 text-xs mt-1\">Action: {nodeData.action.type}</span>}\n            {nodeData.decision_logic && <span className=\"text-neutral-400 text-xs mt-1\">Decision Logic Present</span>}\n        </div>\n    );\n};\n\n// Define custom node types\nconst nodeTypes: NodeTypes = {\n    default: CustomFlowNode, // Use our custom component for the default type\n    // TODO: Define specific node types if needed (e.g., 'decision', 'action')\n};\n// --- End Custom Node Component ---\n\n\nconst AgenticFlowEditor: React.FC = () => {\n  const { flowId } = useParams<{ flowId: string }>(); // Get flowId from URL params\n  const navigate = useNavigate(); // Hook for navigation\n\n  const [flow, setFlow] = useState<AgenticFlow | null>(null); // State for the flow details\n  const [nodes, setNodes, onNodesChange] = useNodesState([]); // React Flow nodes state\n  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // React Flow edges state\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [isSaving, setIsSaving] = useState(false);\n  // --- New: State for running flow ---  const [isRunningFlow, setIsRunningFlow] = useState(false);\n  // --- End New ---\n\n  // --- New: State for editing node/edge properties ---  const [editingNode, setEditingNode] = useState<Node | null>(null); // The React Flow node being edited\n  const [editingEdge, setEditingEdge] = useState<Edge | null>(null); // The React Flow edge being edited\n  const [nodeProperties, setNodeProperties] = useState<Partial<AgenticFlowNode>>({}); // Properties of the node being edited\n  const [edgeProperties, setEdgeProperties] = useState<Partial<AgenticFlowEdge>>({}); // Properties of the edge being edited\n  const [propertiesError, setPropertiesError] = useState<string | null>(null); // Error for properties form\n  // --- End New ---\n  // --- New: States for data needed by ActionEditor and Node/Edge forms ---  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\n  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results\n  // --- End New ---\n\n  // --- New: Layout function using Dagre ---  const getLayoutedElements = useCallback(\n      (nodes: Node[], edges: Edge[], direction = 'TB') => {\n          const isHorizontal = direction === 'LR';\n          dagreGraph.setGraph({ rankdir: direction });\n\n          nodes.forEach((node) => {\n              // Set nodes with dimensions for layout calculation\n              dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });\n          });\n\n          edges.forEach((edge) => {\n              dagreGraph.setEdge(edge.source, edge.target);\n          });\n\n          dagre.layout(dagreGraph);\n\n          const layoutedNodes = nodes.map((node) => {\n              const nodeWithPosition = dagreGraph.node(node.id);\n              // We need to pass a node object with at least position.\n              // Node is passed by reference, so we modify it directly.\n              node.position = {\n                  x: nodeWithPosition.x - nodeWidth / 2,\n                  y: nodeWithPosition.y - nodeHeight / 2,\n              };\n\n              return node;\n          });\n\n          return { nodes: layoutedNodes, edges }; // Return edges as is, layout only affects nodes\n      },\n      [] // Dependencies for useCallback - empty as it only depends on imported constants/libraries\n  );\n  // --- End New ---\n\n  // --- New: Convert Agentic Flow Data to React Flow format with Layout ---  const flowToReactFlowData = useCallback((agenticFlow: AgenticFlow) => {\n      // Store the flow definition in the global context for access by custom nodes\n      window.systemContext.currentFlow = agenticFlow;\n\n      const reactFlowNodes: Node[] = agenticFlow.nodes.map((node) => {\n          return {\n              id: node.node_id_in_flow, // Use node_id_in_flow as React Flow node ID\n              // Position will be calculated by the layout algorithm\n              position: { x: 0, y: 0 }, // Placeholder position\n              data: {\n                  label: (\n                      <div className=\"p-2 bg-neutral-700/70 rounded-md border border-neutral-600 text-neutral-200 text-xs w-[180px] overflow-hidden text-ellipsis whitespace-nowrap\">\n                          <div className=\"font-semibold overflow-hidden text-ellipsis whitespace-nowrap\">Node: {node.node_id_in_flow} ({node.type})</div>\n                          <div className=\"text-neutral-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap\">Desc: {node.description}</div>\n                          {/* Add more details like source, tags if needed */}\n                      </div>\n                  ),\n                  // Store the original node data\n                  nodeData: node,\n                  onEditClick: handleEditNodeClick, // Pass the edit handler\n              },\n              type: 'default', // Use our custom node type\n              sourcePosition: Position.Bottom, // Default source handle position\n              targetPosition: Position.Top, // Default target handle position\n              style: {\n                  padding: 0, // Remove default padding as label has its own\n                  backgroundColor: 'transparent', // Make node background transparent\n                  width: nodeWidth, // Set width for layout calculation\n                  height: nodeHeight, // Set height for layout calculation\n                  border: 'none', // No border on the container, let the custom node handle it\n              },\n          };\n      });\n\n      const reactFlowEdges: Edge[] = agenticFlow.edges.map(edge => {\n          return {\n              id: edge.edge_id_in_flow || edge.id, // Use edge_id_in_flow or DB ID as React Flow edge ID\n              source: edge.source_node_id,\n              target: edge.target_node_id,\n              type: 'default', // Use default edge type\n              label: edge.condition ? 'Conditional' : 'Unconditional', // Show relation type as label\n              style: { strokeWidth: 1, stroke: edge.condition ? '#ffcc00' : '#999' }, // Yellow for conditional, gray for unconditional\n              // animated: true, // Optional: animate edges\n              data: { // Store the original edge data\n                  edgeData: edge,\n                  onEditClick: handleEditEdgeClick, // Pass the edit handler\n              }\n          };\n      });\n\n      // Apply layout algorithm\n      const layouted = getLayoutedElements(reactFlowNodes, reactFlowEdges, 'TB'); // Use 'TB' for top-to-bottom layout\n\n      return { nodes: layouted.nodes, edges: layouted.edges };\n  }, [getLayoutedElements]); // Re-generate React Flow data if layout function changes\n\n\n  const fetchFlowData = useCallback(async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!selfNavigationEngine || !userId || !flowId) {\n            setError(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch the specific flow details, including nodes and edges\n          const fetchedFlow = await selfNavigationEngine.getAgenticFlowById(flowId, userId); // Pass flowId and userId\n\n          if (fetchedFlow) {\n              setFlow(fetchedFlow);\n              // Convert fetched flow data to React Flow format and apply layout\n              const reactFlowData = flowToReactFlowData(fetchedFlow);\n              setNodes(reactFlowData.nodes);\n              setEdges(reactFlowData.edges);\n          } else {\n              // If flow not found\n              setFlow(null);\n              setNodes([]); // Clear React Flow state\n              setEdges([]); // Clear React Flow state\n          }\n\n      } catch (err: any) {\n          console.error("], ["}>\n            <div className=\"flex justify-between items-center mb-1\">\n                <div className=\"text-sm font-semibold text-blue-200 overflow-hidden text-ellipsis whitespace-nowrap\">\n                    Node: {nodeData.node_id_in_flow} ({nodeData.type})\n                </div>\n                <button onClick={() => onEditClick(nodeData)} className=\"text-neutral-400 hover:text-white transition\">\n                    <Edit size={16} />\n                </button>\n            </div>\n            <div className=\"text-neutral-300 text-xs flex-grow overflow-hidden\">\n                {nodeData.description || 'No description.'}\n            </div>\n            {/* TODO: Add visual indicators for action/decision logic presence */}\n            {nodeData.action && <span className=\"text-neutral-400 text-xs mt-1\">Action: {nodeData.action.type}</span>}\n            {nodeData.decision_logic && <span className=\"text-neutral-400 text-xs mt-1\">Decision Logic Present</span>}\n        </div>\n    );\n};\n\n// Define custom node types\nconst nodeTypes: NodeTypes = {\n    default: CustomFlowNode, // Use our custom component for the default type\n    // TODO: Define specific node types if needed (e.g., 'decision', 'action')\n};\n// --- End Custom Node Component ---\n\n\nconst AgenticFlowEditor: React.FC = () => {\n  const { flowId } = useParams<{ flowId: string }>(); // Get flowId from URL params\n  const navigate = useNavigate(); // Hook for navigation\n\n  const [flow, setFlow] = useState<AgenticFlow | null>(null); // State for the flow details\n  const [nodes, setNodes, onNodesChange] = useNodesState([]); // React Flow nodes state\n  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // React Flow edges state\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [isSaving, setIsSaving] = useState(false);\n  // --- New: State for running flow ---\\\n  const [isRunningFlow, setIsRunningFlow] = useState(false);\n  // --- End New ---\\\n\n\n  // --- New: State for editing node/edge properties ---\\\n  const [editingNode, setEditingNode] = useState<Node | null>(null); // The React Flow node being edited\n  const [editingEdge, setEditingEdge] = useState<Edge | null>(null); // The React Flow edge being edited\n  const [nodeProperties, setNodeProperties] = useState<Partial<AgenticFlowNode>>({}); // Properties of the node being edited\n  const [edgeProperties, setEdgeProperties] = useState<Partial<AgenticFlowEdge>>({}); // Properties of the edge being edited\n  const [propertiesError, setPropertiesError] = useState<string | null>(null); // Error for properties form\n  // --- End New ---\\\n\n  // --- New: States for data needed by ActionEditor and Node/Edge forms ---\\\n  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\n  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results\n  // --- End New ---\\\n\n\n  // --- New: Layout function using Dagre ---\\\n  const getLayoutedElements = useCallback(\n      (nodes: Node[], edges: Edge[], direction = 'TB') => {\n          const isHorizontal = direction === 'LR';\n          dagreGraph.setGraph({ rankdir: direction });\n\n          nodes.forEach((node) => {\n              // Set nodes with dimensions for layout calculation\n              dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });\n          });\n\n          edges.forEach((edge) => {\n              dagreGraph.setEdge(edge.source, edge.target);\n          });\n\n          dagre.layout(dagreGraph);\n\n          const layoutedNodes = nodes.map((node) => {\n              const nodeWithPosition = dagreGraph.node(node.id);\n              // We need to pass a node object with at least position.\n              // Node is passed by reference, so we modify it directly.\n              node.position = {\n                  x: nodeWithPosition.x - nodeWidth / 2,\n                  y: nodeWithPosition.y - nodeHeight / 2,\n              };\n\n              return node;\n          });\n\n          return { nodes: layoutedNodes, edges }; // Return edges as is, layout only affects nodes\n      },\n      [] // Dependencies for useCallback - empty as it only depends on imported constants/libraries\n  );\n  // --- End New ---\\\n\n\n  // --- New: Convert Agentic Flow Data to React Flow format with Layout ---\\\n  const flowToReactFlowData = useCallback((agenticFlow: AgenticFlow) => {\n      // Store the flow definition in the global context for access by custom nodes\n      window.systemContext.currentFlow = agenticFlow;\n\n      const reactFlowNodes: Node[] = agenticFlow.nodes.map((node) => {\n          return {\n              id: node.node_id_in_flow, // Use node_id_in_flow as React Flow node ID\n              // Position will be calculated by the layout algorithm\n              position: { x: 0, y: 0 }, // Placeholder position\n              data: {\n                  label: (\n                      <div className=\"p-2 bg-neutral-700/70 rounded-md border border-neutral-600 text-neutral-200 text-xs w-[180px] overflow-hidden text-ellipsis whitespace-nowrap\">\n                          <div className=\"font-semibold overflow-hidden text-ellipsis whitespace-nowrap\">Node: {node.node_id_in_flow} ({node.type})</div>\n                          <div className=\"text-neutral-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap\">Desc: {node.description}</div>\n                          {/* Add more details like source, tags if needed */}\n                      </div>\n                  ),\n                  // Store the original node data\n                  nodeData: node,\n                  onEditClick: handleEditNodeClick, // Pass the edit handler\n              },\n              type: 'default', // Use our custom node type\n              sourcePosition: Position.Bottom, // Default source handle position\n              targetPosition: Position.Top, // Default target handle position\n              style: {\n                  padding: 0, // Remove default padding as label has its own\n                  backgroundColor: 'transparent', // Make node background transparent\n                  width: nodeWidth, // Set width for layout calculation\n                  height: nodeHeight, // Set height for layout calculation\n                  border: 'none', // No border on the container, let the custom node handle it\n              },\n          };\n      });\n\n      const reactFlowEdges: Edge[] = agenticFlow.edges.map(edge => {\n          return {\n              id: edge.edge_id_in_flow || edge.id, // Use edge_id_in_flow or DB ID as React Flow edge ID\n              source: edge.source_node_id,\n              target: edge.target_node_id,\n              type: 'default', // Use default edge type\n              label: edge.condition ? 'Conditional' : 'Unconditional', // Show relation type as label\n              style: { strokeWidth: 1, stroke: edge.condition ? '#ffcc00' : '#999' }, // Yellow for conditional, gray for unconditional\n              // animated: true, // Optional: animate edges\n              data: { // Store the original edge data\n                  edgeData: edge,\n                  onEditClick: handleEditEdgeClick, // Pass the edit handler\n              }\n          };\n      });\n\n      // Apply layout algorithm\n      const layouted = getLayoutedElements(reactFlowNodes, reactFlowEdges, 'TB'); // Use 'TB' for top-to-bottom layout\n\n      return { nodes: layouted.nodes, edges: layouted.edges };\n  }, [getLayoutedElements]); // Re-generate React Flow data if layout function changes\n\n\n  const fetchFlowData = useCallback(async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!selfNavigationEngine || !userId || !flowId) {\n            setError(\"SelfNavigationEngine module not initialized or user not logged in, or flow ID is missing.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch the specific flow details, including nodes and edges\n          const fetchedFlow = await selfNavigationEngine.getAgenticFlowById(flowId, userId); // Pass flowId and userId\n\n          if (fetchedFlow) {\n              setFlow(fetchedFlow);\n              // Convert fetched flow data to React Flow format and apply layout\n              const reactFlowData = flowToReactFlowData(fetchedFlow);\n              setNodes(reactFlowData.nodes);\n              setEdges(reactFlowData.edges);\n          } else {\n              // If flow not found\n              setFlow(null);\n              setNodes([]); // Clear React Flow state\n              setEdges([]); // Clear React Flow state\n          }\n\n      } catch (err: any) {\n          console.error("])));
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
");\n          setFlow(null);\n          setNodes([]); // Clear React Flow state\n          setEdges([]); // Clear React Flow state\n      } finally {\n          setLoading(false);\n      }\n  }, [selfNavigationEngine, systemContext?.currentUser?.id, flowId, setFlow, setNodes, setEdges, setLoading, setError, flowToReactFlowData]); // Dependencies for useCallback\n\n\n    // --- New: Fetch data needed by ActionEditor and Node/Edge forms ---    const fetchActionEditorData = useCallback(async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!userId || !sacredRuneEngraver || !authorityForgingEngine || !goalManagementService) {\n             console.warn(\"Cannot fetch ActionEditor data: Core modules not initialized or user not logged in.\");\n             setAvailableRunes([]);\n             setAvailableAbilities([]);\n             setAvailableGoals([]);\n             return;\n        }\n        try {\n            // Fetch available runes (user's and public)\n            const runes = await sacredRuneEngraver.listRunes(undefined, userId);\n            setAvailableRunes(runes);\n\n            // Fetch available abilities (user's and public)\n            const abilities = await authorityForgingEngine.getAbilities(undefined, userId);\n            setAvailableAbilities(abilities);\n\n            // Fetch available goals (including KRs) for linking\n            const goals = await goalManagementService.getGoals(userId);\n            setAvailableGoals(goals);\n\n        } catch (err: any) {\n            console.error('Error fetching ActionEditor data:', err);\n            // Don't set a critical error for the whole page\n            // setError(";
Failed;
to;
load;
data;
for (action; editor; )
    : $;
{
    err.message;
}
");\n            setAvailableRunes([]);\n            setAvailableAbilities([]);\n            setAvailableGoals([]);\n        } finally {\n             // Ensure loading state is false even if fetching secondary data fails\n             // setLoading(false); // This is handled by fetchFlowData\n        }\n    }, [systemContext?.currentUser?.id, sacredRuneEngraver, authorityForgingEngine, goalManagementService]);\n    // --- End New ---\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes or flowId changes\n    if (systemContext?.currentUser?.id && flowId) {\n        fetchFlowData(); // Fetch data for the specific flow\n        // --- New: Fetch data needed by ActionEditor ---        fetchActionEditorData();\n        // --- End New ---    }\n\n    // TODO: Subscribe to realtime updates for this specific flow, its nodes, and edges\n    // If updates happen externally, we need to refetch and re-layout the graph.\n    // This is complex and deferred for MVP.\n\n    return () => {\n        // Unsubscribe on component unmount\n        // Clear the currentFlow from global context\n        window.systemContext.currentFlow = null;\n    };\n\n  }, [flowId, systemContext?.currentUser?.id, selfNavigationEngine, fetchFlowData, fetchActionEditorData]); // Re-run effect when flowId, user ID, services, or fetch functions change\n\n\n    // --- New: Handle Node/Edge Changes from React Flow ---    // These handlers update the local React Flow state.\n    // Saving to the backend happens explicitly via the Save button.\n    const onNodesChangeHandler: OnNodesChange = useCallback((changes) => {\n        setNodes((nds) => applyNodeChanges(changes, nds));\n        // Clear editing state if the edited node is deleted or changed significantly\n        if (editingNode) {\n            const deletedChange = changes.find(c => c.type === 'remove' && c.id === editingNode.id);\n            const positionChange = changes.find(c => c.type === 'position' && c.id === editingNode.id);\n            if (deletedChange || positionChange) { // Clear edit state on delete or move\n                 setEditingNode(null);\n                 setNodeProperties({});;\n                 setPropertiesError(null);\n            }\n        }\n    }, [setNodes, editingNode]);\n\n    const onEdgesChangeHandler: OnEdgesChange = useCallback((changes) => {\n        setEdges((eds) => applyEdgeChanges(changes, eds));\n         // Clear editing state if the edited edge is deleted or changed significantly\n        if (editingEdge) {\n            const deletedChange = changes.find(c => c.type === 'remove' && c.id === editingEdge.id);\n             if (deletedChange) { // Clear edit state on delete\n                 setEditingEdge(null);\n                 setEdgeProperties({});\n                 setPropertiesError(null);\n             }\n        }\n    }, [setEdges, editingEdge]);\n\n    const onConnect: OnConnect = useCallback((connection) => {\n        // Add a new edge when nodes are connected\n        // Generate a simple ID for the new edge\n        const newEdgeId = ";
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
";\n        const newEdge: Edge = {\n            id: newEdgeId,\n            source: connection.source,\n            target: connection.target,\n            type: 'default', // Default edge type\n            label: 'New Edge', // Default label\n            // Add default condition if needed (e.g., null for unconditional)\n            data: {\n                 edgeData: { // Store placeholder edge data\n                     id: 'temp-edge-' + Date.now() + '-' + Math.random().toString(16).slice(2), // Temporary DB ID\n                     flow_id: flow?.id || 'temp', // Link to the current flow (temp if flow not loaded)\n                     edge_id_in_flow: newEdgeId, // Use the generated ID as ID in flow for now\n                     source_node_id: connection.source, // Source node ID from React Flow\n                     target_node_id: connection.target, // Target node ID from React Flow\n                     condition: null, // Default to unconditional\n                 } as AgenticFlowEdge,\n                 onEditClick: handleEditEdgeClick, // Pass the edit handler\n            }\n        };\n        setEdges((eds) => addEdge(newEdge, eds));\n        console.log('Added new edge:', newEdge);\n        // Automatically select and open properties for the new edge\n        // handleEditEdgeClick(null as any, newEdge); // Pass null event for now\n    }, [setEdges, flow]); // Re-run if flow changes\n\n    const onNodesDelete: OnNodesDelete = useCallback((deletedNodes) => {\n        console.log('Nodes deleted:', deletedNodes);\n        // Clear editing state if the edited node was deleted\n        if (editingNode && deletedNodes.some(node => node.id === editingNode.id)) {\n            setEditingNode(null);\n            setNodeProperties({});;\n            setPropertiesError(null);\n        }\n        // Deletion from backend happens on Save\n    }, [editingNode]);\n\n    const onEdgesDelete: OnEdgesDelete = useCallback((deletedEdges) => {\n        console.log('Edges deleted:', deletedEdges);\n        // Clear editing state if the edited edge was deleted\n        if (editingEdge && deletedEdges.some(edge => edge.id === editingEdge.id)) {\n            setEditingEdge(null);\n            setEdgeProperties({});\n            setPropertiesError(null);\n        }\n    }, [editingEdge]);\n\n    // --- End New ---\n\n    // --- New: Handle Add Node ---    const handleAddNode = () => {\n        const newNodeId = ";
node - $;
{
    nodes.length + 1;
}
"; // Simple sequential ID\n        const newNode: Node = {\n            id: newNodeId,\n            // Position it near the center of the view, or relative to an existing node\n            position: { x: window.innerWidth / 2 - nodeWidth / 2, y: window.innerHeight / 2 - nodeHeight / 2 }, // Center of viewport (rough)\n            data: {\n                label: newNodeId,\n                nodeData: { // Store placeholder node data\n                    id: 'temp-node-' + Date.now() + '-' + Math.random().toString(16).slice(2), // Temporary DB ID\n                    flow_id: flow?.id || 'temp', // Link to the current flow (temp if flow not loaded)\n                    node_id_in_flow: newNodeId, // Use the generated ID as ID in flow\n                    type: 'task_step', // Default node type\n                    description: ";
New;
$;
{
    newNodeId;
}
", // Default description\n                    action: { type: 'log', details: { message: '' } }, // Default action\n                    decision_logic: null, // Default to no decision logic\n                } as AgenticFlowNode,\n                onEditClick: handleEditNodeClick, // Pass the edit handler\n            },\n            type: 'default', // Use our custom node type\n            sourcePosition: Position.Bottom,\n            targetPosition: Position.Top,\n             style: {\n                padding: 0,\n                backgroundColor: 'transparent',\n                width: nodeWidth,\n                height: nodeHeight,\n                border: 'none',\n            },\n        };\n        setNodes((nds) => nds.concat(newNode));\n        console.log('Added new node:', newNode);\n        // Automatically select and open properties for the new node\n        setEditingNode(newNode); // Set the React Flow node for editing\n        setNodeProperties(newNode.data.nodeData); // Set the underlying AgenticFlowNode data for the form\n        setEditingEdge(null); // Ensure edge editing is closed\n        setEdgeProperties({});\n        setPropertiesError(null);\n    };\n    // --- End New ---\n\n    // --- New: Handle Edit Node/Edge ---    const handleEditNodeClick = (nodeData: AgenticFlowNode) => {\n        // Find the corresponding React Flow node\n        const node = nodes.find(n => n.id === nodeData.node_id_in_flow); // Find by node_id_in_flow\n        if (node) {\n            setEditingNode(node); // Set the React Flow node for editing\n            // Deep copy node data for editing\n            setNodeProperties(JSON.parse(JSON.stringify(nodeData))); // Set the underlying AgenticFlowNode data for the form\n            setEditingEdge(null); // Ensure edge editing is closed\n            setEdgeProperties({});\n            setPropertiesError(null);\n        }\n    };\n\n    const handleEditEdgeClick = (event: React.MouseEvent, edge: Edge) => {\n         // Prevent default behavior (e.g., opening context menu)\n         event.preventDefault();\n        // Find the original edge data (stored in edge.data.edgeData)\n        const edgeData = edge.data?.edgeData; // Use optional chaining\n        if (edgeData) {\n            setEditingEdge(edge); // Set the React Flow edge for editing\n            // Deep copy edge data for editing\n            setEdgeProperties(JSON.parse(JSON.stringify(edgeData))); // Set the underlying AgenticFlowEdge data for the form\n            setEditingNode(null); // Ensure node editing is closed\n            setNodeProperties({});\n            setPropertiesError(null);\n        }\n    };\n\n    const handleSaveProperties = () => {\n        if (editingNode) {\n            // Validate node properties before saving\n            if (!nodeProperties.node_id_in_flow || !nodeProperties.type || !nodeProperties.description) {\n                 setPropertiesError('Node ID, Type, and Description are required.');\n                 return;\n            }\n            // TODO: Add more specific validation based on node type (e.g., action for task_step, logic for decision)\n\n            // Update the node in the React Flow state\n            setNodes((nds) =>\n                nds.map((node) =>\n                    node.id === editingNode.id\n                        ? {\n                              ...node,\n                              data: {\n                                  ...node.data,\n                                  label: nodeProperties.description || nodeProperties.node_id_in_flow, // Update label\n                                  nodeData: nodeProperties as AgenticFlowNode, // Update the stored node data\n                              },\n                          }\n                        : node\n                )\n            );\n            console.log('Updated node properties locally:', editingNode.id, nodeProperties);\n            setEditingNode(null); // Close properties panel\n            setNodeProperties({});\n            setPropertiesError(null);\n\n        } else if (editingEdge) {\n            // Validate edge properties before saving\n            // TODO: Add validation for edge properties (e.g., condition format)\n\n            // Update the edge in the React Flow state\n            setEdges((eds) =>\n                eds.map((edge) =>\n                    edge.id === editingEdge.id\n                        ? {\n                              ...edge,\n                              label: edgeProperties.condition ? 'Conditional' : 'Unconditional', // Update label based on condition\n                              style: { ...edge.style, stroke: edgeProperties.condition ? '#ffcc00' : '#999' }, // Update color\n                              data: {\n                                  ...edge.data,\n                                  edgeData: edgeProperties as AgenticFlowEdge, // Update the stored edge data\n                              },\n                          }\n                        : edge\n                )\n            );\n            console.log('Updated edge properties locally:', editingEdge.id, edgeProperties);\n            setEditingEdge(null); // Close properties panel\n            setEdgeProperties({});\n            setPropertiesError(null);\n        }\n    };\n\n    const handleCancelProperties = () => {\n        setEditingNode(null);\n        setNodeProperties({});\n        setEditingEdge(null);\n        setEdgeProperties({});\n        setPropertiesError(null);\n        // Note: Changes made in the form are lost if cancelled\n    };\n    // --- End New ---\n\n    // --- New: Handle Save Flow to Backend ---    const handleSaveFlow = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !flow) {\n            alert(\"SelfNavigationEngine module not initialized, user not logged in, or flow data is missing.\");\n            return;\n        }\n\n        // Convert React Flow nodes and edges back to Agentic Flow format\n        // Extract the underlying AgenticFlowNode/Edge data stored in the 'data' property\n        const updatedNodes: AgenticFlowNode[] = nodes.map(node => node.data.nodeData);\n        const updatedEdges: AgenticFlowEdge[] = edges.map(edge => edge.data?.edgeData || { // Use stored edgeData or reconstruct basic edge\n             // If edgeData is missing, it's likely a newly drawn edge without properties edited yet.\n             // Reconstruct basic edge data using React Flow edge properties.\n             // Note: the 'id' here is the React Flow edge ID, which might be a temporary client-side ID.\n             // The backend's updateAgenticFlowStructure should handle assigning DB UUIDs for new entries.\n             id: edge.id, // Use React Flow ID as temporary identifier\n             flow_id: flow.id, // Link to the current flow (temp if flow not loaded)\n             edge_id_in_flow: edge.id, // Use the React Flow ID as the ID within the flow structure\n             source_node_id: edge.source, // Source node ID from React Flow\n             target_node_id: edge.target, // Target node ID from React Flow\n             condition: null, // Default to unconditional if not set\n        });\n\n        // Basic validation before saving\n        if (updatedNodes.length === 0) {\n             alert('Cannot save flow: Must have at least one node.');\n             return;\n        }\n        const entryNodeExists = updatedNodes.some(node => node.node_id_in_flow === flow.entry_node_id); // Check if the original entry node ID still exists\n        if (!entryNodeExists) {\n             // If the original entry node was deleted, maybe prompt the user to select a new one\n             alert(";
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
saving.(templateObject_3 || (templateObject_3 = __makeTemplateObject([");\n             // TODO: Implement UI to select a new entry node\n             return;\n        }\n        // TODO: Add more robust validation (e.g., check for orphaned nodes, invalid edge targets, cycles if not allowed)\n\n\n        // Create the updated flow object (only flow-level fields that can be edited here, plus nodes/edges)\n        // For MVP, we are not editing flow name/description/entry_node_id on this page.\n        // The "], [");\n             // TODO: Implement UI to select a new entry node\n             return;\n        }\n        // TODO: Add more robust validation (e.g., check for orphaned nodes, invalid edge targets, cycles if not allowed)\n\n\n        // Create the updated flow object (only flow-level fields that can be edited here, plus nodes/edges)\n        // For MVP, we are not editing flow name/description/entry_node_id on this page.\n        // The "])));
updateAgenticFlowStructure(templateObject_4 || (templateObject_4 = __makeTemplateObject([" method handles updating nodes/edges based on the provided lists.\n        // It also implicitly updates the flow's last_updated_timestamp.\n\n        console.log('Attempting to save flow structure:', flow.id);\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:flows:save_editor',\n            details: { flowId: flow.id, flowName: flow.name, nodeCount: updatedNodes.length, edgeCount: updatedEdges.length },\n            context: { platform: 'web', page: 'flow_editor' },\n            user_id: userId, // Associate action with user\n        });\n\n\n        setIsSaving(true);\n        setError(null); // Clear main error\n        try {\n            // Call the SelfNavigationEngine method to update the flow structure\n            // This method handles inserting new, updating existing, and deleting removed nodes/edges.\n            const savedFlow = await selfNavigationEngine.updateAgenticFlowStructure(flow.id, updatedNodes, updatedEdges, userId); // Pass flowId, updatedNodes, updatedEdges, userId\n\n            if (savedFlow) {\n                alert("], [" method handles updating nodes/edges based on the provided lists.\n        // It also implicitly updates the flow's last_updated_timestamp.\n\n        console.log('Attempting to save flow structure:', flow.id);\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:flows:save_editor',\n            details: { flowId: flow.id, flowName: flow.name, nodeCount: updatedNodes.length, edgeCount: updatedEdges.length },\n            context: { platform: 'web', page: 'flow_editor' },\n            user_id: userId, // Associate action with user\n        });\n\n\n        setIsSaving(true);\n        setError(null); // Clear main error\n        try {\n            // Call the SelfNavigationEngine method to update the flow structure\n            // This method handles inserting new, updating existing, and deleting removed nodes/edges.\n            const savedFlow = await selfNavigationEngine.updateAgenticFlowStructure(flow.id, updatedNodes, updatedEdges, userId); // Pass flowId, updatedNodes, updatedEdges, userId\n\n            if (savedFlow) {\n                alert("])));
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
    setError("Failed to save flow: ".concat(err.message));
}
finally {
    setIsSaving(false);
}
;
// --- End New ---\
// --- New: Handle Run Flow ---\
var handleRunFlow = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userId, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId || !flowId || !flow) {
                    alert("SelfNavigationEngine module not initialized or user not logged in, or flow data is missing.");
                    return [2 /*return*/];
                }
                // Basic check: Cannot run if flow is already in progress
                if (flow.status === 'in-progress') {
                    alert('Flow is already in progress.');
                    return [2 /*return*/];
                }
                console.log("Attempting to run flow: ".concat(flow.name, " (").concat(flowId, ") from editor."));
                // Simulate recording user action
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:flows:run_editor',
                    details: { flowId: flow.id, flowName: flow.name },
                    context: { platform: 'web', page: 'flow_editor' },
                    user_id: userId, // Associate action with user
                });
                setIsRunningFlow(true); // Indicate running state
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                // Call the SelfNavigationEngine method to start the flow
                // Pass initialParams if needed (not implemented in UI yet)
                return [4 /*yield*/, selfNavigationEngine.startAgenticFlow(flowId, userId, {})];
            case 2:
                // Call the SelfNavigationEngine method to start the flow
                // Pass initialParams if needed (not implemented in UI yet)
                _b.sent(); // Pass flowId, userId, initialParams
                console.log("Flow ".concat(flow.name, " execution initiated."));
                // Status and execution history updates will be handled by event listeners on the detail page.
                // Navigate to the detail page to view the execution progress.
                navigate("/flows/".concat(flowId));
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error('Error running flow from editor:', err_1);
                setError("Failed to run flow: ".concat(err_1.message));
                alert("Failed to run flow: ".concat(err_1.message));
                return [3 /*break*/, 5];
            case 4:
                setIsRunningFlow(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- End New ---\
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to edit Agentic Flows.</p>
               </div>
            </div>);
}
return (<div className="container mx-auto p-4 flex flex-col h-[calc(100vh-80px)]"> {/* Adjust height to fit within viewport below nav */}
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl flex flex-col flex-grow"> {/* Use flex-grow to fill space */}
        {loading ? (<p className="text-neutral-400">Loading flow details...</p>) : error ? (<p className="text-red-400">Error: {error}</p>) : !flow ? (<p className="text-neutral-400">Agentic Flow not found.</p>) : (<>
                <div className="flex items-center gap-4 mb-4">
                    <Link to={"/flows/".concat(flow.id)} className="text-neutral-400 hover:text-white transition">
                        <ArrowLeft size={24}/>
                    </Link>
                    <h2 className="text-3xl font-bold text-blue-400">Editing Flow: {flow.name}</h2>
                </div>
                <p className="text-neutral-300 mb-4">{flow.description || 'No description.'}</p>
                <small className="text-neutral-400 text-xs block mb-4">
                    ID: {flow.id} | Entry Node: {flow.entry_node_id}
                     {flow.user_id && " | Owner: ".concat(flow.user_id)}
                     {flow.creation_timestamp && " | Created: ".concat(new Date(flow.creation_timestamp).toLocaleString())}\
                     {flow.start_timestamp && " | Started: ".concat(new Date(flow.start_timestamp).toLocaleString())}\
                     {flow.completion_timestamp && " | Finished: ".concat(new Date(flow.completion_timestamp).toLocaleString())}\
                </small>\
\
                {/* Editor Actions */}\
                <div className="mb-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}\
                     {/* Add Node Button */}\
                     <button />\
                         className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"\
                         onClick={handleAddNode}\
                         disabled={isSaving || isRunningFlow}\
                     >\
                         <PlusCircle size={16} className="inline-block mr-1"/> Add Node\
                     </button>\
                     {/* Save Flow Button */}\
                     <button />\
                         className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"\
                         onClick={handleSaveFlow}\
                         disabled={isSaving || isRunningFlow}\
                     >\
                         {isSaving ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Save size={18} className="inline-block mr-2"/>})}\
                         {isSaving ? 'Saving...' : 'Save Flow'}\
                     </>)}button>\
                     {/* New: Run Flow Button */}\
                     <button />\
                         className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"\
                         onClick={handleRunFlow}\
                         disabled={isSaving || isRunningFlow || flow.status === 'in-progress'} // Disable if saving, already running, or flow status is in-progress\
 // Disable if saving, already running, or flow status is in-progress\
                     >\
                         {isRunningFlow ? <Loader2 size={18} className="inline-block mr-2 animate-spin"/> : <Play size={18} className="inline-block mr-2"/>})}\
                         {isRunningFlow ? 'Running...' : 'Run Flow'}\
                     </button>\
                     {/* End New */}\
                     {/* TODO: Add Delete Flow Button */}\
                </div>);
{ /* React Flow Canvas */ }
<div className="flex-grow border border-neutral-600 rounded-md overflow-hidden" style={{ height: '500px' }}> {/* Fixed height for visualization */}\
                    <ReactFlowProvider> {/* Wrap with provider */}\
                        <ReactFlow />\
                            nodes={nodes}\
                            edges={edges}\
                            onNodesChange={onNodesChangeHandler} // Use our handler\
 // Use our handler\
                            onEdgesChange={onEdgesChangeHandler} // Use our handler\
 // Use our handler\
                            onConnect={onConnect} // Handle new connections\
 // Handle new connections\
                            onNodesDelete={onNodesDelete} // Handle node deletion\
 // Handle node deletion\
                            onEdgesDelete={onEdgesDelete} // Handle edge deletion\
 // Handle edge deletion\
                            nodeTypes={nodeTypes} // Use custom node types\
 // Use custom node types\
                            fitView // Automatically fit the view to the nodes\
                            attributionPosition="bottom-left"\
                            // Enable interactive features for editing\
                            nodesDraggable={true}\
                            nodesConnectable={true}\
                            elementsSelectable={true}\
                            panOnDrag={true}\
                            zoomOnScroll={true}\
                            deleteKeyCode={['Backspace', 'Delete']} // Enable delete key\
 // Enable delete key\
                            onNodeClick={function (event, node) { return handleEditNodeClick(node.data.nodeData); }} // Handle click to edit node\
 // Handle click to edit node\
                            onEdgeClick={function (event, edge) { return handleEditEdgeClick(event, edge); }} // Handle click to edit edge\
 // Handle click to edit edge\
                        >\
                            <MiniMap />\
                            <Controls />\
                            <Background variant="dots" gap={12} size={1}/>\
                        </ReactFlow>\
                    </ReactFlowProvider>;
{ /* End Provider */ }
div > ;
{ /* New: Node/Edge Properties Editor Panel */ }
{
    (editingNode || editingEdge) && ();
    <div className="mt-4 p-4 bg-neutral-700/50 rounded-lg">\
                        <div className="flex justify-between items-center mb-3">\
                            <h3 className="text-xl font-semibold text-blue-300">{editingNode ? "Edit Node: ".concat(editingNode.id) : "Edit Edge: ".concat(editingEdge === null || editingEdge === void 0 ? void 0 : editingEdge.id)}</h3>\
                            <button onClick={handleCancelProperties} className="text-neutral-400 hover:text-white transition">\
                                <XCircle size={20}/>\
                            </button>\
                        </div>\
                        {propertiesError && <p className="text-red-400 text-sm mb-4">Error: {propertiesError}</p>}\
\
                        {editingNode && nodeProperties && ()}\
                            <div className="space-y-4">\
                                {/* Node ID (Read-only) */}\
                                <div>\
                                    <label htmlFor="node-id" className="block text-neutral-300 text-sm font-semibold mb-1">Node ID:</label>\
                                    <input id="node-id" type="text" value={nodeProperties.node_id_in_flow || ''} className="w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed" disabled/>\
                                </div>\
                                {/* Node Type */}\
                                <div>\
                                    <label htmlFor="node-type" className="block text-neutral-300 text-sm font-semibold mb-1">Type:</label>\
                                    <select />\
                                        id="node-type"\
                                        className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"\
                                        value={nodeProperties.type || ''}\
                                        onChange={function (e) { return setNodeProperties(__assign(__assign({}, nodeProperties), { type: e.target.value, action: undefined, decision_logic: undefined })); }} // Reset action/logic when type changes\
     // Reset action/logic when type changes\
                                        disabled={isSaving}\
                                        required\
                                    >\
                                        <option value="task_step">task_step</option>\
                                        <option value="decision">decision</option>\
                                        <option value="parallel">parallel</option>\
                                        <option value="sub_workflow">sub_workflow</option>\
                                        <option value="rune_action">rune_action</option> {/* Alias for task_step with executeRune action */}\
                                        <option value="ability_execution">ability_execution</option> {/* Alias for task_step with runScript action */}\
                                        <option value="manual_input">manual_input</option>\
                                        {/* Add other node types */}\
                                    </select>\
                                </div>\
                                {/* Node Description */}\
                                <div>\
                                    <label htmlFor="node-description" className="block text-neutral-300 text-sm font-semibold mb-1">Description:</label>\
                                    <input />\
                                        id="node-description"\
                                        type="text"\
                                        className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"\
                                        value={nodeProperties.description || ''}\
                                        onChange={function (e) { return setNodeProperties(__assign(__assign({}, nodeProperties), { description: e.target.value })); }}\
                                        placeholder="Enter node description"\
                                        disabled={isSaving}\
                                        required\
                                    />\
                                </div>\
\
                                {/* Action Editor (for task_step, rune_action, ability_execution types) */}\
                                {(nodeProperties.type === 'task_step' || nodeProperties.type === 'rune_action' || nodeProperties.type === 'ability_execution') && (())}\
                                     <div className="p-3 bg-neutral-600/50 rounded-md">\
                                         <h4 className="text-neutral-300 text-sm font-semibold mb-2">Action Configuration:</h4>\
                                         <ActionEditor />\
                                             action={nodeProperties.action || { type: 'log', details: { message: '' } }} // Provide default action if none exists\
     // Provide default action if none exists\
                                             onChange={function (newAction) { return setNodeProperties(__assign(__assign({}, nodeProperties), { action: newAction, decision_logic: undefined })); }} // Update action, clear decision logic\
     // Update action, clear decision logic\
                                             disabled={isSaving}\
                                             availableRunes={availableRunes}\
                                             availableAbilities={availableAbilities}\
                                             availableGoals={availableGoals} // Pass available goals\
     // Pass available goals\
                                         />\
                                     </div>\
                                ))}\
\
                                {/* Decision Logic Editor (for decision type) */}\
                                {nodeProperties.type === 'decision' && (())}\
                                     <div className="p-3 bg-neutral-600/50 rounded-md">\
                                         <h4 className="text-neutral-300 text-sm font-semibold mb-2">Decision Logic (JSON):</h4>\
                                          <textarea />\
                                             className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"\
                                             value={JSON.stringify(nodeProperties.decision_logic || {}, null, 2)}\
                                             onChange={function (e) { }}\
                                                 try {}\
                                                     const logic = JSON.parse(e.target.value);\
                                                     setNodeProperties({...nodeProperties, decision_logic}: logic, action: undefined }); // Update logic, clear action\
                                                     setPropertiesError(null); // Clear error if parsing is successful\
                                                 } catch (parseError: any) {}\
                                                     setPropertiesError(`Invalid JSON: ${parseError.message}`);\
                                                 }\
                                             }}\
                                             rows={4}\
                                             disabled={isSaving}\
                                          />\
                                          {propertiesError && <p className="text-red-400 text-xs mt-1">Error: {propertiesError}</p>}\
                                     </div>\
                                ))}\
\
                                {/* New: Placeholder editors for other node types */}\
                                {nodeProperties.type === 'parallel' && (())}\
                                    <div className="p-3 bg-neutral-600/50 rounded-md">\
                                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Parallel Configuration:</h4>\
                                        <p className="text-neutral-400 text-sm">Configuration for parallel execution branches goes here.</p>\
                                        {/* TODO: Add UI to define parallel branches/outputs */}\
                                    </div>\
                                ))}\
\
                                {nodeProperties.type === 'sub_workflow' && (())}\
                                    <div className="p-3 bg-neutral-600/50 rounded-md space-y-2">\
                                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Sub-Workflow Configuration:</h4>\
                                        <div>\
                                            <label htmlFor="subflow-id" className="block text-neutral-400 text-xs font-semibold mb-1">Sub-Workflow ID:</label>\
                                            <input />\
                                                id="subflow-id"\
                                                type="text"\
                                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"\
                                                value={((_b = (_a = nodeProperties.action) === null || _a === void 0 ? void 0 : _a.details) === null || _b === void 0 ? void 0 : _b.subFlowId) || ''} // Assuming subFlowId is in action.details\
     // Assuming subFlowId is in action.details\
                                                onChange={function (e) { var _a; return setNodeProperties(__assign(__assign({}, nodeProperties), { action: { type: 'runSubFlow', details: __assign(__assign({}, (_a = nodeProperties.action) === null || _a === void 0 ? void 0 : _a.details), { subFlowId: e.target.value }) } })); }} // Update action details\
     // Update action details\
                                                placeholder="Enter Sub-Workflow ID"\
                                                disabled={isSaving}\
                                                required // Sub-workflow ID is required\
                                            />\
                                        </div>\
                                        {/* TODO: Add UI for passing parameters to the sub-workflow */}\
                                         <div className="mt-2 p-2 bg-neutral-700/50 rounded-md">\
                                             <label htmlFor="subflow-params-json" className="block text-neutral-400 text-xs font-semibold mb-1">Parameters (JSON):</label>\
                                              <textarea />\
                                                 id="subflow-params-json"\
                                                 className={"w-full p-1 rounded-md bg-neutral-800 text-white border ".concat(propertiesError ? 'border-red-500' : 'border-neutral-600', " focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs")}\
                                                 value={JSON.stringify(((_d = (_c = nodeProperties.action) === null || _c === void 0 ? void 0 : _c.details) === null || _d === void 0 ? void 0 : _d.params) || {}, null, 2)}\
                                                 onChange={function (e) { }}\
                                                     try {}\
                                                         const params = JSON.parse(e.target.value);\
                                                         setNodeProperties({...nodeProperties, action}: {type}: 'runSubFlow', details: {...(_e = nodeProperties.action) === null || _e === void 0 ? void 0 : _e.details, params} } }); // Update action details\
                                                         setPropertiesError(null); // Clear error if parsing is successful\
                                                     } catch (parseError: any) {}\
                                                         setPropertiesError(`Invalid JSON: ${parseError.message}`);\
                                                     }\
                                                 }}\
                                                 rows={3}\
                                                 disabled={isSaving}\
                                              />\
                                              {propertiesError && <p className="text-red-400 text-xs mt-1">Error: {propertiesError}</p>}\
                                         </div>\
                                    </div>\
                                ))}\
\
                                {nodeProperties.type === 'manual_input' && (())}\
                                    <div className="p-3 bg-neutral-600/50 rounded-md space-y-2">\
                                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Manual Input Configuration:</h4>\
                                        <div>\
                                            <label htmlFor="manual-input-prompt" className="block text-neutral-400 text-xs font-semibold mb-1">Prompt:</label>\
                                            <input />\
                                                id="manual-input-prompt"\
                                                type="text"\
                                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"\
                                                value={((_g = (_f = nodeProperties.action) === null || _f === void 0 ? void 0 : _f.details) === null || _g === void 0 ? void 0 : _g.prompt) || ''} // Assuming prompt is in action.details\
     // Assuming prompt is in action.details\
                                                onChange={function (e) { var _a; return setNodeProperties(__assign(__assign({}, nodeProperties), { action: { type: 'waitForUserInput', details: __assign(__assign({}, (_a = nodeProperties.action) === null || _a === void 0 ? void 0 : _a.details), { prompt: e.target.value }) } })); }} // Update action details\
     // Update action details\
                                                placeholder="Enter prompt for user"\
                                                disabled={isSaving}\
                                                required // Prompt is required\
                                            />\
                                        </div>\
                                        {/* TODO: Add UI for expected input type, validation, etc. */}\
                                    </div>\
                                ))}\
                                {/* End New */}\
\
                            </div>;
}
{
    editingEdge && edgeProperties && ();
    <div className="space-y-4">\
                                {/* Edge ID (Read-only) */}\
                                <div>\
                                    <label htmlFor="edge-id" className="block text-neutral-300 text-sm font-semibold mb-1">Edge ID:</label>\
                                    <input id="edge-id" type="text" value={edgeProperties.edge_id_in_flow || edgeProperties.id || ''} className="w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed" disabled/>\
                                </div>\
                                {/* Source Node (Read-only) */}\
                                <div>\
                                    <label htmlFor="edge-source" className="block text-neutral-300 text-sm font-semibold mb-1">Source Node:</label>\
                                    <input id="edge-source" type="text" value={edgeProperties.source_node_id || ''} className="w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed" disabled/>\
                                </div>\
                                {/* Target Node (Read-only) */}\
                                <div>\
                                    <label htmlFor="edge-target" className="block text-neutral-300 text-sm font-semibold mb-1">Target Node:</label>\
                                    <input id="edge-target" type="text" value={edgeProperties.target_node_id || ''} className="w-full p-2 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-not-allowed" disabled/>\
                                </div>\
                                {/* Edge Condition */}\
                                <div>\
                                    <label htmlFor="edge-condition" className="block text-neutral-300 text-sm font-semibold mb-1">Condition (JSON):</label>\
                                     <textarea />\
                                        id="edge-condition"\
                                        className={"w-full p-2 rounded-md bg-neutral-800 text-white border ".concat(propertiesError ? 'border-red-500' : 'border-neutral-600', " focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs")}\
                                        value={JSON.stringify(edgeProperties.condition || null, null, 2)}\
                                        onChange={function (e) { }}\
                                            try {}\
                                                const condition = JSON.parse(e.target.value);\
                                                setEdgeProperties({...edgeProperties, condition}); // Update condition\
                                                setPropertiesError(null); // Clear error if parsing is successful\
                                            } catch (parseError: any) {}\
                                                setPropertiesError(`Invalid JSON: ${parseError.message}`);\
                                            }\
                                        }}\
                                        rows={4}\
                                        disabled={isSaving}\
                                     />\
                                     <small className="text-neutral-400 text-xs mt-1 block">Define the condition for this edge (e.g., `{" \\\"result_is\\\": \\\"success\\\" "}`). Set to `null` for unconditional.</small>\
                                </div>\
                                {/* TODO: Add other edge properties if needed */}\
                            </div>;
}
<div className="flex gap-4 justify-end mt-4">\
                            <button />\
                                type="button"\
                                onClick={handleCancelProperties}\
                                className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"\
                                disabled={isSaving}\
                            >\
                                Cancel\
                            </button>;
<button type="button" onClick={handleSaveProperties} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSaving || !!propertiesError} // Disable if saving or there's a JSON error\
>\
                                Save Properties\
                            </button>;
div > ;
div > ;
{ /* End New */ }
 > ;
div > ;
div > ;
;
;
exports.default = AgenticFlowEditor;
""(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
