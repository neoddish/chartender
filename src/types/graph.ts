import { analyzer } from '@antv/data-wizard';
import type { Advice } from '@antv/chart-advisor';

export type FieldInfo = analyzer.FieldInfo;

export type JsonDatum = Record<string, any>;

export type JsonData = JsonDatum[];

export type DataType = analyzer.TypeSpecifics | 'mixed' | 'geo';

/* Nodes */

interface X6Node {
  id: string;
  x: number;
  y: number;
}

export interface FieldNodeData {
  nodeType: 'field-node';
  fieldType: 'dimension' | 'measure';
  dataType: DataType;
  status: string;
  fieldName: string;
}

export interface FieldNode extends X6Node {
  shape: 'field-node';
  data: FieldNodeData;
  ports: { id: string; group: 'right' }[];
}

export interface DataPropNodeData {
  fieldName: string;
  nodeType: 'dataprop-node';
  dataprop: FieldInfo;
}

export interface DataPropNode extends X6Node {
  shape: 'dataprop-node';
  data: DataPropNodeData;
  ports: { id: string; group: 'left' | 'right' }[];
}

export interface ChartThumbNodeData {
  nodeType: 'chartthumb-node';
  chartAdvice: Advice;
  rank: number;
}

export interface ChartThumbNode extends X6Node {
  shape: 'chartthumb-node';
  data: ChartThumbNodeData;
  ports: { id: string; group: 'left' | 'right' }[];
}

export interface ResultNodeData {
  nodeType: 'result-node';
  chartAdvice: Advice;
}

export interface ResultNode extends X6Node {
  shape: 'result-node';
  data: ResultNodeData;
  ports: { id: string; group: 'left' }[];
}

export type Node = FieldNode | DataPropNode | ChartThumbNode | ResultNode;

/* Edges */

export interface Edge {
  id: string;
  shape: 'field-dataprop-edge' | 'dataprop-chartthumb-edge' | 'chartthumb-result-edge';
  source: { cell: string; port: string };
  target: { cell: string; port: string };
  zIndex: number;
  labels?: any[];
}
