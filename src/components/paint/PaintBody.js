import React from "react";
import { MODES } from "../../constants";
import BrushSettings from "./BrushSettings";

const PaintBody = ({
  showModal,
  settings,
  width,
  height,
  onPointerDown,
  canvas,
}) => {
  return (
    <div className="h-full w-full paint-board bg-white">
      {showModal ? <BrushSettings /> : ""}
      <canvas
        ref={canvas}
        width={width}
        height={height}
        onPointerDown={onPointerDown}
        className={settings.current.mode === MODES.PAN ? "moving" : "drawing"}
      />
    </div>
  );
};

export default PaintBody;
