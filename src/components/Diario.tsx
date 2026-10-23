import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, X, Clock } from 'lucide-react';
import { supabase, type DiaryPost, type DiaryCategory } from '@/lib/supabase';
import { CATEGORIES, getCategoryMeta } from '@/lib/categories';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { normalizeDriveUrl } from '@/lib/driveUrl';


type Filter = DiaryCategory | 'all' | 'fav';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function Diario() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>('all');
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<DiaryPost | null>(null);
  const [favVersion, setFavVersion] = useState(0);

  useEffect(() => {
    setFavorites(getFavorites());
    if (searchParams.get('fav') === 'true') {
      setFilter('fav');
    } else {
      const cat = searchParams.get('cat');
      if (cat && CATEGORIES.some((c) => c.id === cat)) {
        setFilter(cat as Filter);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from('diary_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all' && filter !== 'fav') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;
      if (!error && data) {
        let result = data as DiaryPost[];
        if (filter === 'fav') {
          result = result.filter((p) => favorites.includes(p.id));
        }
        setPosts(result);
      }
      setLoading(false);
    })();
  }, [filter, favVersion]);

  function handleToggleFav(id: string) {
    const isNow = toggleFavorite(id);
    setFavorites(getFavorites());
    setFavVersion((v) => v + 1);
    if (filter === 'fav' && !isNow) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function setTab(f: Filter) {
    setFilter(f);
    if (searchParams.get('fav') === 'true') {
      setSearchParams({}, { replace: true });
    }
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Todo' },
    ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label })),
    { id: 'fav', label: 'Guardados' },
  ];

  return (
    <section id="diario-feed" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-10">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8A8079]">
            El Diario Íntimo
          </span>
          <h2 className="mt-3 font-serif font-bold text-3xl lg:text-5xl text-[#3D3833] tracking-tight">
            Reflexiones en <span className="italic gold-text">construcción</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-serif font-medium tracking-wide transition-all border ${
                filter === t.id
                  ? 'border-gold/50 bg-gold/10 text-[#3D3833] gold-glow'
                  : 'border-nude text-[#8A8079] hover:text-[#3D3833] hover:border-gold/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-[#EAD7C3]/20" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-[#EAD7C3]/40 rounded" />
                  <div className="h-5 w-3/4 bg-[#EAD7C3]/40 rounded" />
                  <div className="h-4 w-full bg-[#EAD7C3]/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-sm text-[#8A8079]">
              {filter === 'fav'
                ? 'Aún no has guardado entradas. Toca el marcador en una publicación para guardarla aquí.'
                : 'No hay entradas en esta categoría todavía.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const meta = getCategoryMeta(post.category);
              const isFav = favorites.includes(post.id);
              return (
                <article
                  key={post.id}
                  className="group glass-card rounded-2xl overflow-hidden hover:gold-glow transition-all duration-500 flex flex-col"
                >
                  {/* 3:4 photo / placeholder */}
                  <div
                    className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                    onClick={() => setSelected(post)}
                    style={{ background: `linear-gradient(160deg, ${meta.accent}10 0%, #EFECE6 70%)` }}
                  >
                    {post.image_url ? (
                      <img
                        src={normalizeDriveUrl(post.image_url)}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget.parentElement!.querySelector('.img-fallback') as HTMLElement)?.style.setProperty('display', 'flex'); e.currentTarget.style.display = 'none'; }}
                      />
                    ) : null}
                    <div className="img-fallback absolute inset-0 flex-col items-center justify-center gap-3" style={{ display: post.image_url ? 'none' : 'flex' }}>
                      <div
                        className="w-12 h-12 rounded-full grid place-items-center"
                        style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}40` }}
                      >
                        {(() => { const Icon = meta.icon; return <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: meta.accent }} />; })()}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A8079]">
                        Foto del día
                      </span>
                    </div>
                    {/* Favorite toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFav(post.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full glass-linen grid place-items-center transition-all hover:scale-110"
                      aria-label="Guardar"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#8A8079]'}`}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A8079]">
                      <span style={{ color: meta.accent }}>{meta.label}</span>
                      <span className="text-[#EAD7C3]">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-serif font-semibold text-lg text-[#3D3833] leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#5C544D] leading-relaxed font-light line-clamp-3 flex-1">
                      {post.body}
                    </p>
                    <button
                      onClick={() => setSelected(post)}
                      className="mt-4 self-start text-[12px] font-medium text-gold hover:underline tracking-wide"
                    >
                      Leer entrada →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Immersive reading modal */}
      {selected && (
        <ReadingModal
          post={selected}
          isFav={favorites.includes(selected.id)}
          onToggleFav={() => handleToggleFav(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

function ReadingModal({
  post,
  isFav,
  onToggleFav,
  onClose,
}: {
  post: DiaryPost;
  isFav: boolean;
  onToggleFav: () => void;
  onClose: () => void;
}) {
  const meta = getCategoryMeta(post.category);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#3D3833]/40 backdrop-blur-sm" />
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto glass-linen-strong rounded-3xl gold-glow-strong animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass-linen grid place-items-center hover:scale-110 transition-transform"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-[#3D3833]" strokeWidth={1.5} />
        </button>

        {/* Favorite */}
        <button
          onClick={onToggleFav}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full glass-linen grid place-items-center hover:scale-110 transition-transform"
          aria-label="Guardar"
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#8A8079]'}`}
            strokeWidth={1.5}
          />
        </button>

        {/* 3:4 image / placeholder */}
        <div
          className="relative aspect-[3/4] max-h-[50vh] overflow-hidden rounded-t-3xl"
          style={{ background: `linear-gradient(160deg, ${meta.accent}10 0%, #EFECE6 70%)` }}
        >
          {post.image_url ? (
            <img
              src={normalizeDriveUrl(post.image_url)}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.currentTarget.parentElement!.querySelector('.img-fallback') as HTMLElement)?.style.setProperty('display', 'flex'); e.currentTarget.style.display = 'none'; }}
            />
          ) : null}
          <div className="img-fallback absolute inset-0 flex-col items-center justify-center gap-3" style={{ display: post.image_url ? 'none' : 'flex' }}>
            <div
              className="w-14 h-14 rounded-full grid place-items-center"
              style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}40` }}
            >
              {(() => { const Icon = meta.icon; return <Icon className="w-6 h-6" strokeWidth={1.5} style={{ color: meta.accent }} />; })()}
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A8079]">
              Foto del día
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 lg:p-10">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079]">
            <span style={{ color: meta.accent }}>{meta.label}</span>
            <span className="text-[#EAD7C3]">·</span>
            <span>{formatDate(post.created_at)}</span>
          </div>

          <h2 className="mt-4 font-serif font-bold text-2xl lg:text-3xl text-[#3D3833] leading-tight">
            {post.title}
          </h2>

          <div className="kintsugi-divider my-6" />

          <p className="text-[#3D3833] text-base lg:text-lg leading-[1.8] font-light whitespace-pre-wrap">
            {post.body}
          </p>
        </div>
      </div>
    </div>
  );
}
