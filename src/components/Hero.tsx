import { Link } from 'react-router-dom';
import { BookOpen, Crown } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export default function Hero() {
  return (
    <section className="relative pt-16 lg:pt-24 pb-20 lg:pb-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-[#D4AF37]/8 blur-[120px] animate-float" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full bg-[#EAD7C3]/30 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-nude text-[11px] font-medium tracking-[0.2em] uppercase text-[#8A8079] mb-8 animate-fade-in">
          <Crown className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
          El diario de Patricia Abar
        </div>

        <h1 className="font-serif font-extrabold text-[12vw] sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight text-[#3D3833] animate-fade-up">
          De Fragmentada
          <br />
          <span className="italic gold-text">a Soberana</span>
        </h1>

        <p className="mt-8 max-w-2xl mx-auto text-base lg:text-lg text-[#5C544D] leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.1s' }}>
          El diario íntimo y el sistema para reconstruirte como mujer entera: tu mente,
          tu cuerpo, tu hogar, tus finanzas y tu propósito — todo en sinergia. Deja de
          fragmentarte y vive en tu Soberanía.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <a
            href="#diario-feed"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#3D3833] font-semibold text-sm tracking-wide gold-glow hover:bg-[#5C544D] transition-all"
            style={{ color: '#EFECE6' }}
          >
            <BookOpen className="w-4.5 h-4.5" strokeWidth={1.75} />
            Leer el Diario de Hoy
          </a>
          <Link
            to="/manifiesto"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full border border-gold text-[#3D3833] font-semibold text-sm tracking-wide hover:bg-gold/10 hover:border-gold transition-all"
          >
            <Crown className="w-4.5 h-4.5 text-gold" strokeWidth={1.5} />
            Conocer el Programa
          </Link>
        </div>

        <div className="mt-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079] mb-6">
            ¿Qué encontrarás aquí?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {CATEGORIES.map((pillar) => (
              <div
                key={pillar.id}
                className="group glass-card rounded-2xl px-4 py-5 lg:py-6 text-center hover:gold-glow transition-all duration-500 cursor-default"
              >
                <div
                  className="w-11 h-11 lg:w-12 lg:h-12 rounded-full grid place-items-center mx-auto mb-3 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `${pillar.accent}15`, border: `1px solid ${pillar.accent}40` }}
                >
                  <span className="text-xl lg:text-2xl">{pillar.emoji}</span>
                </div>
                <p className="font-serif text-[13px] lg:text-sm font-semibold text-[#3D3833] leading-tight">
                  {pillar.label}
                </p>
                <p className="mt-1 text-[10px] lg:text-[11px] text-[#8A8079] leading-snug">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="kintsugi-divider mt-16 max-w-xs mx-auto" />
      </div>
    </section>
  );
}
