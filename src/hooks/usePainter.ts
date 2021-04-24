import { useEffect } from 'react';
import { useCallback, useRef, useState } from 'react';
type Props = {
  bgColor?: string;
};
export const usePainter = ({ bgColor = 'white' }: Props = {}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>(
    undefined
  );

  const [isReady, setIsReady] = useState(false);
  const [isRegularMode, setIsRegularMode] = useState(true);
  const [isAutoWidth, setIsAutoWidth] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(50);

  const autoWidth = useRef(false);
  const selectedSaturation = useRef(100);
  const selectedLightness = useRef(50);
  const selectedColor = useRef('#000000');
  const selectedLineWidth = useRef(50);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const hue = useRef(0);
  const isDrawing = useRef(false);
  const direction = useRef(true);
  const isRegularPaintMode = useRef(true);
  const isEraserMode = useRef(false);

  const ctx = useRef(canvas?.getContext?.('2d')!);
  ctx.current = canvas?.getContext?.('2d')!;
  useEffect(() => {
    console.error('ctx', canvas, ctx.current);
    if (!ctx || !ctx.current || !canvas) {
      return;
    }
    console.error('ctx', canvas, ctx.current);
    init()
    ctx.current.save();
    ctx.current.fillStyle = bgColor;
    ctx.current.fillRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    ctx.current.restore();
  }, [bgColor, canvas]);

  const drawOnCanvas = useCallback(
    (event: MouseEvent) => {
      if (!ctx || !ctx.current) {
        return;
      }
      ctx.current.beginPath();
      ctx.current.moveTo(lastX.current, lastY.current);
      ctx.current.lineTo(event.offsetX, event.offsetY);
      ctx.current.stroke();
      [lastX.current, lastY.current] = [event.offsetX, event.offsetY];
    },
    [canvas]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      isDrawing.current = true;
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    },
    [canvas]
  );

  const dynamicLineWidth = useCallback(() => {
    if (!ctx || !ctx.current) {
      return;
    }
    if (ctx.current.lineWidth > 90 || ctx.current.lineWidth < 10) {
      direction.current = !direction.current;
    }
    direction.current ? ctx.current.lineWidth++ : ctx.current.lineWidth--;
    setCurrentWidth(ctx.current.lineWidth);
  }, [canvas]);

  const drawNormal = useCallback(
    (e: any) => {
      if (!isDrawing.current || !ctx.current) return;

      if (isRegularPaintMode.current || isEraserMode.current) {
        ctx.current.strokeStyle = selectedColor.current;

        setCurrentColor(selectedColor.current);

        autoWidth.current && !isEraserMode.current
          ? dynamicLineWidth()
          : (ctx.current.lineWidth = selectedLineWidth.current);

        isEraserMode.current
          ? (ctx.current.globalCompositeOperation = 'destination-out')
          : (ctx.current.globalCompositeOperation = 'source-over');
      } else {
        setCurrentColor(
          `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`
        );
        ctx.current.strokeStyle = `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`;
        ctx.current.globalCompositeOperation = 'source-over';

        hue.current++;

        if (hue.current >= 360) hue.current = 0;

        autoWidth.current
          ? dynamicLineWidth()
          : (ctx.current.lineWidth = selectedLineWidth.current);
      }
      drawOnCanvas(e);
    },
    [drawOnCanvas, dynamicLineWidth]
  );

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
  }, [canvas]);

  const init = useCallback(() => {
    console.error('init useCallback', canvas, ctx);
    if (canvas && ctx && ctx.current) {
      canvas?.addEventListener('mousedown', handleMouseDown);
      canvas?.addEventListener('mousemove', drawNormal);
      canvas?.addEventListener('mouseup', stopDrawing);
      canvas?.addEventListener('mouseout', stopDrawing);
      canvas.width = window.innerWidth - 196;
      canvas.height = window.innerHeight;
      ctx.current.strokeStyle = '#000';
      ctx.current.lineJoin = 'round';
      ctx.current.lineCap = 'round';
      ctx.current.lineWidth = 10;
      setIsReady(true);
    }
  }, [drawNormal, handleMouseDown, stopDrawing, canvas]);

  const handleRegularMode = useCallback(() => {
    setIsRegularMode(true);
    isEraserMode.current = false;
    setIsEraser(false);
    isRegularPaintMode.current = true;
  }, [canvas]);

  const handleSpecialMode = useCallback(() => {
    setIsRegularMode(false);
    isEraserMode.current = false;
    setIsEraser(false);
    isRegularPaintMode.current = false;
  }, [canvas]);

  const handleColor = (e: any) => {
    setCurrentColor(e.currentTarget.value);
    selectedColor.current = e.currentTarget.value;
  };

  const handleWidth = (e: any) => {
    setCurrentWidth(e.currentTarget.value);
    selectedLineWidth.current = e.currentTarget.value;
  };

  const handleClear = useCallback(() => {
    if (!ctx || !ctx.current || !canvas) {
      return;
    }
    ctx.current.clearRect(0, 0, canvas?.width, canvas?.height);
  }, [canvas]);

  const handleEraserMode = () => {
    autoWidth.current = false;
    setIsAutoWidth(false);
    setIsRegularMode(true);
    isEraserMode.current = true;
    setIsEraser(true);
  };

  const setCurrentSaturation = (e: any) => {
    setCurrentColor(
      `hsl(${hue.current},${e.currentTarget.value}%,${selectedLightness.current}%)`
    );
    selectedSaturation.current = e.currentTarget.value;
  };

  const setCurrentLightness = (e: any) => {
    setCurrentColor(
      `hsl(${hue.current},${selectedSaturation.current}%,${e.currentTarget.value}%)`
    );
    selectedLightness.current = e.currentTarget.value;
  };

  const setAutoWidth = (e: any) => {
    autoWidth.current = e.currentTarget.checked;
    setIsAutoWidth(e.currentTarget.checked);

    if (!e.currentTarget.checked) {
      setCurrentWidth(selectedLineWidth.current);
    } else {
      setCurrentWidth(ctx?.current?.lineWidth ?? selectedLineWidth.current);
    }
  };

  return [
    {
      canvas,
      isReady,
      currentWidth,
      currentColor,
      isRegularMode,
      isAutoWidth,
      isEraser,
    },
    {
      init,
      handleRegularMode,
      handleSpecialMode,
      handleColor,
      handleWidth,
      handleClear,
      handleEraserMode,
      setAutoWidth,
      setCurrentSaturation,
      setCurrentLightness,
      setCanvas,
    },
  ];
};
