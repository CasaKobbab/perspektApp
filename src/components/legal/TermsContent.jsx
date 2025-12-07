import React from 'react';

export default function TermsContent({ locale = 'nb' }) {
  const isNorwegian = locale === 'nb';

  return (
    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
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
  );
}