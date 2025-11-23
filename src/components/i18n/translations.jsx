// Translation resources and i18n logic
const translations = {
  nb: {
    // Navigation
    nav: {
      home: "Hjem",
      latest: "Siste",
      topics: "Emner",
      authors: "Forfattere",
      search: "Søk artikler...",
      login: "Logg inn",
      logout: "Logg ut",
      subscribe: "Abonner",
      account: "Min konto",
      admin: "Admin",
      back: "Tilbake",
      backToSite: "Tilbake til siden"
    },
    // Common
    common: {
      loading: "Laster...",
      save: "Lagre",
      cancel: "Avbryt",
      delete: "Slett",
      edit: "Rediger",
      create: "Opprett",
      view: "Vis",
      preview: "Forhåndsvis",
      publish: "Publiser",
      draft: "Kladd",
      published: "Publisert",
      archived: "Arkivert",
      inReview: "Til vurdering",
      free: "Gratis",
      metered: "Begrenset",
      premium: "Premium",
      readingTime: "min lesing",
      featuredOnHomepage: "Fremhev på forsiden",
      yes: "Ja",
      no: "Nei",
      language: "Språk",
      noArticlesFound: "Ingen artikler funnet.",
      all: "Alle",
      readArticles: "Les artikler",
      backToTopics: "Tilbake til emner"
    },
    // Home page
    home: {
      title: "Norsk journalistikk med",
      titleHighlight: "perspekt",
      subtitle: "Uavhengige analyser, kritisk journalistikk og meningsfulle debatter som setter dagsordenen i Norge.",
      startSubscription: "Start abonnement",
      welcomeBack: "Velkommen tilbake",
      readLatestArticles: "Les siste artikler",
      featured: "Fremhevet",
      latestArticles: "Siste artikler",
      latestSubtitle: "Ferske perspektiver og analyser",
      seeAll: "Se alle",
      popularTopics: "Populære emner",
      getAccess: "Få tilgang til alt",
      subscribeSupport: "Abonner for å lese alle artikler og støtte uavhengig journalistikk.",
      seePrices: "Se priser"
    },
    // Newsletter
    newsletter: {
      title: "Få vårt nyhetsbrev",
      description: "Viktige nyheter og analyser direkte i innboksen din.",
      placeholder: "Din e-postadresse",
      subscribe: "Meld meg på",
      subscribing: "Melder på...",
      thanks: "Takk!",
      subscribed: "Du er nå påmeldt vårt nyhetsbrev.",
      privacy: "Vi respekterer ditt personvern. Avmeld når som helst."
    },
    // Topics
    topics: {
      news: "Nyheter",
      opinion: "Mening",
      culture: "Kultur",
      technology: "Teknologi",
      economy: "Økonomi",
      sports: "Sport",
      subtitle: "Utforsk våre artikler innenfor forskjellige emner og kategorier",
      newsDescription: "Siste nyheter og aktuelle hendelser",
      opinionDescription: "Meninger, kommentarer og debatt",
      cultureDescription: "Kunst, litteratur og kulturliv",
      technologyDescription: "Teknologi og digitale trender",
      economyDescription: "Økonomi, finans og næringsliv",
      sportsDescription: "Sport og idrett"
    },
    // Authors
    authors: {
      subtitle: "Møt våre forfattere og journalister",
      articles: "artikler",
      latestArticle: "Seneste artikkel",
      viewAllArticles: "Se alle artikler",
      noAuthorsFound: "Ingen forfattere funnet"
    },
    // Article
    article: {
      relatedArticles: "Relaterte artikler",
      seeAllFrom: "Se alle fra",
      premiumContent: "Premium-innhold",
      limitedAccess: "Begrenset tilgang",
      premiumDescription: "Dette innholdet er kun tilgjengelig for abonnenter.",
      limitedDescription: "Du har nådd din grense for gratis artikler denne måneden.",
      subscribeNow: "Abonner nå",
      subscribeToRead: "Abonner for å lese",
      articleNotFound: "Artikkelen ble ikke funnet.",
      goToHomepage: "Gå til forsiden"
    },
    // Subscribe page
    subscribe: {
      title: "Velg et abonnement som passer deg",
      subtitle: "Få tilgang til uavhengig journalistikk og dype analyser.",
      whySubscribe: "Hvorfor abonnere på Perspekt?",
      fullAccess: "Full tilgang",
      fullAccessDesc: "Les alle artikler, analyser og kommentarer uten begrensninger.",
      participate: "Delta i debatten",
      participateDesc: "Få mulighet til å kommentere og delta i våre eksklusive abonnent-diskusjoner.",
      community: "Støtt uavhengighet",
      communityDesc: "Bli en del av et fellesskap som verdsetter kritisk og uavhengig journalistikk.",
      
      freeTier: "Registrert Bruker",
      monthlyTier: "Månedlig",
      annualTier: "Årlig",
      
      freePrice: "0 kr",
      monthlyPrice: "199 kr",
      monthlyIntroPrice: "99 kr",
      annualPrice: "2 388 kr",
      annualIntroPrice: "1 188 kr",
      
      introMonthDuration: "i 3 måneder",
      introYearLabel: "første året",
      thenMonthly: "Deretter 199 kr/mnd",
      thenYearly: "Deretter 2 388 kr/år",
      mathYearly: "(99 kr x 12)",
      
      freeFeature1: "Les utvalgte artikler",
      freeFeature2: "Motta vårt nyhetsbrev",
      
      commonFeature1: "Full tilgang til alle artikler",
      commonFeature2: "Ingen reklame",
      commonFeature3: "Kommenter på artikler",
      
      mostPopular: "Mest populær",
      bestValue: "Mest for pengene",
      selectPlan: "Velg plan",
      currentPlan: "Nåværende plan",
      processing: "Behandler...",
      loginAndSubscribe: "Logg inn for å velge"
    },
    // Paywall
    paywall: {
      benefit1: "Ubegrenset tilgang til alle artikler",
      benefit2: "Premium analyser og bakgrunn",
      benefit3: "Ukentlig nyhetsbrev",
      benefit4: "Støtt uavhengig journalistikk"
    },
    // User Roles & Status
    user: {
      admin: "Admin",
      editor: "Redaktør",
      user: "Bruker",
      subscriber: "Abonnent",
      premium: "Premium",
      free: "Gratis",
    },
    // Admin
    admin: {
      title: "Adminpanel",
      articles: "Artikler",
      videos: "Videoer",
      users: "Brukere",
      topics: "Emner",
      authors: "Forfattere",
      settings: "Innstillinger",
      articleManagement: "Artikkelbehandling",
      articleManagementDesc: "Behandle alle artikler på plattformen.",
      videoManagement: "Videoadministrasjon",
      videoManagementDesc: "Administrer videoer på plattformen.",
      userManagement: "Brukerbehandling",
      userManagementDesc: "Denne funksjonaliteten kommer snart.",
      userManagementDescLive: "Behandle alle brukere på plattformen.",
      topicManagement: "Emnestyring",
      topicManagementDesc: "Denne funksjonaliteten kommer snart.",
      authorManagement: "Forfatterbehandling",
      authorManagementDesc: "Opprett og administrer forfatterprofiler.",
      settingsManagement: "Innstillinger",
      settingsManagementDesc: "Administrer plattforminnstillinger.",
      newArticle: "Ny artikkel",
      newAuthor: "Ny forfatter",
      editArticle: "Rediger artikkel",
      editUser: "Rediger bruker",
      editAuthor: "Rediger forfatter",
      editUserDesc: "Redigerer bruker: {{email}}",
      deleteUserConfirm: "Er du sikker på at du vil slette denne brukeren? Dette kan ikke angres.",
      deleteAuthorConfirm: "Er du sikker på at du vil slette denne forfatterprofilen? Artikler av denne forfatteren vil ikke bli slettet.",
      noUsersFound: "Ingen brukere funnet.",
      noAuthorsFound: "Ingen forfattere funnet.",
      fullName: "Fullt navn",
      email: "E-post",
      role: "Rolle",
      subscriptionStatus: "Abonnement",
      registeredOn: "Registrert",
      backToOverview: "Tilbake til oversikt",
      title: "Tittel",
      author: "Forfatter",
      status: "Status",
      access: "Tilgang",
      publishedDate: "Publisert",
      actions: "Handlinger",
      noAccess: "Ingen tilgang",
      noAccessDesc: "Du har ikke tilstrekkelige rettigheter for å se denne siden.",
      goToHomepage: "Gå til forsiden",
      deleteConfirm: "Er du sikker på at du vil slette denne artikkelen?",
      deleteError: "Kunne ikke slette artikkelen.",
      saveError: "En feil oppstod under lagring.",
      saving: "Lagrer...",
      saveArticle: "Lagre artikkel",
      saveAuthor: "Lagre forfatter",
      loadingEditor: "Laster redigeringsverktøy...",
      metadata: "Metadata",
      authorBio: "Biografi",
      authorAvatar: "URL til profilbilde",
      authorSlug: "Slug (for URL)",
      socialLinks: "Sosiale lenker",
      linkToUser: "Knytt til bruker",
      linkedUser: "Tilknyttet bruker",
      notLinked: "Ikke tilknyttet",
      authorName: "Forfatternavn",
      topic: "Emne",
      accessLevel: "Tilgangsnivå",
      tags: "Tagger (kommaseparert)",
      featuredImage: "Forsidebilde",
      imageAlt: "Bildetekst (Alt-tekst)",
      ingress: "Ingress (Dek)",
      bodyText: "Brødtekst",
      language: "Språk",
      translationGroup: "Oversettelsesgruppe ID (valgfritt)",
      originalArticle: "Original artikkel ID (for oversettelser)",
      createTranslation: "Opprett oversettelse",
      selectAuthor: "Velg forfatter",
      noAuthor: "Ingen forfatter",
      uploadImage: "Last opp bilde",
      removeImage: "Fjern bilde",
      uploading: "Laster opp...",
      dragDropHint: "Klikk for å laste opp eller dra og slipp filen her"
    },
    // Account Page
    account: {
      title: "Min konto",
      subtitle: "Velkommen, {{name}}! Administrer din profil, abonnement og innstillinger her.",
      tabs: {
        info: "Informasjon",
        subscription: "Abonnement",
        privacy: "Personvern",
        content: "Mitt innhold",
        support: "Hjelp"
      },
      changeAvatar: "Endre bilde",
      fullName: "Fullt navn",
      email: "E-post",
      phoneNumber: "Telefonnummer",
      phoneNumberPlaceholder: "Ikke angitt",
      currentPlan: "Ditt nåværende abonnement",
      planDetails: "Detaljer og fordeler for ditt abonnement.",
      viewPlans: "Se alle abonnement",
      manageSubscription: "Administrer abonnement",
      manageSubscriptionComingSoon: "Administrasjon av abonnement via kundeportal kommer snart. Kontakt support for endringer.",
      billingInfoNote: "For å endre fakturainformasjon eller se kvitteringer, vennligst se e-poster fra vår betalingspartner eller kontakt support.",
      freeBenefit1: "Les opptil 3 gratis artikler per måned",
      freeBenefit2: "Motta vårt ukentlige nyhetsbrev",
      communicationPrefs: "Kommunikasjonsinnstillinger",
      newsletterLabel: "Motta nyhetsbrevet fra Perspekt med utvalgte artikler og analyser.",
      dataManagement: "Databehandling",
      privacyDisclaimer: "Vi tar ditt personvern på alvor. Her kan du administrere dine data og se hvordan vi bruker dem.",
      exportData: "Eksporter mine data",
      exportRequestSent: "Forespørsel om dataeksport er sendt. Du vil motta en e-post med dataene dine innen kort tid.",
      exportRequestFailed: "Kunne ikke sende forespørsel om dataeksport. Prøv igjen senere eller kontakt support.",
      deleteAccountTitle: "Slett konto",
      deleteAccountWarning: "Dette vil permanent slette din konto og alle dine data. Denne handlingen kan ikke angres.",
      deleteAccountBtn: "Slett min konto permanent",
      deleteConfirmTitle: "Er du helt sikker?",
      deleteConfirmDesc: "Du er i ferd med å slette kontoen din permanent. Alle dine lagrede artikler, kommentarer og abonnementsinformasjon vil bli fjernet. Dette kan ikke angres.",
      deleteConfirmBtn: "Ja, slett min konto",
      deleteFailed: "Kunne ikke slette konto. Vennligst kontakt support.",
      savedArticlesForSubscribers: "Lagrede artikler er en abonnentfordel",
      savedArticlesDesc: "Oppgrader abonnementet ditt for å lagre artikler og lese dem senere, på tvers av alle enhetene dine.",
      upgradeNow: "Oppgrader nå",
      noSavedArticles: "Du har ingen lagrede artikler",
      noSavedArticlesDesc: "Finn en artikkel du vil lese senere og trykk på bokmerkeikonet for å lagre den her.",
      exploreArticles: "Utforsk artikler",
      contactSupport: "Kontakt kundeservice",
      contactSupportDesc: "Har du spørsmål eller trenger hjelp med kontoen din? Vi er her for å hjelpe.",
      sendEmail: "Send oss en e-post",
      faqChangePlan: "Hvordan endrer jeg abonnementet mitt?",
      faqChangePlanAnswer: "Du kan oppgradere eller nedgradere abonnementet ditt når som helst. Gå til 'Abonnement'-fanen og velg 'Administrer Abonnement'. Eventuelle endringer trer i kraft fra neste faktureringsperiode."
    },
    // Footer
    footer: {
      description: "Uavhengig norsk medieplattform for nyheter, meninger og debatt. Vi leverer kvalitetsjournalistikk og perspektiver som setter dagsordenen.",
      content: "Innhold",
      subscription: "Abonnement",
      privacy: "Personvern",
      terms: "Vilkår",
      contact: "Kontakt",
      rights: "Alle rettigheter forbeholdt."
    }
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      latest: "Latest",
      topics: "Topics",
      authors: "Authors",
      search: "Search articles...",
      login: "Sign in",
      logout: "Sign out",
      subscribe: "Subscribe",
      account: "My Account",
      admin: "Admin",
      back: "Back",
      backToSite: "Back to site"
    },
    // Common
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      view: "View",
      preview: "Preview",
      publish: "Publish",
      draft: "Draft",
      published: "Published",
      archived: "Archived",
      inReview: "In Review",
      free: "Free",
      metered: "Limited",
      premium: "Premium",
      readingTime: "min read",
      featuredOnHomepage: "Feature on homepage",
      yes: "Yes",
      no: "No",
      language: "Language",
      noArticlesFound: "No articles found.",
      all: "All",
      readArticles: "Read articles",
      backToTopics: "Back to topics"
    },
    // Home page
    home: {
      title: "Norwegian journalism with",
      titleHighlight: "perspekt",
      subtitle: "Independent analysis, critical journalism and meaningful debates that set the agenda in Norway.",
      startSubscription: "Start subscription",
      welcomeBack: "Welcome back",
      readLatestArticles: "Read latest articles",
      featured: "Featured",
      latestArticles: "Latest articles",
      latestSubtitle: "Fresh perspectives and analysis",
      seeAll: "See all",
      popularTopics: "Popular topics",
      getAccess: "Get full access",
      subscribeSupport: "Subscribe to read all articles and support independent journalism.",
      seePrices: "View pricing"
    },
    // Newsletter
    newsletter: {
      title: "Get our newsletter",
      description: "Important news and analysis delivered to your inbox.",
      placeholder: "Your email address",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      thanks: "Thank you!",
      subscribed: "You are now subscribed to our newsletter.",
      privacy: "We respect your privacy. Unsubscribe anytime."
    },
    // Topics
    topics: {
      news: "News",
      opinion: "Opinion",
      culture: "Culture",
      technology: "Technology",
      economy: "Economy",
      sports: "Sports",
      subtitle: "Explore our articles across different topics and categories",
      newsDescription: "Latest news and current events",
      opinionDescription: "Opinions, comments and debate",
      cultureDescription: "Art, literature and cultural life",
      technologyDescription: "Technology and digital trends",
      economyDescription: "Economics, finance and business",
      sportsDescription: "Sports and athletics"
    },
    // Authors
    authors: {
      subtitle: "Meet our writers and journalists",
      articles: "articles",
      latestArticle: "Latest article",
      viewAllArticles: "View all articles",
      noAuthorsFound: "No authors found"
    },
    // Article
    article: {
      relatedArticles: "Related articles",
      seeAllFrom: "See all from",
      premiumContent: "Premium content",
      limitedAccess: "Limited access",
      premiumDescription: "This content is only available to subscribers.",
      limitedDescription: "You have reached your limit of free articles this month.",
      subscribeNow: "Subscribe now",
      subscribeToRead: "Subscribe to read",
      articleNotFound: "Article not found.",
      goToHomepage: "Go to homepage"
    },
    // Subscribe page
    subscribe: {
      title: "Choose a plan that works for you",
      subtitle: "Get access to independent journalism and deep analysis.",
      whySubscribe: "Why subscribe to Perspekt?",
      fullAccess: "Full Access",
      fullAccessDesc: "Read all articles, analysis, and comments without restrictions.",
      participate: "Participate",
      participateDesc: "Join the debate and comment on articles.",
      community: "Community",
      communityDesc: "Support independent journalism and join our community.",
      
      freeTier: "Registered User",
      monthlyTier: "Monthly",
      annualTier: "Annual",
      
      freePrice: "0 NOK",
      monthlyPrice: "199 NOK",
      monthlyIntroPrice: "99 NOK",
      annualPrice: "2 388 NOK",
      annualIntroPrice: "1 188 NOK",
      
      introMonthDuration: "for 3 months",
      introYearLabel: "for the first year",
      thenMonthly: "Then 199 NOK/month",
      thenYearly: "Then 2 388 NOK/year",
      mathYearly: "(99 NOK x 12)",
      
      freeFeature1: "Read selected articles",
      freeFeature2: "Standard newsletter",
      
      commonFeature1: "Full access to all articles",
      commonFeature2: "No ads",
      commonFeature3: "Comment on articles",
      
      mostPopular: "Most Popular",
      bestValue: "Best Value",
      selectPlan: "Select Plan",
      currentPlan: "Current Plan",
      processing: "Processing...",
      loginAndSubscribe: "Sign in to select"
    },
    // Paywall
    paywall: {
      benefit1: "Unlimited access to all articles",
      benefit2: "Premium analysis and background",
      benefit3: "Weekly newsletter",
      benefit4: "Support independent journalism"
    },
    // User Roles & Status
    user: {
      admin: "Admin",
      editor: "Editor",
      user: "User",
      subscriber: "Subscriber",
      premium: "Premium",
      free: "Free",
    },
    // Admin
    admin: {
      title: "Admin Panel",
      articles: "Articles",
      videos: "Videos",
      users: "Users",
      topics: "Topics",
      authors: "Authors",
      settings: "Settings",
      articleManagement: "Article Management",
      articleManagementDesc: "Manage all articles on the platform.",
      videoManagement: "Video Management",
      videoManagementDesc: "Manage videos on the platform.",
      userManagement: "User Management",
      userManagementDesc: "This functionality is coming soon.",
      userManagementDescLive: "Manage all users on the platform.",
      topicManagement: "Topic Management",
      topicManagementDesc: "This functionality is coming soon.",
      authorManagement: "Author Management",
      authorManagementDesc: "Create and manage author profiles.",
      settingsManagement: "Settings",
      settingsManagementDesc: "Manage platform settings.",
      newArticle: "New Article",
      newAuthor: "New Author",
      editArticle: "Edit Article",
      editUser: "Edit User",
      editAuthor: "Edit Author",
      editUserDesc: "Editing user: {{email}}",
      deleteUserConfirm: "Are you sure you want to delete this user? This can not be undone.",
      deleteAuthorConfirm: "Are you sure you want to delete this author profile? Articles by this author will not be deleted.",
      noUsersFound: "No users found.",
      noAuthorsFound: "No authors found.",
      fullName: "Full Name",
      email: "Email",
      role: "Role",
      subscriptionStatus: "Subscription",
      registeredOn: "Registered",
      backToOverview: "Back to overview",
      title: "Title",
      author: "Author",
      status: "Status",
      access: "Access",
      publishedDate: "Published",
      actions: "Actions",
      noAccess: "No access",
      noAccessDesc: "You do not have sufficient permissions to view this page.",
      goToHomepage: "Go to homepage",
      deleteConfirm: "Are you sure you want to delete this article?",
      deleteError: "Could not delete the article.",
      saveError: "An error occurred while saving.",
      saving: "Saving...",
      saveArticle: "Save article",
      saveAuthor: "Save Author",
      loadingEditor: "Loading editor...",
      metadata: "Metadata",
      authorBio: "Biography",
      authorAvatar: "Avatar URL",
      authorSlug: "Slug (for URL)",
      socialLinks: "Social Links",
      linkToUser: "Link to User",
      linkedUser: "Linked User",
      notLinked: "Not Linked",
      authorName: "Author name",
      topic: "Topic",
      accessLevel: "Access level",
      tags: "Tags (comma separated)",
      featuredImage: "Featured image",
      imageAlt: "Image alt text",
      ingress: "Lead/Subtitle",
      bodyText: "Body text",
      language: "Language",
      translationGroup: "Translation Group ID (optional)",
      originalArticle: "Original Article ID (for translations)",
      createTranslation: "Create translation",
      selectAuthor: "Select author",
      noAuthor: "No author",
      uploadImage: "Upload Image",
      removeImage: "Remove Image",
      uploading: "Uploading...",
      dragDropHint: "Click to upload or drag and drop"
    },
    // Account Page
    account: {
      title: "My Account",
      subtitle: "Welcome, {{name}}! Manage your profile, subscription, and settings here.",
      tabs: {
        info: "Information",
        subscription: "Subscription",
        privacy: "Privacy",
        content: "My Content",
        support: "Support"
      },
      changeAvatar: "Change Picture",
      fullName: "Full Name",
      email: "Email",
      phoneNumber: "Phone Number",
      phoneNumberPlaceholder: "Not provided",
      currentPlan: "Your Current Plan",
      planDetails: "Details and benefits for your plan.",
      viewPlans: "View All Plans",
      manageSubscription: "Manage Subscription",
      manageSubscriptionComingSoon: "Subscription management via a customer portal is coming soon. Please contact support for any changes.",
      billingInfoNote: "To change billing information or see receipts, please refer to emails from our payment partner or contact support.",
      freeBenefit1: "Read up to 3 free articles per month",
      freeBenefit2: "Receive our weekly newsletter",
      communicationPrefs: "Communication Preferences",
      newsletterLabel: "Receive the Perspekt newsletter with selected articles and analysis.",
      dataManagement: "Data Management",
      privacyDisclaimer: "We take your privacy seriously. Here you can manage your data and see how we use it.",
      exportData: "Export My Data",
      exportRequestSent: "Data export request sent. You will receive an email with your data shortly.",
      exportRequestFailed: "Could not send data export request. Please try again later or contact support.",
      deleteAccountTitle: "Delete Account",
      deleteAccountWarning: "This will permanently delete your account and all associated data. This action cannot be undone.",
      deleteAccountBtn: "Permanently Delete My Account",
      deleteConfirmTitle: "Are you absolutely sure?",
      deleteConfirmDesc: "You are about to permanently delete your account. All your saved articles, comments, and subscription information will be removed. This cannot be undone.",
      deleteConfirmBtn: "Yes, delete my account",
      deleteFailed: "Could not delete account. Please contact support.",
      savedArticlesForSubscribers: "Saved Articles is a Subscriber Benefit",
      savedArticlesDesc: "Upgrade your plan to save articles and read them later, across all your devices.",
      upgradeNow: "Upgrade Now",
      noSavedArticles: "You have no saved articles",
      noSavedArticlesDesc: "Find an article you want to read later and click the bookmark icon to save it here.",
      exploreArticles: "Explore Articles",
      contactSupport: "Contact Customer Support",
      contactSupportDesc: "Have questions or need help with your account? We're here to help.",
      sendEmail: "Send us an Email",
      faqChangePlan: "How do I change my subscription plan?",
      faqChangePlanAnswer: "You can upgrade or downgrade your plan at any time. Go to the 'Subscription' tab and select 'Manage Subscription'. Any changes will take effect from the next billing cycle."
    },
    // Footer
    footer: {
      description: "Independent Norwegian media platform for news, opinions and debate. We deliver quality journalism and perspectives that set the agenda.",
      content: "Content",
      subscription: "Subscription",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
      rights: "All rights reserved."
    }
  }
};

