import React, { useState, useEffect } from 'react';
import { BannerImage } from '@/entities/BannerImage';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

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
      // Process sequentially to avoid overwhelming requests if many files
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        await BannerImage.create({
          image_url: file_url,
          alt_text: file.name.split('.')[0]
        });
      }
      fetchBanners();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload some images.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = null;
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
          <p className="text-secondary">Manage partner logos and banners for the homepage slider.</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="group relative bg-white dark:bg-gray-800 rounded-lg border border-default p-4 shadow-sm hover:shadow-md transition-all">
              <div className="aspect-video flex items-center justify-center bg-gray-50 dark:bg-black/20 rounded-md mb-3 overflow-hidden">
                <img 
                  src={banner.image_url} 
                  alt={banner.alt_text} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary truncate max-w-[120px]" title={banner.alt_text}>
                  {banner.alt_text || 'Untitled'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(banner.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}