import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '@/entities/SiteSettings';
import { UploadFile } from '@/integrations/Core';
import { useTranslation } from "@/components/i18n/translations";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload } from 'lucide-react';

export default function AdminSettings({ user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (user?.role !== 'admin') {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        let settingsData = await SiteSettings.list();
        if (settingsData.length === 0) {
          // Create default settings if none exist
          settingsData = [await SiteSettings.create({})];
        }
        setSettings(settingsData[0]);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
      setIsLoading(false);
    };
    loadSettings();
  }, [user]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    if (type === 'logo') setIsUploadingLogo(true);
    if (type === 'favicon') setIsUploadingFavicon(true);

    try {
      const { file_url } = await UploadFile({ file });
      if (type === 'logo') handleInputChange('logo_url', file_url);
      if (type === 'favicon') handleInputChange('favicon_url', file_url);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      if (type === 'logo') setIsUploadingLogo(false);
      if (type === 'favicon') setIsUploadingFavicon(false);
    }
  };
  
  const handleEnabledLocalesChange = (locale, checked) => {
    const currentLocales = settings.enabled_locales || [];
    let newLocales;
    if (checked) {
      newLocales = [...currentLocales, locale];
    } else {
      // Ensure at least one locale is always enabled
      if (currentLocales.length > 1) {
        newLocales = currentLocales.filter(l => l !== locale);
      } else {
        newLocales = currentLocales; // Do not allow unchecking the last one
      }
    }
    handleInputChange('enabled_locales', newLocales);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SiteSettings.update(settings.id, settings);
      // Optional: show a success toast
    } catch (error) {
      console.error("Error saving settings:", error);
      // Optional: show an error toast
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (user?.role !== 'admin') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-primary">{t('admin.settings')}</h1>
        <p className="text-secondary mt-1">{t('admin.noAccessDesc')}</p>
      </div>
    );
  }
  
  if (!settings) {
    return <div>Error loading settings. Please try again.</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sticky top-0 bg-primary py-4 z-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('admin.settings')}</h1>
          <p className="text-secondary mt-1">Manage your site's global configuration.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto h-11">
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t('common.save')}
        </Button>
      </div>

      <div className="space-y-8">
        {/* General Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>General Site Information</CardTitle>
            <CardDescription>Manage the main branding and contact details for your publication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name</Label>
              <Input id="site_name" value={settings.site_name} onChange={(e) => handleInputChange('site_name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description / Tagline</Label>
              <Input id="site_description" value={settings.site_description} onChange={(e) => handleInputChange('site_description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input id="contact_email" type="email" value={settings.contact_email} onChange={(e) => handleInputChange('contact_email', e.target.value)} />
            </div>
            <div className="flex gap-8">
                <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                        {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="h-10 bg-surface p-1 rounded"/>}
                        <input type="file" ref={logoInputRef} onChange={(e) => handleFileUpload(e.target.files[0], 'logo')} accept="image/*" className="hidden" />
                        <Button variant="outline" onClick={() => logoInputRef.current.click()} disabled={isUploadingLogo}>
                            {isUploadingLogo ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Upload className="w-4 h-4 mr-2"/>}
                            Upload Logo
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                        {settings.favicon_url && <img src={settings.favicon_url} alt="Favicon" className="h-10 w-10 bg-surface p-1 rounded"/>}
                        <input type="file" ref={faviconInputRef} onChange={(e) => handleFileUpload(e.target.files[0], 'favicon')} accept="image/png, image/x-icon, image/svg+xml" className="hidden" />
                        <Button variant="outline" onClick={() => faviconInputRef.current.click()} disabled={isUploadingFavicon}>
                            {isUploadingFavicon ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Upload className="w-4 h-4 mr-2"/>}
                            Upload Favicon
                        </Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Localization & Language */}
        <Card>
          <CardHeader>
            <CardTitle>Localization & Language</CardTitle>
            <CardDescription>Configure language options for your site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 max-w-xs">
              <Label>Default Language</Label>
              <Select value={settings.default_locale} onValueChange={(value) => handleInputChange('default_locale', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nb">Norsk (nb)</SelectItem>
                  <SelectItem value="en">English (en)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enable/disable available languages</Label>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id="lang-nb" checked={settings.enabled_locales?.includes('nb')} onCheckedChange={(checked) => handleEnabledLocalesChange('nb', checked)} />
                    <Label htmlFor="lang-nb">Norsk (nb)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="lang-en" checked={settings.enabled_locales?.includes('en')} onCheckedChange={(checked) => handleEnabledLocalesChange('en', checked)} />
                    <Label htmlFor="lang-en">English (en)</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content & Publishing Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Content & Publishing Defaults</CardTitle>
            <CardDescription>Set default behaviors for content creation and display.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Default access level for new articles</Label>
                    <Select value={settings.default_article_access} onValueChange={(value) => handleInputChange('default_article_access', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="metered">Metered</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Default publishing status for new articles</Label>
                    <Select value={settings.default_article_status} onValueChange={(value) => handleInputChange('default_article_status', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Number of free metered articles per month</Label>
                    <Input type="number" value={settings.metered_articles_limit} onChange={(e) => handleInputChange('metered_articles_limit', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label>Limit for homepage featured articles</Label>
                    <Input type="number" value={settings.featured_articles_limit} onChange={(e) => handleInputChange('featured_articles_limit', Number(e.target.value))} />
                </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Subscription & Monetization */}
        <Card>
            <CardHeader>
                <CardTitle>Subscription & Monetization</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-secondary">This section will house settings for pricing tiers, payment provider integrations (like Stripe), and currency defaults. These features require backend integration and will become available once configured at the platform level.</p>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}