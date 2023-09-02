import React, { useEffect, useRef, useState } from "react";

import { ReactComponent as BackArrow } from "../../../../resources/icons/arrow-back.svg";
import { ReactComponent as Erasor } from "../../../../resources/icons/erasor.svg";

import "./lessonBoard.scss";
import WhiteBoard from "./WhiteBoard";

const COLORS = ["#333333", "#4AA979", "#EB5757", "#BB6BD9"];
const LINE_WIDTHS = [2, 4, 6];

interface props {
  onClose: () => void;
  show: boolean
}

const LessonBoard: React.FC<props> = ({ onClose, show}) => {
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const previousLineColor = useRef("#333333");
  const previousLineWidth = useRef(3);

  const [erasing, setErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [lineColor, setLineColor] = useState("#333333");

  useEffect(() => {
    if (erasing && lineWidth !== 10) {
      previousLineWidth.current = lineWidth;
      previousLineColor.current = lineColor;
      setLineWidth(10);
      setLineColor("#ffffff");
    } else if (!erasing && lineWidth === 10) {
      setLineWidth(previousLineWidth.current);
      setLineColor(previousLineColor.current);
    }
  }, [erasing, lineColor, lineWidth]);

  useEffect(() => {
    document.onmousemove = (ev: MouseEvent) => {
      if (!pointerRef.current) return;

      pointerRef.current.style.top = ev.clientY - pointerRef.current.clientHeight / 2 + "px";
      pointerRef.current.style.left = ev.clientX - pointerRef.current.clientWidth / 2 + "px";
    };
  }, []);

  return (
    <div id="lesson-board" className={show ? "show" : ""}>
      <div
        ref={pointerRef}
        id="pointer"
        className={erasing ? "erasing" : ""}
        style={{
          width: `${lineWidth * 1.5}px`,
          height: `${lineWidth * 1.5}px`,
          backgroundColor: lineColor,
        }}
      ></div>
      <button id="btn-close-board" className="tertiary-button" onClick={onClose}>
        <BackArrow />
        <span>Fechar</span>
      </button>
      {<WhiteBoard strokeColor={lineColor} lineWidth={lineWidth} erase={erasing} />}
      <div id="options">
        <div className="shadowed-element">
          <button id="btn-erasor" onClick={() => setErasing(!erasing)}>
            <Erasor />
          </button>
          {LINE_WIDTHS.map((width, i) => (
            <button
              key={i}
              className="stroke-width-option"
              style={{
                width: `${width * 5}px`,
                height: `${width * 5}px`,
                backgroundColor: !erasing ? lineColor : previousLineColor.current,
              }}
              onClick={() => {
                if (erasing) {
                  setErasing(false);
                  previousLineWidth.current = width;
                } else {
                  setLineWidth(width);
                }
              }}
            ></button>
          ))}
          <div id="separator"></div>
          {COLORS.map((color, i) => (
            <button
              key={i}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => {
                if (erasing) {
                  previousLineColor.current = color;
                  setErasing(false);
                } else {
                  setLineColor(color);
                }
              }}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonBoard;
