import React from "react";

const BrushSettings = ({ setSelBrush, setShowModal }) => {
  const selectBrush = (brushNum) => {
    setSelBrush(brushNum);
    setShowModal(false);
  };
  return (
    <div className="absolute z-100">
      <div className="w-full bg-amber-700">
        <button onClick={() => selectBrush(1)}>PEN</button>
        <br />
        <button onClick={() => selectBrush(2)}>BRUSH</button>
        <br />
        <button onClick={() => selectBrush(3)}>SHADOW</button>
      </div>
    </div>
  );
};

export default BrushSettings;
