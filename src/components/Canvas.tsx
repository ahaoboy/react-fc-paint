import React, { useImperativeHandle, useRef } from 'react';

interface Props {
  width?: number;
}
export type Refs = {
  getCanvas: () => HTMLCanvasElement | null;
};
const Canvas: React.ForwardRefRenderFunction<Refs, Props> = (
  { width },
  ref
) => {
  const widthHalf = width ? width / 2 : 0;
  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${width}" viewBox="0 0 ${width} ${width}" width="${width}"><circle cx="${widthHalf}" cy="${widthHalf}" r="${widthHalf}" fill="%23000000" /></svg>') ${widthHalf} ${widthHalf}, auto`;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }));
  return (
    <section className="canvas-wrap">
      <canvas style={{ cursor }} ref={canvasRef} />
    </section>
  );
};
export default React.forwardRef(Canvas);
