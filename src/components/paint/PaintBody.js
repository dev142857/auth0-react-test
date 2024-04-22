import React from "react";
import { MODES } from "../../constants";
import BrushSettings from "./BrushSettings";

const PaintBody = ({
  showModal,
  setShowModal,
  settings,
  width,
  height,
  onPointerDown,
  canvas,
  setSelBrush,
}) => {
  return (
    <div className="h-full w-full paint-board bg-white">
      {showModal ? (
        <BrushSettings setSelBrush={setSelBrush} setShowModal={setShowModal} />
      ) : (
        ""
      )}
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
