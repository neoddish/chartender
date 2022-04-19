import { DataFrame } from '@antv/data-wizard';
import { ChartAdvisor } from '@antv/chart-advisor';

import { UI_GRAPH, UI_AXES, UI_NODES, CELL_NAMES } from '../constants';

import type { Advice } from '@antv/chart-advisor';
import type { Edge as OriEdge, Node as OriNode } from '@antv/x6';
import type { ChartEncoding } from '@antv/antv-spec';

import type { ChartLayer } from '@antv/antv-spec/lib/src/schema/layer';
import type {
  FieldNode,
  FieldNodeData,
  DataPropNode,
  DataPropNodeData,
  ChartThumbNode,
  ChartThumbNodeData,
  ResultNode,
  ResultNodeData,
  JsonData,
  JsonDatum,
  FieldInfo,
  Node,
  Edge,
} from '../types';

/**
 * Generate Graph Data of Field Nodes.
 *
 * @param dataProps
 * @returns
 */
function genFieldNodes(dataProps: FieldInfo[]): FieldNode[] {
  const fieldNodes: FieldNode[] = [];

  for (let i = 0; i < dataProps.length; i += 1) {
    const fieldInfo = dataProps[i];

    const id = `field-node-${i}`;

    const data: FieldNodeData = {
      nodeType: 'field-node',
      fieldName: fieldInfo.name || id,
      dataType: fieldInfo.recommendation,
      fieldType: ['integer', 'float'].includes(fieldInfo.recommendation) ? 'measure' : 'dimension',
      status: 'success',
    };

    const result: FieldNode = {
      id,
      shape: 'field-node',
      x: 0,
      y: 0,
      data,
      ports: [
        {
          id: `${id}:right:1`,
          group: 'right',
        },
      ],
    };

    fieldNodes.push(result);
  }

  return fieldNodes;
}

/**
 * Generate DataProp Nodes.
 *
 * @param dataProps
 * @returns
 */
function genDataPropNodes(dataProps: FieldInfo[]): DataPropNode[] {
  const dataPropNodes: DataPropNode[] = [];

  for (let i = 0; i < dataProps.length; i += 1) {
    const fieldInfo = dataProps[i];

    const id = `dataprop-node-${i}`;

    const data: DataPropNodeData = {
      nodeType: 'dataprop-node',
      fieldName: fieldInfo.name || id,
      dataprop: fieldInfo,
    };

    const result: DataPropNode = {
      id,
      shape: 'dataprop-node',
      x: 0,
      y: 0,
      data,
      ports: [
        {
          id: `${id}:left:1`,
          group: 'left',
        },
        {
          id: `${id}:right:1`,
          group: 'right',
        },
      ],
    };

    dataPropNodes.push(result);
  }

  return dataPropNodes;
}

/**
 * Generate ChartThumb Nodes.
 *
 * @param advices
 * @returns
 */
function genChartThumbNodes(advices: Advice[]): ChartThumbNode[] {
  const chartThumbNodes: ChartThumbNode[] = [];

  for (let i = 0; i < advices.length; i += 1) {
    const advice = advices[i];

    const id = `chartthumb-node-${i}`;

    const data: ChartThumbNodeData = {
      nodeType: 'chartthumb-node',
      chartAdvice: advice,
      rank: i,
    };

    const result: ChartThumbNode = {
      id,
      shape: 'chartthumb-node',
      x: 0,
      y: 0,
      data,
      ports: [
        {
          id: `${id}:left:1`,
          group: 'left',
        },
        {
          id: `${id}:right:1`,
          group: 'right',
        },
      ],
    };

    chartThumbNodes.push(result);
  }

  return chartThumbNodes;
}

interface LayoutAxisOptions {
  /** axis height */
  H: number;
  /** node height */
  h: number;
  /** gap between nodes */
  g: number;
  /** axis x position */
  x: number;
}

/**
 * Layout nodes evenly by options.
 *
 * @param nodes
 * @param options
 * @returns
 */
