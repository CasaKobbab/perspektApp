import React, { useState, useEffect } from 'react';
import { useTranslation } from "@/components/i18n/translations";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Topic } from '@/entities/Topic';
import { Loader2 } from 'lucide-react';

export default function TopicFormModal({ isOpen, onClose, topic, onSave, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color_class: 'bg-gray-100 text-gray-800',
    is_active: true,
    locale: 'nb'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (topic) {
      setFormData({
        name: topic.name || '',
        slug: topic.slug || '',
        description: topic.description || '',
        color_class: topic.color_class || 'bg-gray-100 text-gray-800',
        is_active: topic.is_active,
        locale: topic.locale || 'nb',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        color_class: 'bg-gray-100 text-gray-800',
        is_active: true,
        locale: 'nb'
      });
    }
  }, [topic, isOpen]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (topic) {
        await Topic.update(topic.id, formData);
      } else {
        await Topic.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving topic:", error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] card-surface">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{topic ? 'Edit Topic' : 'Create New Topic'}</DialogTitle>
            <DialogDescription>
              Manage the properties of a content topic. The slug cannot be changed as it's linked to articles.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Topic Name</Label>
              <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={formData.slug} onChange={e => handleInputChange('slug', e.target.value)} required disabled={!!topic} />
              <p className="text-xs text-muted">Cannot be changed after creation.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color_class">Color Class</Label>
              <Input id="color_class" value={formData.color_class} onChange={e => handleInputChange('color_class', e.target.value)} required />
              <p className="text-xs text-muted">Example: bg-blue-100 text-blue-800</p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={value => handleInputChange('is_active', value)} />
              <Label htmlFor="is_active">Is Active?</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}