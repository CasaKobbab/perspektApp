import React from 'react';
import { User } from '@/entities/User';
import { SendEmail } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/i18n/translations';

export default function AccountPrivacy({ user, t, onUpdate }) {
  const navigate = useNavigate();

  const handleNewsletterToggle = async (isSubscribed) => {
    try {
      const updatedUser = await User.updateMyUserData({ newsletter_subscribed: isSubscribed });
      onUpdate(updatedUser);
    } catch (error) {
      console.error("Error updating newsletter preference:", error);
    }
  };

  const handleExportData = async () => {
    try {
      await SendEmail({
        to: 'admin@perspektiv.example.com', // Replace with actual admin email
        subject: `Data Export Request for ${user.email}`,
        body: `User ${user.full_name} (${user.email}, ID: ${user.id}) has requested an export of their personal data.`,
      });
      alert(t('account.exportRequestSent'));
    } catch (error) {
      console.error("Error sending export request:", error);
      alert(t('account.exportRequestFailed'));
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await User.logout();
      await User.delete(user.id);
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(t('account.deleteFailed'));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-body mb-6">{t('account.tabs.privacy')}</h2>
      
      <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-body mb-2">{t('account.communicationPrefs')}</h3>
            <div className="flex items-center space-x-4 p-6 border border-default rounded-xl bg-surface">
                <Switch
                    id="newsletter"
                    checked={user.newsletter_subscribed}
                    onCheckedChange={handleNewsletterToggle}
                    className="data-[state=checked]:bg-accent"
                />
                <div className="flex-1">
                    <Label htmlFor="newsletter" className="text-base font-medium text-body block mb-1 cursor-pointer">{t('account.newsletterLabel')}</Label>
                    <p className="text-sm text-secondary">{t('account.newsletterDesc') || 'Stay updated with our latest news'}</p>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-body mb-2">{t('account.dataManagement')}</h3>
            <div className="bg-surface border border-default rounded-xl p-6 space-y-4">
                <p className="text-secondary">{t('account.privacyDisclaimer')}</p>
                <Button variant="outline" onClick={handleExportData} className="text-body border-default hover:bg-secondary">{t('account.exportData')}</Button>
            </div>
        </div>

        <div className="border-t border-default pt-8">
            <h3 className="text-lg font-semibold text-red-500 mb-2">{t('account.deleteAccountTitle')}</h3>
            <p className="text-secondary mb-4">{t('account.deleteAccountWarning')}</p>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">{t('account.deleteAccountBtn')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{t('account.deleteConfirmTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('account.deleteConfirmDesc')}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                        {t('account.deleteConfirmBtn')}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
    </div>
  );
}