import { useState } from 'react';
import { Lock, Send, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Buzon() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      setError('Escribe tu mensaje antes de enviar.');
      return;
    }
    if (!anonymous && (!name.trim() || !email.trim())) {
      setError('Completa nombre y email, o marca "Enviar como Anónimo".');
      return;
    }
    setStatus('loading');
    setError('');

    const { error: insertError } = await supabase.from('buzon_messages').insert({
      name: anonymous ? 'Anónimo' : name.trim(),
      email: anonymous ? null : email.trim(),
      message: message.trim(),
      is_anonymous: anonymous,
    });

    if (insertError) {
      setStatus('error');
      setError('No se pudo enviar ahora. Inténtalo de nuevo.');
      return;
    }
    setStatus('success');
    setName('');
    setEmail('');
    setMessage('');
    setAnonymous(false);
    setTimeout(() => setStatus('idle'), 6000);
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079]">
            Buzón de Soberanía
          </span>
          <h1 className="mt-4 font-serif font-extrabold text-4xl lg:text-6xl text-[#3D3833] tracking-tight">
            Deposita aquí <span className="italic gold-text">tus grietas</span>
          </h1>
          <p className="mt-4 text-sm lg:text-base text-[#8A8079] max-w-lg mx-auto leading-relaxed">
            Usa este buzón para tus preguntas u opiniones. El formulario procesa los envíos
            directamente al correo de la autora:
            <span className="block mt-2 font-medium text-[#3D3833]">patriciaabardigital@gmail.com</span>
          </p>
        </div>

        <div className="relative glass-card rounded-3xl p-7 lg:p-10 gold-glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute -top-3 left-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFECE6] border border-gold/30 text-[11px] font-medium text-gold">
            <Lock className="w-3 h-3" />
            Espacio confidencial
          </div>

          {status === 'success' ? (
            <div className="py-12 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 grid place-items-center mx-auto mb-5 gold-glow">
                <CheckCircle2 className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-semibold text-2xl text-[#3D3833]">Mensaje depositado</h3>
              <p className="mt-2 text-sm text-[#8A8079] max-w-sm mx-auto leading-relaxed">
                Gracias por confiar. Tu mensaje llegó de forma segura al buzón. Patricia te
                leerá con la atención que mereces.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className={`relative w-11 h-6 rounded-full transition-colors ${anonymous ? 'bg-gold/40' : 'bg-[#EAD7C3]'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${anonymous ? 'translate-x-[22px] border-gold/40' : 'translate-x-0.5 border-nude'}`} />
                </span>
                <span className="text-[13px] text-[#5C544D] font-medium">Enviar como Anónimo</span>
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Nombre</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={anonymous} placeholder="Tu nombre" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-40" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={anonymous} placeholder="tu@correo.com" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-40" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Tu mensaje</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Escribe aquí tu pregunta, opinión o desahogo…" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors resize-none" />
              </div>

              {error && <p className="text-xs text-red-700">{error}</p>}

              <button type="submit" disabled={status === 'loading'} className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#3D3833] font-semibold text-sm tracking-wide gold-glow hover:bg-[#5C544D] transition-colors disabled:opacity-60" style={{ color: '#EFECE6' }}>
                {status === 'loading' ? (
                  <><Loader2 className="w-4.5 h-4.5 animate-spin" strokeWidth={1.75} />Enviando de forma segura…</>
                ) : (
                  <><Send className="w-4.5 h-4.5" strokeWidth={1.75} />Enviar Mensaje</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#8A8079]">
                <Mail className="w-3 h-3" />
                <span>patriciaabardigital@gmail.com</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
