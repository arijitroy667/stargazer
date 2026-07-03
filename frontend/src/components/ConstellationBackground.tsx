
import React, { useEffect, useRef } from 'react';

export const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Enhanced stars array with parallax layers
    const backgroundStars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      angle: number;
      layer: number;
      twinkleOffset: number;
    }> = [];

    const foregroundStars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      angle: number;
      glowIntensity: number;
      twinkleOffset: number;
    }> = [];

    // Create background stars (parallax layer)
    for (let i = 0; i < 80; i++) {
      backgroundStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.2 + 0.05,
        angle: Math.random() * Math.PI * 2,
        layer: 0.3,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Create foreground stars (main layer)
    for (let i = 0; i < 70; i++) {
      foregroundStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.4 + 0.1,
        angle: Math.random() * Math.PI * 2,
        glowIntensity: Math.random() * 20 + 10,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw background stars (no hover effects)
      backgroundStars.forEach((star, index) => {
        // Update position with random movement
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Wrap around screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Enhanced twinkling
        const twinkle = Math.sin(time * 2 + star.twinkleOffset) * 0.3 + 0.7;
        star.opacity = twinkle * 0.4;

        // Draw star
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw foreground stars with enhanced effects (no hover effects)
      foregroundStars.forEach((star, index) => {
        // Update position with random movement
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Wrap around screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Enhanced twinkling with color shifts
        const twinkle = Math.sin(time * 1.5 + star.twinkleOffset) * 0.4 + 0.6;
        star.opacity = twinkle;

        // Color variation for different star types
        const starColors = ['#ffffff', '#ffd700', '#87ceeb', '#ff69b4'];
        const colorIndex = index % starColors.length;

        // Draw star with glow
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = starColors[colorIndex];
        ctx.shadowBlur = star.glowIntensity * twinkle;
        ctx.shadowColor = starColors[colorIndex];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections between nearby stars with enhanced visuals
        foregroundStars.forEach((otherStar, otherIndex) => {
          if (index !== otherIndex && Math.abs(index - otherIndex) < 10) {
            const distance = Math.sqrt(
              Math.pow(star.x - otherStar.x, 2) + 
              Math.pow(star.y - otherStar.y, 2)
            );

            if (distance < 120) {
              ctx.save();
              const alpha = (120 - distance) / 120 * 0.15 * twinkle;
              ctx.globalAlpha = alpha;
              
              // Gradient line
              const gradient = ctx.createLinearGradient(
                star.x, star.y, 
                otherStar.x, otherStar.y
              );
              gradient.addColorStop(0, starColors[colorIndex]);
              gradient.addColorStop(1, starColors[otherIndex % starColors.length]);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.8;
              ctx.shadowBlur = 5;
              ctx.shadowColor = '#ffffff';
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(otherStar.x, otherStar.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};
