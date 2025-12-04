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
    },
    {
      icon: MessageCircle,
      title: t('subscribe.participate'),
      desc: t('subscribe.participateDesc'),
    },
    {
      icon: Users,
      title: t('subscribe.community'),
      desc: t('subscribe.communityDesc'),
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
      buttonVariant: "gradient"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-slate-950 font-sans overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 pointer-events-none z-0 translate-x-1/2 translate-y-1/2" />

      {/* Content Wrapper */}
      <div className="relative z-10">
        
        {/* Hero / Value Prop Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                {t('subscribe.whySubscribe')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
              {t('subscribe.subtitle')}
            </p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {pillars.map((pillar, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-8 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative flex flex-col h-full transition-all duration-500 rounded-2xl overflow-hidden ${
                  plan.highlight 
                    ? "shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)] scale-105 z-10 border-2 border-teal-500/50 dark:border-teal-400/50" 
                    : "shadow-xl hover:shadow-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md"
                } ${plan.highlight ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                )}
                
                {plan.highlight && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-3 py-1 shadow-lg">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold mb-2 ${plan.type === 'free' ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {plan.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-1">
                      {plan.type === 'free' ? (
                        <span className="text-4xl font-bold text-gray-400">{plan.displayPrice}</span>
                      ) : (
                        <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                          {plan.displayPrice}
                        </span>
                      )}
                    </div>
                    
                    {plan.introDuration && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mt-1">
                        {plan.introDuration}
                      </p>
                    )}
                    
                    {plan.regularPriceLabel && (
                      <p className="text-muted-foreground text-sm mt-2">
                        {plan.regularPriceLabel}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm group">
                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 transition-colors ${
                          plan.highlight 
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' 
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading}
                    variant={plan.buttonVariant === 'outline' ? 'outline' : 'default'}
                    className={`w-full py-6 text-lg font-medium transition-all duration-300 ${
                      plan.buttonVariant === 'gradient' || plan.highlight
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5' 
                        : plan.buttonVariant === 'default'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                          : 'border-2 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 bg-transparent'
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
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}