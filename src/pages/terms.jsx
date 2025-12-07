import React, { useState, useEffect } from "react";
import TermsContent from "@/components/legal/TermsContent";
import { useTranslation } from "@/components/i18n/translations";

export default function Terms() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred_locale') || 'nb';
    setCurrentLocale(savedLocale);

    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 pb-2">
            {currentLocale === 'en' ? "Terms of Service" : "Brukervilkår"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {currentLocale === 'en' ? "Last updated: December 2025" : "Sist oppdatert: Desember 2025"}
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-10 shadow-sm">
          <TermsContent locale={currentLocale} />
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>
            {currentLocale === 'en' 
              ? "Questions about our terms? Contact us at " 
              : "Spørsmål om vilkårene? Kontakt oss på "}
            <a href="mailto:support@perspekt.no" className="text-teal-600 hover:text-teal-500 underline">
              support@perspekt.no
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}