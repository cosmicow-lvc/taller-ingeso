import { useEffect, useRef } from 'react';

export default function StaticParticles({ variant = 'default' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = Math.random() * 0.15 + 0.08;
        this.speedX = Math.random() * 0.08 - 0.04;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.008 - 0.004;
        this.wobble = Math.random() * 0.8 + 0.3;
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
        // Color based on variant
        let color;
        if (variant === 'hero') {
          color = `rgba(139, 92, 246, ${this.opacity})`; // More purple
        } else if (variant === 'productos') {
          color = `rgba(96, 165, 250, ${this.opacity})`; // More blue
        } else {
          color = `rgba(168, 85, 247, ${this.opacity})`;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 1.8
        );
        
        if (variant === 'hero') {
          gradient.addColorStop(0, `rgba(139, 92, 246, ${this.opacity * 0.25})`);
        } else if (variant === 'productos') {
          gradient.addColorStop(0, `rgba(96, 165, 250, ${this.opacity * 0.25})`);
        } else {
          gradient.addColorStop(0, `rgba(168, 85, 247, ${this.opacity * 0.25})`);
        }
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Dust particle
    class Dust {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1 + 0.3;
        this.speedY = Math.random() * 0.08 + 0.02;
        this.speedX = Math.random() * 0.05 - 0.025;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.twinkle = Math.random() * 0.015;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.twinkleOffset += this.twinkle;

        if (this.y < -5 || this.x < -5 || this.x > canvas.width + 5) {
          this.y = canvas.height + 5;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        const twinkleOpacity = this.opacity * (0.6 + Math.sin(this.twinkleOffset) * 0.4);
        
        let color;
        if (variant === 'hero') {
          color = `rgba(180, 160, 255, ${twinkleOpacity})`;
        } else if (variant === 'productos') {
          color = `rgba(160, 200, 255, ${twinkleOpacity})`;
        } else {
          color = `rgba(200, 180, 255, ${twinkleOpacity})`;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 25000) + 3;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const dustCount = Math.floor((canvas.width * canvas.height) / 12000) + 5;
    for (let i = 0; i < dustCount; i++) {
      particles.push(new Dust());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
