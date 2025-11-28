import React, { useState } from 'react';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function AccountInformation({ user, t, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    phone_number: user.phone_number || '',
    avatar_url: user.avatar_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, avatar_url: file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to show an error message to the user here
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await User.updateMyUserData(formData);
      onUpdate(updatedUser); // Update parent state
    } catch (error) {
      console.error("Error saving user data:", error);
    }
    setIsSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-body mb-6">{t('account.tabs.info')}</h2>
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm" />
            {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"><Loader2 className="w-6 h-6 animate-spin text-white" /></div>}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <Button variant="outline" onClick={() => fileInputRef.current.click()} disabled={isUploading} className="text-body border-default hover:bg-secondary">{t('account.changeAvatar')}</Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-body">{t('account.fullName')}</Label>
          <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} className="max-w-md bg-surface border-default text-body focus:border-accent" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-body">{t('account.email')}</Label>
          <Input id="email" name="email" value={user.email} disabled className="max-w-md bg-secondary text-muted border-default" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-body">{t('account.phoneNumber')}</Label>
          <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder={t('account.phoneNumberPlaceholder')} className="max-w-md bg-surface border-default text-body focus:border-accent" />
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="btn-gradient text-white border-none">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}