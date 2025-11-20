import React, { useEffect, useState, useRef } from 'react';
import { BannerImage } from '@/entities/BannerImage';

export default function ImageMarquee() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
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

    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Initial check
    checkSize();
    
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Reset index when view mode changes to prevent out-of-bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [isDesktop]);

  const itemsPerView = isDesktop ? 2 : 1;
  
  // Group banners into slides
  const slides = [];
  if (banners.length > 0) {
    for (let i = 0; i < banners.length; i += itemsPerView) {
      slides.push(banners.slice(i, i + itemsPerView));
    }
  }

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

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
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }

    if (isRightSwipe) {
      // Previous slide
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="w-full bg-surface border-b border-default h-20 relative overflow-hidden z-10 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full max-w-7xl mx-auto px-4 relative">
        {slides.map((slideImages, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center gap-12 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {slideImages.map((banner, i) => (
              <div key={`${banner.id}-${i}`} className="h-12 flex items-center justify-center">
                <img
                  src={banner.image_url}
                  alt={banner.alt_text || 'Partner logo'}
                  className="h-full w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        ))}
        
        {/* Optional indicators for better UX if multiple slides exist */}
        {slides.length > 1 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-primary' : 'bg-border-default'
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