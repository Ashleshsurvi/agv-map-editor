import React from "react";
import type { MapNode } from "../types/types";
interface HeaderControlsProps {
    nodes: MapNode[];
    savedNodes: MapNode[];
    setNodes: React.Dispatch<React.SetStateAction<MapNode[]>>;
    setSelectedNode: React.Dispatch<React.SetStateAction<MapNode | null>>;
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

function generateUniqueCode(nodes: MapNode[], savedNodes: MapNode[]): number {
    const allNodes = [...nodes, ...savedNodes];
    const maxCode = allNodes.reduce((max, node) => Math.max(max, node.code), 0);
    return maxCode + 1;
}


const HeaderControls: React.FC<HeaderControlsProps> = ({
    nodes,
    setNodes,
    setSelectedNode,
    savedNodes,
    zoom,
    setZoom,
    setOffset,
}) => {
    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mujin AGV Map Editor</h1>
                <button
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 shadow"
                    onClick={() => {
                        const newNode: MapNode = {
                            x: 500,
                            y: 500,
                            code: generateUniqueCode(nodes, savedNodes),
                            directions: [],
                        };
                        setNodes((prev) => [...prev, newNode]);
                        setSelectedNode(newNode);
                    }}
                >
                    + Add Node
                </button>
            </div>

            <div className="flex gap-4 items-center">
                {/* Zoom Controls */}
                <div className="flex gap-2">
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 shadow-sm"
                        onClick={() => setZoom((z) => z * 1.2)}
                    >
                        Zoom In
                    </button>
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 shadow-sm"
                        onClick={() => setZoom((z) => z / 1.2)}
                    >
                        Zoom Out
                    </button>
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 shadow-sm"
                        onClick={() => {
                            setZoom(1);
                            setOffset({ x: 0, y: 0 });
                        }}
                    >
                        Reset
                    </button>
                </div>

                {/* Pan Controls */}
                <div className="grid grid-cols-3 gap-1 w-24">
                    <div></div>
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-lg hover:bg-gray-300 shadow-sm"
                        onClick={() => setOffset((o) => ({ ...o, y: o.y - 200 / zoom }))}
                    >
                        ↑
                    </button>
                    <div></div>
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-lg hover:bg-gray-300 shadow-sm"
                        onClick={() => setOffset((o) => ({ ...o, x: o.x - 200 / zoom }))}
                    >
                        ←
                    </button>
                    <div></div>
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-lg hover:bg-gray-300 shadow-sm"
                        onClick={() => setOffset((o) => ({ ...o, x: o.x + 200 / zoom }))}
                    >
                        →
                    </button>
                    <div></div>
                    <button
                        className="px-2 py-1 rounded bg-gray-200 text-lg hover:bg-gray-300 shadow-sm"
                        onClick={() => setOffset((o) => ({ ...o, y: o.y + 200 / zoom }))}
                    >
                        ↓
                    </button>

                    <div></div>


                </div>
                <div className="flex gap-2">
                    {/* Export Button */}
                    <button
                        className="px-2 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 shadow"
                        onClick={() => {
                            const dataStr = JSON.stringify(nodes, null, 2);
                            const blob = new Blob([dataStr], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "nodes.json";
                            link.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        Export JSON
                    </button>

                    {/* Import Button */}
                    <label className="px-2 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 shadow cursor-pointer">
                        Import JSON
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();

                                reader.onload = (event) => {
                                    try {
                                        const text = event.target?.result as string;
                                        console.log("Raw file content:", text);
                                        const json = JSON.parse(text);
                                        console.log("Parsed JSON:", json);

                                        let importedNodes: any[] = [];

                                        if (json.map && Array.isArray(json.map.nodes)) {
                                            importedNodes = json.map.nodes;
                                        } else if (Array.isArray(json)) {
                                            importedNodes = json;
                                        } else {
                                            alert("Invalid JSON format.");
                                            return;
                                        }

                                        console.log("Imported nodes:", importedNodes);

                                        const fixedNodes = importedNodes.map((node) => ({
                                            // no id
                                            x: node.x,
                                            y: node.y,
                                            code: node.code,
                                            directions: node.directions ?? [],
                                            name: node.name ?? "",
                                            charger:
                                                typeof node.charger === "object"
                                                    ? node.charger
                                                    : node.charger === true
                                                        ? { direction: "Unknown" }
                                                        : undefined,
                                            chute:
                                                typeof node.chute === "object"
                                                    ? node.chute
                                                    : node.chute === true
                                                        ? { direction: "Unknown" }
                                                        : undefined,
                                        }));


                                        console.log("Fixed nodes:", fixedNodes);

                                        // setNodes(fixedNodes);
                                        const replaceBackendNodes = async (newNodes: MapNode[]) => {
                                            try {
                                                // Delete everything in the backend first
                                                await fetch("http://127.0.0.1:8000/api/NodeClear/", { method: "DELETE" });
                                                console.log("Cleared backend nodes.");

                                                // Bulk insert new nodes
                                                const res = await fetch("http://127.0.0.1:8000/api/NodeBulkImport/", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify(newNodes),
                                                });

                                                if (!res.ok) {
                                                    throw new Error(`Failed to save nodes: ${res.status}`);
                                                }

                                                console.log("Imported nodes saved to backend.");
                                                alert("Imported nodes saved successfully!");
                                            } catch (err) {
                                                console.error("Error saving imported nodes:", err);
                                                alert("Error saving imported nodes to backend.");
                                            }
                                        };

                                        setNodes(fixedNodes);
                                        setSelectedNode(null);
                                        // First save them in backend
                                        replaceBackendNodes(fixedNodes).then(() => {
                                            // Then re-fetch from backend so you get IDs
                                            fetch("http://127.0.0.1:8000/api/NodeList/")
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    setNodes(data);
                                                    setSelectedNode(null);
                                                    alert("Imported successfully!");
                                                })
                                                .catch((err) => {
                                                    console.error("Error reloading nodes after import:", err);
                                                    alert("Error loading nodes after import.");
                                                });
                                        });

                                    } catch (err) {
                                        console.error("Error parsing file:", err);
                                        alert("Error reading file.");
                                    }
                                };
                                reader.readAsText(file);
                            }}


                        />
                    </label>
                    <button
                        className="px-2 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 shadow"
                        onClick={() => {
                            if (confirm("Are you sure you want to clear all nodes? This cannot be undone.")) {
                                // Clear frontend
                                setNodes([]);
                                setSelectedNode(null);

                                // Clear backend
                                fetch("http://127.0.0.1:8000/api/NodeClear/", { method: "DELETE" })
                                    .then((res) => {
                                        if (!res.ok) {
                                            throw new Error(`Server error: ${res.status}`);
                                        }
                                        console.log("Backend nodes cleared.");
                                    })
                                    .catch((err) => {
                                        console.error("Error clearing backend nodes:", err);
                                        alert("Error clearing nodes in backend.");
                                    });
                            }
                        }}

                    >
                        Clear Map
                    </button>

                </div>
            </div>
        </div>
    );
};

export default HeaderControls;
