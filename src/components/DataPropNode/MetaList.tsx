import React from 'react';

import { Table, Tag } from 'antd';

type MetaInfo = { name: string; value: any };

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    render: (value: string | string[]) => (
      <span>
        {Array.isArray(value)
          ? value.map((val, index) => {
              const color = 'geekblue';
              return (
                <Tag color={color} key={`${index}-${val}`}>
                  {val}
                </Tag>
              );
            })
          : value}
      </span>
    ),
  },
];

interface MetaListProps {
  meta: MetaInfo[];
}

const datapropToArray = (dataprop: any): MetaInfo[] => {
  const tuples: MetaInfo[] = [];
  if (dataprop.type) tuples.push({ name: 'type', value: dataprop.type });
  if (dataprop.recommendation) tuples.push({ name: 'rec.', value: dataprop.recommendation });
  if (dataprop.levelOfMeasurements) tuples.push({ name: 'lom.', value: dataprop.levelOfMeasurements });

  return tuples.map((row, index) => {
    return { ...row, key: `row-${index}` };
  });
};

export const MetaList: React.FC<MetaListProps> = ({ meta }) => {
  const infoArr: MetaInfo[] = datapropToArray(meta);
  return (
    <div className="meta-list">
      <Table columns={columns} dataSource={infoArr} showHeader={false} pagination={false} size="small" />
    </div>
  );
};
