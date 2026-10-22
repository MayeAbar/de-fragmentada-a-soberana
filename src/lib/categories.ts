import type { DiaryCategory } from './supabase';

export interface CategoryMeta {
  id: DiaryCategory;
  label: string;
  description: string;
  emoji: string;
  accent: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'cuerpo',
    label: 'Cuerpo',
    description: 'Mi hogar fÃ­sico',
    emoji: 'ð',
    accent: '#B8951E',
  },
  {
    id: 'mente',
    label: 'Mente y Espiritualidad',
    description: 'Mi paz interior',
    emoji: 'ð§ ',
    accent: '#C9A227',
  },
  {
    id: 'madre',
    label: 'Maternidad',
    description: 'Criar con consciencia',
    emoji: 'ð¤±',
    accent: '#D4AF37',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    description: 'Mi control y libertad',
    emoji: 'ð',
    accent: '#B8951E',
  },
  {
    id: 'mujer',
    label: 'Ser Mujer',
    description: 'La identidad que las abarca a todas',
    emoji: 'ð',
    accent: '#D4AF37',
  },
];

export function getCategoryMeta(id: DiaryCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
