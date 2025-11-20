import React, { useState, useEffect } from 'react';
import { BannerImage } from '@/entities/BannerImage';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, Loader2, Image as ImageIcon, Save } from 'lucide-react';

const BannerItem = ({ banner, onDelete, onUpdate }) => {
  const [caption, setCaption] = useState(banner.caption || '');
  const [duration, setDuration] = useState(banner.duration || 5000);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(banner.id, { caption, duration: parseInt(duration) });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    setHasChanges(true);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
    setHasChanges(true);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg border border-default p-4 shadow-sm hover:shadow-md transition-all">
      <div className="aspect-video flex items-center justify-center bg-gray-50 dark:bg-black/20 rounded-md mb-4 overflow-hidden relative">
        <img 
          src={banner.image_url} 
          alt={banner.alt_text} 
          className="w-full h-full object-cover"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(banner.id)}
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`caption-${banner.id}`} className="text-xs text-secondary">Caption</Label>
          <Input 
            id={`caption-${banner.id}`}
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Enter text overlay..."
            className="h-8 text-sm"
          />
        </div>
        
        <div className="flex items-end gap-2">
          <div className="space-y-1 flex-1">
            <Label htmlFor={`duration-${banner.id}`} className="text-xs text-secondary">Duration (ms)</Label>
            <Input 
              id={`duration-${banner.id}`}
              type="number"
              value={duration}
              onChange={handleDurationChange}
              step={500}
              min={1000}
              className="h-8 text-sm"
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`h-8 ${hasChanges ? 'bg-primary text-primary-foreground' : 'bg-secondary/20 text-secondary'}`}
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const data = await BannerImage.list('-created_date');
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        await BannerImage.create({
          image_url: file_url,
          alt_text: file.name.split('.')[0],
          caption: '',
          duration: 5000
        });
      }
      fetchBanners();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload some images.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await BannerImage.update(id, data);
      // Optimistic update or refetch - let's refetch to be safe
      await fetchBanners();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update banner.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await BannerImage.delete(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Banner Management</h2>
          <p className="text-secondary">Manage homepage slider images, captions, and timing.</p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            id="banner-upload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label htmlFor="banner-upload">
            <Button 
              asChild 
              disabled={isUploading}
              className="cursor-pointer bg-accent text-white hover:bg-accent/90"
            >
              <span>
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : banners.length === 0 ? (
        <Card className="bg-surface border-dashed border-2 border-default">
          <CardContent className="flex flex-col items-center justify-center p-12 text-secondary">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p>No banners active. Upload some images to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {banners.map((banner) => (
            <BannerItem 
              key={banner.id} 
              banner={banner} 
              onDelete={handleDelete} 
              onUpdate={handleUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}