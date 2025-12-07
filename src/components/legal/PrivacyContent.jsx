import React from 'react';

export default function PrivacyContent({ locale = 'nb' }) {
  const isNorwegian = locale === 'nb';

  return (
    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
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
  );
}