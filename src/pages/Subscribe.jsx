import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, MessageCircle, Users, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";

export default function Subscribe() {
  const navigate = useNavigate();
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

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      if (!user) {
        await User.login();
      } else {
        navigate(createPageUrl("Home"));
      }
      return;
    }

    setIsLoading(true);
    try {
      if (!user) {
        localStorage.setItem('intended_subscription_plan', planId);
        await User.login();
        return;
      }

      const { data } = await base44.functions.invoke('createStripeCheckout', { 
        priceId: planId === 'annual' ? "ANNUAL" : "MONTHLY" 
      });

      console.log("Checkout Session Created:", data);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to retrieve checkout URL");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pillars = [
    {
      icon: BookOpen,
      title: t('subscribe.fullAccess'),
      desc: t('subscribe.fullAccessDesc'),
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      icon: MessageCircle,
      title: t('subscribe.participate'),
      desc: t('subscribe.participateDesc'),
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: Users,
      title: t('subscribe.community'),
      desc: t('subscribe.communityDesc'),
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  const plans = [
    {
      id: 'free',
      name: t('subscribe.freeTier'),
      price: 0,
      displayPrice: t('subscribe.freePrice'),
      type: 'free',
      features: [
        t('subscribe.freeFeature1'),
        t('subscribe.freeFeature2')
      ],
      buttonVariant: "outline"
    },
    {
      id: 'monthly',
      name: t('subscribe.monthlyTier'),
      type: 'recurring',
      highlight: false,
      displayPrice: t('subscribe.monthlyIntroPrice'),
      introDuration: t('subscribe.introMonthDuration'),
      regularPriceLabel: t('subscribe.thenMonthly'),
      features: [
        t('subscribe.commonFeature1'),
        t('subscribe.commonFeature2'),
        t('subscribe.commonFeature3')
      ],
      buttonVariant: "default"
    },
    {
      id: 'annual',
      name: t('subscribe.annualTier'),
      type: 'recurring',
      highlight: true,
      badge: t('subscribe.mostPopular'),
      displayPrice: t('subscribe.annualIntroPrice'),
      introDuration: t('subscribe.introYearLabel'),
      mathLabel: t('subscribe.mathYearly'),
      regularPriceLabel: t('subscribe.thenYearly'),
      features: [
        t('subscribe.commonFeature1'),
        t('subscribe.commonFeature2'),
        t('subscribe.commonFeature3'),
        t('subscribe.bestValue')
      ],
      buttonVariant: "gradient" // Custom handling for gradient
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      
      {/* Hero / Value Prop Section */}
      <div className="bg-white dark:bg-slate-800 py-16 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('subscribe.whySubscribe')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            {t('subscribe.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${pillar.bg}`}>
                  <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col h-full transition-all duration-300 ${
                plan.highlight 
                  ? "border-teal-500 dark:border-teal-500 shadow-xl scale-105 z-10 border-2" 
                  : "border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
              } ${plan.type === 'free' ? 'bg-gray-50/50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 text-sm uppercase tracking-wide">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <h3 className={`text-xl font-bold ${plan.type === 'free' ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col pt-4">
                
                {/* Price Section */}
                <div className="text-center mb-6">
                  {plan.type === 'free' ? (
                    <div className="text-4xl font-bold text-gray-400">{plan.displayPrice}</div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                          {plan.displayPrice}
                        </span>
                      </div>
                      {plan.introDuration && (
                        <p className="text-teal-600 dark:text-teal-400 font-medium text-sm mt-1">
                          {plan.introDuration}
                        </p>
                      )}
                      {plan.mathLabel && (
                        <p className="text-gray-400 text-xs mt-1">{plan.mathLabel}</p>
                      )}
                      {plan.regularPriceLabel && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          {plan.regularPriceLabel}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  variant={plan.buttonVariant === 'outline' ? 'outline' : 'default'}
                  className={`w-full py-6 text-lg ${
                    plan.buttonVariant === 'gradient' 
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all' 
                      : plan.buttonVariant === 'default' 
                        ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                        : ''
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t('subscribe.selectPlan')}
                      {plan.highlight && <ArrowRight className="w-5 h-5 ml-2" />}
                    </>
                  )}
                </Button>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </div>
  );
}