import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PaintHeader = ({
  setShowModal,
  showModal,
  undoCanvas,
  redoCanvas,
}) => {
  const handleModal = () => {
    setShowModal(!showModal);
    console.log(showModal);
  };
  return (
    <div className="w-full flex justify-between border">
      <div className="paint-header-icon m-2">HOME</div>
      <div className="paint-header-icon m-2">SAVE</div>
      <div className="paint-header-icon m-2">
        <button onClick={handleModal}>Brush</button>
      </div>
      <div className="paint-header-icon m-2">Size</div>
      <div className="paint-header-icon m-2">
        <button onClick={undoCanvas}>Undo</button>
      </div>
      <div className="paint-header-icon m-2">
        <button onClick={redoCanvas}>Redo</button>
      </div>
      <div className="paint-header-icon m-2">Record</div>
      <div className="paint-header-icon m-2">Color History</div>
    </div>
  );
};
