import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/components/i18n/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Code } from "lucide-react";
import { toast } from "sonner";

export default function AdminScriptSettings({ currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    id: null,
    head_scripts: "",
    body_end_scripts: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const result = await base44.entities.ScriptSettings.list();
      if (result && result.length > 0) {
        setSettings({
          id: result[0].id,
          head_scripts: result[0].head_scripts || "",
          body_end_scripts: result[0].body_end_scripts || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch script settings:", error);
      toast.error(t('admin.fetchError') || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const dataToSave = {
        head_scripts: settings.head_scripts,
        body_end_scripts: settings.body_end_scripts
      };

      if (settings.id) {
        await base44.entities.ScriptSettings.update(settings.id, dataToSave);
      } else {
        const newSettings = await base44.entities.ScriptSettings.create(dataToSave);
        setSettings(prev => ({ ...prev, id: newSettings.id }));
      }
      
      toast.success(t('common.saveSuccess') || "Settings saved successfully");
    } catch (error) {
      console.error("Failed to save script settings:", error);
      toast.error(t('admin.saveError') || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Code className="w-6 h-6" />
            {t('admin.scriptSettings') || "Script Injection"}
          </h2>
          <p className="text-secondary mt-1">
            {t('admin.scriptSettingsDesc') || "Manage global scripts for analytics and marketing pixels."}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="btn-gradient">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {t('common.save')}
        </Button>
      </div>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-primary">Head Scripts</CardTitle>
          <CardDescription className="text-secondary">
            These scripts will be injected into the &lt;head&gt; section of every page. 
            Useful for Google Analytics, Meta Pixel base code, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={settings.head_scripts}
            onChange={(e) => setSettings({ ...settings, head_scripts: e.target.value })}
            placeholder="<!-- Google Analytics -->&#10;<script>...</script>"
            className="font-mono text-sm min-h-[200px] bg-surface border-default focus:border-accent"
            spellCheck="false"
          />
        </CardContent>
      </Card>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-primary">Body End Scripts</CardTitle>
          <CardDescription className="text-secondary">
            These scripts will be injected just before the closing &lt;/body&gt; tag.
            Useful for Google Tag Manager (noscript), chatbots, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={settings.body_end_scripts}
            onChange={(e) => setSettings({ ...settings, body_end_scripts: e.target.value })}
            placeholder="<script>...</script>"
            className="font-mono text-sm min-h-[200px] bg-surface border-default focus:border-accent"
            spellCheck="false"
          />
        </CardContent>
      </Card>
    </div>
  );
}