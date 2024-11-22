import React, { useEffect, useRef } from "react";

const CanvasBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let particles = [];

        // Устанавливаем размеры Canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Создаем точки
        function createParticles() {
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() * 0.5 - 0.25,
                    vy: Math.random() * 0.5 - 0.25,
                    radius: Math.random() * 3 + 1,
                });
            }
        }

        // Рисуем точки и линии
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                // Рисуем точку
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#00d4ff";
                ctx.fill();

                // Рисуем линии между точками
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distance = Math.sqrt(
                        (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2
                    );
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = "rgba(0, 212, 255, 0.1)";
                        ctx.stroke();
                    }
                }

                // Обновляем позиции
                p.x += p.vx;
                p.y += p.vy;

                if (p.x > canvas.width || p.x < 0) p.vx *= -1;
                if (p.y > canvas.height || p.y < 0) p.vy *= -1;
            });

            requestAnimationFrame(drawParticles);
        }

        // Запускаем анимацию
        createParticles();
        drawParticles();

        // Обновление размеров Canvas при изменении размера окна
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        // Удаляем обработчики при размонтировании
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
            }}
        />
    );
};

export default CanvasBackground;
