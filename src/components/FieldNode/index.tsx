import React from 'react';

import { Node } from '@antv/x6';

import { DataTypeIcon, DataType } from '../DataTypeIcon';
import { StatusIcon } from '../StatusIcon';

import './index.less';

export interface FieldNodeData {
  id: string;
  fieldType: 'dimension' | 'measure';
  dataType: DataType;
  status: string;
  label?: string;
}

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
    const { label, fieldType, dataType } = data;

    return (
      <div className={`node ${fieldType}`}>
        <DataTypeIcon type={dataType} />
        <span className="label">{label}</span>
        <span className="status">
          <StatusIcon status="default" />
        </span>
      </div>
    );
  }
}
