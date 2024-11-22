import React, { useEffect, useRef } from "react";

const CanvasBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 150; // Увеличиваем количество частиц

        // Класс частицы
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random();
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 200, ${this.opacity})`;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Отражение от краёв экрана
                if (this.x > canvas.width || this.x < 0) this.vx *= -1;
                if (this.y > canvas.height || this.y < 0) this.vy *= -1;

                this.draw();
            }
        }

        // Создаём массив частиц
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Рисуем линии между точками
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) { // Увеличиваем расстояние для соединения
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 120})`; // Линии плавно исчезают с увеличением расстояния
                        ctx.lineWidth = 0.5; // Тонкие линии
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => particle.update());
            drawLines();

            requestAnimationFrame(animate);
        };

        animate();

        // Обновляем размеры Canvas при изменении окна
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

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
                width: "100vw",
                height: "100vh",
            }}
        />
    );
};

export default CanvasBackground;
