import React, { useEffect, useState, useRef } from 'react';
import { BannerImage } from '@/entities/BannerImage';

export default function ImageMarquee() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const results = await BannerImage.list();
        setBanners(results);
      } catch (error) {
        console.error('Failed to load banners:', error);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const currentDuration = banners[currentIndex]?.duration || 5000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, banners.length, banners]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Next slide
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }

    if (isRightSwipe) {
      // Previous slide
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="w-full border-b border-default h-20 relative overflow-hidden z-10 select-none group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full relative">
        {banners.map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Image */}
            <img
              src={banner.image_url}
              alt={banner.alt_text || 'Banner'}
              className="w-full h-full object-cover"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Caption Overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <span className="text-white font-bold text-lg md:text-xl drop-shadow-md text-center">
                {banner.caption}
              </span>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}