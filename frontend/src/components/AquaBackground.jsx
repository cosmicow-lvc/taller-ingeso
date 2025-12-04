import { useEffect, useRef, useState } from 'react';
import '../styles/aqua-background.css';

export default function AquaBackground() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let glassOrbs = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 0.25 + 0.1;
        this.speedX = Math.random() * 0.15 - 0.075;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.01 - 0.005;
        this.wobble = Math.random() * 1 + 0.5;
      }

      update() {
        this.angle += this.angleSpeed;
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * this.wobble;

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `rgba(168, 85, 247, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    class DustParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.15 + 0.05;
        this.speedX = Math.random() * 0.1 - 0.05;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.twinkle = Math.random() * 0.02;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.twinkleOffset += this.twinkle;

        if (this.y < -5 || this.x < -5 || this.x > canvas.width + 5) {
          this.reset();
          this.y = canvas.height + 5;
        }
      }

      draw() {
        const twinkleOpacity = this.opacity * (0.7 + Math.sin(this.twinkleOffset) * 0.3);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${twinkleOpacity})`;
        ctx.fill();
      }
    }

    class ColorCircle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 80 + 60;
        this.drift = Math.random() * 0.2 + 0.08;
        this.driftAngle = Math.random() * Math.PI * 2;
        
        const colors = [
          { h: 280, s: 60, l: 65 },  // Purple
          { h: 200, s: 60, l: 70 },  // Cyan/Turquoise
          { h: 260, s: 50, l: 60 },  // Violet
          { h: 320, s: 55, l: 68 },  // Pink
          { h: 180, s: 65, l: 75 },  // Light cyan
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.4 + 0.3;
      }

      update() {
        this.driftAngle += 0.004;
        const driftX = Math.cos(this.driftAngle) * this.drift;
        const driftY = Math.sin(this.driftAngle) * this.drift;
        
        this.baseX += driftX;
        this.baseY += driftY;

        const margin = this.size * 2;
        if (this.baseX < -margin) {
          this.baseX = canvas.width + margin;
          this.x = this.baseX;
        }
        if (this.baseX > canvas.width + margin) {
          this.baseX = -margin;
          this.x = this.baseX;
        }
        if (this.baseY < -margin) {
          this.baseY = canvas.height + margin;
          this.y = this.baseY;
        }
        if (this.baseY > canvas.height + margin) {
          this.baseY = -margin;
          this.y = this.baseY;
        }

        const dx = mouseRef.current.x - this.baseX;
        const dy = mouseRef.current.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 180;

        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          const targetX = this.baseX - Math.cos(angle) * force * 30;
          const targetY = this.baseY - Math.sin(angle) * force * 30;
          
          const diffX = targetX - this.x;
          const diffY = targetY - this.y;
          if (Math.abs(diffX) < 200 && Math.abs(diffY) < 200) {
            this.x += diffX * 0.04;
            this.y += diffY * 0.04;
          }
        } else {
          const diffX = this.baseX - this.x;
          const diffY = this.baseY - this.y;
          if (Math.abs(diffX) < 200 && Math.abs(diffY) < 200) {
            this.x += diffX * 0.03;
            this.y += diffY * 0.03;
          } else {
            this.x = this.baseX;
            this.y = this.baseY;
          }
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${this.opacity})`);
        gradient.addColorStop(0.7, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l - 10}%, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l - 20}%, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    class GlassOrb {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 60 + 40;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.hue = Math.random() * 30 + 260; // Purple range
        this.drift = Math.random() * 0.3 + 0.1;
        this.driftAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.driftAngle += 0.005;
        this.baseX += Math.cos(this.driftAngle) * this.drift;
        this.baseY += Math.sin(this.driftAngle) * this.drift;

        if (this.baseX < -50) this.baseX = canvas.width + 50;
        if (this.baseX > canvas.width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = canvas.height + 50;
        if (this.baseY > canvas.height + 50) this.baseY = -50;

        const dx = mouseRef.current.x - this.baseX;
        const dy = mouseRef.current.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x = this.baseX - Math.cos(angle) * force * 40;
          this.y = this.baseY - Math.sin(angle) * force * 40;
        } else {
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 65%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 60%, 55%, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    let colorCircles = [];
    const circleCount = Math.floor((canvas.width * canvas.height) / 80000) + 8;
    for (let i = 0; i < circleCount; i++) {
      colorCircles.push(new ColorCircle());
    }

    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let dustParticles = [];
    const dustCount = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push(new DustParticle());
    }

    const orbCount = 12;
    for (let i = 0; i < orbCount; i++) {
      glassOrbs.push(new GlassOrb());
    }

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      colorCircles.forEach(circle => {
        circle.update();
        circle.draw();
      });

      glassOrbs.forEach(orb => {
        orb.update();
        orb.draw();
      });

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      dustParticles.forEach(dust => {
        dust.update();
        dust.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="aqua-background">
      <canvas ref={canvasRef} className="aqua-canvas" />
      <div className="aqua-overlay"></div>
    </div>
  );
}
