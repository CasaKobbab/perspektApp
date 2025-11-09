import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight } from "lucide-react";
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
  const [selectedPlan, setSelectedPlan] = useState("monthly");

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

  const plans = [
  {
    id: "monthly",
    name: t('subscribe.monthlyPlan'),
    price: "199",
    period: t('subscribe.month'),
    description: t('subscribe.monthlyDescription'),
    features: [
    t('subscribe.monthlyFeature1'),
    t('subscribe.monthlyFeature2'),
    t('subscribe.monthlyFeature3'),
    t('subscribe.monthlyFeature4'),
    t('subscribe.monthlyFeature5'),
    t('subscribe.monthlyFeature6')],

    popular: false
  },
  {
    id: "yearly",
    name: t('subscribe.yearlyPlan'),
    price: "1790",
    period: t('subscribe.year'),
    originalPrice: "2388",
    savings: t('subscribe.discount'),
    description: t('subscribe.yearlyDescription'),
    features: [
    t('subscribe.yearlyFeature1'),
    t('subscribe.yearlyFeature2'),
    t('subscribe.yearlyFeature3'),
    t('subscribe.yearlyFeature4'),
    t('subscribe.yearlyFeature5'),
    t('subscribe.yearlyFeature6')],

    popular: true
  }];


  const handleSubscribe = async (planId) => {
    setIsLoading(true);
    try {
      if (!user) {
        await User.login();
        return;
      }

      // In real implementation, would integrate with Stripe
      // For demo purposes, just update user subscription status
      await User.updateMyUserData({
        subscription_status: 'subscriber',
        subscription_plan: planId
      });

      navigate(createPageUrl("Account"));
    } catch (error) {
      console.error('Subscription error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-6">
            {t('subscribe.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subscribe.subtitle')}
          </p>
          <div className="flex justify-center mt-8">
            <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
              <Check className="w-4 h-4 mr-2" />
              {t('subscribe.guarantee')}
            </Badge>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) =>
          <Card
            key={plan.id}
            className={`relative ${
            plan.popular ?
            "border-blue-500 shadow-xl scale-105" :
            "border-gray-200 shadow-lg"}`
            }>

              {plan.popular &&
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    {t('subscribe.mostPopular')}
                  </Badge>
                </div>
            }

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold">
                    {plan.price}
                  </span>
                  <div className="text-left">
                    <div className="text-lg text-gray-600">kr</div>
                    <div className="text-sm text-gray-500">/{plan.period}</div>
                  </div>
                </div>

                {plan.originalPrice &&
              <div className="mt-2">
                    <span className="text-lg text-gray-400 line-through mr-2">
                      {plan.originalPrice} kr/{t('subscribe.year')}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {plan.savings}
                    </Badge>
                  </div>
              }
              </CardHeader>

              <CardContent className="px-6 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) =>
                <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                )}
                </ul>

                <Button
                className={`w-full text-lg py-6 ${
                plan.popular ?
                "bg-blue-600 hover:bg-blue-700" :
                "bg-gray-900 hover:bg-gray-800"}`
                }
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading}>

                  {isLoading ?
                t('subscribe.processing') :

                <>
                      {!user ? t('subscribe.loginAndSubscribe') : t('subscribe.selectPlan')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                }
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-serif mb-12">
            {t('subscribe.whySubscribe')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('subscribe.independentJournalism')}
              </h3>
              <p className="text-gray-600">
                {t('subscribe.independentJournalismDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('subscribe.qualityOverQuantity')}
              </h3>
              <p className="text-gray-600">
                {t('subscribe.qualityOverQuantityDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('subscribe.perspectivesThatMatter')}
              </h3>
              <p className="text-gray-600">
                {t('subscribe.perspectivesThatMatterDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 font-serif mb-8">
            {t('subscribe.faq')}
          </h3>
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('subscribe.cancelSubscription')}
              </h4>
              <p className="text-gray-600">
                {t('subscribe.cancelSubscriptionAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('subscribe.studentDiscount')}
              </h4>
              <p className="text-gray-600">
                {t('subscribe.studentDiscountAnswer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('subscribe.shareSubscription')}
              </h4>
              <p className="text-gray-600">
                {t('subscribe.shareSubscriptionAnswer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}