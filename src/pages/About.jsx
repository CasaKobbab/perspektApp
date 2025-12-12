import React, { useEffect, useState } from "react";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { SpotlightBackground } from "@/components/ui/SpotlightBackground";
import { motion } from "framer-motion";

export default function About() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');

    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink transition-colors duration-300 relative overflow-hidden">
      <SpotlightBackground />
      
      {/* Aurora Glass Blobs (Custom for this page) */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          {/* Glass Card Container */}
          <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-12 md:p-16 shadow-2xl">
            
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
              {t('about.title')}
            </h1>

            <div className="space-y-8 text-lg md:text-xl text-gray-700 dark:text-gray-300 font-body leading-relaxed">
              <p className="font-medium text-gray-900 dark:text-white">
                {t('about.intro')}
              </p>

              <p>
                {t('about.mission')}
              </p>

              <p>
                {t('about.values')}
              </p>

              <div className="pt-8 text-center border-t border-gray-200 dark:border-gray-800">
                <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  {t('about.joinUs')}
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}