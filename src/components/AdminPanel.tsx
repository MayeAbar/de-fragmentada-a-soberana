import { useState, useEffect, useRef } from 'react';
import { Send, Lock, Crown, Flame, Loader2, KeyRound, Copy, Check, Video, Camera, Clock, Trash2, Edit, X, ArrowLeft, UploadCloud } from 'lucide-react';
import { supabase, type DiaryCategory, type DiaryPost } from '@/lib/supabase';
import { CATEGORIES, getCategoryMeta } from '@/lib/categories';
import { computeStreak, type StreakResult } from '@/lib/streak';

const ADMIN_PASSWORD = 'soberana2026';
const STORAGE_KEY = 'dfas_admin_auth';
const MAX_IMAGE_BYTES = 4_500_000;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

type Tab = 'tiktok' | 'instagram';
type FormMode = 'create' | 'edit';

function SocialContentPrivate({ tiktokScript, instagramText }: { tiktokScript: string | null; instagramText: string | null }) {
  const [tab, setTab] = useState<Tab>('tiktok');
  const [copied, setCopied] = useState(false);

  const content = tab === 'tiktok' ? tiktokScript : instagramText;
  const hasContent = content && content.trim().length > 0;

  function handleCopy() {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-4 rounded-2xl border border-gold/30 overflow-hidden">
      <div className="flex border-b border-gold/20 bg-gold/5">
        <button
          onClick={() => setTab('tiktok')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-medium tracking-wide transition-colors ${tab === 'tiktok' ? 'text-gold bg-gold/10' : 'text-[#8A8079] hover:text-[#5C544D]'}`}
        >
          <Video className="w-3.5 h-3.5" strokeWidth={1.5} />
          TikTok / Reels
        </button>
        <button
          onClick={() => setTab('instagram')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-medium tracking-wide transition-colors ${tab === 'instagram' ? 'text-gold bg-gold/10' : 'text-[#8A8079] hover:text-[#5C544D]'}`}
        >
          <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
          Instagram / Facebook
        </button>
      </div>
      <div className="p-4 lg:p-5 bg-[#EFECE6]/50 relative">
        {hasContent ? (
          <>
            <p className="text-[13px] text-[#3D3833] leading-[1.7] font-light whitespace-pre-wrap pr-10">
              {content}
            </p>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 w-7 h-7 rounded-full border border-nude grid place-items-center text-[#8A8079] hover:text-gold hover:border-gold/50 transition-colors"
              aria-label="Copiar"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />}
            </button>
            {copied && <p className="mt-2 text-[10px] text-gold font-medium animate-fade-in">Copiado al portapapeles</p>}
          </>
        ) : (
          <p className="text-[13px] text-[#8A8079] italic font-light">
            {tab === 'tiktok' ? 'No hay guion de TikTok para esta entrada.' : 'No hay texto de Instagram para esta entrada.'}
          </p>
        )}
      </div>
    </div>
  );
}

