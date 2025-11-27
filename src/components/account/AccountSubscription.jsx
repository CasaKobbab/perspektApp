import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/i18n/translations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function AccountSubscription({ user, t }) {
  const planDetails = {
    free: {
      name: t('user.free'),
      benefits: [t('account.freeBenefit1'), t('account.freeBenefit2')],
      color: "bg-gray-200 text-gray-800"
    },
    subscriber: {
      name: t('user.subscriber'),
      benefits: [t('subscribe.monthlyFeature1'), t('subscribe.monthlyFeature2'), t('subscribe.monthlyFeature3')],
      color: "bg-blue-200 text-blue-800"
    },
    premium: {
      name: t('user.premium'),
      benefits: [t('subscribe.yearlyFeature1'), t('subscribe.yearlyFeature2'), t('subscribe.yearlyFeature3'), t('subscribe.yearlyFeature4')],
      color: "bg-indigo-200 text-indigo-800"
    }
  };

  const currentPlan = planDetails[user.subscription_status] || planDetails.free;

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        if (url) window.location.href = url;
      } else {
        console.error("Failed to create portal session");
        alert(t('account.manageSubscriptionComingSoon'));
      }
    } catch (error) {
      console.error("Error accessing billing portal:", error);
      alert("Stripe integration requires backend setup.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">{t('account.tabs.subscription')}</h2>
      
      <Card className="bg-warm-sand/30 dark:bg-slate-ink/30 border-theme">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-primary">{t('account.currentPlan')}</CardTitle>
              <p className="text-secondary mt-1">{t('account.planDetails')}</p>
            </div>
            <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {currentPlan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-primary">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl("Subscribe")}>
              <Button className="btn-primary">{t('account.viewPlans')}</Button>
            </Link>
            {user.subscription_status !== 'free' && (
              <Button variant="outline" onClick={handleManageSubscription}>{t('account.manageSubscription')}</Button>
            )}
          </div>
          <p className="text-xs text-muted mt-4">{t('account.billingInfoNote')}</p>
        </CardContent>
      </Card>
    </div>
  );
}