import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { usePainter } from './hooks/usePainter';

const App = () => {
  const [dateUrl, setDataUrl] = useState('#');
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();

  const handleDownload = useCallback(() => {
    if (!canvas) return;

    setDataUrl(canvas.toDataURL?.('image/png'));
  }, [canvas]);
  const canvasRef = useRef();
  const toolbarProps = { ...state, ...api, dateUrl, handleDownload };
  useEffect(() => {
    init?.();

    console.error('canvasRef', canvasRef);
    // api.setCanvas()
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
