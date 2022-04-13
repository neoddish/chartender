import React, { useEffect, useState } from 'react';

import { Graph, Path, Cell } from '@antv/x6';
import '@antv/x6-react-shape';

import { FieldNode, FieldNodeData } from '../components';

import './index.less';

interface PlaygroundProps {}

Graph.registerNode(
  'dag-node',
  {
    inherit: 'react-shape',
    width: 180,
    height: 36,
    component: <FieldNode />,
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      },
    },
  },
  true
);

Graph.registerEdge(
  'dag-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#C2C8D5',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  },
  true
);

Graph.registerConnector(
  'algo-connector',
  (s, e) => {
    const offset = 4;
    const deltaY = Math.abs(e.y - s.y);
    const control = Math.floor((deltaY / 3) * 2);

    const v1 = { x: s.x, y: s.y + offset + control };
    const v2 = { x: e.x, y: e.y - offset - control };

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `
    );
  },
  true
);

// TODO temp
const nodeStatusList = [
  [
    {
      id: '1',
      status: 'running',
    },
    {
      id: '2',
      status: 'default',
    },
    {
      id: '3',
      status: 'default',
    },
    {
      id: '4',
      status: 'default',
    },
  ],
  [
    {
      id: '1',
      status: 'success',
    },
    {
      id: '2',
      status: 'running',
    },
    {
      id: '3',
      status: 'default',
    },
    {
      id: '4',
      status: 'default',
    },
  ],
  [
    {
      id: '1',
      status: 'success',
    },
    {
      id: '2',
      status: 'success',
    },
    {
      id: '3',
      status: 'running',
    },
    {
      id: '4',
      status: 'running',
    },
  ],
  [
    {
      id: '1',
      status: 'success',
    },
    {
      id: '2',
      status: 'success',
    },
    {
      id: '3',
      status: 'success',
    },
    {
      id: '4',
      status: 'failed',
    },
  ],
];

export const Playground: React.FC<PlaygroundProps> = () => {
  const [pipeGraph, setPipeGraph] = useState<Graph>();

  useEffect(() => {
    const graph: Graph = new Graph({
      container: document.getElementById('container')!,
      width: 1440,
      height: 900,
      background: {
        color: '#f7f7f7',
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
        connector: 'algo-connector',
        connectionPoint: 'anchor',
        anchor: 'center',
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'top';
        },
        createEdge() {
          return graph.createEdge({
            shape: 'dag-edge',
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
      const { type } = node.getData() as FieldNodeData;
      edges?.forEach((edge) => {
        if (type === 'dimension') {
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
        if (item.shape === 'dag-node') {
          cells.push(graph.createNode(item));
        } else {
          cells.push(graph.createEdge(item));
        }
      });
      graph.resetCells(cells);
    };

    // 显示节点状态
    const showNodeStatus = async (statusList: FieldNodeData[][]) => {
      const status = statusList.shift();
      status?.forEach((item) => {
        const { id, type } = item;
        const node = graph.getCellById(id);
        const data = node.getData() as FieldNodeData;
        node.setData({
          ...data,
          type,
        });
      });
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        showNodeStatus(statusList);
      }, 3000);
    };

    fetch('../data/test.json')
      .then((response) => response.json())
      .then((data) => {
        init(data);
        showNodeStatus(nodeStatusList);
        graph.centerContent();
      });

    setPipeGraph(graph);
  }, []);

  // TODO for testing
  const getPositions = () => {
    const cells = pipeGraph?.toJSON().cells;
    const result = (cells as any[])
      .filter((cell) => cell.shape === 'dag-node')
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
