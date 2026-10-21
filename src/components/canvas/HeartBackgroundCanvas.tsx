import React, { useEffect, useRef } from 'react';

interface HeartBackgroundCanvasProps {
  intensity?: 'subtle' | 'normal' | 'celebration' | 'glitch' | 'rose_petals';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  isHeart: boolean;
  angle: number;
  spin: number;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
}

export const HeartBackgroundCanvas: React.FC<HeartBackgroundCanvasProps> = ({
  intensity = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#e11d48', '#ff2d75', '#f43f5e', '#f5c7b8', '#9f1239'];

    const particleCount =
      intensity === 'subtle'
        ? 28
        : intensity === 'celebration'
        ? 90
        : 45;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.2 - Math.random() * 0.55,
        size: 1.5 + Math.random() * 3,
        alpha: 0.15 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart: Math.random() > 0.65,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
      });
    }

    const petals: Petal[] = [];
    const petalCount = intensity === 'rose_petals' || intensity === 'celebration' ? 22 : 6;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6 + 0.3,
        vy: 0.5 + Math.random() * 0.8,
        size: 8 + Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 0.25 + Math.random() * 0.4,
      });
    }

    // Helper to draw miniature SVG-like heart
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number,
      angle: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      // top left curve
      context.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight, 0, size);
      // top right curve
      context.bezierCurveTo(size, topCurveHeight, size / 2, -topCurveHeight, 0, topCurveHeight);
      context.closePath();
      context.fill();
      context.restore();
    };

    // Helper to draw soft rose petal
    const drawPetal = (
      context: CanvasRenderingContext2D,
      petal: Petal
    ) => {
      context.save();
      context.translate(petal.x, petal.y);
      context.rotate(petal.rotation);
      context.globalAlpha = petal.alpha;
      const grad = context.createLinearGradient(-petal.size, -petal.size, petal.size, petal.size);
      grad.addColorStop(0, '#e11d48');
      grad.addColorStop(0.6, '#f43f5e');
      grad.addColorStop(1, '#f5c7b8');
      context.fillStyle = grad;

      context.beginPath();
      context.moveTo(0, -petal.size);
      context.quadraticCurveTo(petal.size * 0.8, -petal.size * 0.3, petal.size * 0.5, petal.size);
      context.quadraticCurveTo(0, petal.size * 0.8, -petal.size * 0.5, petal.size);
      context.quadraticCurveTo(-petal.size * 0.8, -petal.size * 0.3, 0, -petal.size);
      context.closePath();
      context.fill();
      context.restore();
    };

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric deep vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, 'rgba(44, 8, 22, 0.22)');
      bgGrad.addColorStop(0.5, 'rgba(15, 6, 12, 0.45)');
      bgGrad.addColorStop(1, 'rgba(5, 5, 7, 0.9)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Connect particles with thin neural lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 95;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.14;
            ctx.strokeStyle = `rgba(255, 45, 117, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & render particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        // Wrap around bounds
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        if (p.isHeart) {
          drawHeart(ctx, p.x, p.y, p.size * 3, p.color, p.alpha, p.angle);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render drifting rose petals
      for (const petal of petals) {
        petal.x += petal.vx;
        petal.y += petal.vy;
        petal.rotation += petal.rotSpeed;

        if (petal.y > height + 30) {
          petal.y = -20;
          petal.x = Math.random() * width;
        }
        if (petal.x > width + 20) petal.x = -10;

        drawPetal(ctx, petal);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  );
};
