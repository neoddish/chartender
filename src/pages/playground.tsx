import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Graph, Cell } from '@antv/x6';
import '@antv/x6-react-shape';

import { EncodingLabel } from '../components';
import { CELL_NAMES, UI_GRAPH } from '../constants';
import {
  registerPipeConnector,
  registerFieldDatapropEdge,
  registerFieldNode,
  registerResultNode,
  registerDatapropNode,
  registerChartThumbNode,
  registerDatapropChartThumbEdge,
  registerChartThumbResultEdge,
  jsonToGraphData,
  genResultNode,
} from '../graph';

import type { FieldNodeData } from '../types';
import type { Advice } from '@antv/chart-advisor';

import './index.less';

registerFieldNode();
registerDatapropNode();
registerChartThumbNode();
registerResultNode();
registerFieldDatapropEdge();
registerDatapropChartThumbEdge();
registerChartThumbResultEdge();
registerPipeConnector();

export const Playground: React.FC = () => {
  const [pipeGraph, setPipeGraph] = useState<Graph>();

  useEffect(() => {
    const graph: Graph = new Graph({
      container: document.getElementById('container')!,
      width: UI_GRAPH.WIDTH,
      height: UI_GRAPH.HEIGHT,
      background: {
        color: '#f2f5f7',
      },
      panning: false,
      mousewheel: {
        enabled: true,
        modifiers: 'ctrl',
        factor: 1.1,
        maxScale: 1.5,
        minScale: 0.5,
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: CELL_NAMES.pipeConnector,
        connectionPoint: 'anchor',
        anchor: 'center',
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'top';
        },
        createEdge() {
          return graph.createEdge({
            shape: CELL_NAMES.fieldDatapropEdge,
            attrs: {
              line: {
                strokeDasharray: '5 5',
              },
            },
            zIndex: -1,
          });
        },
      },
      selecting: {
        enabled: true,
        filter(node) {
          return node.shape === 'chartthumb-node';
        },
      },
      interacting: {
        nodeMovable: false,
        edgeMovable: false,
      },
      onEdgeLabelRendered: (args) => {
        const { selectors, edge } = args;
        const content = selectors.foContent as HTMLDivElement;
        if (content) {
          const channel = edge?.id === 'dce-1' ? 'Arc' : 'Col';
          ReactDOM.render(<EncodingLabel channel={channel} />, content);
        }
      },
    });

    graph.on('edge:connected', ({ edge }) => {
      edge.attr({
        line: {
          strokeDasharray: '',
        },
      });
    });

    graph.on('node:change:data', ({ node }) => {
      const edges = graph.getIncomingEdges(node);
      const { fieldType } = node.getData() as FieldNodeData;
      edges?.forEach((edge) => {
        if (fieldType === 'dimension') {
          edge.attr('line/strokeDasharray', 5);
          edge.attr('line/style/animation', 'running-line 30s infinite linear');
        } else {
          edge.attr('line/strokeDasharray', '');
          edge.attr('line/style/animation', '');
        }
      });
    });

    graph.on('node:selected', ({ node }) => {
      const { chartAdvice } = node.getData();
      const resultNode = graph.getCellById(CELL_NAMES.resultNode);
      resultNode.replaceData({ ...resultNode.getData(), chartAdvice });
    });

    // 初始化节点/边
    const init = (data: Cell.Metadata[]) => {
      let resultAdvice: any = null;

      const cells: Cell[] = [];
      data.forEach((item) => {
        // init selectedChartThumbNode
        if (item.shape === CELL_NAMES.chartThumbNode && !resultAdvice) {
          resultAdvice = item.data?.chartAdvice;
        }

        if (
          [CELL_NAMES.fieldNode, CELL_NAMES.datapropNode, CELL_NAMES.chartThumbNode, CELL_NAMES.resultNode].includes(
            `${item.shape}`
          )
        ) {
          cells.push(graph.createNode(item));
        } else {
          cells.push(graph.createEdge(item));
        }
      });

      // init result node
      if (resultAdvice) {
        const resultNodeGraphData = genResultNode(resultAdvice as Advice);
        cells.push(graph.createNode(resultNodeGraphData));
      }

      graph.resetCells(cells);
    };

    fetch('../presets/data/mini-superstore.json')
      .then((res) => res.json())
      .then((data) => {
        const graphData = jsonToGraphData(data, ['Order ID']);
        init(graphData);
        graph.centerContent();
      });

    setPipeGraph(graph);
  }, []);

  // TODO for testing
  const getPositions = () => {
    const cells = pipeGraph?.toJSON().cells;
    const result = (cells as any[])
      .filter((cell) => cell.shape === CELL_NAMES.fieldNode)
      .map((cell) => {
        return { name: cell.data.label, x: cell.position.x, y: cell.position.y };
      });

    return result;
  };

  return (
    <div>
      <div id="container"></div>
      <button onClick={() => console.log(getPositions())}>json</button>
    </div>
  );
};
