import { useState } from "react";
import { useEffect } from "react";
import MapCanvas from "./components/MapCanvas";
import type { MapNode } from "./types/types";
import NodeDetailsPanel from "./components/NodeDetailsPanel";
import HeaderControls from "./components/HeaderControls";

function App() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [savedNodes, setSavedNodes] = useState<MapNode[]>([]);
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/NodeList/")
    .then((res) => res.json())
    .then((data) => {
      setSavedNodes(data);
      setNodes(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching nodes:", error);
      setLoading(false);
    });
}, []);

  if (loading) {
    return <div className="p-4">Loading nodes...</div>;
  }
  return (
    <div className="flex h-screen">
      {/* Left side: Map */}
      <div className="flex-1 p-4 bg-gray-50">
        <HeaderControls
          nodes={nodes}
          savedNodes={savedNodes}      
          setNodes={setNodes}
          setSelectedNode={setSelectedNode}
          zoom={zoom}
          setZoom={setZoom}
          setOffset={setOffset}
        />

        <MapCanvas nodes={nodes} onSelectNode={(node) => setSelectedNode({ ...node })}
          onMoveNode={(code, newX, newY) => {
            setNodes((prev) =>
              prev.map((n) =>
                n.code === code ? { ...n, x: newX, y: newY } : n
              )
            );
          }}
          zoom={zoom}
          offset={offset} />
      </div>

      {/* Right side: Sidebar */}
      {selectedNode ? (
        <NodeDetailsPanel
          node={selectedNode}
          setNode={setSelectedNode}

          onSave={() => {
            // Determine if this is a new node or existing
            const isNew = !selectedNode.id;

            const url = isNew
              ? "http://127.0.0.1:8000/api/NodeList/"
              : `http://127.0.0.1:8000/api/NodeUpdate/${selectedNode.id}/`;

            const method = isNew ? "POST" : "PUT";
            console.log("Saving node:", selectedNode);
            console.log("Request method:", method);
            console.log("Request URL:", url);
            fetch(url, {
              method: method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(selectedNode),
            })
              .then(async (res) => {
                if (!res.ok) {
                  const text = await res.text();
                  console.error("Error response:", text);
                  throw new Error("Failed to save node");
                }
                return res.json();
              })
              .then(() => {
                // Re-fetch the updated list
                return fetch("http://127.0.0.1:8000/api/NodeList/").then((r) => r.json());
              })
              .then((data) => {
                setNodes(data);
                setSelectedNode(null);
              })
              .catch((err) => {
                console.error(err);
                alert("Error saving node.");
              });
          }}

          onDelete={() => {
  if (!selectedNode) return;

  fetch(`http://127.0.0.1:8000/api/NodeDelete/${selectedNode.code}/`, {
    method: "DELETE",
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        console.error("Error response:", text);
        throw new Error("Failed to delete node");
      }
      return res.json();
    })
    .then(() => {
      // Re-fetch updated list
      return fetch("http://127.0.0.1:8000/api/NodeList/").then((r) => r.json());
    })
    .then((data) => {
      setNodes(data);
      setSavedNodes(data);
      setSelectedNode(null);
    })
    .catch((err) => {
      console.error(err);
      alert("Error deleting node.");
    });
}}

        />
      ) : (
        <div className="w-80 p-4 border-l border-gray-300 bg-gray-50">
          <p className="text-gray-500">Click a node to see details</p>
        </div>
      )}
    </div>
  );
}

export default App;
