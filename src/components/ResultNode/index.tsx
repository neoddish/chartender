import React from 'react';

import { Node } from '@antv/x6';

import { ChartView } from '../ChartView';
import { ScoreTable } from '../ScoreTable';

import type { ResultNodeData } from '../../types';

import './index.less';

export class ResultNode extends React.Component<{ node?: Node }> {
  private chartRef = React.createRef();

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
    const data = node?.getData() as ResultNodeData;
    const { nodeType, chartAdvice } = data;

    const { spec } = chartAdvice;

    return (
      <div className={`node ${nodeType}`}>
        <div className="node-header">Result</div>
        <div className="node-body">
          <ChartView chartRef={this.chartRef} spec={spec} />
          <ScoreTable />
        </div>
      </div>
    );
  }
}
