import React, { useState, useRef, useEffect, useReducer } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { PaintHeader } from "../components/paint/PaintHeader";
import PaintBody from "../components/paint/PaintBody";
import { MODES, PAN_LIMIT_HEIGHT, PAN_LIMIT_WIDTH } from "../constants";
import { useWindowSize } from "../hooks";

const PaintPage = () => {
  //   const { user } = useAuth0();

  //   if (!user) {
  //     return null;
  //   }
  const [selBrush, setSelBrush] = useState(1);
  const settings = useRef({
    stroke: 20,
    color: "#000",
    mode: selBrush,
  });
  console.log(settings);
  let lastPath = [];
  const size = useWindowSize();
  const [showModal, setShowModal] = useState(false);

  const width = Math.min(size.width - 96, PAN_LIMIT_WIDTH);
  const height = Math.min(size.height, PAN_LIMIT_HEIGHT);
  const [, setDrawing] = useState(false);
  const canvas = useRef(null);
  const context = useRef(null);
  const preview = useRef(null);
  const [, render] = useReducer((prev) => !prev, false);
  const draw = useRef(false);
  const coords = useRef([0, 0]);
  const history = useRef([]);
  const redoHistory = useRef([]);
  const moving = useRef(false);

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const undoCanvas = (e) => {
    prevent(e);
    if (history.current.length === 0) return;
    redoHistory.current.push(history.current.pop());
    drawCanvas(getContext());
    render();
  };
  const redoCanvas = (e) => {
    prevent(e);
    if (redoHistory.current.length === 0) return;
    history.current.push(redoHistory.current.pop());
    drawCanvas(getContext());
    render();
  };
  const onPointerDown = (e) => {
    prevent(e);
    const ctx = getContext(settings.current);
    coords.current = [e.clientX, e.clientY];
    if (settings.current.mode === MODES.PAN) {
      moving.current = true;
      return;
    }
    setDrawing(true);
    draw.current = true;
    const point = getPoints(e, context.current);
    lastPath = [];
    drawModes(settings.current.mode, ctx, point, lastPath);
  };

  const onPointerUp = (e) => {
    prevent(e);
    if (settings.current.mode === MODES.PAN) {
      moving.current = false;
      return;
    }
    setDrawing(false);
    draw.current = false;
    if (lastPath.length > 0) {
      history.current.push({
        ...settings.current,
        path: lastPath,
      });
      redoHistory.current = [];
      lastPath = [];
      drawCanvas(getContext());
    }
  };

  const getPreviewActiveStyles = () => {
    const styles = {
      width: (width * 100) / PAN_LIMIT_WIDTH + "%",
      height: (height * 100) / PAN_LIMIT_HEIGHT + "%",
    };
    if (!context.current) return styles;
    const { e, f } = getContext().getTransform();
    styles.left = (100 - e * 100) / PAN_LIMIT_WIDTH + "%";
    styles.top = (100 - f * 100) / PAN_LIMIT_HEIGHT + "%";
    return styles;
  };

  const updatePreview = () => {
    if (preview.current) {
      const style = getPreviewActiveStyles();
      preview.current.style.left = style.left;
      preview.current.style.top = style.top;
    }
  };

  const onCanvasMove = (e, ctx) => {
    const [x1, y1] = coords.current;
    const { clientX: x2, clientY: y2 } = e;
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    const { e: tdx, f: tdy } = ctx.getTransform();
    const ntdx = Math.min(Math.max(-(PAN_LIMIT_WIDTH - width), tdx + dx), 0);
    const ntdy = Math.min(Math.max(-(PAN_LIMIT_HEIGHT - height), tdy + dy), 0);
    ctx.setTransform(1, 0, 0, 1, ntdx, ntdy);
    drawCanvas(ctx);
    coords.current = [x2, y2];
    updatePreview();
  };

  const onPointerMove = (e) => {
    prevent(e);
    if (moving.current) return onCanvasMove(e, context.current);
    if (!draw.current) return;
    const point = getPoints(e, context.current);
    const ctx = getContext(settings.current);
    drawModes(settings.current.mode, ctx, point, lastPath);
  };

  const drawModes = (mode, ctx, point, path) => {
    // console.log(ctx);
    switch (mode) {
      case MODES.PEN:
        ctx.lineWidth = 2;
        point ? previewPen(point, ctx) : drawPen(path, ctx);
        break;
      case MODES.BRUSH:
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = 10;
        // ctx.shadowBlur = 10;
        // ctx.shadowColor = "rgb(0, 0, 0)";
        if (point) {
          previewPen(point, ctx);
        } else {
          drawPen(path, ctx);
        }
        break;
      case MODES.SHADOW:
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = 10;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgb(0, 0, 0)";
        if (point) {
          previewPen(point, ctx);
        } else {
          drawPen(path, ctx);
        }
        break;
      default:
        return;
    }
  };
  const getContext = (config, ctx) => {
    if (!context.current) {
      context.current = canvas.current.getContext("2d");
    }
    if (!ctx) ctx = context.current;
    if (config) {
      ctx.strokeStyle = config.color;
      ctx.lineWidth = config.stroke;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    return ctx;
  };

  const getPoints = (e, ctx) => {
    const { e: dx, f: dy } = ctx.getTransform();
    const rect = canvas.current.getBoundingClientRect();
    return [e.clientX - rect.x - dx, e.clientY - rect.y - dy];
  };

  //   const drawRect = (path, ctx) => {
  //     ctx.beginPath();
  //     ctx.rect(
  //       path[0][0],
  //       path[0][1],
  //       path[1][0] - path[0][0],
  //       path[1][1] - path[0][1]
  //     );
  //     ctx.stroke();
  //   };

  //   const previewCircle = (path, ctx) => {
  //     if (path.length < 2) return;
  //     drawCanvas(ctx);
  //     getContext(settings.current, ctx); // reset context
  //     drawCircle(path, ctx);
  //   };

  //   const getDistance = ([[p1X, p1Y], [p2X, p2Y]]) => {
  //     return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2));
  //   };

  //   const drawCircle = (path, ctx) => {
  //     ctx.beginPath();
  //     ctx.arc(path[0][0], path[0][1], getDistance(path), 0, 2 * Math.PI);
  //     ctx.stroke();
  //   };

  const previewPen = (point, ctx) => {
    if (lastPath.length === 0) {
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
    }
    ctx.lineTo(point[0], point[1]);
    ctx.stroke();
    lastPath.push(point);
  };

  const drawPen = (points, ctx) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const p of points) {
      ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
  };

  const clearCanvas = (ctx) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, PAN_LIMIT_WIDTH, PAN_LIMIT_HEIGHT);
    ctx.restore();
  };

  const drawCanvas = (ctx) => {
    clearCanvas(ctx);
    for (const item of history.current) {
      getContext(item, ctx);
      drawModes(item.mode, ctx, null, item.path);
    }
  };

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointermove", onPointerMove);
    getContext().setTransform(
      1,
      0,
      0,
      1,
      -(PAN_LIMIT_WIDTH - width) / 2,
      -(PAN_LIMIT_HEIGHT - height) / 2
    );
    drawCanvas(getContext());
    updatePreview();
    return () => {
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointermove", onPointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <PageLayout>
      <div className="content-layout">
        <div className="relative">
          <PaintHeader
            showModal={showModal}
            setShowModal={setShowModal}
            undoCanvas={undoCanvas}
            redoCanvas={redoCanvas}
          />
          <PaintBody
            showModal={showModal}
            setShowModal={setShowModal}
            settings={settings}
            canvas={canvas}
            width={width}
            height={height}
            onPointerDown={onPointerDown}
            setSelBrush={setSelBrush}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default PaintPage;
