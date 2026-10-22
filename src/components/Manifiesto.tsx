import { Crown, Baby, TrendingUp, PenTool, Cpu } from 'lucide-react';

const FACETS = [
  { icon: Baby, title: 'Madre', text: 'Criar mientras construyo. Mi hijo es mi brújula y mi recordatorio de que el legado empieza en casa.' },
  { icon: TrendingUp, title: 'Estratega Digital', text: 'Fundadora de Abar Digital. Convierto procesos en sistemas y sistemas en libertad.' },
  { icon: PenTool, title: 'Escritora', text: 'Autora de "De Fragmentada a Soberana". La palabra es mi herramienta de reconstrucción.' },
  { icon: Cpu, title: 'Mentora', text: 'Enseño a emprendedoras a convertir su historia en un imperio digital con estructura.' },
];

export default function Manifiesto() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079]">Acerca de Mí · El Manifiesto</span>
          <h1 className="mt-4 font-serif font-extrabold text-4xl lg:text-6xl text-[#3D3833] tracking-tight leading-[0.98]">
            Soy <span className="italic gold-text">Patricia Abar</span>
          </h1>
        </div>

        <div className="glass-card rounded-3xl p-8 lg:p-12 gold-glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="kintsugi-divider mb-8 max-w-[60px]" />
          <p className="font-serif text-lg lg:text-xl text-[#3D3833] leading-[1.9] font-medium">
            Soy mamá, mentora, estratega digital en mi agencia Abar Digital. A mis 40 años,
            entendí que el éxito no sirve de nada si estás fragmentada por dentro. Tras años
            de hacerme pequeña a mí misma por miedo a Ser quien Soy, decidí fundar este
            espacio como un registro vivo de mi propia reconstrucción: pasar del caos a la
            <span className="italic gold-text"> soberanía total</span>.
          </p>
          <div className="kintsugi-divider mt-8 max-w-[60px] ml-auto" />
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {FACETS.map((f) => (
            <article key={f.title} className="glass-card rounded-2xl p-6 hover:gold-glow transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center">
                  <f.icon className="w-4.5 h-4.5 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#3D3833]">{f.title}</h3>
              </div>
              <p className="text-sm text-[#5C544D] leading-relaxed font-light">{f.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative rounded-3xl overflow-hidden glass-card p-2">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #E5E1D8 0%, #EAD7C3 50%, #D9C3A9 100%)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8 blur-text select-none">
                  <p className="font-serif text-2xl lg:text-4xl text-[#5C544D]/40 leading-relaxed italic">Capítulo 1 — La fragmentación</p>
                  <p className="mt-4 font-serif text-base lg:text-lg text-[#5C544D]/30 leading-relaxed max-w-xl mx-auto">Me fragmenté en mil pedazos intentando ser todo para todos. Madre perfecta, empresaria impecable, mujer siempre dispuesta. Nadie me pidió eso…</p>
                </div>
              </div>
              <div className="absolute top-0 bottom-0 w-[2px] kintsugi-line opacity-60" style={{ left: '62%', transform: 'rotate(8deg) translateY(10%)' }} />
              <div className="absolute top-0 bottom-0 w-[1px] kintsugi-line opacity-40" style={{ left: '30%', transform: 'rotate(-5deg)' }} />
            </div>
          </div>
          <p className="mt-5 text-sm text-[#8A8079] leading-relaxed font-light italic text-center max-w-xl mx-auto">
            El manuscrito en construcción: Esta imagen difusa es una captura real de mi libro en edición, <span className="font-serif not-italic text-[#3D3833]">"De Fragmentada a Soberana"</span>. Un proceso que aún se está escribiendo con el alma descubierta.
          </p>
        </div>

        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="kintsugi-divider flex-1 max-w-[100px]" />
          <Crown className="w-5 h-5 text-gold" strokeWidth={1.25} />
          <div className="kintsugi-divider flex-1 max-w-[100px]" />
        </div>
      </div>
    </section>
  );
}
