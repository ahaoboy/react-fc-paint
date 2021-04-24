import React, { useState, useCallback, useEffect, useRef } from 'react';
import Canvas, { Refs } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { usePainter, Props as PainterProps } from './hooks/usePainter';
export type Props = {
  className?: string | string[];
} & PainterProps;
const App: React.FC<Props> = (props = {}) => {
  const { className = '' } = props;
  const [dateUrl, setDataUrl] = useState('#');
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth - 196,
    height: window.innerHeight,
  });

  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter({
    bgColor: 'white',
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    ...props,
  });

  const handleDownload = useCallback(() => {
    if (!canvas) return;
    setDataUrl(canvas.toDataURL?.('image/png'));
  }, [canvas]);
  const canvasRef = useRef<Refs>(null);
  const toolbarProps = { ...state, ...api, dateUrl, handleDownload };
  useEffect(() => {
    const rect = wrapRef.current?.getBoundingClientRect();
    rect &&
      setCanvasSize({
        width: rect.width - 196,
        height: rect.height,
      });
    const c = canvasRef.current?.getCanvas?.();
    c && api?.setCanvas?.(c);
    init?.();
  }, []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const classNameStr = ['paint-wrap', [className]].flat().join(' ');
  return (
    <div className={classNameStr} ref={wrapRef}>
      <Toolbar {...toolbarProps} />
      <Canvas cursorWidth={state.currentWidth} ref={canvasRef} />
    </div>
  );
};

export default App;
