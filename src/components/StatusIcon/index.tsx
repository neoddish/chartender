import React from 'react';

import './index.less';

type Status = 'default' | 'success' | 'failed' | 'running';

const image: Record<Status, string> = {
  default: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
  success: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ',
  failed: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ',
  running: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ',
};

interface StatusIconProps {
  status: Status;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => (
  <img className={`status ${status}`} src={image[status]} />
);
