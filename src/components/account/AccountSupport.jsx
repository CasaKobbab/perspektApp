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
      <h2 className="text-2xl font-bold text-primary mb-6">{t('account.tabs.support')}</h2>
      
      <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('account.contactSupport')}</h3>
            <p className="text-secondary mb-4">{t('account.contactSupportDesc')}</p>
            <a href="mailto:support@perspektiv.example.com">
                <Button variant="outline">{t('account.sendEmail')}</Button>
            </a>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-primary mb-4">{t('subscribe.faq')}</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-primary text-left">{t(faq.question)}</AccordionTrigger>
                  <AccordionContent className="text-secondary">
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