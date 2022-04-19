import React from 'react';

interface EncodingLabelProps {
  channel: string;
  active: boolean;
}

const channelAbbr: Record<string, string> = {
  x: 'X',
  y: 'Y',
  color: 'Clr',
  theta: 'Tta',
  size: 'Siz',
  column: 'Clm',
  row: 'Row',
};

export const EncodingLabel: React.FC<EncodingLabelProps> = ({ channel, active }) => {
  return (
    <button
      style={{
        width: '30px',
        height: '30px',
        border: `2px solid ${active ? '#7262fd' : '#C2C8D540'}`,
        borderRadius: 10,
        background: active ? '#DECFEA' : '#e0e0e040',
        textAlign: 'center',
        color: active ? '#7262fd' : '#99999940',
        fontSize: 12,
        padding: 0,
      }}
    >
      {channelAbbr[channel] || channel}
    </button>
  );
};
