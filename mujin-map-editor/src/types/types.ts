
export type Direction = "North" | "South" | "East" | "West";


export interface MapNode {
  id?: number;
  x: number;
  y: number;
  code: number;
  directions?: Direction[];
  name?: string;
  charger?: { direction: Direction };
  chute?: { direction: Direction };
}
