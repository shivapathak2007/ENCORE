import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Loader, Sparkles } from 'lucide-react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Layout helper for mindmap
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  // A simple radial/tree layout is ideal, but for simplicity here we'll 
  // space them out. If we had dagre we could use it, but let's do a basic layout.
  
  // Very naive layout: Root at top, children spread out below.
  let y = 50;
  const layoutedNodes = nodes.map((node, index) => {
    // If it's node id 1 (root), put it at top center
    if (node.id === '1') {
      return { ...node, position: { x: 400, y: y } };
    }
    // Spread others below
    return { ...node, position: { x: (index % 5) * 200, y: y + 150 + Math.floor(index / 5) * 100 } };
  });

  return { nodes: layoutedNodes, edges };
};

export const MindMapView = ({ documentId }) => {
  const [mindMaps, setMindMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchMindMaps();
  }, [documentId]);

  const fetchMindMaps = async () => {
    try {
      const res = await api.getMindMaps(documentId);
      if (res.data.success) {
        const maps = res.data.data.mindMaps;
        setMindMaps(maps);
        if (maps.length > 0) {
          loadGraph(maps[0]);
        }
      }
    } catch (err) {
      setError('Failed to load mind maps');
    } finally {
      setLoading(false);
    }
  };

  const generateMindMap = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.generateMindMap(documentId);
      if (res.data.success) {
        const newMap = res.data.data.mindMap;
        setMindMaps([newMap, ...mindMaps]);
        loadGraph(newMap);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate mind map');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadGraph = (mapData) => {
    try {
      let rawNodes = mapData.nodes_json || [];
      let rawEdges = mapData.edges_json || [];

      // Format for React Flow
      const rfNodes = rawNodes.map((n) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: 0, y: 0 }, // Will be set by layout
        style: {
          background: n.id === '1' ? 'var(--color-primary)' : '#fff',
          color: n.id === '1' ? '#fff' : 'var(--color-primary-text)',
          border: '2px solid var(--color-primary)',
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
      }));

      const rfEdges = rawEdges.map((e, idx) => ({
        id: `e${idx}`,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        style: { stroke: 'var(--color-primary)', strokeWidth: 2 }
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rfNodes, rfEdges);
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (e) {
      console.error("Failed to parse map graph", e);
    }
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  if (loading) return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10 relative">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">Knowledge Map</h2>
          <p className="text-[var(--color-secondary-text)] mt-1 text-sm">Visual relationships extracted from your document.</p>
        </div>
        <button 
          onClick={generateMindMap}
          disabled={isGenerating}
          className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center"
        >
          {isGenerating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Generate Map
        </button>
      </div>

      {error && <div className="m-6 p-4 bg-red-50 text-red-700 rounded-xl z-20 absolute top-20">{error}</div>}

      <div className="flex-1 w-full h-full relative">
        {mindMaps.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center py-20 px-10 bg-white rounded-3xl border border-gray-100 border-dashed max-w-md shadow-sm">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No mind map generated</h3>
              <p className="text-gray-500 mt-1">Click "Generate Map" to visualize the concepts in this document.</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap 
              nodeColor={(n) => {
                if (n.id === '1') return '#4f46e5';
                return '#c7d2fe';
              }} 
            />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
