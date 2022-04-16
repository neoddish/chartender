import React from 'react';

interface EncodingLabelProps {
  channel: string;
}

export const EncodingLabel: React.FC<EncodingLabelProps> = ({ channel }) => {
  return (
    <button
      style={{
        width: '30px',
        height: '30px',
        border: '2px solid #C2C8D5',
        borderRadius: 10,
        background: '#e0e0e0',
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        padding: 0,
      }}
    >
      {channel}
    </button>
  );
};
