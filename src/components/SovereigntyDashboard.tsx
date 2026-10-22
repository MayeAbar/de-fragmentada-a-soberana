import { useEffect, useState } from 'react';
import { Dumbbell, Brain, Baby, BarChart3, Crown } from 'lucide-react';
import { supabase, type SovereigntyStat, type DiaryPost } from '@/lib/supabase';
import { computeStreak, type StreakResult } from '@/lib/streak';

interface DashboardData {
  bodyStreak: string;
  bodyDetail: string;
  mentalStreak: StreakResult | null;
}

export default function SovereigntyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    (async () => {
      const { data: stats } = await supabase.from('sovereignty_stats').select('*');
      const { data: posts } = await supabase
        .from('diary_posts')
        .select('created_at')
        .order('created_at', { ascending: false });

      const map = new Map<string, string>();
      (stats as SovereigntyStat[] | null)?.forEach((s) => map.set(s.metric_key, s.metric_value));

      let mentalStreak: StreakResult | null = null;
      if (posts && posts.length > 0) {
        mentalStreak = computeStreak((posts as DiaryPost[]).map((p) => p.created_at));
      }

      setData({
        bodyStreak: map.get('body_streak') ?? '0',
        bodyDetail: map.get('body_detail') ?? '',
        mentalStreak,
      });
    })();
  }, []);

  if (!data) return null;

  const cards = [
    { icon: Dumbbell, label: 'Cuerpo', value: `${data.bodyStreak} días`, detail: data.bodyDetail },
    { icon: Brain, label: 'Mente y Espiritualidad', value: data.mentalStreak ? (data.mentalStreak.isPaused ? 'Pausa de Enfoque' : `${data.mentalStreak.count} días`) : '—', detail: data.mentalStreak?.label ?? '', paused: data.mentalStreak?.isPaused },
    { icon: Baby, label: 'Maternidad', value: 'Activa', detail: 'Criar con consciencia' },
    { icon: BarChart3, label: 'Finanzas', value: 'En control', detail: 'Mi libertad' },
    { icon: Crown, label: 'Ser Mujer', value: 'Soberana', detail: 'La identidad que abarca todo' },
  ];

  return (
    <section className="pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="glass-card rounded-2xl p-5 lg:p-6 gold-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A8079]">Centro de Soberanía</span>
            <span className="flex items-center gap-1.5 text-[10px] text-[#8A8079]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-gold" />
              En vivo
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {cards.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-full border border-nude grid place-items-center">
                  <c.icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A8079]">{c.label}</p>
                  <p className={`mt-1 font-serif text-base font-semibold leading-tight ${c.paused ? 'italic text-[#8A8079]' : 'text-[#3D3833]'}`}>{c.value}</p>
                  <p className="mt-0.5 text-[11px] text-[#8A8079] leading-snug truncate">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
