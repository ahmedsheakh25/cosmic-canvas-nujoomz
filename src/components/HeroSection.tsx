
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars: Array<{ x: number; y: number; size: number; opacity: number; speed: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.5
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 245, 165, ${star.opacity})`;
        ctx.fill();
        
        // Animate stars
        star.opacity += star.speed * 0.02;
        if (star.opacity > 1 || star.opacity < 0) {
          star.speed *= -1;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartWithNujmooz = () => {
    navigate('/nujmooz');
  };

  const handleModernNujmooz = () => {
    navigate('/modern-nujmooz');
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)' }}
      />
      
      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 border border-[#7EF5A5]/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute w-64 h-64 border border-[#4AE374]/30 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
        <div className="absolute w-32 h-32 border border-[#7EF5A5]/40 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent animate-fade-in">
            We Think Out of the Space
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            A creative studio crafting cosmic brand identities, no-code websites, and interactive experiences
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <button 
            onClick={handleModernNujmooz}
            className="group bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300 flex items-center space-x-2"
          >
            <span>ابدأ مع نجموز الحديث</span>
            <span className="text-lg">✨</span>
          </button>
          
          <button 
            onClick={handleStartWithNujmooz}
            className="group border-2 border-[#7EF5A5] text-[#7EF5A5] px-8 py-4 rounded-full font-semibold hover:bg-[#7EF5A5] hover:text-black transition-all duration-300 flex items-center space-x-2"
          >
            <span>Start with Nujoomz</span>
            <span className="text-lg">🚀</span>
          </button>
          
          <button 
            onClick={scrollToServices}
            className="group border border-white/30 text-white/80 px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center space-x-2"
          >
            <span>Explore Our Universe</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-16 text-sm text-white/60 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <p>↓ Scroll to begin your cosmic journey</p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-2 h-2 bg-[#7EF5A5] rounded-full absolute top-20 left-20 animate-pulse" />
        <div className="w-1 h-1 bg-[#4AE374] rounded-full absolute top-40 right-32 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="w-3 h-3 bg-[#7EF5A5]/60 rounded-full absolute bottom-32 left-40 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="w-1 h-1 bg-white rounded-full absolute bottom-20 right-20 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </section>
  );
};

export default HeroSection;
