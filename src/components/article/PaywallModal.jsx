import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Star, Check } from "lucide-react";
import { User } from "@/entities/User";

export default function PaywallModal({ isOpen, onClose, article, user }) {
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');

    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const benefits = [
    t('paywall.benefit1'),
    t('paywall.benefit2'),
    t('paywall.benefit3'),
    t('paywall.benefit4')
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <DialogTitle className="text-2xl font-bold font-serif mb-2">
              {article?.access_level === 'premium' 
                ? t('article.premiumContent') 
                : t('article.limitedAccess')
              }
            </DialogTitle>
            <p className="text-gray-600">
              {article?.access_level === 'premium'
                ? t('article.premiumDescription')
                : t('article.limitedDescription')
              }
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Link to={createPageUrl("Subscribe")} className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                <Star className="w-5 h-5 mr-2" />
                {t('home.seePrices')}
              </Button>
            </Link>
            
            {!user && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={async () => await User.login()}
              >
                {t('nav.login')}
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            {t('subscribe.guarantee')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}