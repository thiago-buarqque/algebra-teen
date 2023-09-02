//@ts-nocheck
import React, { useEffect, useRef } from "react";

interface props {
  strokeColor: string;
  lineWidth: number;
  erase: boolean;
}
const WhiteBoard: React.FC<props> = ({ erase, lineWidth, strokeColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // // Fill Window Width and Height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set Background Color
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // // Fill Window Width and Height
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // Set Background Color
    // ctx.fillStyle = "#fff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mouse Event Handlers
    if (canvas) {
      let isDown = false;
      let canvasX, canvasY;
      ctx.lineWidth = lineWidth;

      canvas.onmousedown = function (e) {
        isDown = true;
        ctx.beginPath();
        canvasX = e.pageX - canvas.offsetLeft;
        canvasY = e.pageY - canvas.offsetTop;
        ctx.moveTo(canvasX, canvasY);
      };
      canvas.onmousemove = function (e) {
        if (isDown !== false) {
          canvasX = e.pageX - canvas.offsetLeft;
          canvasY = e.pageY - canvas.offsetTop;
          ctx.lineTo(canvasX, canvasY);
          ctx.strokeStyle = erase ? "#fff" : strokeColor;
          ctx.stroke();
        }
      };
      canvas.onmouseup = function (e) {
        isDown = false;
        ctx.closePath();
      };
    }

    // Touch Events Handlers
    let draw = {
      started: false,
      start: function (evt) {
        ctx.beginPath();
        ctx.moveTo(evt.touches[0].pageX, evt.touches[0].pageY);

        this.started = true;
      },
      move: function (evt) {
        if (this.started) {
          ctx.lineTo(evt.touches[0].pageX, evt.touches[0].pageY);

          ctx.strokeStyle = erase ? "#fff" : strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      },
      end: function (evt) {
        this.started = false;
      },
    };

    // Touch Events
    canvas.addEventListener("touchstart", draw.start, false);
    canvas.addEventListener("touchend", draw.end, false);
    canvas.addEventListener("touchmove", draw.move, false);

    // Disable Page Move
    document.body.addEventListener(
      "touchmove",
      function (evt) {
        evt.preventDefault();
      },
      false
    );
  }, [erase, lineWidth, strokeColor]);

  return (
    <canvas ref={canvasRef} id="whiteboard-canvas">
      Sorry, your browser does not support HTML5 canvas technology.
    </canvas>
  );
};

export default WhiteBoard;
