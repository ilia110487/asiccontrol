import React, { useEffect, useRef } from "react";

const CanvasAsic = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 200;

        // ASIC Animation
        const asic = {
            x: 50,
            y: 50,
            width: 300,
            height: 100,
            color: "#00d4ff",
            speed: 2,
        };

        const drawAsic = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.strokeRect(asic.x, asic.y, asic.width, asic.height);

            ctx.beginPath();
            ctx.moveTo(asic.x, asic.y);
            ctx.lineTo(asic.x + asic.width, asic.y + asic.height);
            ctx.strokeStyle = asic.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const animate = () => {
            drawAsic();
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                margin: "20px auto",
            }}
        />
    );
};

export default CanvasAsic;