function layoutAxisNodes(nodes: Node[], options: LayoutAxisOptions) {
  const { H, h, g, x } = options;

  const laidoutNodes: Node[] = [];

  const n = nodes.length;
  if (n < 1) return laidoutNodes;

  const startY = (H - n * h - (n - 1) * g) * 0.5;
  const step = h + g;

  for (let i = 0; i < n; i += 1) {
    laidoutNodes.push({ ...nodes[i], x, y: startY + i * step });
  }

  return laidoutNodes;
}

/**
 * Layout Field Nodes.
 *
 * @param fieldNodes
 * @returns
 */
function layoutFieldNodes(fieldNodes: FieldNode[]): FieldNode[] {
  const { HEIGHT: H } = UI_GRAPH;
  const { Y_GAP: g, X: x } = UI_AXES.FIELD_NODE_AXIS;
  const { HEIGHT: h } = UI_NODES.FIELD_NODE;

  return layoutAxisNodes(fieldNodes, { H, h, g, x }) as FieldNode[];
}

/**
 * Layout Field Nodes.
 *
 * @param dataPropNodes
 * @returns
 */
function layoutDataPropNodes(dataPropNodes: DataPropNode[]): DataPropNode[] {
  const { HEIGHT: H } = UI_GRAPH;
  const { Y_GAP: g, X: x } = UI_AXES.DATAPROP_NODE_AXIS;
  const { HEIGHT: h } = UI_NODES.DATAPROP_NODE;

  return layoutAxisNodes(dataPropNodes, { H, h, g, x }) as DataPropNode[];
}

function layoutChartThumbNodes(chartThumbNodes: ChartThumbNode[]): ChartThumbNode[] {
  const { HEIGHT: H } = UI_GRAPH;
  const { Y_GAP: g, X: x } = UI_AXES.CHARTTHUMB_NODE_AXIS;
  const { HEIGHT: h } = UI_NODES.CHARTTHUMB_NODE;

  return layoutAxisNodes(chartThumbNodes, { H, h, g, x }) as ChartThumbNode[];
}

interface genEdgeOptions {
  fieldNodes: FieldNode[];
  datapropNodes: DataPropNode[];
  chartThumbNodes: ChartThumbNode[];
}

/**
 * Generate all Edges.
 *
 * @param options
 * @returns
 */
function genEdge(options: genEdgeOptions): Edge[] {
  const { fieldNodes, datapropNodes, chartThumbNodes } = options;

  // field-dataprop-edge
  const fde: Edge[] = [];
  for (let i = 0; i < fieldNodes.length; i += 1) {
    const s = fieldNodes[i];
    if (datapropNodes.length > i) {
      const t = datapropNodes[i];

      if (s.data.fieldName === t.data.fieldName) {
        const newEdge: Edge = {
          id: `${CELL_NAMES.fieldDatapropEdge}-${i}`,
          shape: 'field-dataprop-edge',
          source: {
            cell: s.id,
            port: s.ports.find((p) => p.group === 'right')!.id,
          },
          target: {
            cell: t.id,
            port: t.ports.find((p) => p.group === 'left')!.id,
          },
          zIndex: 0,
        };
        fde.push(newEdge);
      }
    }
  }

  // dataprop-chartthumb-edge
  const dce: Edge[] = [];
  for (let i = 0; i < chartThumbNodes.length; i += 1) {
    const chartThumbNode = chartThumbNodes[i];

    const encodings: { channel: string; fieldName: string }[] = [];
    (chartThumbNode.data.chartAdvice.spec?.layer as ChartLayer[]).forEach((layer) => {
      if (layer.encoding) {
        const channels = Object.keys(layer.encoding);
        channels.forEach((channel) => {
          encodings.push({
            channel,
            fieldName: layer.encoding[channel as keyof ChartEncoding]!.field!,
          });
        });
      }
    });

    datapropNodes.forEach((dpn, j) => {
      const encoding = encodings.find((enc) => enc.fieldName === dpn.data.fieldName);
      if (encoding) {
        const { channel } = encoding;

        const newEdge: Edge = {
          id: `${CELL_NAMES.datapropChartThumbEdge}-${i}-${j}`,
          shape: 'dataprop-chartthumb-edge',
          source: {
            cell: dpn.id,
            port: dpn.ports.find((p) => p.group === 'right')!.id,
          },
          target: {
            cell: chartThumbNode.id,
            port: chartThumbNode.ports.find((p) => p.group === 'left')!.id,
          },
          zIndex: 0,
          labels: [
            {
              data: {
                channel,
                active: false,
              },
            },
          ],
        };
        dce.push(newEdge);
      }
    });
  }

  const edges = [...fde, ...dce];

  return edges;
}

