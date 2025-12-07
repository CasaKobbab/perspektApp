import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, MessageCircle, Users, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";

export default function Terms() {
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
               {isNorwegian ? 'Vilkår for bruk' : 'Terms of Service'}
             </h1>

             <p className="lead text-lg mb-6">
               {isNorwegian 
                 ? 'Velkommen til Perspekt. Ved å bruke våre tjenester godtar du følgende vilkår. Vennligst les dem nøye.'
                 : 'Welcome to Perspekt. By using our services, you agree to the following terms. Please read them carefully.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '1. Abonnement og fornyelse' : '1. Subscription and Renewal'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Ditt abonnement fornyes automatisk ved utløpet av hver abonnementsperiode (månedlig eller årlig) inntil du sier det opp. Beløpet trekkes automatisk fra ditt registrerte betalingskort.'
                 : 'Your subscription renews automatically at the end of each subscription period (monthly or annual) until you cancel it. The amount is automatically charged to your registered payment card.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '2. Angrerett' : '2. Right of Withdrawal'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Ved kjøp av digitalt innhold som leveres umiddelbart, samtykker du til at leveringen påbegynnes med en gang, og at du dermed gir avkall på angreretten iht. angrerettloven § 22 bokstav n.'
                 : 'When purchasing digital content that is delivered immediately, you agree that delivery begins immediately, and that you thereby waive your right of withdrawal pursuant to applicable consumer protection laws regarding digital content.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '3. Brukerkonto og sikkerhet' : '3. User Account and Security'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Du er ansvarlig for å holde passordet ditt hemmelig. Deling av brukerkonto med andre er ikke tillatt. Vi forbeholder oss retten til å stenge kontoer ved mistanke om misbruk eller deling.'
                 : 'You are responsible for keeping your password secret. Sharing your user account with others is not prohibited. We reserve the right to suspend accounts upon suspicion of misuse or sharing.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '4. Atferdsregler' : '4. Code of Conduct'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Vi oppfordrer til en saklig og respektfull debatt. Trakassering, hatefulle ytringer eller spam i kommentarfelt vil føre til utestengelse.'
                 : 'We encourage factual and respectful debate. Harassment, hate speech, or spam in comment sections will result in banning.'}
             </p>

             <h2 className="text-2xl font-semibold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
               {isNorwegian ? '5. Endringer i vilkårene' : '5. Changes to Terms'}
             </h2>
             <p>
               {isNorwegian 
                 ? 'Vi kan oppdatere disse vilkårene fra tid til annen. Vesentlige endringer vil bli varslet via e-post eller ved innlogging.'
                 : 'We may update these terms from time to time. Significant changes will be notified via email or upon login.'}
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