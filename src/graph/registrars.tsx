import React from 'react';

import { Graph, Markup, Path } from '@antv/x6';
import '@antv/x6-react-shape';

import { FieldNode, DataPropNode, ChartThumbNode, ResultNode } from '../components';
import { CELL_NAMES, UI_NODES } from '../constants';

export const registerFieldNode = () => {
  Graph.registerNode(
    CELL_NAMES.fieldNode,
    {
      inherit: 'react-shape',
      width: UI_NODES.FIELD_NODE.WIDTH,
      height: UI_NODES.FIELD_NODE.HEIGHT,
      component: <FieldNode />,
      ports: {
        groups: {
          right: {
            position: 'right',
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
};

export const registerDatapropNode = () => {
  Graph.registerNode(
    CELL_NAMES.datapropNode,
    {
      inherit: 'react-shape',
      width: UI_NODES.DATAPROP_NODE.WIDTH,
      height: UI_NODES.DATAPROP_NODE.HEIGHT,
      component: <DataPropNode />,
      ports: {
        groups: {
          left: {
            position: 'left',
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
          right: {
            position: 'right',
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
};

export const registerChartThumbNode = () => {
  Graph.registerNode(
    CELL_NAMES.chartThumbNode,
    {
      inherit: 'react-shape',
      width: UI_NODES.CHARTTHUMB_NODE.WIDTH,
      height: UI_NODES.CHARTTHUMB_NODE.HEIGHT,
      component: <ChartThumbNode />,
      ports: {
        groups: {
          left: {
            position: 'left',
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
          right: {
            position: 'right',
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
};

export const registerResultNode = () => {
  Graph.registerNode(
    CELL_NAMES.resultNode,
    {
      inherit: 'react-shape',
      width: UI_NODES.RESULT_NODE.WIDTH,
      height: UI_NODES.RESULT_NODE.HEIGHT,
      component: <ResultNode />,
      ports: {
        groups: {
          left: {
            position: 'left',
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
};

export const registerFieldDatapropEdge = () => {
  Graph.registerEdge(
    CELL_NAMES.fieldDatapropEdge,
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
};

export const registerDatapropChartThumbEdge = () => {
  Graph.registerEdge(
    CELL_NAMES.datapropChartThumbEdge,
    {
      inherit: 'edge',
      defaultLabel: {
        markup: Markup.getForeignObjectMarkup(),
        attrs: {
          fo: {
            width: 30,
            height: 30,
            x: -15,
            y: -15,
          },
        },
      },
      label: {
        position: 0.5,
        data: { channel: '', active: false },
      },
      attrs: {
        line: {
          stroke: '#C2C8D540',
          strokeWidth: 1,
          targetMarker: null,
        },
      },
    },
    true
  );
};

export const registerChartThumbResultEdge = () => {
  Graph.registerEdge(
    CELL_NAMES.chartThumbResultEdge,
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
};

export const registerPipeConnector = () => {
  Graph.registerConnector(
    CELL_NAMES.pipeConnector,
    (s, e) => {
      const offset = 4;
      const deltaX = Math.abs(e.x - s.x);
      const control = Math.floor((deltaX / 3) * 2);

      const v1 = { x: s.x + offset + control, y: s.y };
      const v2 = { x: e.x - offset - control, y: e.y };

      return Path.normalize(
        `M ${s.x} ${s.y}
         L ${s.x + offset} ${s.y}
         C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x - offset} ${e.y}
         L ${e.x} ${e.y}
        `
      );
    },
    true
  );
};
