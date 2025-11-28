import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

export default function AccountSupport({ t }) {
  const faqs = [
    {
      question: 'subscribe.cancelSubscription',
      answer: 'subscribe.cancelSubscriptionAnswer'
    },
    {
      question: 'subscribe.studentDiscount',
      answer: 'subscribe.studentDiscountAnswer'
    },
    {
      question: 'subscribe.shareSubscription',
      answer: 'subscribe.shareSubscriptionAnswer'
    },
    {
        question: 'account.faqChangePlan',
        answer: 'account.faqChangePlanAnswer'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-body mb-6">{t('account.tabs.support')}</h2>
      
      <div className="space-y-8">
        <div className="bg-surface border border-default rounded-xl p-6">
            <h3 className="text-lg font-semibold text-body mb-2">{t('account.contactSupport')}</h3>
            <p className="text-secondary mb-6">{t('account.contactSupportDesc')}</p>
            <a href="mailto:support@perspektiv.example.com">
                <Button variant="outline" className="text-body border-default hover:bg-secondary">{t('account.sendEmail')}</Button>
            </a>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-body mb-4">{t('subscribe.faq')}</h3>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-default rounded-lg px-4 bg-surface">
                  <AccordionTrigger className="text-body text-left hover:no-underline hover:text-accent">{t(faq.question)}</AccordionTrigger>
                  <AccordionContent className="text-secondary pt-2 pb-4">
                    {t(faq.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
}