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
          title: "Innledning",
          body: "Perspective Media AS\nDisse vilkårene gjelder for kjøp av abonnement og digitale tjenester levert av Perspective Media AS. Ved å gjennomføre et kjøp godtar du vilkårene nedenfor."
        },
        {
          title: "1. Abonnement",
          body: "1.1 Innhold og tilgang\nEt abonnement gir tilgang til digitalt innhold og eventuelle medlemsfordeler som beskrevet på kjøpstidspunktet. Tilgang gis umiddelbart etter godkjent betaling.\n\n1.2 Automatisk fornyelse\nAbonnementet fornyes automatisk ved utløpet av hver periode, med mindre det sies opp. Du blir belastet på nytt for hver abonnementsperiode.\n\n1.3 Betaling\nBetaling skjer forskuddsvis via Vipps eller Stripe (kort).\n• Ved bruk av Vipps opprettes en fast betalingsavtale, som du kan administrere og avslutte i Vipps-appen:\nProfil → Abonnement → Administrer Abonnement → Avslutt Abonnement (Cancel subscription).\n• Ved bruk av Stripe behandles kortinformasjon av Stripe – vi lagrer ingen kortdata selv.\nKvittering sendes automatisk på e-post etter hver transaksjon.\n\n1.4 Oppsigelse\nAbonnementet kan sies opp når som helst. Oppsigelsen gjelder fra utløpet av inneværende betalte periode. Betalte perioder refunderes ikke."
        },
        {
          title: "2. Angrerett",
          body: "2.1 Digitale abonnement\nDu har 14 dagers angrerett fra kjøpsdato – forutsatt at du ikke har tatt abonnementet i bruk.\nAngreretten bortfaller hvis:\n• du har fått tilgang til innholdet,\n• du har samtykket til umiddelbar levering, og\n• du har akseptert at angreretten da bortfaller.\nDette bekreftes ved kjøp.\nØnsker du å bruke angreretten, må du kontakte oss innen fristen."
        },
        {
          title: "3. Endringer i vilkår",
          body: "Perspective Media AS forbeholder seg retten til å oppdatere disse vilkårene. Ved vesentlige endringer varsles abonnenter på e-post eller ved innlogging i forkant."
        },
        {
          title: "4. Kontakt og klager",
          body: "Spørsmål, oppsigelser eller bruk av angrerett kan sendes til:\nE-post: info@perspekt.no\nOrganisasjonsnummer: 936 463 096\nAdresse: Olafiagangen 3, 0188 Oslo\n\nVed tvist kan du kontakte Forbrukerrådet eller benytte EUs klageportal:\nhttps://ec.europa.eu/odr"
        }
      ],
      privacy: [
        {
          title: "1. Behandlingsansvarlig",
          body: "Perspekt AS (heretter \"Perspective Media AS\") er behandlingsansvarlig for personopplysningene vi samler inn. Vi tar ditt personvern på alvor og følger gjeldende norsk lovgivning, inkludert personopplysningsloven og GDPR."
        },
        {
          title: "2. Hvilke opplysninger samler vi inn?",
          body: "Konto-informasjon: Navn, e-postadresse og passord (kryptert) når du registrerer deg.\nBetalingsinformasjon: Vi lagrer ikke kortnummer selv. Transaksjoner behandles sikkert via vår betalingspartner, Stripe. Vi lagrer kun en referanse (token) til betalingsmetoden.\nBruksmønster: Informasjon om hvordan du bruker nettstedet (f.eks. leste artikler) for å forbedre brukeropplevelsen og gi relevante anbefalinger."
        },
        {
          title: "3. Kontaktinformasjon og samtykke",
          body: "Når du fyller ut skjemaer på nettsiden vår, lagres informasjonen din i vårt CRM-system. Ved å sende inn skjema, laste ned innhold eller signere, samtykker du til at vi kan kontakte deg via telefon, SMS og e-post i forbindelse med det du har gjort på nettsiden.\n\nVi kan også kontakte deg og tilpasse kommunikasjonen vår når vi har en berettiget interesse, for eksempel når:\n- du har vist interesse for innhold eller tjenester\n- du har lastet ned eller samhandlet med noe på nettstedet\n- du har tidligere vært i kontakt med oss"
        },
        {
          title: "4. Markedsføring og målrettet annonsering",
          body: "Vi bruker informasjonskapsler og digitale spor for å:\n- forbedre brukeropplevelsen\n- vise relevante annonser (retargeting)\n- kontakte deg hvis du har vist interesse gjennom handlinger på nettstedet\n\nDette betyr at vi kan kjøre annonser mot deg i kanaler som Meta (Facebook/Instagram) og Google hvis du har besøkt nettstedet vårt eller utført handlinger som viser berettiget interesse."
        },
        {
          title: "5. Informasjonskapsler og analyseverktøy",
          body: "Vi bruker følgende verktøy på perspektivemedia.no:\n- Google Analytics – innsikt og trafikkstatistikk\n- Facebook Pixel og Google Pixel – for kampanjeoptimalisering og retargeting\n- Cookies – for å gi deg en bedre opplevelse og forstå hvordan nettstedet brukes\n\nDu kan deaktivere eller begrense informasjonskapsler i nettleseren din. Hvis du er logget inn med en Google-konto, kan Google samle inn ytterligere data i henhold til deres vilkår."
        },
        {
          title: "6. Utlevering av personopplysninger til tredjeparter",
          body: "Perspective Media AS deler ikke personopplysninger med andre enn:\n- nødvendige tekniske og administrative underleverandører\n- offentlige myndigheter når loven krever det\n- betalingsleverandører (Stripe) når du gjennomfører kjøp\n- databehandlere som bistår oss med kommunikasjon og drift"
        },
        {
          title: "7. Mailchimp",
          body: "Vi bruker Mailchimp til:\n- lagring av e-postadresser\n- utsending av nyhetsbrev og kampanjer\n- automatiserte e-postkampanjer\n\nMailchimp behandler personopplysninger på våre vegne i samsvar med GDPR og bruker standard personvernbestemmelser (SCC) ved overføring av data til USA.\nAll overføring av personopplysninger er kryptert med SSL."
        },
        {
          title: "8. Dine rettigheter",
          body: "Du har rett til:\n- innsyn i informasjon vi lagrer om deg\n- be om retting eller sletting\n- protestere mot behandling\n- trekke tilbake samtykke\n- be om begrenset behandling\n- be om dataportabilitet der det er relevant\n\nKontakt oss via e-post eller telefon hvis du ønsker å benytte dine rettigheter. Vi svarer så raskt som mulig og senest innen 30 dager.\nFor sensitive forespørsler kan vi be deg om å bekrefte identiteten din."
        },
        {
          title: "9. Klage",
          body: "Hvis du mener at vår behandling av personopplysninger ikke er i tråd med regelverket, kan du klage til Datatilsynet."
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
          title: "Introduction",
          body: "Perspective Media AS\nThese terms apply to the purchase of subscriptions and digital services provided by Perspective Media AS. By completing a purchase, you agree to the terms below."
        },
        {
          title: "1. Subscription",
          body: "1.1 Content and Access\nA subscription provides access to digital content and any membership benefits as described at the time of purchase. Access is granted immediately upon approved payment.\n\n1.2 Automatic Renewal\nThe subscription renews automatically at the end of each period unless cancelled. You will be charged again for each subscription period.\n\n1.3 Payment\nPayment is made in advance via Vipps or Stripe (card).\n• When using Vipps, a fixed payment agreement is created, which you can manage and end in the Vipps app:\nProfile → Subscriptions → Manage Subscriptions → Cancel Subscription.\n• When using Stripe, card information is processed by Stripe – we do not store any card data ourselves.\nA receipt is sent automatically by email after each transaction.\n\n1.4 Cancellation\nThe subscription can be cancelled at any time. The cancellation applies from the expiration of the current paid period. Paid periods are not refunded."
        },
        {
          title: "2. Right of Withdrawal",
          body: "2.1 Digital Subscriptions\nYou have a 14-day right of withdrawal from the purchase date – provided you have not started using the subscription.\nThe right of withdrawal lapses if:\n• you have gained access to the content,\n• you have consented to immediate delivery, and\n• you have accepted that the right of withdrawal then lapses.\nThis is confirmed at purchase.\nIf you wish to exercise the right of withdrawal, you must contact us within the deadline."
        },
        {
          title: "3. Changes to Terms",
          body: "Perspective Media AS reserves the right to update these terms. In the event of significant changes, subscribers will be notified by email or upon login in advance."
        },
        {
          title: "4. Contact and Complaints",
          body: "Questions, cancellations, or use of the right of withdrawal can be sent to:\nEmail: info@perspekt.no\nOrganization number: 936 463 096\nAddress: Olafiagangen 3, 0188 Oslo\n\nIn case of a dispute, you can contact the Consumer Council or use the EU's complaint portal:\nhttps://ec.europa.eu/odr"
        }
      ],
      privacy: [
        {
          title: "1. Data Controller",
          body: "Perspekt AS (hereinafter \"Perspective Media AS\") is the data controller for the personal data we collect. We take your privacy seriously and comply with applicable Norwegian laws, including the Personal Data Act and GDPR."
        },
        {
          title: "2. What Information Do We Collect?",
          body: "Account Information: Name, email address, and encrypted password upon registration.\nPayment Information: We do not store credit card numbers directly. Transactions are securely handled by our payment partner, Stripe. We only store a reference (token) to the payment method.\nUsage Data: Information on how you use the site (e.g., articles read) to improve user experience and provide recommendations."
        },
        {
          title: "3. Contact Information and Consent",
          body: "When you fill out forms on our website, your information is stored in our CRM system. By submitting a form, downloading content or signing, you agree that we may contact you by phone, SMS and email in connection with what you have done on the website.\n\nWe may also contact you and tailor our communications to you when we have a legitimate interest, for example when:\n- you have shown interest in content or services\n- you have downloaded or interacted with something on the website\n- you have previously been in contact with us"
        },
        {
          title: "4. Marketing and targeted advertising",
          body: "We use cookies and digital traces to:\n- improve the user experience\n- show relevant ads (retargeting)\n- contact you if you have shown interest through actions on the website\n\nThis means that we can run ads against you in channels such as Meta (Facebook/Instagram) and Google if you have visited our website or taken actions that show legitimate interest."
        },
        {
          title: "5. Cookies and analysis tools",
          body: "We use the following tools on perspektivemedia.no:\n- Google Analytics – insights and traffic statistics\n- Facebook Pixel and Google Pixel – for campaign optimization and retargeting\n- Cookies – to give you a better experience and understand how the website is used\n\nYou can disable or limit cookies in your browser. If you are logged in with a Google account, Google may collect additional data in accordance with its terms."
        },
        {
          title: "6. Disclosure of personal data to third parties",
          body: "Perspective Media AS does not share personal data with anyone other than:\n- necessary technical and administrative subcontractors\n- public authorities when required by law\n- payment providers (Stripe) when you make purchases\n- data processors who assist us with communication and operations"
        },
        {
          title: "7. Mailchimp",
          body: "We use Mailchimp for:\n- storing email addresses\n- sending newsletters and campaigns\n- automated email campaigns\n\nMailchimp processes personal data on our behalf in accordance with the GDPR and uses Standard Contractual Clauses (SCC) when transferring data to the USA.\nAll transfers of personal data are encrypted with SSL."
        },
        {
          title: "8. Your Rights",
          body: "You have the right to:\n- access information we store about you\n- request rectification or erasure\n- object to processing\n- withdraw consent\n- request restricted processing\n- request data portability where relevant\n\nContact us by email or phone if you wish to exercise your rights. We will respond as quickly as possible and within 30 days.\nFor sensitive requests, we may ask you to confirm your identity."
        },
        {
          title: "9. Complaint",
          body: "If you believe that our processing of personal data is not in line with the regulations, you can complain to the Norwegian Data Protection Authority (Datatilsynet)."
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
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
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