import React from "react";
import type { MapNode } from "../types/types";

interface NodeDetailsPanelProps {
    node: MapNode;
    setNode: (node: MapNode) => void;
    onSave: () => void;
    onDelete: () => void;
}

const directionsList = ["North", "South", "East", "West"];

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
    node,
    setNode,
    onSave,
    onDelete
}) => {
    return (
        <div className="w-80 p-4 border-l border-gray-300 bg-white shadow-inner rounded">
            <h2 className="text-lg font-semibold mb-2">Node Details</h2>

            <div className="mb-2">
                <label className="block text-sm font-medium">Code</label>
                <div className="text-gray-700">{node.code}</div>
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">X</label>
                <div className="text-gray-700">{node.x}</div>
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">Y</label>
                <div className="text-gray-700">{node.y}</div>
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    className="border p-1 w-full"
                    value={node.name ?? ""}
                    onChange={(e) => setNode({ ...node, name: e.target.value })}
                />
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">Directions</label>
                <div className="flex gap-2 flex-wrap">
                    {directionsList.map((dir) => (
                        <label key={dir} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={node.directions?.includes(dir as any) ?? false}
                                onChange={(e) => {
                                    const newDirections = new Set(node.directions ?? []);
                                    if (e.target.checked) {
                                        newDirections.add(dir as any);
                                    } else {
                                        newDirections.delete(dir as any);
                                    }
                                    setNode({
                                        ...node,
                                        directions: Array.from(newDirections),
                                    });
                                }}
                            />
                            {dir}
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">Charger</label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={!!node.charger}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setNode({
                                    ...node,
                                    charger: { direction: "North" },
                                });
                            } else {
                                const newNode = { ...node };
                                delete newNode.charger;
                                setNode(newNode);
                            }
                        }}
                    />
                    Has Charger
                </label>
                {node.charger && (
                    <select
                        className="border p-1 mt-1"
                        value={node.charger.direction}
                        onChange={(e) =>
                            setNode({
                                ...node,
                                charger: { direction: e.target.value as any },
                            })
                        }
                    >
                        {["North", "South", "East", "West"].map((dir) => (
                            <option key={dir} value={dir}>
                                {dir}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">Chute</label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={!!node.chute}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setNode({
                                    ...node,
                                    chute: { direction: "North" },
                                });
                            } else {
                                const newNode = { ...node };
                                delete newNode.chute;
                                setNode(newNode);
                            }
                        }}
                    />
                    Has Chute
                </label>
                {node.chute && (
                    <select
                        className="border p-1 mt-1"
                        value={node.chute.direction}
                        onChange={(e) =>
                            setNode({
                                ...node,
                                chute: { direction: e.target.value as any },
                            })
                        }
                    >
                        {["North", "South", "East", "West"].map((dir) => (
                            <option key={dir} value={dir}>
                                {dir}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <button
                className="mt-4 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 shadow"
                onClick={onSave}
            >
                Save Changes
            </button>
            <button
                className="mt-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 shadow"
                onClick={onDelete}
            >
                Delete Node
            </button>

        </div>
    );
};

export default NodeDetailsPanel;
