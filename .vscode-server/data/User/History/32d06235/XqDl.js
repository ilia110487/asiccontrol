import React from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';

const ParticlesBackground = () => {
    const particlesInit = async (main) => {
        await loadFull(main); // Загружаем основной функционал tsparticles
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: {
                        value: '#2c2c2c', // Цвет фона
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: 'grab',
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            links: {
                                opacity: 0.5,
                            },
                        },
                    },
                },
                particles: {
                    color: {
                        value: '#ffffff', // Цвет точек
                    },
                    links: {
                        color: '#ffffff', // Цвет линий
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        direction: 'none',
                        enable: true,
                        outModes: {
                            default: 'bounce',
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80, // Количество точек
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: 'circle',
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticlesBackground;
