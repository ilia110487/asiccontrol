import React, { useEffect, useRef } from "react";

const CanvasAsic = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 300;

        const drawASIC = () => {
            // Фон майнера
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(50, 50, 300, 200);

            // Вентиляторы
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.arc(100 + i * 200, 150, 30, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fill();
                ctx.closePath();
            }

            // Линии охлаждения
            ctx.strokeStyle = "#00ffc3";
            ctx.lineWidth = 2;
            for (let i = 60; i < 340; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 50);
                ctx.lineTo(i, 250);
                ctx.stroke();
            }
        };

        drawASIC();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                margin: "20px auto",
                display: "block",
            }}
        />
    );
};

export default CanvasAsic;
