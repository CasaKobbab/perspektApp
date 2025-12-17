import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Monitor, Smartphone } from "lucide-react";
import { useTranslation } from "@/components/i18n/translations";

export default function ImageFocalPointEditor({ 
  imageUrl, 
  focusX = 50, 
  focusY = 50,
  onImageChange,
  onFocalPointChange,
  onRemove,
  isUploading
}) {
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);
  const [isDragging, setIsDragging] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const imageRef = useRef(null);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const handleImageClick = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onFocalPointChange(
      Math.max(0, Math.min(100, x)),
      Math.max(0, Math.min(100, y))
    );
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onFocalPointChange(
      Math.max(0, Math.min(100, x)),
      Math.max(0, Math.min(100, y))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, focusX, focusY]);

  if (!imageUrl) {
    return (
      <div className="space-y-4">
        <Label className="font-semibold text-primary">{t('admin.featuredImage')}</Label>
        <div
          className={`h-40 border-2 border-dashed border-default rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-colors bg-surface ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => !isUploading && document.getElementById('image-upload-input')?.click()}
        >
          <input
            id="image-upload-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageChange}
          />
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-secondary mb-2" />
              <p className="text-sm text-secondary font-medium">{t('admin.dragDropHint')}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-primary">{t('admin.featuredImage')}</Label>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          <X className="w-4 h-4 mr-2" />
          {t('admin.removeImage')}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-3">
          <Label className="text-sm text-secondary">Click to set focal point</Label>
          <div 
            ref={imageRef}
            className="relative border-2 border-default rounded-lg overflow-hidden cursor-crosshair bg-gray-100 dark:bg-gray-900"
            onClick={handleImageClick}
            onMouseDown={() => setIsDragging(true)}
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={imageUrl}
              alt="Editor"
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
            
            {/* Focal Point Indicator */}
            <div
              className="absolute w-8 h-8 -ml-4 -mt-4 pointer-events-none"
              style={{
                left: `${focusX}%`,
                top: `${focusY}%`,
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border-4 border-white shadow-lg" />
                <div className="absolute inset-1 rounded-full border-2 border-teal-500" />
                <div className="absolute inset-3 rounded-full bg-teal-500" />
              </div>
            </div>

            {/* Crosshair */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, transparent calc(${focusX}% - 1px), rgba(20, 184, 166, 0.3) calc(${focusX}% - 1px), rgba(20, 184, 166, 0.3) calc(${focusX}% + 1px), transparent calc(${focusX}% + 1px)),
                  linear-gradient(to bottom, transparent calc(${focusY}% - 1px), rgba(20, 184, 166, 0.3) calc(${focusY}% - 1px), rgba(20, 184, 166, 0.3) calc(${focusY}% + 1px), transparent calc(${focusY}% + 1px))
                `
              }}
            />
          </div>
          <p className="text-xs text-muted text-center">
            Position: {Math.round(focusX)}% × {Math.round(focusY)}%
          </p>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-secondary">Preview:</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </Button>
              <Button
                type="button"
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </Button>
            </div>
          </div>

          <div className="border-2 border-default rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
            <div 
              className="relative"
              style={{ 
                aspectRatio: previewMode === 'desktop' ? '16/9' : '4/5'
              }}
            >
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${focusX}% ${focusY}%`
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted text-center">
            {previewMode === 'desktop' ? '16:9 (Desktop/Card)' : '4:5 (Mobile Portrait)'}
          </p>
        </div>
      </div>
    </div>
  );
}