function EntryHistoryItem({
  post,
  onEdit,
  onDelete,
}: {
  post: DiaryPost;
  onEdit: (post: DiaryPost) => void;
  onDelete: (post: DiaryPost) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = getCategoryMeta(post.category);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div
          className="shrink-0 w-10 h-10 rounded-full grid place-items-center"
          style={{ background: `${meta.accent}15`, border: `1px solid ${meta.accent}40` }}
        >
          <meta.icon className="w-4 h-4" strokeWidth={1.5} style={{ color: meta.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-serif font-semibold text-sm text-[#3D3833] truncate">{post.title}</p>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#8A8079] mt-0.5">
            <span style={{ color: meta.accent }}>{meta.label}</span>
            <span className="text-[#EAD7C3]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
        <span className={`text-[11px] text-gold shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-nude/50">
          {post.image_url && (
            <div className="mt-4 rounded-xl overflow-hidden aspect-[16/9]">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          <p className="mt-4 text-[13px] text-[#3D3833] leading-relaxed font-light whitespace-pre-wrap">
            {post.body}
          </p>
          {(post.tiktok_script || post.instagram_text) && (
            <SocialContentPrivate tiktokScript={post.tiktok_script} instagramText={post.instagram_text} />
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(post); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold/10 border border-gold/30 text-[12px] font-medium text-gold hover:bg-gold/20 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" strokeWidth={1.5} />
              Editar
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-red-700 font-medium">¿Estás segura de eliminar esta publicación?</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(post); setConfirmDelete(false); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 text-[12px] font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Sí, eliminar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                  className="px-3 py-2 rounded-xl border border-nude text-[12px] text-[#8A8079] hover:text-[#3D3833] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  }

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-md mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 lg:p-10 gold-glow text-center animate-fade-up">
          <div className="w-14 h-14 rounded-full border border-gold/40 grid place-items-center mx-auto mb-5 gold-glow">
            <KeyRound className="w-6 h-6 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif font-extrabold text-2xl text-[#3D3833]">Acceso privado</h1>
          <p className="mt-2 text-sm text-[#8A8079] leading-relaxed">
            Esta zona es exclusiva para Patricia. Ingresa tu contraseña para continuar.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-nude text-[#3D3833] text-sm placeholder:text-[#8A8079] focus:outline-none focus:border-gold/50 transition-colors text-center tracking-widest"
              autoFocus
            />
            {error && <p className="text-xs text-red-700">Contraseña incorrecta. Inténtalo de nuevo.</p>}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#3D3833] font-semibold text-sm tracking-wide hover:bg-[#5C544D] transition-colors"
              style={{ color: '#EFECE6' }}
            >
              <Lock className="w-4 h-4" strokeWidth={1.75} />
              Entrar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true');

  const [mode, setMode] = useState<FormMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DiaryCategory>('mente');
  const [body, setBody] = useState('');
  const [tiktokScript, setTiktokScript] = useState('');
  const [instagramText, setInstagramText] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);

  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageError, setImageError] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [currentStreak, setCurrentStreak] = useState<StreakResult | null>(null);
  const [streakPreview, setStreakPreview] = useState<StreakResult | null>(null);
  const [history, setHistory] = useState<DiaryPost[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadHistory() {
    const { data: posts } = await supabase.from('diary_posts').select('*').order('created_at', { ascending: false });
    if (posts) setHistory(posts as DiaryPost[]);
  }

  async function loadStreak() {
    const { data: dates } = await supabase.from('diary_posts').select('created_at').order('created_at', { ascending: false });
    if (dates && dates.length > 0) setCurrentStreak(computeStreak(dates.map((p: { created_at: string }) => p.created_at)));
  }

  useEffect(() => {
    if (!unlocked) return;
    (async () => {
      await loadStreak();
      await loadHistory();
    })();
  }, [unlocked]);

  useEffect(() => {
    if (!currentStreak) return;
    const nowIso = new Date().toISOString();
    setStreakPreview(computeStreak([nowIso]));
  }, [currentStreak]);

  function resetForm() {
    setMode('create');
    setEditingId(null);
    setTitle('');
    setCategory('mente');
    setBody('');
    setTiktokScript('');
    setInstagramText('');
    setImageData(null);
    setImageError('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleEdit(post: DiaryPost) {
    setMode('edit');
    setEditingId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setBody(post.body);
    setTiktokScript(post.tiktok_script ?? '');
    setInstagramText(post.instagram_text ?? '');
    setImageData(post.image_url ?? null);
    setImageError('');
    setStatus('idle');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function refreshStreakAfterMutation() {
    const { data: allDates } = await supabase.from('diary_posts').select('created_at').order('created_at', { ascending: false });
    if (allDates && allDates.length > 0) {
      const newStreak = computeStreak(allDates.map((p: { created_at: string }) => p.created_at));
      setCurrentStreak(newStreak);
      await supabase.from('sovereignty_stats').upsert({ metric_key: 'mental_streak', metric_value: String(newStreak.count), updated_at: new Date().toISOString() }, { onConflict: 'metric_key' });
      await supabase.from('sovereignty_stats').upsert({ metric_key: 'mental_detail', metric_value: newStreak.label, updated_at: new Date().toISOString() }, { onConflict: 'metric_key' });
    } else {
      setCurrentStreak(null);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('El archivo seleccionado no es una imagen.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('La imagen es demasiado grande (máximo ~4.5 MB). Usa una más pequeña.');
      return;
    }

    setImageError('');
    setImageProcessing(true);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImageData(result);
        setImageProcessing(false);
      } else {
        setImageError('No se pudo procesar la imagen. Inténtalo de nuevo.');
        setImageProcessing(false);
      }
    };
    reader.onerror = () => {
      setImageError('Error al leer el archivo. Inténtalo de nuevo.');
      setImageProcessing(false);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageData(null);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { setError('El título y la reflexión son obligatorios.'); return; }
    setStatus('loading'); setError('');

    if (mode === 'edit' && editingId) {
      const { error: updateError } = await supabase.from('diary_posts').update({
        title: title.trim(),
        category,
        body: body.trim(),
        tiktok_script: tiktokScript.trim() || null,
        instagram_text: instagramText.trim() || null,
        image_url: imageData,
      }).eq('id', editingId);

      if (updateError) { setStatus('error'); setError('No se pudo actualizar. Inténtalo de nuevo.'); return; }

      await refreshStreakAfterMutation();
      await loadHistory();
      setStatus('success');
      setTimeout(() => { setStatus('idle'); resetForm(); }, 5000);
    } else {
      const { error: insertError } = await supabase.from('diary_posts').insert({
        title: title.trim(), category, body: body.trim(),
        tiktok_script: tiktokScript.trim() || null,
        instagram_text: instagramText.trim() || null,
        image_url: imageData,
      });

      if (insertError) { setStatus('error'); setError('No se pudo publicar. Inténtalo de nuevo.'); return; }

      await refreshStreakAfterMutation();
      await loadHistory();
      setStatus('success');
      resetForm();
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  async function handleDelete(post: DiaryPost) {
    const { error: deleteError } = await supabase.from('diary_posts').delete().eq('id', post.id);
    if (deleteError) { setError('No se pudo eliminar. Inténtalo de nuevo.'); return; }

    if (editingId === post.id) resetForm();

    await refreshStreakAfterMutation();
    await loadHistory();
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

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
          {mode === 'edit' && (
            <div className="mb-5 flex items-center justify-between px-4 py-3 rounded-xl bg-gold/10 border border-gold/30">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-gold">Modo edición — Estás editando una publicación existente</span>
              </div>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-1 text-[11px] text-[#8A8079] hover:text-[#3D3833] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancelar edición
              </button>
            </div>
          )}

          {status === 'success' ? (
            <div className="py-10 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 grid place-items-center mx-auto mb-5 gold-glow">
                <Crown className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-semibold text-2xl text-[#3D3833]">
                {mode === 'edit' ? 'Actualizado' : 'Publicado'}
              </h3>
              <p className="mt-2 text-sm text-[#8A8079] max-w-sm mx-auto">
                {mode === 'edit'
                  ? 'Los cambios se guardaron correctamente. La entrada actualizada ya está en el feed público.'
                  : 'La entrada ya está en el feed público. La racha de Soberanía Mental se actualizó automáticamente.'}
              </p>
              <button
                onClick={resetForm}
                className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-gold hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a crear nueva entrada
              </button>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-6">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8079] mb-3">Área</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} type="button" onClick={() => setCategory(c.id)} className={`px-4 py-2 rounded-full text-[13px] font-serif font-medium transition-all border ${category === c.id ? 'border-gold/50 bg-gold/10 text-[#3D3833] gold-glow' : 'border-nude text-[#8A8079] hover:text-[#3D3833] hover:border-gold/30'}`}>
                      <c.icon className="w-4 h-4 mr-1.5 inline-block" strokeWidth={1.5} style={{ color: c.accent }} />{c.label}
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

                {imageData ? (
                  <div className="relative rounded-xl overflow-hidden group">
                    <img src={imageData} alt="Vista previa" className="w-full aspect-[16/9] object-cover" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#3D3833]/80 grid place-items-center text-[#EFECE6] hover:bg-[#3D3833] transition-colors" aria-label="Quitar imagen">
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <p className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-gold/90 text-[10px] font-medium text-[#3D3833]">Imagen cargada</p>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-xl border-2 border-dashed border-nude bg-white/30 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-colors">
                    {imageProcessing ? (
                      <><Loader2 className="w-7 h-7 text-gold animate-spin" strokeWidth={1.5} /><span className="text-[12px] text-[#8A8079]">Procesando imagen…</span></>
                    ) : (
                      <><div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 grid place-items-center"><UploadCloud className="w-6 h-6 text-gold" strokeWidth={1.5} /></div><div className="text-center"><p className="text-[13px] font-medium text-[#3D3833]">Arrastra o toca para subir una foto</p><p className="mt-1 text-[11px] text-[#8A8079]">JPG, PNG o WebP · máximo ~4.5 MB</p></div></>
                    )}
                    <input ref={fileInputRef} id="image-upload" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={imageProcessing} />
                  </label>
                )}
                {imageError && <p className="mt-2 text-[11px] text-red-700">{imageError}</p>}
              </div>
              {error && <p className="text-xs text-red-700">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={status === 'loading' || imageProcessing} className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#3D3833] font-semibold text-sm tracking-wide gold-glow hover:bg-[#5C544D] transition-colors disabled:opacity-60" style={{ color: '#EFECE6' }}>
                  {status === 'loading' ? (<><Loader2 className="w-4.5 h-4.5 animate-spin" strokeWidth={1.75} />{mode === 'edit' ? 'Actualizando…' : 'Publicando…'}</>) : mode === 'edit' ? (<><Send className="w-4.5 h-4.5" strokeWidth={1.75} />Guardar Cambios</>) : (<><Send className="w-4.5 h-4.5" strokeWidth={1.75} />Publicar entrada</>)}
                </button>
                {mode === 'edit' && (<button type="button" onClick={resetForm} className="px-5 py-4 rounded-xl border border-nude text-sm font-medium text-[#8A8079] hover:text-[#3D3833] hover:border-gold/30 transition-colors">Cancelar</button>)}
              </div>
            </form>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-12 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="kintsugi-divider w-12" />
              <h2 className="font-serif font-bold text-xl text-[#3D3833]">Historial de entradas</h2>
              <div className="kintsugi-divider flex-1" />
            </div>
            <p className="text-[11px] text-[#8A8079] mb-4">Toca cualquier entrada para ver el contenido completo, editarla o eliminarla. Los copys de redes sociales están disponibles con botón de copiar.</p>
            <div className="space-y-3">
              {history.map((post) => (<EntryHistoryItem key={post.id} post={post} onEdit={handleEdit} onDelete={handleDelete} />))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
