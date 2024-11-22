useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const particles = [];
    const particleCount = 100;

    // Установка размеров Canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Функция для изменения размеров Canvas при изменении окна
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Класс частицы
    class Particle {
        constructor(x, y, dx, dy, radius) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
        }

        draw() {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fillStyle = "white";
            context.fill();
            context.closePath();
        }

        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    // Создание массива частиц
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        particles.push(new Particle(x, y, dx, dy, radius));
    }

    // Анимация
    const animate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            particle.update();

            // Линии между близкими частицами
            for (let j = index + 1; j < particles.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(particle.x - particles[j].x, 2) +
                    Math.pow(particle.y - particles[j].y, 2)
                );
                if (distance < 100) {
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(particles[j].x, particles[j].y);
                    context.strokeStyle = "rgba(255, 255, 255, 0.3)";
                    context.lineWidth = 0.5;
                    context.stroke();
                    context.closePath();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, []);
