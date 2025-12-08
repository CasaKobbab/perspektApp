import React from 'react';

import { Button } from '@/components/ui/button';

export default function AccountSupport({ t }) {


  return (
    <div>
      <h2 className="text-2xl font-bold text-body mb-6">{t('account.tabs.support')}</h2>
      
      <div className="space-y-8">
        <div className="bg-surface border border-default rounded-xl p-6">
            <h3 className="text-lg font-semibold text-body mb-2">{t('account.contactSupport')}</h3>
            <p className="text-secondary mb-6">{t('account.contactSupportDesc')}</p>
            <a href="mailto:info@perspekt.no">
                <Button variant="outline" className="text-body border-default hover:bg-secondary">{t('account.sendEmail')}</Button>
            </a>
        </div>
        

      </div>
    </div>
  );
}