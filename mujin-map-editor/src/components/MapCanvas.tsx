import React from "react";
import type { MapNode } from "../types/types";

interface MapCanvasProps {
    nodes: MapNode[];
    onSelectNode: (node: MapNode) => void;
    zoom: number;
    offset: { x: number; y: number };
    onMoveNode: (code: number, newX: number, newY: number) => void;


}

const MapCanvas: React.FC<MapCanvasProps> = ({ nodes, onSelectNode, zoom, offset, onMoveNode }) => {
    const [draggingCode, setDraggingCode] = React.useState<number | null>(null);

    function handleMouseMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        if (draggingCode === null) return;

        const svg = e.currentTarget;
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const transformed = point.matrixTransform(ctm.inverse());

        onMoveNode(draggingCode, transformed.x, transformed.y);
    }

    function handleMouseUp() {
        setDraggingCode(null);
    }

    return (
        <svg
            
            className="w-full h-[500px] border border-gray-300 bg-white"
            viewBox={`
                0 0
                ${4000 / zoom}
                ${4000 / zoom}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
{nodes.flatMap((node) =>
  nodes
    .filter((target) => {
      const isSameX = node.x === target.x;
      const isSameY = node.y === target.y;
      const distance = isSameX
        ? Math.abs(node.y - target.y)
        : isSameY
        ? Math.abs(node.x - target.x)
        : Infinity;
      return (isSameX || isSameY) && distance > 0 && distance <= 1500;
    })
    .map((target) => (
      <line
        key={`${node.code}-${target.code}`}
        x1={node.x}
        y1={node.y}
        x2={target.x}
        y2={target.y}
        stroke="#888"
        strokeWidth={4}
      />
    ))
)}


            {nodes.map((node, index) => (
                <g
                    key={index}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => onSelectNode(node)}
                >
                    <circle
                        cx={node.x}
                        cy={node.y}
                        r={50}
                        fill={
                            node.charger && node.chute
                                ? "purple"
                                : node.charger
                                    ? "green"
                                    : node.chute
                                        ? "orange"
                                        : "blue"
                        }
                        stroke="black"
                        strokeWidth={3}
                        onMouseDown={() => setDraggingCode(node.code)}

                    />
                    <text
                        x={node.x}
                        y={node.y + 150}
                        textAnchor="middle"
                        style={{ fontSize: "50px", fill: "#1f2937", fontWeight: "500" }}
                    >
                        {node.name ?? node.code}
                    </text>
                </g>


            ))}
        </svg>
    );
};

export default MapCanvas;
