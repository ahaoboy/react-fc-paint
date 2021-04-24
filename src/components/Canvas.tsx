import React, { useEffect, useRef } from 'react';

interface Props {
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | undefined>;
  width?: number;
  bgColor?: string;
}

export const Canvas: React.FC<Props> = ({ width, bgColor = 'black' }) => {
  const widthHalf = width ? width / 2 : 0;
  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${width}" viewBox="0 0 ${width} ${width}" width="${width}"><circle cx="${widthHalf}" cy="${widthHalf}" r="${widthHalf}" fill="%23000000" /></svg>') ${widthHalf} ${widthHalf}, auto`;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d')!;
    console.error('ctx', ctx);
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(
      0,
      0,
      canvasRef?.current?.width || 0,
      canvasRef?.current?.height || 0
    );
    ctx.restore();
    console.error('===', bgColor, canvasRef?.current?.height);

    setTimeout(() => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(
        0,
        0,
        canvasRef?.current?.width || 0,
        canvasRef?.current?.height || 0
      );
      console.error('===22', bgColor, canvasRef?.current?.height);
      ctx.restore();
    }, 1000);
  }, []);
  return (
    <section className="canvas-wrap">
      <canvas style={{ cursor }} ref={canvasRef} />
    </section>
  );
};
