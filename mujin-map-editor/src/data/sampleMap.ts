import type { MapNode } from "../types/types";

export const sampleMap: MapNode[] = [
  {
    x: 1000,
    y: 1000,
    code: 10001000,
    directions: ["North"],
  },
  {
    x: 1000,
    y: 2000,
    code: 10002000,
    directions: ["North"],
  },
  {
    x: 2000,
    y: 2000,
    code: 20002000,
    directions: ["East"],
    name: "CHARGING STATION",
    charger: { direction: "East" },
  },
  {
    x: 2000,
    y: 3000,
    code: 20003000,
    directions: ["South"],
    name: "CHUTE AREA",
    chute: { direction: "South" },
  },
];
