import React from 'react';

import { Node } from '@antv/x6';
import { Divider, Table, Tag } from 'antd';

import { ChartImg } from '../ChartImg';

import type { ChartAntVSpec } from '@antv/antv-spec';
import type { ChartThumbNodeData } from '../../types';

import './index.less';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
    onCell: (_: any, index: number) => ({
      colSpan: index === 0 ? 0 : 1,
    }),
    ellipsis: true,
    width: 40,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    render: (value: string | string[], record: any) => (
      <span className={`advice-info ${record?.name === 'type' && 'chart-id'}`}>
        {record?.name === 'rank' ? <Tag color="geekblue">{value}</Tag> : value}
      </span>
    ),
    onCell: (_: any, index: number) => ({
      colSpan: index === 0 ? 2 : 1,
    }),
    ellipsis: true,
    width: 60,
  },
];

export class ChartThumbNode extends React.Component<{ node?: Node }> {
  shouldComponentUpdate() {
    const { node } = this.props;
    if (node) {
      if (node.hasChanged('data')) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { node } = this.props;
    const data = node?.getData() as ChartThumbNodeData;
    const { nodeType, chartAdvice } = data;

    const { type, spec, score } = chartAdvice;

    const tableData = [
      { key: 'row-0', name: 'type', value: type },
      { key: 'row-1', name: 'rank', value: 1 },
      { key: 'row-2', name: 'score', value: score },
    ];

    return (
      <div className={`node ${nodeType}`}>
        <div className="chartview">
          <ChartImg
            spec={spec as ChartAntVSpec}
            tempDomStyle={{ height: '400px', width: '400px', padding: '40px' }}
            style={{ height: '100px', width: '100px' }}
          />
        </div>
        <Divider type="vertical" style={{ margin: '0 2px' }} />
        <div className="infoview">
          <div className="infoview-table">
            <Table columns={columns as any} dataSource={tableData} showHeader={false} pagination={false} size="small" />
          </div>
        </div>
      </div>
    );
  }
}
