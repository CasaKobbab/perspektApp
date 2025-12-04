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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_100%)] dark:bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.2)_0%,_transparent_100%)] pointer-events-none z-0" />

      {/* Hero / Value Prop Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 drop-shadow-sm">
            {t('subscribe.whySubscribe')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            {t('subscribe.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="group flex flex-col items-center bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col h-full transition-all duration-300 backdrop-blur-xl ${
                plan.highlight 
                  ? "bg-white/60 dark:bg-slate-900/60 border-emerald-500/50 dark:border-emerald-400/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] scale-105 z-10 border-[1.5px]" 
                  : "bg-white/40 dark:bg-slate-900/40 border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl z-0"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 text-sm uppercase tracking-wide border-0 shadow-lg">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <h3 className={`text-xl font-bold ${plan.type === 'free' ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col pt-6">
                
                {/* Price Section */}
                <div className="text-center mb-8">
                  {plan.type === 'free' ? (
                    <div className="text-4xl font-bold text-gray-400/80">{plan.displayPrice}</div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400' : 'text-gray-900 dark:text-white'}`}>
                          {plan.displayPrice}
                        </span>
                      </div>
                      {plan.introDuration && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mt-1">
                          {plan.introDuration}
                        </p>
                      )}
                      {plan.mathLabel && (
                        <p className="text-muted-foreground text-xs mt-1">{plan.mathLabel}</p>
                      )}
                      {plan.regularPriceLabel && (
                        <p className="text-muted-foreground text-sm mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          {plan.regularPriceLabel}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 rounded-full p-1 ${plan.highlight ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-6 text-lg font-bold shadow-md transition-all duration-300 ${
                    plan.buttonVariant === 'gradient' || plan.highlight
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5' 
                      : plan.buttonVariant === 'default' 
                        ? 'bg-slate-800 hover:bg-slate-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900' 
                        : 'bg-white/50 hover:bg-white/80 dark:bg-transparent dark:hover:bg-white/10 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
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