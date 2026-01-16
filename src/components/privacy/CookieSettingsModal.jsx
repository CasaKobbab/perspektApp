import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/components/i18n/translations";
import { ShieldCheck, BarChart3, Megaphone } from "lucide-react";

export default function CookieSettingsModal({ isOpen, onClose, onSave, initialPreferences, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    if (isOpen && initialPreferences) {
      setPreferences({
        essential: true,
        analytics: initialPreferences.analytics || false,
        marketing: initialPreferences.marketing || false
      });
    }
  }, [isOpen, initialPreferences]);

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-surface border-default max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-heading text-primary">{t('cookie.settingsTitle')}</DialogTitle>
          <DialogDescription className="text-secondary">
            {t('cookie.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Essential */}
          <div className="flex items-start justify-between space-x-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <Label htmlFor="essential" className="text-base font-semibold text-primary">{t('cookie.essential')}</Label>
                <p className="text-sm text-secondary">{t('cookie.essentialDesc')}</p>
              </div>
            </div>
            <Switch id="essential" checked={true} disabled />
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between space-x-4">
            <div className="flex gap-3">
              <BarChart3 className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <Label htmlFor="analytics" className="text-base font-semibold text-primary">{t('cookie.analytics')}</Label>
                <p className="text-sm text-secondary">{t('cookie.analyticsDesc')}</p>
              </div>
            </div>
            <Switch 
              id="analytics" 
              checked={preferences.analytics}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
            />
          </div>

          {/* Marketing */}
          <div className="flex items-start justify-between space-x-4">
            <div className="flex gap-3">
              <Megaphone className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <Label htmlFor="marketing" className="text-base font-semibold text-primary">{t('cookie.marketing')}</Label>
                <p className="text-sm text-secondary">{t('cookie.marketingDesc')}</p>
              </div>
            </div>
            <Switch 
              id="marketing" 
              checked={preferences.marketing}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto btn-gradient">
                {t('cookie.save')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}