import React, { useEffect, useRef } from 'react';

interface DigitalHeartSculptureProps {
  isScanning?: boolean;
  scanProgress?: number; // 0 to 1
  size?: number;
  pulseSpeed?: number;
  interactive?: boolean;
  onHeartClick?: () => void;
  glitchMode?: boolean;
  grandRevealMode?: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
}

export const DigitalHeartSculpture: React.FC<DigitalHeartSculptureProps> = ({
  isScanning = false,
  scanProgress = 0,
  size = 320,
  pulseSpeed = 1,
  interactive = true,
  onHeartClick,
  glitchMode = false,
  grandRevealMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = size;
    const h = size;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Generate heart surface points using parametric heart equation
    const points: Point3D[] = [];
    const count = grandRevealMode ? 280 : 180;
    const colors = ['#ff2d75', '#f43f5e', '#e11d48', '#f5c7b8', '#ffffff'];

    for (let i = 0; i < count; i++) {
      // t is perimeter param, layer distributes inside and outside
      const t = Math.random() * Math.PI * 2;
      const layer = Math.pow(Math.random(), 0.45); // concentration toward boundary
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const zDepth = (Math.random() - 0.5) * 16 * layer;

      const scale = (w * 0.024) * layer;

      points.push({
        x: heartX * scale,
        y: heartY * scale,
        z: zDepth * scale,
        baseX: heartX * scale,
        baseY: heartY * scale,
        baseZ: zDepth * scale,
        size: 1.2 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.025 * pulseSpeed;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2 + 10;

      // Heartbeat pulse math: dual systolic pulse
      const beat = Math.sin(time * 3);
      const pulseFactor = beat > 0.4 ? 1 + Math.pow(beat, 4) * 0.12 : 1;
      const scaleMultiplier = (glitchMode ? 0.95 + (Math.random() - 0.5) * 0.1 : 1) * pulseFactor;

      // Parallax rotation from mouse
      const targetRotY = mousePosRef.current.x * 0.4;
      const targetRotX = -mousePosRef.current.y * 0.4;

      const cosY = Math.cos(targetRotY);
      const sinY = Math.sin(targetRotY);
      const cosX = Math.cos(targetRotX);
      const sinX = Math.sin(targetRotX);

      // Render outer rotating orbital rings
      const ringAngles = [time * 0.8, -time * 0.6];
      ringAngles.forEach((angle, idx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(idx === 0 ? 0.4 : -0.4);
        ctx.beginPath();
        const rx = (w * 0.44) * (idx === 0 ? 1 : 0.88);
        const ry = (h * 0.16) * (idx === 0 ? 1 : 0.82);
        ctx.ellipse(0, 0, rx, ry, angle, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? 'rgba(255, 45, 117, 0.28)' : 'rgba(245, 199, 184, 0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 8]);
        ctx.stroke();

        // Orbiting glowing photon bead
        const beadX = rx * Math.cos(angle * 2);
        const beadY = ry * Math.sin(angle * 2);
        ctx.beginPath();
        ctx.arc(beadX, beadY, 3, 0, Math.PI * 2);
        ctx.fillStyle = idx === 0 ? '#ff2d75' : '#f5c7b8';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // Internal neural connection lines between nearby points
      for (let i = 0; i < points.length; i += 2) {
        for (let j = i + 1; j < Math.min(i + 8, points.length); j++) {
          const p1 = points[i];
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 26) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 45, 117, ${0.18 * (1 - dist / 26)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(centerX + p1.x * scaleMultiplier, centerY + p1.y * scaleMultiplier);
            ctx.lineTo(centerX + p2.x * scaleMultiplier, centerY + p2.y * scaleMultiplier);
            ctx.stroke();
          }
        }
      }

      // Draw all heart constellation points
      points.forEach((p) => {
        // 3D rotation transform
        let px = p.baseX;
        let py = p.baseY;
        let pz = p.baseZ;

        if (glitchMode) {
          px += (Math.random() - 0.5) * 8;
          py += (Math.random() - 0.5) * 8;
        }

        // Rotate Y
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        const screenX = centerX + x1 * scaleMultiplier;
        const screenY = centerY + y2 * scaleMultiplier;

        // Depth projection alpha
        const depthScale = (z2 + 150) / 150;
        const finalAlpha = Math.max(0.15, Math.min(1, p.alpha * depthScale));

        ctx.save();
        ctx.globalAlpha = finalAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isScanning ? 12 : 6;

        ctx.beginPath();
        const ptRadius = Math.max(1, p.size * (isScanning ? 1.3 : 1));
        ctx.arc(screenX, screenY, ptRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Laser Scanner Beam if active
      if (isScanning) {
        const scanY = (centerY - h * 0.38) + (h * 0.76) * scanProgress;

        // Glowing horizontal line
        const grad = ctx.createLinearGradient(centerX - w * 0.45, scanY, centerX + w * 0.45, scanY);
        grad.addColorStop(0, 'rgba(255, 45, 117, 0)');
        grad.addColorStop(0.3, 'rgba(255, 45, 117, 0.85)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.7, 'rgba(255, 45, 117, 0.85)');
        grad.addColorStop(1, 'rgba(255, 45, 117, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ff2d75';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(centerX - w * 0.45, scanY);
        ctx.lineTo(centerX + w * 0.45, scanY);
        ctx.stroke();

        // Scan wave glow area
        const beamGrad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
        beamGrad.addColorStop(0, 'rgba(255, 45, 117, 0)');
        beamGrad.addColorStop(0.5, 'rgba(255, 45, 117, 0.25)');
        beamGrad.addColorStop(1, 'rgba(255, 45, 117, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(centerX - w * 0.45, scanY - 18, w * 0.9, 36);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size, pulseSpeed, isScanning, scanProgress, glitchMode, grandRevealMode]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mousePosRef.current = { x: nx, y: ny };
  };

  const handlePointerLeave = () => {
    mousePosRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none group"
      onClick={onHeartClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="transition-transform duration-300 group-hover:scale-105 active:scale-95"
      />
    </div>
  );
};
