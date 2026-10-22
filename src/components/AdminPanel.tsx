import { useState, useEffect } from 'react';
import { Send, Lock, Crown, Flame, Loader2 } from 'lucide-react';
import { supabase, type DiaryCategory } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';
import { computeStreak, type StreakResult } from '@/lib/streak';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DiaryCategory>('mente');
  const [body, setBody] = useState('');
  const [tiktokScript, setTiktokScript] = useState('');
  const [instagramText, setInstagramText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [currentStreak, setCurrentStreak] = useState<StreakResult | null>(null);
  const [streakPreview, setStreakPreview] = useState<StreakResult | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('diary_posts').select('created_at').order('created_at', { ascending: false });
      if (data && data.length > 0) setCurrentStreak(computeStreak(data.map((p) => p.created_at)));
    })();
  }, []);

  useEffect(() => {
    if (!currentStreak) return;
    const nowIso = new Date().toISOString();
    setStreakPreview(computeStreak([nowIso]));
  }, [currentStreak]);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { setError('El título y la reflexión son obligatorios.'); return; }
    setStatus('loading'); setError('');

    const { data: postData, error: insertError } = await supabase.from('diary_posts').insert({
      title: title.trim(), category, body: body.trim(),
      tiktok_script: tiktokScript.trim() || null,
      instagram_text: instagramText.trim() || null,
      image_url: imageUrl.trim() || null,
    }).select('created_at').single();

    if (insertError || !postData) { setStatus('error'); setError('No se pudo publicar. Inténtalo de nuevo.'); return; }

    const { data: allDates } = await supabase.from('diary_posts').select('created_at').order('created_at', { ascending: false });
    if (allDates && allDates.length > 0) {
      const newStreak = computeStreak(allDates.map((p) => p.created_at));
      setCurrentStreak(newStreak);
      const streakValue = String(newStreak.count);
      await supabase.from('sovereignty_stats').upsert({ metric_key: 'mental_streak', metric_value: streakValue, updated_at: new Date().toISOString() }, { onConflict: 'metric_key' });
      await supabase.from('sovereignty_stats').upsert({ metric_key: 'mental_detail', metric_value: newStreak.label, updated_at: new Date().toISOString() }, { onConflict: 'metric_key' });
    }

    setStatus('success'); setTitle(''); setBody(''); setTiktokScript(''); setInstagramText(''); setImageUrl('');
    setTimeout(() => setStatus('idle'), 5000);
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 text-[11px] font-medium text-gold mb-5">
            <Lock className="w-3.5 h-3.5" />Panel privado · Patricia Abar
          </div>
          <h1 className="font-serif font-extrabold text-3xl lg:text-5xl text-[#3D3833] tracking-tight">
            Escribir en el <span className="italic gold-text">diario</span>
          </h1>
          <p className="mt-3 text-sm text-[#8A8079] leading-relaxed">Cada publicación se inyecta en orden cronológico inverso en el feed público. La racha de Soberanía Mental se actualiza automáticamente.</p>
        </div>

        {currentStreak && (
          <div className="glass-card rounded-2xl p-5 mb-8 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <div className={`w-11 h-11 rounded-full grid place-items-center ${currentStreak.isPaused ? 'border border-[#EAD7C3]' : 'border border-gold/40 gold-glow'}`}>
              <Flame className={`w-5 h-5 ${currentStreak.isPaused ? 'text-[#8A8079]' : 'text-gold'}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079]">Racha editorial actual</p>
              <p className={`mt-0.5 font-serif text-lg font-semibold ${currentStreak.isPaused ? 'italic text-[#8A8079]' : 'text-[#3D3833]'}`}>
                {currentStreak.isPaused ? 'Pausa de Enfoque' : `${currentStreak.count} días consecutivos`}
              </p>
              <p className="text-[11px] text-[#8A8079]">{currentStreak.label}</p>
            </div>
            {streakPreview && !currentStreak.isPaused && (
              <div className="ml-auto text-right">
                <p className="text-[10px] text-[#8A8079] uppercase tracking-wide">Al publicar ahora</p>
                <p className="font-serif text-lg font-semibold text-gold">+{streakPreview.count > currentStreak.count ? 1 : 0} día</p>
              </div>
            )}
          </div>
        )}

        <div className="glass-card rounded-3xl p-7 lg:p-10 gold-glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {status === 'success' ? (
            <div className="py-10 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 grid place-items-center mx-auto mb-5 gold-glow">
                <Crown className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-semibold text-2xl text-[#3D3833]">Publicado</h3>
              <p className="mt-2 text-sm text-[#8A8079] max-w-sm mx-auto">La entrada ya está en el feed público. La racha de Soberanía Mental se actualizó automáticamente.</p>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-6">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-3">Área</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} type="button" onClick={() => setCategory(c.id)} className={`px-4 py-2 rounded-full text-[13px] font-serif font-medium transition-all border ${category === c.id ? 'border-gold/50 bg-gold/10 text-[#3D3833] gold-glow' : 'border-nude text-[#8A8079] hover:text-[#3D3833] hover:border-gold/30'}`}>
                      <span className="mr-1.5">{c.emoji}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="El título de la reflexión…" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm font-serif placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Cuerpo Íntimo</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Escribe la entrada del diario…" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm leading-relaxed placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Texto para TikTok <span className="text-[#EAD7C3] normal-case tracking-normal">(opcional)</span></label>
                <textarea value={tiktokScript} onChange={(e) => setTiktokScript(e.target.value)} rows={4} placeholder="3-4 frases cortas de alta retención para video vertical…" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Texto para Instagram <span className="text-[#EAD7C3] normal-case tracking-normal">(opcional)</span></label>
                <textarea value={instagramText} onChange={(e) => setInstagramText(e.target.value)} rows={5} placeholder="Título, 2-3 párrafos resumidos y pregunta final interactiva…" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm leading-relaxed placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-2">Foto <span className="text-[#EAD7C3] normal-case tracking-normal">(opcional)</span></label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://… (URL de la foto del día)" className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors" />
              </div>

              {error && <p className="text-xs text-red-700">{error}</p>}

              <button type="submit" disabled={status === 'loading'} className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#3D3833] font-semibold text-sm tracking-wide gold-glow hover:bg-[#5C544D] transition-colors disabled:opacity-60" style={{ color: '#EFECE6' }}>
                {status === 'loading' ? (<><Loader2 className="w-4.5 h-4.5 animate-spin" strokeWidth={1.75} />Publicando…</>) : (<><Send className="w-4.5 h-4.5" strokeWidth={1.75} />Publicar entrada</>)}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
