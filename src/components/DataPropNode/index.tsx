import React from 'react';

import { Node } from '@antv/x6';
import { Popover, Button } from 'antd';

import { DataPropNodeData } from '../../types';
import { MetaList } from './MetaList';

import './index.less';

export class DataPropNode extends React.Component<{ node?: Node }> {
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
    const data = node?.getData() as DataPropNodeData;
    const { nodeType, fieldName, dataprop } = data;

    const metaList = <MetaList meta={dataprop} />;

    return (
      <div className={`node ${nodeType}`}>
        <div className="node-header">{fieldName}</div>
        <div className="node-body">{metaList}</div>
        <div className="node-footer">
          <Popover content={metaList} trigger="click">
            <Button className="footer-btn" type="link" block>
              more
            </Button>
          </Popover>
        </div>
      </div>
    );
  }
}
