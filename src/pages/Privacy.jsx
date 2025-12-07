import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useTranslation } from "@/components/i18n/translations";

export default function Privacy() {
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
            {currentLocale === 'nb' ? 'Personvernerklæring' : 'Privacy Policy'}
          </h1>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="lead text-xl mb-6">
              {currentLocale === 'nb' 
                ? 'Hos Perspekt tar vi ditt personvern på alvor. Denne erklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger.' 
                : 'At Perspekt, we take your privacy seriously. This policy explains how we collect, use, and protect your personal data.'}
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Behandlingsansvarlig' : 'Data Controller'}
            </h3>
            <p>
              {currentLocale === 'nb'
                ? 'Perspekt AS er ansvarlig for behandlingen av personopplysninger på denne nettsiden. Kontakt oss på personvern@perspekt.no hvis du har spørsmål.'
                : 'Perspekt AS is the data controller for the personal data processed on this website. Contact us at personvern@perspekt.no if you have any questions.'}
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Hvilke data samler vi inn?' : 'What Data We Collect'}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {currentLocale === 'nb' 
                  ? 'Informasjon du oppgir ved registrering (navn, e-post, passord).'
                  : 'Information you provide upon registration (name, email, password).'}
              </li>
              <li>
                {currentLocale === 'nb' 
                  ? 'Betalingsinformasjon (håndteres sikkert av Stripe).'
                  : 'Payment information (securely handled by Stripe).'}
              </li>
              <li>
                {currentLocale === 'nb' 
                  ? 'Bruksmønstre og leseaktivitet for å forbedre tjenesten.'
                  : 'Usage patterns and reading activity to improve our service.'}
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              {currentLocale === 'nb' ? 'Dine rettigheter' : 'Your Rights'}
            </h3>
            <p>
              {currentLocale === 'nb'
                ? 'Du har rett til innsyn, retting, sletting og dataportabilitet. Du kan når som helst trekke tilbake samtykke til markedsføring.'
                : 'You have the right to access, rectification, erasure, and data portability. You can withdraw consent for marketing at any time.'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}