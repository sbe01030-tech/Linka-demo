import { create } from 'zustand';
import { LangCode, translations, Translations } from '../i18n';

interface LanguageState {
  lang: LangCode;
  t: Translations;
  setLang: (lang: LangCode) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: 'ko',
  t: translations['ko'],
  setLang: (lang: LangCode) => set({ lang, t: translations[lang] }),
}));
