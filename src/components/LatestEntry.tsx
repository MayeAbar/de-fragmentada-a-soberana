import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { supabase, type DiaryPost } from '@/lib/supabase';
import { getCategoryMeta } from '@/lib/categories';
import { normalizeDriveUrl } from '@/lib/driveUrl';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function LatestEntry() {
  const [post, setPost] = useState<DiaryPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('diary_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setPost(data as DiaryPost);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-3 w-24 bg-[#EAD7C3]/40 rounded mb-4" />
        <div className="h-6 w-3/4 bg-[#EAD7C3]/40 rounded mb-3" />
        <div className="h-4 w-full bg-[#EAD7C3]/20 rounded" />
      </div>
    );
  }

  if (!post) return null;

  const meta = getCategoryMeta(post.category);

  return (
    <Link
      to="/#diario-feed"
      className="group block glass-card rounded-2xl overflow-hidden hover:gold-glow transition-all duration-500"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden"
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
        <div className="img-fallback absolute inset-0 flex-col items-center justify-center gap-2" style={{ display: post.image_url ? 'none' : 'flex' }}>
          <div
            className="w-12 h-12 rounded-full grid place-items-center text-xl"
            style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}40`, color: meta.accent }}
          >
            {(() => { const Icon = meta.icon; return <Icon className="w-5 h-5" strokeWidth={1.5} />; })()}
          </div>
        </div>
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-linen text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: meta.accent }}>
          {meta.label}
        </div>
      </div>

      <div className="p-5 lg:p-6">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A8079]">
          <Clock className="w-3 h-3" />
          {formatDate(post.created_at)}
        </div>
        <h3 className="mt-2.5 font-serif font-semibold text-lg lg:text-xl text-[#3D3833] leading-snug">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-[#5C544D] leading-relaxed font-light line-clamp-2">
          {post.body}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-gold group-hover:gap-2.5 transition-all">
          Leer entrada
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}
