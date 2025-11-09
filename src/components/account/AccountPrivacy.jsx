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
      <h2 className="text-2xl font-bold text-primary mb-6">{t('account.tabs.privacy')}</h2>
      
      <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('account.communicationPrefs')}</h3>
            <div className="flex items-center space-x-2 p-4 border border-theme rounded-lg">
                <Switch
                    id="newsletter"
                    checked={user.newsletter_subscribed}
                    onCheckedChange={handleNewsletterToggle}
                />
                <Label htmlFor="newsletter" className="flex-1 text-primary">{t('account.newsletterLabel')}</Label>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('account.dataManagement')}</h3>
            <div className="space-y-4">
                <p className="text-secondary">{t('account.privacyDisclaimer')}</p>
                <Button variant="outline" onClick={handleExportData}>{t('account.exportData')}</Button>
            </div>
        </div>

        <div className="border-t border-red-500/30 pt-6">
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