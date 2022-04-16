import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Graph, Cell } from '@antv/x6';
import '@antv/x6-react-shape';

import { FieldNodeData, EncodingLabel } from '../components';
import { CELL_NAMES } from '../constants';
import {
  registerPipeConnector,
  registerFieldDatapropEdge,
  registerFieldNode,
  registerDatapropNode,
  registerChartThumbNode,
  registerDatapropChartThumbEdge,
} from '../graph';

import './index.less';

registerFieldNode();
registerDatapropNode();
registerChartThumbNode();
registerFieldDatapropEdge();
registerDatapropChartThumbEdge();
registerPipeConnector();

export const Playground: React.FC = () => {
  const [pipeGraph, setPipeGraph] = useState<Graph>();

  useEffect(() => {
    const graph: Graph = new Graph({
      container: document.getElementById('container')!,
      width: 1440,
      height: 900,
      background: {
        color: '#f2f5f7',
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
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
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true,
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

    // 初始化节点/边
    const init = (data: Cell.Metadata[]) => {
      const cells: Cell[] = [];
      data.forEach((item) => {
        if ([CELL_NAMES.fieldNode, CELL_NAMES.datapropNode, CELL_NAMES.chartThumbNode].includes(`${item.shape}`)) {
          cells.push(graph.createNode(item));
        } else {
          cells.push(graph.createEdge(item));
        }
      });
      graph.resetCells(cells);
    };

    fetch('../data/test.json')
      .then((response) => response.json())
      .then((data) => {
        init(data);
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

  // const changeSize = () => {
  //   console.log(
  //     pipeGraph
  //       ?.getNodes()
  //       .find((node) => node.id === 'fn-1')
  //       ?.position()
  //   );

  //   pipeGraph
  //     ?.getNodes()
  //     .find((node) => node.id === 'fn-1')
  //     ?.scale(1, 2, { x: 0, y: 200 });
  // };

  return (
    <div>
      <div id="container"></div>
      <button onClick={() => console.log(getPositions())}>json</button>
    </div>
  );
};
