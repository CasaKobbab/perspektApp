import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, Shield, Star, Bookmark, HelpCircle } from "lucide-react";

import AccountInformation from "../components/account/AccountInformation";
import AccountSubscription from "../components/account/AccountSubscription";
import AccountPrivacy from "../components/account/AccountPrivacy";
import AccountContent from "../components/account/AccountContent";
import AccountSupport from "../components/account/AccountSupport";

export default function AccountPage() {
  const navigate = useNavigate();
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // Not logged in, redirect to login
        await User.loginWithRedirect(window.location.href);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white dark:bg-slate-ink">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nordic-sea"></div>
      </div>
    );
  }
  
  const tabs = [
    { value: 'info', label: 'account.tabs.info', icon: UserIcon, component: <AccountInformation user={user} t={t} onUpdate={setUser} /> },
    { value: 'subscription', label: 'account.tabs.subscription', icon: Star, component: <AccountSubscription user={user} t={t} /> },
    { value: 'privacy', label: 'account.tabs.privacy', icon: Shield, component: <AccountPrivacy user={user} t={t} onUpdate={setUser} /> },
    { value: 'content', label: 'account.tabs.content', icon: Bookmark, component: <AccountContent user={user} t={t} /> },
    { value: 'support', label: 'account.tabs.support', icon: HelpCircle, component: <AccountSupport user={user} t={t} /> },
  ];

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-primary font-serif mb-2">{t('account.title')}</h1>
          <p className="text-secondary text-lg">{t('account.subtitle', { name: user.full_name })}</p>
        </header>

        <Tabs defaultValue="info" className="flex flex-col md:flex-row gap-10">
          <TabsList className="flex flex-row md:flex-col items-start h-auto md:w-1/5 bg-transparent p-0">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="w-full justify-start text-secondary hover:text-primary data-[state=active]:bg-warm-sand/50 dark:data-[state=active]:bg-slate-ink/50 data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2 text-left">
                <tab.icon className="w-4 h-4 mr-3" />
                <span>{t(tab.label)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1">
            {tabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <div className="card-surface p-6 sm:p-8 rounded-xl">
                  {tab.component}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}