import type { MapNode } from "../types/types";

export function snapNodePosition(
  movingNode: MapNode,
  allNodes: MapNode[],
  threshold = 150
): { x: number; y: number } {
  let snappedX = movingNode.x;
  let snappedY = movingNode.y;

  let minXDiff = Infinity;
  let minYDiff = Infinity;

  for (const n of allNodes) {
    const xDiff = Math.abs(n.x - movingNode.x);
    const yDiff = Math.abs(n.y - movingNode.y);

    if (xDiff < minXDiff && xDiff <= threshold) {
      minXDiff = xDiff;
      snappedX = n.x;
    }
    if (yDiff < minYDiff && yDiff <= threshold) {
      minYDiff = yDiff;
      snappedY = n.y;
    }
  }

  return { x: snappedX, y: snappedY };
}
