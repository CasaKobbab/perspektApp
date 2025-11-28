import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/i18n/translations';
import { base44 } from "@/api/base44Client";
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
    active: {
      name: t('user.subscriber'),
      benefits: [t('subscribe.monthlyFeature1'), t('subscribe.monthlyFeature2'), t('subscribe.monthlyFeature3')],
      color: "bg-emerald-200 text-emerald-800"
    },
    trialing: {
      name: "Trial",
      benefits: [t('subscribe.monthlyFeature1')],
      color: "bg-blue-200 text-blue-800"
    },
    past_due: {
      name: "Past Due",
      benefits: [],
      color: "bg-red-200 text-red-800"
    },
    canceled: {
      name: "Canceled",
      benefits: [t('account.freeBenefit1')],
      color: "bg-gray-200 text-gray-800"
    }
  };
  
  // Map legacy status to new stripe status if needed
  let status = user.subscription_status || 'free';
  if (status === 'subscriber' || status === 'premium') status = 'active';

  const currentPlan = planDetails[status] || planDetails.free;

  const handleManageSubscription = async () => {
    try {
      const { url } = await base44.functions.invoke('createStripePortal');
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to open portal:", error);
      alert("Could not open subscription portal.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-body mb-6">{t('account.tabs.subscription')}</h2>
      
      <Card className="bg-surface border-default shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-body">{t('account.currentPlan')}</CardTitle>
              <p className="text-secondary mt-1">{t('account.planDetails')}</p>
            </div>
            <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {currentPlan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-body">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl("Subscribe")}>
              <Button className="btn-gradient text-white border-none shadow-md">{t('account.viewPlans')}</Button>
            </Link>
            {user.subscription_status !== 'free' && (
              <Button variant="outline" onClick={handleManageSubscription} className="text-body border-default hover:bg-secondary">{t('account.manageSubscription')}</Button>
            )}
          </div>
          <p className="text-xs text-muted mt-4">{t('account.billingInfoNote')}</p>
        </CardContent>
      </Card>
    </div>
  );
}