import React, { useImperativeHandle, useRef } from 'react';

interface Props {
  cursorWidth?: number;
}
export type Refs = {
  getCanvas: () => HTMLCanvasElement | null;
};
const Canvas: React.ForwardRefRenderFunction<Refs, Props> = (
  { cursorWidth = 0 },
  ref
) => {
  const cursorWidthHalf = cursorWidth ? cursorWidth / 2 : 0;
  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${cursorWidth}" viewBox="0 0 ${cursorWidth} ${cursorWidth}" cursorWidth="${cursorWidth}"><circle cx="${cursorWidthHalf}" cy="${cursorWidthHalf}" r="${cursorWidthHalf}" fill="%23000000" /></svg>') ${cursorWidthHalf} ${cursorWidthHalf}, auto`;
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
