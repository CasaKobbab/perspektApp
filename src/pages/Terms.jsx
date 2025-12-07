import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useTranslation } from "@/components/i18n/translations";

export default function Terms() {
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
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-black py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
            {currentLocale === 'nb' ? 'Brukervilkår' : 'Terms of Service'}
          </h1>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="lead text-xl mb-6">
              {currentLocale === 'nb' 
                ? 'Velkommen til Perspekt. Ved å bruke vår tjeneste godtar du disse vilkårene.' 
                : 'Welcome to Perspekt. By using our service, you agree to these terms.'}
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Abonnement og Betaling' : 'Subscriptions and Payment'}
            </h3>
            <p>
              {currentLocale === 'nb'
                ? 'Abonnementer fornyes automatisk til de sies opp. Du belastes ved starten av hver periode. Alle priser inkluderer MVA.'
                : 'Subscriptions renew automatically until cancelled. You are charged at the beginning of each period. All prices include VAT.'}
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Angrerett' : 'Right of Withdrawal'}
            </h3>
            <p>
              {currentLocale === 'nb'
                ? 'Som forbruker har du 14 dagers angrerett ved kjøp av digitale tjenester, forutsatt at tjenesten ikke er tatt i bruk.'
                : 'As a consumer, you have a 14-day right of withdrawal for digital services, provided the service has not been accessed/used.'}
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Opphavsrett' : 'Copyright'}
            </h3>
            <p>
              {currentLocale === 'nb'
                ? 'Alt innhold på Perspekt er beskyttet av opphavsrett. Kopiering eller videredistribusjon uten tillatelse er ikke tillatt.'
                : 'All content on Perspekt is protected by copyright. Copying or redistribution without permission is prohibited.'}
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Endringer i vilkår' : 'Changes to Terms'}
            </h3>
            <p>
              {currentLocale === 'nb'
                ? 'Vi forbeholder oss retten til å endre vilkårene. Vesentlige endringer vil bli varslet via e-post eller på nettstedet.'
                : 'We reserve the right to modify these terms. Material changes will be notified via email or on the website.'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}