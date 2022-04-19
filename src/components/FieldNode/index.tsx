import React from 'react';

import { Node } from '@antv/x6';

import { DataTypeIcon } from '../DataTypeIcon';
import { StatusIcon } from '../StatusIcon';

import type { FieldNodeData } from '../../types';

import './index.less';

export class FieldNode extends React.Component<{ node?: Node }> {
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
    const data = node?.getData() as FieldNodeData;
    const { nodeType, fieldName, fieldType, dataType } = data;

    return (
      <div className={`node ${nodeType} ${fieldType}`}>
        <DataTypeIcon type={dataType} />
        <span className="label">{fieldName}</span>
        <span className="status">
          <StatusIcon status="default" />
        </span>
      </div>
    );
  }
}
