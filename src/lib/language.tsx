import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'ta' | 'en';

type LanguageContextValue = {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') return 'ta';
    const saved = window.localStorage.getItem('app-language');
    return saved === 'en' ? 'en' : 'ta';
  });

  useEffect(() => {
    window.localStorage.setItem('app-language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((prev) => (prev === 'ta' ? 'en' : 'ta')),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useAppLanguage must be used inside LanguageProvider');
  }
  return context;
}
