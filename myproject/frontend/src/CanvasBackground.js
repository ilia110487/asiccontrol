import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const CanvasBackground = () => {
    const canvasRef = useRef(null);
    const location = useLocation(); // Определяем текущий путь

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Устанавливаем размеры Canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 150;
        const maxDistance = location.pathname === "/dashboard" ? 100 : 120; // Меняем параметры для Dashboard
        const particleSpeed = location.pathname === "/dashboard" ? 0.5 : 1; // Более медленная анимация на Dashboard

        // Класс для частиц
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * particleSpeed;
                this.vy = (Math.random() - 0.5) * particleSpeed;
                this.size = Math.random() * 2 + 1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle =
                    location.pathname === "/dashboard"
                        ? "rgba(200, 200, 200, 0.6)" // Светлее и более прозрачные частицы
                        : "rgba(255, 255, 255, 0.8)";
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Отражение от краёв
                if (this.x > canvas.width || this.x < 0) this.vx *= -1;
                if (this.y > canvas.height || this.y < 0) this.vy *= -1;

                this.draw();
            }
        }

        // Создаём массив частиц
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Рисуем линии между частицами
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${
                            location.pathname === "/dashboard"
                                ? 0.3 // Линии более прозрачные в Dashboard
                                : 0.5
                        })`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        // Анимация
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => particle.update());
            drawLines();

            requestAnimationFrame(animate);
        };

        animate();

        // Обновление размеров Canvas при изменении окна
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [location.pathname]); // Анимация изменяется при изменении маршрута

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
            }}
        />
    );
};

export default CanvasBackground;
