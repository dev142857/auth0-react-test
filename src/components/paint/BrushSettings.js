import React from "react";

const BrushSettings = ({ setSelBrush, setShowModal, setCurLineWidth }) => {
  const selectBrush = (brushNum) => {
    setSelBrush(brushNum);
    setShowModal(false);
    setCurLineWidth(brushNum);
    switch (brushNum) {
      case 1:
        setCurLineWidth(2);
        break;
      case 2:
        setCurLineWidth(10);
        break;
      case 3:
        setCurLineWidth(10);
        break;
      case 4:
        setCurLineWidth(2);
        break;
      default:
        setCurLineWidth(2);
    }
  };
  return (
    <div className="w-full flex justify-center absolute z-100">
      <div className="w-4/5 bg-amber-700 px-40 py-3">
        <div className="w-full button-group flex justify-between ">
          <button onClick={() => selectBrush(1)}>PEN</button>
          <br />
          <button onClick={() => selectBrush(2)}>BRUSH</button>
          <br />
          <button onClick={() => selectBrush(3)}>SHADOW</button>
          <br />
          <button onClick={() => selectBrush(4)}>SHAPE</button>
        </div>
        <br />
        <div className="">Input Size</div>
      </div>
    </div>
  );
};

export default BrushSettings;
