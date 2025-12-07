import React from 'react';

export default function TermsContent({ locale }) {
  const isEn = locale === 'en';

  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "1. Introduction" : "1. Innledning"}
        </h2>
        <p>
          {isEn 
            ? "Welcome to Perspekt. By creating an account or subscribing, you agree to these Terms of Service. These terms constitute a binding agreement between you and Perspekt AS." 
            : "Velkommen til Perspekt. Ved å opprette en konto eller abonnere, godtar du disse brukervilkårene. Disse vilkårene utgjør en bindende avtale mellom deg og Perspekt AS."}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "2. Subscription & Payments" : "2. Abonnement og betaling"}
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{isEn ? "Recurring Billing:" : "Løpende fakturering:"}</strong> {isEn ? "Subscriptions are billed in advance on a monthly or annual basis. The subscription renews automatically unless cancelled." : "Abonnement faktureres forskuddsvis månedlig eller årlig. Abonnementet fornyes automatisk med mindre det sies opp."}
          </li>
          <li>
            <strong>{isEn ? "Cancellation:" : "Oppsigelse:"}</strong> {isEn ? "You can cancel your subscription at any time via 'My Account'. Access continues until the end of the current billing period." : "Du kan si opp abonnementet når som helst via 'Min konto'. Tilgangen fortsetter ut inneværende betalingsperiode."}
          </li>
          <li>
            <strong>{isEn ? "Price Changes:" : "Prisendringer:"}</strong> {isEn ? "We reserve the right to adjust prices with at least 30 days notice." : "Vi forbeholder oss retten til å justere priser med minst 30 dagers varsel."}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "3. Right of Withdrawal (Angrerett)" : "3. Angrerett"}
        </h2>
        <p>
          {isEn 
            ? "By purchasing a digital subscription, you acknowledge that access to the content is granted immediately. Consequently, you agree to waive the standard 14-day right of withdrawal for digital content once the service has started, in accordance with the Norwegian Right of Cancellation Act." 
            : "Ved kjøp av digitalt abonnement aksepterer du at tilgang til innholdet gis umiddelbart. Følgelig samtykker du i at den vanlige 14 dagers angreretten bortfaller for digitalt innhold så snart tjenesten er påbegynt, i henhold til Angrerettloven."}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "4. User Conduct" : "4. Brukeratferd"}
        </h2>
        <p>
          {isEn 
            ? "Perspekt encourages open and civilized debate. We do not tolerate hate speech, harassment, or illegal content in comments. Violations may result in account suspension without refund." 
            : "Perspekt oppfordrer til åpen og sivilisert debatt. Vi tolererer ikke hatytringer, trakassering eller ulovlig innhold i kommentarfelt. Brudd kan føre til utestengelse uten refusjon."}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
          {isEn ? "5. Intellectual Property" : "5. Opphavsrett"}
        </h2>
        <p>
          {isEn 
            ? "All content published on Perspekt (text, images, video) is protected by copyright. You may not reproduce, distribute, or use content for commercial purposes without written permission." 
            : "Alt innhold publisert på Perspekt (tekst, bilder, video) er beskyttet av opphavsrett. Du kan ikke reprodusere, distribuere eller bruke innhold til kommersielle formål uten skriftlig tillatelse."}
        </p>
      </section>
    </div>
  );
}