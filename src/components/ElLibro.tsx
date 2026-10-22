import { useEffect, useState } from 'react';
import { BookOpen, X, ScrollText } from 'lucide-react';
import { supabase, type BookFragment } from '@/lib/supabase';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function ElLibro() {
  const [fragments, setFragments] = useState<BookFragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BookFragment | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('book_fragments').select('*').order('created_at', { ascending: false });
      if (!error && data) setFragments(data as BookFragment[]);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-nude text-[11px] font-medium text-gold mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Biblioteca digital
          </div>
          <h1 className="font-serif font-extrabold text-4xl lg:text-6xl text-[#3D3833] tracking-tight">
            El <span className="italic gold-text">Libro</span>
          </h1>
          <p className="mt-4 text-sm lg:text-base text-[#8A8079] max-w-lg mx-auto leading-relaxed">
            Fragmentos esporádicos del manuscrito en construcción. Un espacio aislado del diario, para leer despacio.
          </p>
        </div>

        <div className="kintsugi-divider mb-12 max-w-[120px] mx-auto" />

        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-7 animate-pulse">
                <div className="h-4 w-24 bg-[#EAD7C3]/40 rounded mb-4" />
                <div className="h-6 w-3/4 bg-[#EAD7C3]/40 rounded mb-3" />
                <div className="h-4 w-full bg-[#EAD7C3]/20 rounded" />
              </div>
            ))}
          </div>
        ) : fragments.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <ScrollText className="w-8 h-8 text-[#EAD7C3] mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-[#8A8079]">El manuscrito aún no tiene fragmentos públicos. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {fragments.map((f, i) => (
              <article key={f.id} className="group glass-card rounded-2xl p-7 lg:p-8 hover:gold-glow transition-all duration-500 cursor-pointer animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }} onClick={() => setSelected(f)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{f.chapter_label ?? 'Fragmento'}</span>
                  <span className="text-[11px] text-[#8A8079]">{formatDate(f.created_at)}</span>
                </div>
                <h3 className="font-serif font-semibold text-xl lg:text-2xl text-[#3D3833] leading-snug">{f.title}</h3>
                <p className="mt-3 text-sm lg:text-base text-[#5C544D] leading-relaxed font-light line-clamp-4">{f.body}</p>
                <span className="mt-4 inline-block text-[12px] font-medium text-gold group-hover:underline">Leer fragmento →</span>
              </article>
            ))}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-[#3D3833]/40 backdrop-blur-sm" />
            <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-linen-strong rounded-3xl gold-glow-strong animate-scale-in p-8 lg:p-12" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full glass-linen grid place-items-center hover:scale-110 transition-transform" aria-label="Cerrar">
                <X className="w-4 h-4 text-[#3D3833]" strokeWidth={1.5} />
              </button>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{selected.chapter_label ?? 'Fragmento'}</span>
              <h2 className="mt-3 font-serif font-bold text-2xl lg:text-3xl text-[#3D3833] leading-tight">{selected.title}</h2>
              <div className="kintsugi-divider my-6" />
              <p className="text-[#3D3833] text-base lg:text-lg leading-[1.9] font-light whitespace-pre-wrap">{selected.body}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
