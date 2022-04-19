import React from 'react';

import {
  FieldStringOutlined,
  FieldNumberOutlined,
  FieldBinaryOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
  ExpandOutlined,
  ForkOutlined,
} from '@ant-design/icons';

import type { DataType } from '../../types';

import './index.less';

const COLOR = 'rgba(0,0,0,0.45)';

const typeMap: Record<DataType, any> = {
  string: <FieldStringOutlined style={{ color: COLOR }} />,
  integer: <FieldNumberOutlined style={{ color: COLOR }} />,
  float: <FieldNumberOutlined style={{ color: COLOR }} />,
  boolean: <FieldBinaryOutlined style={{ color: COLOR }} />,
  date: <FieldTimeOutlined style={{ color: COLOR }} />,
  geo: <GlobalOutlined style={{ color: COLOR }} />,
  null: <ExpandOutlined style={{ color: COLOR }} />,
  mixed: <ForkOutlined style={{ color: COLOR }} />,
};

interface DataTypeIconProps {
  type: DataType;
}

export const DataTypeIcon: React.FC<DataTypeIconProps> = ({ type }) => <div className="type-icon">{typeMap[type]}</div>;
