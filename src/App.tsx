import React, { useState, useCallback, useEffect, useRef } from 'react';
import Canvas, { Refs } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { usePainter } from './hooks/usePainter';

const App = () => {
  const [dateUrl, setDataUrl] = useState('#');
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter({
    bgColor: 'rgba(0,0,0,0)',
  });

  const handleDownload = useCallback(() => {
    if (!canvas) return;
    setDataUrl(canvas.toDataURL?.('image/png'));
  }, [canvas]);
  const canvasRef = useRef<Refs>(null);
  const toolbarProps = { ...state, ...api, dateUrl, handleDownload };
  useEffect(() => {
    console.error('canvasRef', canvasRef.current?.getCanvas());
    const c = canvasRef.current?.getCanvas?.();
    console.error('init', c);
    c && api?.setCanvas?.(c);
    init?.();
  }, []);
  return (
    <div className="paint-wrap">
      {/* <Intro isReady={isReady} init={init} /> */}
      <Toolbar {...toolbarProps} />
      <Canvas width={state.currentWidth} ref={canvasRef} />
      {/* <Goo /> */}
    </div>
  );
};

export default App;
