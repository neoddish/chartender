import React from 'react';

import { Graph, Markup, Path } from '@antv/x6';
import '@antv/x6-react-shape';

import { FieldNode, DataPropNode, ChartThumbNode } from '../components';
import { CELL_NAMES } from '../constants';

export const registerFieldNode = () => {
  Graph.registerNode(
    CELL_NAMES.fieldNode,
    {
      inherit: 'react-shape',
      width: 180,
      height: 36,
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
      width: 200,
      height: 147,
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
      width: 220,
      height: 100,
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
      },
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
