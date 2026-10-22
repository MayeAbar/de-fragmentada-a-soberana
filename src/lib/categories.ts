import type { LucideIcon } from 'lucide-react';
import { Heart, Brain, Baby, Wallet, Crown } from 'lucide-react';
import type { DiaryCategory } from './supabase';

export interface CategoryMeta {
  id: DiaryCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'cuerpo',
    label: 'Cuerpo',
    description: 'Mi hogar físico',
    icon: Heart,
    accent: '#B8951E',
  },
  {
    id: 'mente',
    label: 'Mente y Espiritualidad',
    description: 'Mi paz interior',
    icon: Brain,
    accent: '#C9A227',
  },
  {
    id: 'madre',
    label: 'Maternidad',
    description: 'Criar con consciencia',
    icon: Baby,
    accent: '#D4AF37',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    description: 'Mi control y libertad',
    icon: Wallet,
    accent: '#B8951E',
  },
  {
    id: 'mujer',
    label: 'Ser Mujer',
    description: 'La identidad que las abarca a todas',
    icon: Crown,
    accent: '#D4AF37',
  },
];

export function getCategoryMeta(id: DiaryCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
