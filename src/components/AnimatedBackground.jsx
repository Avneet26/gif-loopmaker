import { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

function AnimatedBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let targetX = mouseX;
        let targetY = mouseY;

        const handleMouseMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const getThemeColors = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            return {
                gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                dotColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
            };
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // smooth mouse follow
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            const { gridColor, dotColor } = getThemeColors();
            const gridSize = 80;
            const offsetX = (mouseX / canvas.width - 0.5) * -30;
            const offsetY = (mouseY / canvas.height - 0.5) * -30;

            const startX = (offsetX % gridSize) - gridSize;
            const startY = (offsetY % gridSize) - gridSize;

            // Create radial gradients for spotlight effect
            const lineGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 800);
            lineGradient.addColorStop(0, gridColor);
            lineGradient.addColorStop(1, 'transparent');

            const pointGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 800);
            pointGradient.addColorStop(0, dotColor);
            pointGradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            for (let x = startX; x < canvas.width + gridSize; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            for (let y = startY; y < canvas.height + gridSize; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }
            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 1;
            ctx.stroke();

            // dots at intersections
            ctx.fillStyle = pointGradient;
            for (let x = startX; x < canvas.width + gridSize; x += gridSize) {
                for (let y = startY; y < canvas.height + gridSize; y += gridSize) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="animated-background" />;
}

export default AnimatedBackground;
