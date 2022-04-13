import React from 'react';

import {
  FieldStringOutlined,
  FieldNumberOutlined,
  FieldBinaryOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

import './index.less';

export type DataType = 'string' | 'number' | 'boolean' | 'time' | 'geo';

const COLOR = 'rgba(0,0,0,0.45)';

const typeMap: Record<DataType, any> = {
  string: <FieldStringOutlined style={{ color: COLOR }} />,
  number: <FieldNumberOutlined style={{ color: COLOR }} />,
  boolean: <FieldBinaryOutlined style={{ color: COLOR }} />,
  time: <FieldTimeOutlined style={{ color: COLOR }} />,
  geo: <GlobalOutlined style={{ color: COLOR }} />,
};

interface DataTypeIconProps {
  type: 'string' | 'number' | 'boolean' | 'time' | 'geo';
}

export const DataTypeIcon: React.FC<DataTypeIconProps> = ({ type }) => <div className="type-icon">{typeMap[type]}</div>;
