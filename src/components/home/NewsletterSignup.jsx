import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { User } from "@/entities/User";
import { useTranslation } from "@/components/i18n/translations";

export default function NewsletterSignup({ user }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email && !user) return;

    setIsLoading(true);
    try {
      if (user) {
        await User.updateMyUserData({ newsletter_subscribed: true });
      }
      // In real implementation, would integrate with MailerLite/ConvertKit
      setIsSubscribed(true);
    } catch (error) {
      console.error('Newsletter signup error:', error);
    }
    setIsLoading(false);
  };

  if (isSubscribed || user?.newsletter_subscribed) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-green-900 mb-2">{t('newsletter.thanks')}</h3>
          <p className="text-sm text-green-700">
            {t('newsletter.subscribed')}
          </p>
        </CardContent>
      </Card>);

  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <Mail className="w-8 h-8 text-blue-800 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">{t('newsletter.title')}</h3>
          <p className="text-sm text-gray-600">
            {t('newsletter.description')}
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-3">
          {!user &&
          <Input
            type="email"
            placeholder={t('newsletter.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white" />

          }
          <Button
            type="submit" className="bg-[#2896cc] text-primary-foreground px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-full hover:bg-blue-900"

            disabled={isLoading || !email && !user}>

            {isLoading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          {t('newsletter.privacy')}
        </p>
      </CardContent>
    </Card>);

}