/**
 * Generate basic graph data exclude result node.
 *
 * @param json
 * @param ignoreFields
 * @returns
 */
export function jsonToGraphData(json: JsonData, ignoreFields?: string[]) {
  // filter ignore fields in json
  const data = json.map((datum) => {
    const validKeys = Object.keys(datum).filter((key) => !ignoreFields?.includes(key));

    const result: JsonDatum = {};
    validKeys.forEach((key) => {
      result[key] = datum[key];
    });
    return result;
  });

  const df = new DataFrame(data);
  const dataProps: FieldInfo[] = df.info();

  const ca = new ChartAdvisor();
  const adviseResults = ca.advise({ data, dataProps });

  const fieldNodesGraphData = layoutFieldNodes(genFieldNodes(dataProps));

  const dataPropNodesGraphData = layoutDataPropNodes(genDataPropNodes(dataProps));

  const chartThumbNodesGraphData = layoutChartThumbNodes(genChartThumbNodes(adviseResults));

  const edges = genEdge({
    fieldNodes: fieldNodesGraphData,
    datapropNodes: dataPropNodesGraphData,
    chartThumbNodes: chartThumbNodesGraphData,
  });

  return [...fieldNodesGraphData, ...dataPropNodesGraphData, ...chartThumbNodesGraphData, ...edges];
}

/**
 * Generate the Result Node.
 *
 * @param advice
 * @returns
 */
export function genResultNode(advice: Advice): ResultNode {
  const id = 'result-node';

  const data: ResultNodeData = {
    nodeType: 'result-node',
    chartAdvice: advice,
  };

  const resultNode: ResultNode = {
    id,
    shape: 'result-node',
    x: UI_AXES.RESULT_NODE_AXIS.X,
    y: (UI_GRAPH.HEIGHT - UI_NODES.RESULT_NODE.HEIGHT) * 0.5,
    data,
    ports: [
      {
        id: `${id}:left:1`,
        group: 'left',
      },
    ],
  };

  return resultNode;
}

/**
 * Generate an edge from active ctn to rn.
 *
 * @todo generalize it to genEdgeBetween.
 * @param activeChartThumbNode
 * @param resultNode
 * @returns
 */
export function genChartThumbResultEdge(activeChartThumbNode: OriNode, resultNode: OriNode): Edge {
  const sNode = activeChartThumbNode;
  const tNode = resultNode;

  const newEdge: Edge = {
    id: `${CELL_NAMES.chartThumbResultEdge}`,
    shape: 'chartthumb-result-edge',
    source: {
      cell: sNode.id,
      port: sNode.ports.items.find((p) => p.group === 'right')!.id!,
    },
    target: {
      cell: tNode.id,
      port: tNode.ports.items.find((p) => p.group === 'left')!.id!,
    },
    zIndex: 0,
  };

  return newEdge;
}

/**
 * Switch edge status (active).
 *
 * @param edge
 * @param active
 * @param index
 */
export function switchEdgeActive(edge: OriEdge, active: boolean, index = 0) {
  const labelInfo = edge.getLabelAt(index);

  const newLabelInfo = JSON.parse(JSON.stringify(labelInfo));
  newLabelInfo.data.active = active;

  edge.setLabelAt(0, newLabelInfo);

  if (active) {
    edge.setAttrByPath('line/stroke', '#7262fd');
    edge.setZIndex(1);
  } else {
    edge.setAttrByPath('line/stroke', '#C2C8D540');
    edge.setZIndex(0);
  }
}
