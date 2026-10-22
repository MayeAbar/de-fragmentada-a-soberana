import { Link } from 'react-router-dom';
import { Crown, Instagram, Mail, Mic } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim() });
    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setEmail('');
        return;
      }
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
  }

  return (
    <footer className="relative mt-20 border-t border-nude">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-nude text-[11px] font-medium text-gold mb-6">
          <Mic className="w-3.5 h-3.5" />
          Notas de Voz Soberanas
        </div>
        <h3 className="font-serif text-3xl lg:text-4xl font-semibold text-[#3D3833] tracking-tight">
          Un audio crudo, <span className="italic gold-text">cada domingo</span>
        </h3>
        <p className="mt-3 text-sm text-[#8A8079] max-w-md mx-auto leading-relaxed">
          Únete a las Notas de Voz Soberanas. Un audio crudo dominical directo a tu correo.
        </p>

        {status === 'success' ? (
          <div className="mt-8 glass-card rounded-xl px-6 py-4 inline-block animate-scale-in">
            <p className="text-sm text-[#3D3833] font-medium">
              Bienvenida, soberana. Escucharás de mí pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={subscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3.5 rounded-xl bg-[#3D3833] text-sm font-semibold tracking-wide hover:bg-[#5C544D] transition-colors disabled:opacity-60"
              style={{ color: '#EFECE6' }}
            >
              {status === 'loading' ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-3 text-xs text-red-700">No se pudo registrar. Inténtalo de nuevo.</p>
        )}
      </div>

      <div className="border-t border-nude">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-7 h-7 rounded-full border border-gold/40">
                <Crown className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
              </span>
              <span className="font-serif text-[13px] text-[#3D3833]">
                Patricia Abar · De Fragmentada a Soberana
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full border border-nude grid place-items-center text-[#8A8079] hover:text-gold hover:border-gold/50 transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <Link to="/buzon" aria-label="Contacto" className="w-8 h-8 rounded-full border border-nude grid place-items-center text-[#8A8079] hover:text-gold hover:border-gold/50 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </Link>
              </div>

              <nav className="flex items-center gap-4 text-[11px] text-[#8A8079]">
                <a href="#" className="hover:text-gold transition-colors">Aviso de Privacidad</a>
                <span className="text-[#EAD7C3]">·</span>
                <a href="#" className="hover:text-gold transition-colors">Términos</a>
              </nav>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-[#8A8079] tracking-wide">
              © 2026 Patricia Abar · De Fragmentada a Soberana · Desarrollado por Abar Digital
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
