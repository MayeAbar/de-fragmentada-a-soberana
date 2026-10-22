import { useState } from 'react';
import { ChevronDown, Crown, Lock, Check, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { supabase } from '@/lib/supabase';

const SECTIONS = [
  { title: '¿Qué es?', content: 'De Fragmentada a Soberana es el sistema completo que Patricia Abar diseñó tras su propia reconstrucción. Un método que te saca del caos de vivir en pilares desconectados y te instala en la soberanía: el punto donde tu mente, tu cuerpo, tu hogar, tus finanzas y tu identidad como mujer trabajan en sinergia, no en competencia.' },
  { title: 'Los 5 módulos', content: 'Cada pilar es un módulo con lecciones accionables, ejercicios de introspección y herramientas reales: Cuerpo (rutina y templo físico), Mente y Espiritualidad (enfoque y paz), Maternidad (criar construyendo), Finanzas (control y libertad) y Ser Mujer (identidad e intimidad).' },
  { title: 'La transformación', content: 'Pasas de fragmentada —intentando ser todo para todos, agotada, sin sistema— a soberana: una mujer que opera desde la claridad, que cría sin abandonarse, que crece económicamente sin sacrificar su paz y que construye un legado con las grietas selladas en oro.' },
  { title: 'Qué incluye', content: 'Acompañamiento directo con Patricia, materiales descargables de cada módulo, acceso a la comunidad privada de Soberanas, sesiones grupales mensuales y acceso de por vida a todas las actualizaciones del sistema.' },
];

function AccordionItem({ title, content, isOpen, onClick }: { title: string; content: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button onClick={onClick} className="w-full flex items-center justify-between px-6 lg:px-8 py-5 text-left">
        <h3 className="font-serif font-semibold text-lg text-[#3D3833]">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 lg:px-8 pb-6">
          <div className="kintsugi-divider mb-4 max-w-[60px]" />
          <p className="text-sm lg:text-[15px] text-[#5C544D] leading-[1.8] font-light">{content}</p>
        </div>
      </div>
    </div>
  );
}

export default function ElPrograma() {
  const [openIndex, setOpenIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim() });
    if (error) {
      if (error.code === '23505') { setStatus('success'); setEmail(''); setName(''); return; }
      setStatus('error');
      return;
    }
    setStatus('success'); setEmail(''); setName('');
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079]">El Programa</span>
          <h1 className="mt-4 font-serif font-extrabold text-3xl lg:text-5xl text-[#3D3833] tracking-tight leading-[1.05]">
            De Fragmentada a Soberana<br /><span className="italic gold-text">Tu Sistema Completo</span>
          </h1>
        </div>

        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {SECTIONS.map((s, i) => (
            <AccordionItem key={s.title} title={s.title} content={s.content} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>

        <div className="mt-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="glass-card rounded-full px-4 py-2.5 flex items-center gap-2">
                <span className="text-base">{c.emoji}</span>
                <span className="text-[12px] font-serif font-medium text-[#3D3833]">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079] mb-4">Inversión</p>
          <div className="inline-flex flex-col items-center">
            <p className="font-serif font-extrabold text-5xl lg:text-6xl text-[#3D3833] tracking-tight">
              <span className="text-3xl align-top">$</span>497<span className="text-2xl font-medium text-[#8A8079] ml-2">USD</span>
            </p>
            <p className="mt-2 text-sm text-gold font-medium tracking-wide">Acceso de por vida</p>
          </div>
        </div>

        <div className="mt-10 glass-card rounded-3xl p-7 lg:p-10 gold-glow border border-gold/30 text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-[12px] font-medium text-gold mb-6">
            <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />Próxima apertura: Enero 2027
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#3D3833]">Lista de espera <span className="italic gold-text">abierta</span></h3>
          <p className="mt-3 text-sm text-[#8A8079] leading-relaxed max-w-md mx-auto">Sé de las primeras en entrar cuando abramos las puertas. Recibirás prioridad y un aviso directo a tu correo.</p>

          {status === 'success' ? (
            <div className="mt-8 glass-card rounded-xl px-6 py-5 inline-block animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 grid place-items-center">
                  <Check className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-[#3D3833] font-medium text-left">Estás en la lista, soberana.<br /><span className="text-[#8A8079] font-normal">Te avisaremos en enero de 2027.</span></p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="flex-1 px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="flex-1 px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors" />
              <button type="submit" disabled={status === 'loading'} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#3D3833] font-semibold text-sm tracking-wide hover:bg-[#5C544D] transition-colors disabled:opacity-60" style={{ color: '#EFECE6' }}>
                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} /> : <Crown className="w-4 h-4 text-gold" strokeWidth={1.5} />}Quiero ser Soberana
              </button>
            </form>
          )}
          {status === 'error' && <p className="mt-3 text-xs text-red-700">No se pudo registrar. Inténtalo de nuevo.</p>}
        </div>
      </div>
    </section>
  );
}
