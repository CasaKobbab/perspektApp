import React from 'react';
import Layout from '../Layout'; // Assuming Layout.js is in root based on context, adjusted if needed during check
import PrivacyContent from '../components/legal/PrivacyContent';
import { useTranslation } from "@/components/i18n/translations";

export default function PrivacyPage() {
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  
  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
           {/* Ambient glow inside card */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>
           
           <div className="relative z-10">
             <PrivacyContent locale={currentLocale} />
           </div>
        </div>
      </div>
    </div>
  );
}