import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import type { DiaryCategory } from '@/lib/supabase';

const PILLAR_DETAILS: Record<DiaryCategory, { tagline: string; description: string }> = {
  cuerpo: { tagline: 'Mi primer territorio', description: 'Gimnasio, alimentación, descanso y temple físico. El cuerpo es la base de toda soberanía.' },
  mente: { tagline: 'Mi brújula interior', description: 'Meditación, enfoque espiritual, gestión de la ansiedad y dominio del Síndrome del Casi.' },
  madre: { tagline: 'Criar mientras construyo', description: 'Crianza consciente, caos real, balance y el amor como motor del legado.' },
  finanzas: { tagline: 'Mi orden y libertad', description: 'Control económico, automatización, inversión y la disciplina que compra tiempo.' },
  mujer: { tagline: 'La identidad que las abarca a todas', description: 'Crisis de los 40, identidad, intimidad y la reconstrucción como mujer entera.' },
};

export default function ElSistema() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079]">El Sistema · 5 Pilares</span>
          <h1 className="mt-4 font-serif font-extrabold text-4xl lg:text-6xl text-[#3D3833] tracking-tight leading-[0.98]">
            La sinergia de los <span className="italic gold-text">cinco pilares</span>
          </h1>
          <p className="mt-6 text-base text-[#5C544D] leading-relaxed font-light max-w-2xl mx-auto">
            Ningún pilar sostiene solo. Tu cuerpo sin mente es maquinaria. Tu mente sin finanzas es ansiedad. Tus finanzas sin maternidad son soledad. La soberanía nace cuando los cinco trabajan en sinergia.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="kintsugi-divider flex-1 max-w-[120px]" />
          <div className="kintsugi-divider flex-1 max-w-[120px]" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {CATEGORIES.map((pillar, i) => {
            const detail = PILLAR_DETAILS[pillar.id];
            return (
              <Link key={pillar.id} to={`/?cat=${pillar.id}#diario-feed`} className="group glass-card rounded-3xl p-7 lg:p-8 hover:gold-glow transition-all duration-500 animate-fade-up flex flex-col" style={{ animationDelay: `${0.05 * (i + 1)}s` }}>
                <div className="w-14 h-14 rounded-full grid place-items-center mb-5 transition-transform duration-500 group-hover:scale-110" style={{ background: `${pillar.accent}15`, border: `1px solid ${pillar.accent}40` }}>
                  <span className="text-2xl">{pillar.emoji}</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#3D3833] leading-tight">{pillar.label}</h3>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.15em] text-gold">{detail.tagline}</p>
                <p className="mt-4 text-sm text-[#5C544D] leading-relaxed font-light flex-1">{detail.description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-gold group-hover:gap-2.5 transition-all">
                  Ver entradas del diario
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                </span>
              </Link>
            );
          })}

          <Link to="/manifiesto" className="group glass-card rounded-3xl p-7 lg:p-8 hover:gold-glow transition-all duration-500 animate-fade-up flex flex-col justify-center items-center text-center" style={{ animationDelay: '0.3s' }}>
            <div className="kintsugi-divider w-16 mb-5" />
            <h3 className="font-serif font-bold text-xl text-[#3D3833] leading-tight">Conocer a Patricia</h3>
            <p className="mt-4 text-sm text-[#5C544D] leading-relaxed font-light">La historia detrás del sistema y la mujer que lo construye cada día.</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-gold group-hover:gap-2.5 transition-all">
              Leer el manifiesto
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
