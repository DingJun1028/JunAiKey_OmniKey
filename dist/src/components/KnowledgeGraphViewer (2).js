import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
`` `typescript
// src/components/KnowledgeGraphViewer.tsx
// \u53ef\u91cd\u7528\u7d44\u4ef6 (Reusable Component) - \u77e5\u8b58\u5716\u8b5c\u67e5\u770b\u5668 (Knowledge Graph Viewer)
// Displays a knowledge graph using React Flow.
// --- New: Enhance node and edge styling --
// --- New: Add basic node click interaction (show details) --
// --- Modified: Implement node click to show details in a sidebar/modal --
// --- New: Add filtering by source --

import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
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
  OnNodesChange, // Import OnNodesChange type
  OnEdgesChange, // Import OnEdgesChange type
  NodeMouseHandler, // Import NodeMouseHandler type
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles
import dagre from '@reactflow/dagre'; // Import Dagre layout algorithm
import { KnowledgeRecord, KnowledgeRelation } from '../interfaces'; // Import interfaces
import { XCircle } from 'lucide-react'; // Import XCircle icon for closing modal
import ReactMarkdown from 'react-markdown'; // For rendering markdown

// Access core modules from the global window object (for MVP simplicity)
declare const window: any;
const knowledgeGraphService: any = window.systemContext?.knowledgeGraphService; // Access KnowledgeGraphService
const systemContext: any = window.systemContext; // Access the full context for currentUser


// --- New: Initialize Dagre graph ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Define node and edge dimensions for layout calculation
const nodeWidth = 200; // Approximate width of the node label div
const nodeHeight = 80; // Approximate height of the node label div (adjust based on content)
// --- End New ---


// Define the props for the KnowledgeGraphViewer component
interface KnowledgeGraphViewerProps {
    userId: string; // The user ID whose graph to display
    sourceFilter?: string; // New: Add source filter prop
    // TODO: Add filters (e.g., by relation type, timeframe)
}


// --- New: Custom Node Component for Graph Viewer ---
// This component will render the content of each node in the React Flow graph.
// It should display node details and indicate execution status.
const GraphNode: React.FC<{ data: { label: string, knowledgeRecord: KnowledgeRecord } }> = ({ data }) => {
    const { label, knowledgeRecord } = data;

    // Determine border color based on source (example)
    const borderColor = knowledgeRecord.source === 'dev-log' ? 'border-orange-500' :
                        knowledgeRecord.source === 'dev-conversation' ? 'border-blue-500' :
                        'border-neutral-500'; // Default border

    return (
        <div className={`;
