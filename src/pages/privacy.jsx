import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, MessageCircle, Users, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');

    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };
  
  const isNorwegian = currentLocale === 'nb';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_100%)] dark:bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.2)_0%,_transparent_100%)] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
           
           <div className="relative z-10 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
             <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? 'Personvernerklæring' : 'Privacy Policy'}
             </h1>

             <p className="lead text-lg mb-6">
               {isNorwegian 
                 ? 'Hos Perspekt tar vi ditt personvern på alvor. Denne erklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger.'
                 : 'At Perspekt, we take your privacy seriously. This policy explains how we collect, use, and protect your personal data.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '1. Behandlingsansvarlig' : '1. Data Controller'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Perspekt AS er behandlingsansvarlig for behandlingen av personopplysninger på denne nettsiden. Har du spørsmål om personvern, kan du kontakte oss på privacy@perspekt.no.'
                 : 'Perspekt AS is the data controller for the processing of personal data on this website. If you have questions about privacy, please contact us at privacy@perspekt.no.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '2. Hva slags informasjon samler vi inn?' : '2. What Information Do We Collect?'}
             </h2>
             <ul className="list-disc pl-5 space-y-2">
               <li>
                 <strong>{isNorwegian ? 'Kontoinformasjon:' : 'Account Information:'}</strong> {isNorwegian ? 'Navn, e-postadresse, og passord (kryptert).' : 'Name, email address, and password (encrypted).'}
               </li>
               <li>
                 <strong>{isNorwegian ? 'Bruksmønster:' : 'Usage Data:'}</strong> {isNorwegian ? 'Hvilke artikler du leser, lesetid, og interaksjon med innholdet.' : 'Which articles you read, reading time, and interaction with content.'}
               </li>
               <li>
                 <strong>{isNorwegian ? 'Betalingsinformasjon:' : 'Payment Information:'}</strong> {isNorwegian ? 'Vi lagrer ikke kortnummer selv. Alle betalingstransaksjoner behandles sikkert av vår betalingspartner, Stripe.' : 'We do not store card numbers ourselves. All payment transactions are securely processed by our payment partner, Stripe.'}
               </li>
             </ul>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '3. Dine rettigheter (GDPR)' : '3. Your Rights (GDPR)'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'I henhold til personvernforordningen (GDPR) har du rett til å be om innsyn i, retting av eller sletting av personopplysningene vi behandler om deg. Du har også rett til å protestere mot behandlingen og rett til dataportabilitet.'
                 : 'Under the General Data Protection Regulation (GDPR), you have the right to request access to, rectification of, or erasure of the personal data we process about you. You also have the right to object to processing and the right to data portability.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '4. Sletting av data' : '4. Data Deletion'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Du kan når som helst slette kontoen din via "Min Side". Da vil alle dine personopplysninger bli permanent fjernet fra våre systemer, med unntak av lovpålagt regnskapsinformasjon.'
                 : 'You can delete your account at any time via "My Page". This will permanently remove all your personal data from our systems, with the exception of legally required accounting information.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '5. Informasjonskapsler (Cookies)' : '5. Cookies'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Vi bruker informasjonskapsler for å gi deg en bedre brukeropplevelse, huske dine preferanser (som språk og tema), og analysere trafikken på nettstedet vårt.'
                 : 'We use cookies to provide you with a better user experience, remember your preferences (such as language and theme), and analyze traffic on our website.'}
             </p>

             <p className="mt-8 text-sm text-gray-500">
               {isNorwegian 
                 ? 'Sist oppdatert: 1. Desember 2025' 
                 : 'Last updated: December 1, 2025'}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}