import React, { useRef, useEffect } from "react";
import { useMotionValueEvent } from "framer-motion";

export default function ParticleLogo({ scrollProgress }) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const scrollRef = useRef(0);

    useMotionValueEvent(scrollProgress, "change", (latest) => {
        scrollRef.current = latest;
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext("2d");

            tempCtx.fillStyle = "white";
            const fontSize = Math.min(canvas.width / 4, 250);
            tempCtx.font = `bold ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            tempCtx.textAlign = "center";
            tempCtx.textBaseline = "middle";
            tempCtx.fillText("Esillio", canvas.width / 2, canvas.height / 2);

            const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
            const step = 6; // Density of particles
            
            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    const alpha = imageData[((y * canvas.width + x) * 4) + 3];
                    if (alpha > 128) {
                        particlesRef.current.push({
                            x: x,
                            y: y,
                            originX: x,
                            originY: y,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15,
                            size: Math.random() * 2 + 1.5,
                            baseAlpha: Math.random() * 0.5 + 0.5,
                            angle: Math.random() * Math.PI * 2,
                            rotSpeed: (Math.random() - 0.5) * 0.1
                        });
                    }
                }
            }
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        let animationFrameId;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const scroll = scrollRef.current;
            // Map scroll 0.3 -> 0.7 to explosion progress 0 -> 1 (Finishes fading before un-sticking)
            const explosionProgress = Math.min(1, Math.max(0, (scroll - 0.2) / 0.5));
            
            // Fades out completely by the time explosion progress hits 1
            const globalFade = 1 - explosionProgress;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            particlesRef.current.forEach(p => {
                p.angle += p.rotSpeed; // Rotate the diamond continuously

                const floatX = Math.sin(Date.now() * 0.001 + p.angle) * 3 * (1 - explosionProgress);
                const floatY = Math.cos(Date.now() * 0.001 + p.angle) * 3 * (1 - explosionProgress);
                
                const dx = p.originX - centerX;
                const dy = p.originY - centerY;
                
                const spiralAngle = explosionProgress * Math.PI * 1.5;
                const cosA = Math.cos(spiralAngle);
                const sinA = Math.sin(spiralAngle);
                
                const rx = dx * cosA - dy * sinA;
                const ry = dx * sinA + dy * cosA;

                const randomExplodeX = p.vx * explosionProgress * 150;
                const randomExplodeY = p.vy * explosionProgress * 150;
                
                const currentX = p.originX + floatX + (rx * explosionProgress * 5) + randomExplodeX;
                const currentY = p.originY + floatY + (ry * explosionProgress * 5) + randomExplodeY;
                
                const opacity = p.baseAlpha * globalFade;
                
                if (opacity > 0.01) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.beginPath();
                    
                    // Draw a diamond instead of a circle
                    const size = p.size * (1 + explosionProgress * 3);
                    
                    // Apply individual rotation to the diamond
                    const cosR = Math.cos(p.angle);
                    const sinR = Math.sin(p.angle);
                    
                    // Diamond vertices relative to center
                    const pts = [
                        { x: 0, y: -size },
                        { x: size * 0.6, y: 0 },
                        { x: 0, y: size },
                        { x: -size * 0.6, y: 0 }
                    ];

                    ctx.moveTo(
                        currentX + pts[0].x * cosR - pts[0].y * sinR,
                        currentY + pts[0].x * sinR + pts[0].y * cosR
                    );
                    for (let i = 1; i < 4; i++) {
                        ctx.lineTo(
                            currentX + pts[i].x * cosR - pts[i].y * sinR,
                            currentY + pts[i].x * sinR + pts[i].y * cosR
                        );
                    }
                    ctx.closePath();

                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "rgba(200, 230, 255, 0.8)";
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", setCanvasSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />;
}
