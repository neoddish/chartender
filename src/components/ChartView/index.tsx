import React, { useEffect } from 'react';

import { specToG2Plot } from '@antv/antv-spec';

interface ChartViewProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  chartRef: React.RefObject<any>;
  spec: any;
  scale?: { x: number; y: number };
}

export const ChartView: React.FC<ChartViewProps> = ({
  prefixCls = 'chartview',
  className,
  style,
  chartRef,
  spec,
  scale,
  ...restProps
}) => {
  const height = style?.height || 200;
  const width = style?.width || '100%';

  useEffect(() => {
    if (chartRef?.current) {
      const plot = specToG2Plot(spec, chartRef.current);
      const canvas = chartRef.current.querySelector('canvas');

      if (scale && scale.x && scale.y) {
        const ctx = canvas?.getContext('2d');

        if (ctx) ctx.scale(0.5, 0.5);

        ctx.canvas.width = 40;
        // ctx.canvas.height =40;

        plot.render();
      }
    }
  });

  return (
    <div
      {...restProps}
      className={`${prefixCls} ${className}`}
      ref={chartRef}
      style={{ width, height, margin: 'auto' }}
    />
  );
};
