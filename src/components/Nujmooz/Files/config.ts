import { FileText, Lightbulb, Type, Palette, Eye, Sparkles } from 'lucide-react';
import type { FileType, FileTypeConfig } from './types';

export const FILE_TYPE_CONFIG: Record<FileType, FileTypeConfig> = {
  brief: {
    icon: FileText,
    label: {
      ar: 'موجز إبداعي',
      en: 'Brief'
    },
    gradientColor: 'from-blue-500/20 to-blue-600/20'
  },
  ideas: {
    icon: Lightbulb,
    label: {
      ar: 'أفكار',
      en: 'Ideas'
    },
    gradientColor: 'from-yellow-500/20 to-yellow-600/20'
  },
  names: {
    icon: Type,
    label: {
      ar: 'أسماء',
      en: 'Names'
    },
    gradientColor: 'from-purple-500/20 to-purple-600/20'
  },
  tone: {
    icon: Sparkles,
    label: {
      ar: 'نبرة',
      en: 'Tone'
    },
    gradientColor: 'from-green-500/20 to-green-600/20'
  },
  colors: {
    icon: Palette,
    label: {
      ar: 'ألوان',
      en: 'Colors'
    },
    gradientColor: 'from-pink-500/20 to-pink-600/20'
  },
  strategy: {
    icon: Eye,
    label: {
      ar: 'استراتيجية',
      en: 'Strategy'
    },
    gradientColor: 'from-indigo-500/20 to-indigo-600/20'
  }
}; 