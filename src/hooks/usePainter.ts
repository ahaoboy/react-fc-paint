import { isPC } from './../util';
import { useEffect } from 'react';
import { useCallback, useRef, useState } from 'react';
export type Props = {
  bgColor?: string;
  defaultColor?: string;
  brushSize?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  maxCanvasWidth?: number;
  maxCanvasHeight?: number;
};

const getPosition = (e: MouseEvent | TouchEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (e instanceof MouseEvent) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
  }

  if (e instanceof TouchEvent) {
    const t = e.changedTouches[0];
    const rect = (t.target as HTMLCanvasElement).getBoundingClientRect();
    console.error(t, rect);
    if (t && rect) {
      return {
        x: t.clientX - rect.x,
        y: t.clientY - rect.y,
      };
    }
  }
  return {
    x: 0,
    y: 0,
  };
};
export const usePainter = ({
  bgColor = 'white',
  defaultColor = 'black',
  brushSize = 10,
  canvasWidth = window.innerWidth - 196,
  canvasHeight = window.innerHeight,
  maxCanvasWidth = 1024 * 4,
  maxCanvasHeight = 1024 * 2,
}: Props = {}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>(
    undefined
  );

  const [isReady, setIsReady] = useState(false);
  const [isRegularMode, setIsRegularMode] = useState(true);
  const [isAutoWidth, setIsAutoWidth] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  const [currentColor, setCurrentColor] = useState(defaultColor);
  const [currentWidth, setCurrentWidth] = useState(brushSize);

  const autoWidth = useRef(false);
  const selectedSaturation = useRef(100);
  const selectedLightness = useRef(50);
  const selectedColor = useRef(defaultColor);
  const selectedLineWidth = useRef(brushSize);
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
    if (!ctx.current || !canvas) {
      return;
    }
    init();
    ctx.current.save();
    ctx.current.fillStyle = bgColor;
    ctx.current.fillRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    ctx.current.restore();
  }, [bgColor, canvas]);

  const drawOnCanvas = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!ctx.current) {
        return;
      }
      const { x, y } = getPosition(event);
      ctx.current.beginPath();
      ctx.current.moveTo(lastX.current, lastY.current);
      ctx.current.lineTo(x, y);
      ctx.current.stroke();
      [lastX.current, lastY.current] = [x, y];
    },
    [canvas]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPosition(e);
      isDrawing.current = true;
      [lastX.current, lastY.current] = [x, y];
      drawNormal(e);
    },
    [canvas]
  );

  const dynamicLineWidth = useCallback(() => {
    if (!ctx.current) {
      return;
    }
    if (ctx.current.lineWidth > 90 || ctx.current.lineWidth < 10) {
      direction.current = !direction.current;
    }
    direction.current ? ctx.current.lineWidth++ : ctx.current.lineWidth--;
    setCurrentWidth(ctx.current.lineWidth);
  }, [canvas]);

  const drawNormal = useCallback(
    (e: MouseEvent | TouchEvent) => {
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
    if (canvas && ctx.current) {
      if (isPC()) {
        canvas.addEventListener('mousedown', handleMouseDown, {
          passive: false,
        });
        canvas.addEventListener('mousemove', drawNormal, {
          passive: false,
        });
        canvas.addEventListener('mouseup', stopDrawing, {
          passive: false,
        });
        canvas.addEventListener('mouseout', stopDrawing, {
          passive: false,
        });
      } else {
        canvas.addEventListener('touchstart', handleMouseDown, {
          passive: false,
        });
        canvas.addEventListener('touchmove', drawNormal, {
          passive: false,
        });
        canvas.addEventListener('touchend', stopDrawing, {
          passive: false,
        });
      }
      canvas.width = Math.min(canvasWidth, maxCanvasWidth);
      canvas.height = Math.min(canvasHeight, maxCanvasHeight);
      ctx.current.strokeStyle = defaultColor;
      ctx.current.lineJoin = 'round';
      ctx.current.lineCap = 'round';
      ctx.current.lineWidth = brushSize;
      setIsReady(true);
    }

    return () => {
      if (canvas) {
        if (isPC()) {
          canvas.removeEventListener('mousedown', handleMouseDown);
          canvas.removeEventListener('mousemove', drawNormal);
          canvas.removeEventListener('mouseup', stopDrawing);
          canvas.removeEventListener('mouseout', stopDrawing);
        } else {
          canvas.removeEventListener('touchstart', handleMouseDown);
          canvas.removeEventListener('touchmove', drawNormal);
          canvas.removeEventListener('touchend', stopDrawing);
        }
      }
    };
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
      brushSize,
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