p - 2;
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
text - ellipsis;
whitespace - nowrap;
flex;
flex - col `}>
            <div className="text-sm font-semibold text-neutral-200 overflow-hidden text-ellipsis whitespace-nowrap">
                Q: {knowledgeRecord.question}
            </div>
            <div className="text-neutral-400 text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                A: {knowledgeRecord.answer}
            </div>
            {/* Add more details like source, tags if needed */}
            {knowledgeRecord.source && <span className="text-neutral-400 text-xs mt-1">Source: {knowledgeRecord.source}</span>}
        </div>
    );
};

// Define custom node types for the graph viewer
const nodeTypes: NodeTypes = {
    default: GraphNode, // Use our custom component for the default type
};
// --- End New ---


const KnowledgeGraphViewer: React.FC<KnowledgeGraphViewerProps> = ({ userId, sourceFilter }) => { // Accept sourceFilter prop
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesState] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- New: State for selected node details --
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<KnowledgeRecord | null>(null);
  // --- End New ---


  // --- New: Layout function using Dagre ---
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


  // --- New: Convert Knowledge Data to React Flow format with Layout ---
  const knowledgeToReactFlowData = useCallback((knowledgeNodes: KnowledgeRecord[], knowledgeEdges: KnowledgeRelation[]) => {
      const reactFlowNodes: Node[] = knowledgeNodes.map((node) => {
          return {
              id: node.id, // Use KnowledgeRecord ID as React Flow node ID
              // Position will be calculated by the layout algorithm
              position: { x: 0, y: 0 }, // Placeholder position
              data: {
                  label: (
                      <div className="p-2 bg-neutral-700/70 rounded-md border border-neutral-600 text-neutral-200 text-xs w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                          <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">Q: {node.question}</div>
                          <div className="text-neutral-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">A: {node.answer}</div>
                          {/* Add more details like source, tags if needed */}
                      </div>
                  ),
                  // Store the full knowledge record in data for easy access on click
                  knowledgeRecord: node,
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

      const reactFlowEdges: Edge[] = knowledgeEdges.map(edge => {
          return {
              id: edge.id, // Use KnowledgeRelation ID as React Flow edge ID
              source: edge.source_record_id,
              target: edge.target_record_id,
              type: 'default', // Use default edge type
              label: edge.relation_type, // Show relation type as label
              style: { strokeWidth: 1, stroke: '#999' },
              // animated: true, // Optional: animate edges
          };
      });

      // Apply layout algorithm
      const layouted = getLayoutedElements(reactFlowNodes, reactFlowEdges, 'TB'); // Use 'TB' for top-to-bottom layout

      return { nodes: layouted.nodes, edges: layouted.edges };
  }, [getLayoutedElements]); // Re-generate React Flow data if layout function changes


  const fetchGraphData = useCallback(async () => {
       if (!knowledgeGraphService || !userId) {
            setError("KnowledgeGraphService module not initialized or user ID is missing.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null);
      try {
          // Fetch graph data for the current user
          const graphData = await knowledgeGraphService.getGraphData(userId); // Pass user ID
          console.log('Fetched graph data:', graphData);

          // --- New: Apply source filter ---
          const filteredNodes = sourceFilter
              ? graphData.nodes.filter((node: KnowledgeRecord) => node.source === sourceFilter)
              : graphData.nodes;

          // Filter edges to only include those connecting the filtered nodes
          const filteredNodeIds = new Set(filteredNodes.map((node: KnowledgeRecord) => node.id));
          const filteredEdges = graphData.edges.filter((edge: KnowledgeRelation) =>
              filteredNodeIds.has(edge.source_record_id) && filteredNodeIds.has(edge.target_record_id)
          );
          // --- End New ---

          // Convert filtered data to React Flow format and apply layout
          const reactFlowData = knowledgeToReactFlowData(filteredNodes, filteredEdges); // Use filtered data

          setNodes(reactFlowData.nodes);
          setEdges(reactFlowData.edges);

      } catch (err: any) {
          console.error('Error fetching graph data:', err);
          setError(`;
Failed;
to;
load;
knowledge;
graph: $;
{
    err.message;
}
`);
      } finally {
          setLoading(false);
      }
  }, [knowledgeGraphService, userId, knowledgeToReactFlowData, setNodes, setEdges, setLoading, setError, sourceFilter]); // Add sourceFilter to dependencies


  useEffect(() => {
    // Fetch graph data when the component mounts or when the user changes or sourceFilter changes
    fetchGraphData();

    // --- New: Subscribe to realtime updates for knowledge_records and knowledge_relations ---
    // Note: KnowledgeGraphService itself subscribes to these updates and publishes events.
    // We need to listen to those events here to update the graph visualization.
    let unsubscribeRecordInsert: (() => void) | undefined;
    let unsubscribeRecordUpdate: (() => void) | undefined;
    let unsubscribeRecordDelete: (() => void) | undefined;
    let unsubscribeRelationInsert: (() => void) | undefined;
    let unsubscribeRelationUpdate: (() => void) | undefined;
    let unsubscribeRelationDelete: (() => void) | undefined;

    if (knowledgeGraphService?.context?.eventBus) { // Check if service and its EventBus are available
        const eventBus = knowledgeGraphService.context.eventBus;

        // Subscribe to knowledge record events
        unsubscribeRecordInsert = eventBus.subscribe('knowledge_record_insert', (payload: KnowledgeRecord) => {
            if (payload.user_id === userId) {
                console.log('Graph Viewer received knowledge_record_insert event:', payload);
                // Refetch graph data to include the new node
                fetchGraphData();
            }
        });
         unsubscribeRecordUpdate = eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => {
             if (payload.user_id === userId) {
                 console.log('Graph Viewer received knowledge_record_update event:', payload);
                 // Refetch graph data to update the node
                 fetchGraphData();
             }
         });
          unsubscribeRecordDelete = eventBus.subscribe('knowledge_record_delete', (payload: { id: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('Graph Viewer received knowledge_record_delete event:', payload);
                 // Refetch graph data to remove the node
                 fetchGraphData();
             }
         });

        // Subscribe to knowledge relation events
        unsubscribeRelationInsert = eventBus.subscribe('knowledge_relation_insert', (payload: KnowledgeRelation) => {
             if (payload.user_id === userId) {
                 console.log('Graph Viewer received knowledge_relation_insert event:', payload);
                 // Refetch graph data to include the new edge
                 fetchGraphData();
             }
         });
         unsubscribeRelationUpdate = eventBus.subscribe('knowledge_relation_update', (payload: KnowledgeRelation) => {
             if (payload.user_id === userId) {
                 console.log('Graph Viewer received knowledge_relation_update event:', payload);
                 // Refetch graph data to update the edge
                 fetchGraphData();
             }
         });
          unsubscribeRelationDelete = eventBus.subscribe('knowledge_relation_delete', (payload: { relationId: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('Graph Viewer received knowledge_relation_delete event:', payload);
                 // Refetch graph data to remove the edge
                 fetchGraphData();
             }
         });
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeRecordInsert?.();
        unsubscribeRecordUpdate?.();
        unsubscribeRecordDelete?.();
        unsubscribeRelationInsert?.();
        unsubscribeRelationUpdate?.();
        unsubscribeRelationDelete?.();
    };

  }, [fetchGraphData, userId, knowledgeGraphService]); // Re-run effect if fetchGraphData changes or user/service changes

    // --- New: Handle Node Click to show details ---
    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        console.log('Node clicked:', node);
        // Find the full knowledge record from the node data
        const record = node.data?.knowledgeRecord;
        if (record) {
            setSelectedNodeDetails(record);
        } else {
            setSelectedNodeDetails(null);
        }
    }, []);
    // --- End New ---


  if (loading) {
    return <div className="text-neutral-400 text-center">Loading knowledge graph...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center">Error loading knowledge graph: {error}</div>;
  }

  if (nodes.length === 0) {
      return <div className="text-neutral-400 text-center">No knowledge records found to build the graph{sourceFilter ? `;
