import React, { useState, useEffect } from "react";
import { useTranslation } from "@/components/i18n/translations";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Terms() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' or 'privacy'
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const content = {
    nb: {
      title: "Vilkår og Personvern",
      tabs: {
        terms: "Brukervilkår",
        privacy: "Personvernerklæring"
      },
      terms: [
        {
          title: "1. Abonnement og Betaling",
          body: "Abonnementet løper forskuddsvis og fornyes automatisk (månedlig eller årlig) inntil det sies opp. Beløpet trekkes automatisk fra ditt registrerte betalingskort via Stripe. Du kan når som helst administrere eller avslutte abonnementet via \"Min Konto\"."
        },
        {
          title: "2. Angrerett (Viktig)",
          body: "Ved kjøp av digitale tjenester (tilgang til artikler og innhold) samtykker du til at leveringen starter umiddelbart. Du erkjenner at angreretten på 14 dager derfor bortfaller, jf. angrerettloven § 22 bokstav n."
        },
        {
          title: "3. Oppsigelse",
          body: "Du kan si opp abonnementet når som helst. Tilgangen vil da vare ut den inneværende perioden du allerede har betalt for. Det gis ingen refusjon for påbegynte perioder."
        },
        {
          title: "4. Opphavsrett og Bruk",
          body: "Alt innhold på Perspekt (tekst, bilder, video) er beskyttet av åndsverkloven. Abonnementet er personlig. Det er ikke tillatt å dele innloggingsinformasjon eller kopiere/distribuere innholdet uten tillatelse."
        },
        {
          title: "5. Debattregler",
          body: "Vi oppfordrer til en saklig og respektfull debatt. Perspekt forbeholder seg retten til å fjerne upassende kommentarer og utestenge brukere som bryter våre retningslinjer."
        }
      ],
      privacy: [
        {
          title: "1. Behandlingsansvarlig",
          body: "Perspekt AS er behandlingsansvarlig for personopplysningene vi samler inn. Vi tar ditt personvern på alvor og følger gjeldende norsk lovgivning, inkludert personopplysningsloven og GDPR."
        },
        {
          title: "2. Hvilke opplysninger samler vi inn?",
          body: "Konto-informasjon: Navn, e-postadresse og passord (kryptert) når du registrerer deg.\nBetalingsinformasjon: Vi lagrer ikke kortnummer selv. Transaksjoner behandles sikkert via vår betalingspartner, Stripe. Vi lagrer kun en referanse (token) til betalingsmetoden.\nBruksmønster: Informasjon om hvordan du bruker nettstedet (f.eks. leste artikler) for å forbedre brukeropplevelsen og gi relevante anbefalinger."
        },
        {
          title: "3. Formålet med behandlingen",
          body: "Vi bruker opplysningene til å:\n- Levere tjenestene du abonnerer på (tilgang til pluss-innhold).\n- Administrere kundeforholdet og betalinger.\n- Sende deg nyhetsbrev og relevant informasjon (du kan når som helst melde deg av)."
        },
        {
          title: "4. Dine rettigheter",
          body: "Du har rett til innsyn i egne opplysninger, rett til å få uriktige opplysninger korrigert, og i visse tilfeller rett til å få opplysningene slettet (\"retten til å bli glemt\"). Kontakt oss på personvern@perspekt.no for henvendelser."
        }
      ]
    },
    en: {
      title: "Terms & Privacy",
      tabs: {
        terms: "Terms of Service",
        privacy: "Privacy Policy"
      },
      terms: [
        {
          title: "1. Subscription and Payment",
          body: "Subscriptions are billed in advance and renew automatically (monthly or annually) until cancelled. Payments are processed automatically via Stripe. You can manage or cancel your subscription at any time via \"My Account\"."
        },
        {
          title: "2. Right of Withdrawal",
          body: "For the purchase of digital services (access to content), you consent to immediate delivery. You acknowledge that the standard 14-day right of withdrawal is therefore waived, in accordance with the Right of Withdrawal Act (Angrerettloven)."
        },
        {
          title: "3. Cancellation",
          body: "You may cancel your subscription at any time. Access will continue until the end of the current billing period. No refunds are provided for partial periods."
        },
        {
          title: "4. Copyright and Usage",
          body: "All content on Perspekt (text, images, video) is protected by copyright law. Your subscription is personal. Sharing login credentials or redistributing content without permission is prohibited."
        },
        {
          title: "5. User Conduct",
          body: "We encourage civil and respectful debate. Perspekt reserves the right to remove inappropriate comments and ban users who violate our community guidelines."
        }
      ],
      privacy: [
        {
          title: "1. Data Controller",
          body: "Perspekt AS is the data controller for the personal data we collect. We take your privacy seriously and comply with applicable Norwegian laws, including the Personal Data Act and GDPR."
        },
        {
          title: "2. What Information Do We Collect?",
          body: "Account Information: Name, email address, and encrypted password upon registration.\nPayment Information: We do not store credit card numbers directly. Transactions are securely handled by our payment partner, Stripe. We only store a reference (token) to the payment method.\nUsage Data: Information on how you use the site (e.g., articles read) to improve user experience and provide recommendations."
        },
        {
          title: "3. Purpose of Processing",
          body: "We use this data to:\n- Deliver the services you subscribe to (premium content access).\n- Manage customer relationships and payments.\n- Send newsletters and relevant updates (you can opt-out at any time)."
        },
        {
          title: "4. Your Rights",
          body: "You have the right to access your data, correct inaccuracies, and in certain cases, request deletion (\"the right to be forgotten\"). Contact us at personvern@perspekt.no for requests."
        }
      ]
    }
  };

  const tContent = content[currentLocale] || content.nb;

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
            {tContent.title}
          </h1>

          {/* Custom Tabs */}
          <div className="flex space-x-2 mb-8 bg-white/40 dark:bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/20 dark:border-white/10 w-fit">
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'terms'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              {tContent.tabs.terms}
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'privacy'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              {tContent.tabs.privacy}
            </button>
          </div>

          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-sm">
            {activeTab === 'terms' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {tContent.terms.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {tContent.privacy.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
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