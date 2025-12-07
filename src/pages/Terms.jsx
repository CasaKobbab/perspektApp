import React, { useState, useEffect } from "react";
import { useTranslation } from "@/components/i18n/translations";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Terms() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-300">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 dark:opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <Link to="/Home">
          <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.backToSite') || "Tilbake til siden"}
          </Button>
        </Link>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
            {currentLocale === 'nb' ? "Vilkår for bruk" : "Terms of Service"}
          </h1>

          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-sm">
            <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
              {currentLocale === 'nb' 
                ? "Velkommen til Perspekt. Ved å bruke våre tjenester godtar du disse vilkårene." 
                : "Welcome to Perspekt. By using our services, you agree to these terms."}
            </p>

            <h3>1. {currentLocale === 'nb' ? "Aksept av vilkår" : "Acceptance of Terms"}</h3>
            <p>
              {currentLocale === 'nb'
                ? "Ved å få tilgang til eller bruke Perspekt, samtykker du til å være bundet av disse vilkårene. Hvis du ikke godtar noen del av vilkårene, kan du ikke bruke tjenestene våre."
                : "By accessing or using Perspekt, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service."}
            </p>

            <h3>2. {currentLocale === 'nb' ? "Kontoer og Abonnement" : "Accounts and Subscriptions"}</h3>
            <p>
              {currentLocale === 'nb'
                ? "Når du oppretter en konto hos oss, må du oppgi informasjon som er nøyaktig, fullstendig og gjeldende til enhver tid. Unnlatelse av å gjøre dette utgjør et brudd på vilkårene."
                : "When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms."}
            </p>

            <h3>3. {currentLocale === 'nb' ? "Opphavsrett" : "Intellectual Property"}</h3>
            <p>
              {currentLocale === 'nb'
                ? "Tjenesten og dens originale innhold (unntatt innhold levert av brukere), funksjoner og funksjonalitet er og vil forbli den eksklusive eiendommen til Perspekt og dets lisensgivere."
                : "The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Perspekt and its licensors."}
            </p>

            <h3>4. {currentLocale === 'nb' ? "Endringer" : "Changes"}</h3>
            <p>
              {currentLocale === 'nb'
                ? "Vi forbeholder oss retten til, etter eget skjønn, å endre eller erstatte disse vilkårene når som helst. Det er ditt ansvar å sjekke denne siden jevnlig for endringer."
                : "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check this page periodically for changes."}
            </p>

            <h3>5. {currentLocale === 'nb' ? "Kontakt Oss" : "Contact Us"}</h3>
            <p>
              {currentLocale === 'nb'
                ? "Hvis du har spørsmål om disse vilkårene, vennligst kontakt oss."
                : "If you have any questions about these Terms, please contact us."}
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mt-8 text-center">
            {currentLocale === 'nb' 
              ? "Sist oppdatert: 7. desember 2025" 
              : "Last updated: December 7, 2025"}
          </p>
        </div>
      </div>
    </div>
  );
}