for (source; ; )
    ;
"${sourceFilter}\"` : ''}.</div>; // Added filter info;
return (
// React Flow container - needs dimensions
_jsxs("div", { className: "relative", style: { width: '100%', height: '500px', backgroundColor: '#282c34', borderRadius: '8px' }, children: [" ", _jsxs(ReactFlowProvider, { children: [" ", _jsxs(ReactFlow, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesState, onNodeClick: onNodeClick, nodeTypes: nodeTypes, 
                    // onConnect={onConnect} // Enable if you want to allow drawing edges in the viewer
                    // onNodesDelete={onNodesDelete} // Enable if you want to allow deleting nodes
                    // onEdgesDelete={onEdgesDelete} // Enable if you want to allow deleting edges
                    fitView // Automatically fit the view to the nodes
                    : true, attributionPosition: "bottom-left", 
                    // Enable interactive features for viewing
                    nodesDraggable: false, nodesConnectable: false, elementsSelectable: true, panOnDrag: true, zoomOnScroll: true, children: [_jsx(MiniMap, {}), _jsx(Controls, {}), _jsx(Background, { variant: "dots", gap: 12, size: 1 })] })] }), " ", selectedNodeDetails && (_jsxs("div", { className: "absolute top-4 right-4 bg-neutral-800/90 p-4 rounded-lg shadow-xl max-w-sm max-h-[95%] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 z-10", children: [" ", _jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h4", { className: "text-lg font-semibold text-blue-300", children: "Node Details" }), _jsx("button", { onClick: () => setSelectedNodeDetails(null), className: "text-neutral-400 hover:text-white", children: _jsx(XCircle, { size: 20 }) })] }), _jsxs("div", { className: "text-neutral-300 text-sm space-y-2", children: [_jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "ID:" }), " ", selectedNodeDetails.id] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Question:" }), " ", selectedNodeDetails.question] }), _jsxs("div", { className: "prose prose-invert max-w-none", children: [_jsx("span", { className: "font-semibold", children: "Answer:" }), " ", _jsx(ReactMarkdown, { children: selectedNodeDetails.answer })] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Created:" }), " ", new Date(selectedNodeDetails.timestamp).toLocaleString()] }), selectedNodeDetails.source && _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Source:" }), " ", selectedNodeDetails.source] }), "\\\\", selectedNodeDetails.tags && selectedNodeDetails.tags.length > 0 && _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Tags:" }), " ", selectedNodeDetails.tags.join(', ')] }), "\\\\", "\\\\"] }), "\\\\"] })), "\\\\ )}\\\\", "\\\\ \\\\"] }));
;
;
export default KnowledgeGraphViewer;
`` `;
