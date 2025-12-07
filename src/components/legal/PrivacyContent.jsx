import React from 'react';

export default function PrivacyContent({ locale }) {
  const isEn = locale === 'en';

  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "1. Data Controller" : "1. Behandlingsansvarlig"}
        </h2>
        <p>
          {isEn 
            ? "Perspekt AS is the data controller for the personal data processed in connection with the use of our services. Contact information: support@perspekt.no." 
            : "Perspekt AS er behandlingsansvarlig for personopplysningene som behandles i forbindelse med bruk av våre tjenester. Kontaktinformasjon: support@perspekt.no."}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "2. What Data We Collect" : "2. Hvilke opplysninger vi samler inn"}
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{isEn ? "Account Information:" : "Kontoinformasjon:"}</strong> {isEn ? "Name, email address, and password (encrypted)." : "Navn, e-postadresse og passord (kryptert)."}
          </li>
          <li>
            <strong>{isEn ? "Payment Information:" : "Betalingsinformasjon:"}</strong> {isEn ? "We use Stripe for payments. We do not store your full card details locally; these are handled securely by Stripe." : "Vi bruker Stripe for betalinger. Vi lagrer ikke fullstendige kortdetaljer lokalt; disse håndteres sikkert av Stripe."}
          </li>
          <li>
            <strong>{isEn ? "Usage Logs:" : "Brukslogger:"}</strong> {isEn ? "IP addresses, browser type, and reading history to improve our journalism and services." : "IP-adresser, nettlesertype og lesehistorikk for å forbedre journalistikken og tjenestene våre."}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "3. Purpose of Processing" : "3. Formålet med behandlingen"}
        </h2>
        <p>
          {isEn 
            ? "We process your data to deliver our journalism, manage your subscription, send newsletters (if consented), and prevent abuse of our platform." 
            : "Vi behandler opplysningene dine for å levere journalistikken vår, administrere abonnementet ditt, sende nyhetsbrev (hvis samtykket) og forhindre misbruk av plattformen."}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "4. Sharing with Third Parties" : "4. Utlevering til tredjeparter"}
        </h2>
        <p className="mb-2">
          {isEn 
            ? "We do not sell your personal data. We share data with trusted partners essential for our operations:" 
            : "Vi selger ikke personopplysningene dine. Vi deler data med betrodde partnere som er nødvendige for driften:"}
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Stripe:</strong> {isEn ? "For secure payment processing." : "For sikker betalingsbehandling."}
          </li>
          <li>
            <strong>Google / Supabase:</strong> {isEn ? "For authentication and database infrastructure." : "For autentisering og databaseinfrastruktur."}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "5. Your Rights (GDPR)" : "5. Dine rettigheter (GDPR)"}
        </h2>
        <p>
          {isEn 
            ? "You have the right to request access to, correction of, or deletion of your personal data. You can manage most of your data directly in your Account settings." 
            : "Du har rett til å be om innsyn, retting eller sletting av personopplysningene dine. Du kan administrere det meste av dataene dine direkte i Kontoinnstillingene."}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "6. Cookies" : "6. Informasjonskapsler (Cookies)"}
        </h2>
        <p>
          {isEn 
            ? "We use essential cookies to keep you logged in and analytical cookies to understand how our content is consumed. You can control cookie settings in your browser." 
            : "Vi bruker nødvendige informasjonskapsler for å holde deg innlogget, og analytiske kapsler for å forstå hvordan innholdet vårt brukes. Du kan kontrollere innstillingene i nettleseren din."}
        </p>
      </section>
    </div>
  );
}