// Simple translation function
export const useTranslation = (locale = 'nb') => {
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
      if (value === undefined || value === null) {
        // Fallback to default language if key not found in current locale
        value = translations[DEFAULT_LOCALE];
        for (const k2 of keys) {
            value = value?.[k2];
        }
        if (value === undefined || value === null) {
            return key; // Return the key itself if not found in default either
        }
        break; // Exit inner loop if found in default
      }
      value = value?.[k];
    }

    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => params[param] || match);
    }

    return value || key;
  };

  return { t };
};

export const LOCALES = {
  nb: 'nb',
  en: 'en'
};

export const LOCALE_LABELS = {
  nb: 'Norsk',
  en: 'English'
};

export const DEFAULT_LOCALE = 'nb';

// Locale utilities
export const getLocaleFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return Object.values(LOCALES).includes(firstSegment) ? firstSegment : DEFAULT_LOCALE;
};

export const createPageUrl = (pageName, locale = null) => {
  const currentPathname = window.location.pathname;
  const activeLocale = locale || getLocaleFromPath(currentPathname) || DEFAULT_LOCALE;

  let url = `/${pageName}`;

  if (activeLocale !== DEFAULT_LOCALE) {
    url = `/${activeLocale}${url}`;
  }
  return url;
};

export const getTopicKey = (topicSlug) => {
  // This function now returns the translation key directly,
  // assuming topicSlug from entity is language-agnostic (e.g., 'news', 'opinion')
  return `topics.${topicSlug}`;
};