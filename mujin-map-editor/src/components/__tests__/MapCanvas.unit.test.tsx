import React from "react";
import { render, screen } from "@testing-library/react";
import MapCanvas from "../MapCanvas";
import { type MapNode } from "../../types/types";

test("renders MapCanvas with nodes", () => {
  const nodes: MapNode[] = [
    { x: 100, y: 100, code: 1, directions: [], name: "Node A" },
    { x: 200, y: 200, code: 2, directions: [], name: "Node B" },
  ];

  const { container } = render(
    <MapCanvas
      nodes={nodes}
      onSelectNode={() => {}}
      onMoveNode={() => {}}
      zoom={1}
      offset={{ x: 0, y: 0 }}
    />
  );

  // Assert both labels exist
  expect(screen.getByText("Node A")).toBeInTheDocument();
  expect(screen.getByText("Node B")).toBeInTheDocument();

  // Optionally: count circles via querySelectorAll
  const circles = container.querySelectorAll("circle");
  expect(circles.length).toBe(2);
});
