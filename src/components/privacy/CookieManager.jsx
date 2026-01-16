import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/components/i18n/translations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, Settings as SettingsIcon } from "lucide-react";
import CookieSettingsModal from "./CookieSettingsModal";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieManager({ currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [scripts, setScripts] = useState(null);
  const [consentState, setConsentState] = useState({
    analytics: false,
    marketing: false,
    hasInteracted: false
  });

  // 1. Initialize Consent Mode & Load Settings
  useEffect(() => {
    // Define GTM/Gtag helper
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    // Check local storage for existing consent
    const savedConsent = localStorage.getItem("cookie_consent");
    
    if (savedConsent) {
      const parsed = JSON.parse(savedConsent);
      setConsentState({ ...parsed, hasInteracted: true });
      
      // Update GCM immediately with saved preferences
      updateConsentMode(parsed);
    } else {
      // Default: Denied
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'wait_for_update': 500
      });
      setShowBanner(true);
    }

    // Initialize GTM Script (Basic Container)
    // Note: We are just ensuring the dataLayer is ready. 
    // The actual tracking scripts come from our backend settings.

    // Fetch User Scripts
    const fetchScripts = async () => {
        try {
            const settings = await base44.entities.ScriptSettings.list();
            if (settings && settings.length > 0) {
                setScripts(settings[0]);
            }
        } catch (e) {
            console.error("Failed to fetch scripts", e);
        }
    };
    fetchScripts();

  }, []);

  // 2. Inject Scripts when consent is granted
  useEffect(() => {
    if (!scripts || !consentState.hasInteracted) return;

    // If marketing consent is granted, we inject the scripts
    // Since the prompt asks to wrap *all* pasted scripts in logic,
    // and those scripts are usually pixels/analytics, we treat them as needing consent.
    // A more granular approach would parse the scripts, but for now we gate the entire block.
    
    // We treat "marketing" consent as the gatekeeper for these external scripts 
    // because they usually contain mixed tracking (FB Pixel, GTM, etc).
    // Ideally GTM handles granular consent internally, but we must load GTM first.
    
    // If user accepted EITHER analytics OR marketing, we load the scripts
    // and rely on GCM to control what they do internally.
    const shouldLoadScripts = consentState.analytics || consentState.marketing;

    if (shouldLoadScripts) {
       injectScripts(scripts.head_scripts, scripts.body_end_scripts);
    }

  }, [scripts, consentState]);

  const updateConsentMode = (preferences) => {
    const consentUpdate = {
      'ad_storage': preferences.marketing ? 'granted' : 'denied',
      'ad_user_data': preferences.marketing ? 'granted' : 'denied',
      'ad_personalization': preferences.marketing ? 'granted' : 'denied',
      'analytics_storage': preferences.analytics ? 'granted' : 'denied'
    };
    
    if (window.gtag) {
        window.gtag('consent', 'update', consentUpdate);
    }
    
    // Push event for GTM triggers
    window.dataLayer.push({
      'event': 'consent_update',
      ...consentUpdate
    });
  };

  const saveConsent = (preferences) => {
    const newState = {
      analytics: preferences.analytics,
      marketing: preferences.marketing
    };

    localStorage.setItem("cookie_consent", JSON.stringify(newState));
    setConsentState({ ...newState, hasInteracted: true });
    updateConsentMode(newState);
    setShowBanner(false);
    
    // Reload page if needed to ensure clean state, but GCM usually handles updates dynamically.
    // For now we rely on dynamic injection.
  };

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
  };

  const injectScripts = (head, body) => {
    // Check if scripts are already injected to avoid duplicates
    if (window.scriptsInjected) return;
    window.scriptsInjected = true;

    if (head) {
        const range = document.createRange();
        const fragment = range.createContextualFragment(head);
        document.head.appendChild(fragment);
    }

    if (body) {
        const range = document.createRange();
        const fragment = range.createContextualFragment(body);
        document.body.appendChild(fragment);
    }
  };

  return (
    <>
      {/* Floating Settings Button */}
      {!showBanner && (
        <Button
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(true)}
            className="fixed bottom-4 left-4 z-40 bg-surface/80 backdrop-blur border border-default shadow-lg rounded-full w-10 h-10 hover:bg-surface text-secondary hover:text-primary transition-all duration-300"
            title={t('cookie.settingsTitle')}
        >
            <Cookie className="w-5 h-5" />
        </Button>
      )}

      {/* Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <Card className="max-w-7xl mx-auto shadow-2xl border-accent/20 bg-surface/95 backdrop-blur-lg">
                <div className="p-6 md:flex items-center justify-between gap-6">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                            <Cookie className="w-5 h-5 text-accent" />
                            {t('cookie.title')}
                        </h3>
                        <p className="text-secondary text-sm max-w-2xl leading-relaxed">
                            {t('cookie.description')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                        <Button variant="outline" onClick={() => setShowSettings(true)} className="whitespace-nowrap">
                            <SettingsIcon className="w-4 h-4 mr-2" />
                            {t('cookie.preferences')}
                        </Button>
                        <Button variant="outline" onClick={handleRejectAll} className="whitespace-nowrap hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20">
                            {t('cookie.rejectAll')}
                        </Button>
                        <Button onClick={handleAcceptAll} className="whitespace-nowrap btn-gradient">
                            {t('cookie.acceptAll')}
                        </Button>
                    </div>
                </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <CookieSettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        onSave={saveConsent}
        initialPreferences={consentState}
        currentLocale={currentLocale}
      />
    </>
  );
}