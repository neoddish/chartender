import React, { useEffect } from 'react';

import { SheetComponent } from '@antv/s2-react';

const data = [
  {
    ruleType: 'Hard',
    ruleId: 'h1',
    detail: '我是个备注',
    score: 76.32,
  },
  {
    ruleType: 'Soft',
    ruleId: 's1',
    detail: '我也是个备注',
    score: 7,
  },
  {
    ruleType: 'Soft',
    ruleId: 's2',
    detail: '一二线城市',
    score: 62.12,
  },
  {
    ruleType: 'Soft',
    ruleId: 's3',
    detail: '三四线城市',
    score: 37,
  },
  {
    ruleType: 'Design',
    ruleId: 'd1',
    detail: '一二城市',
    score: 40,
  },
  {
    ruleType: 'Design',
    ruleId: 'd2',
    detail: '三四线城市',
    score: 7.2,
  },
];

const PALETTE_COLORS = [
  {
    limit: 10,
    background: '#b8e1ff',
  },
  {
    limit: 20,
    background: '#b4d3fb',
  },
  {
    limit: 30,
    background: '#7daaff',
  },
  {
    limit: 40,
    background: '#5b8ff9',
  },
  {
    limit: 50,
    background: '#3d76dd',
  },
  {
    limit: 60,
    background: '#085ec0',
  },
  {
    limit: 70,
    background: '#085ec0cc',
  },
  {
    limit: 80,
    background: '#0047a5',
  },
  {
    limit: 90,
    background: '#00318a',
  },
  {
    limit: 100,
    background: '#001d70',
  },
];

const getTargetColor = (value: any) => {
  if (Number.isNaN(Number(value))) {
    return PALETTE_COLORS[0].background;
  }
  return PALETTE_COLORS[Math.floor(Number(value) / 10)].background;
};

export const ScoreTable: React.FC = () => {
  const s2DataConfig = {
    fields: {
      rows: ['ruleType', 'ruleId'],
      column: [],
      values: ['score', 'detail'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'ruleType',
        name: 'Rule Type',
      },
      {
        field: 'ruleId',
        name: 'Rule ID',
      },
      {
        field: 'detail',
        name: 'Detail',
      },
      {
        field: 'score',
        name: 'Score',
      },
    ],
    data,
  };

  const s2Options = {
    width: 400,
    height: 600,
    tooltip: {
      showTooltip: true,
      operation: {
        hiddenColumns: true,
      },
    },
    interaction: {
      selectedCellsSpotlight: true,
      hoverHighlight: false,
    },
    style: {
      layoutWidthType: 'colAdaptive',
      cellCfg: {
        width: 100,
      },
    },
    conditions: {
      text: [
        {
          field: 'score',
          mapping(value: any) {
            return {
              fill: value >= 50 ? '#fff' : '#282b32',
            };
          },
        },
      ],
      background: [
        {
          field: 'score',
          mapping(value: any) {
            const backgroundColor = getTargetColor(value);
            return {
              fill: backgroundColor,
            };
          },
        },
      ],
    },
  };

  useEffect(() => {}, []);

  return (
    <div className="score-table">
      <SheetComponent dataCfg={s2DataConfig} options={s2Options as any} sheetType="pivot" adaptive={false} />
    </div>
  );
};
