import React, { useEffect, useState } from 'react';
import { BannerImage } from '@/entities/BannerImage';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function ImageMarquee() {
  const [banners, setBanners] = useState([]);
  const { theme } = useTheme();

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

  if (!banners || banners.length === 0) return null;

  // Duplicate the array to create the seamless infinite scroll effect
  // If we have few items, we might need to duplicate multiple times to fill screen width
  // For safety, let's ensure we have at least 10 items or enough to fill width
  const displayBanners = [...banners, ...banners, ...banners, ...banners].slice(0, 20); // Cap at 20 for performance if list is huge, but ensure enough duplication

  return (
    <div className="w-full bg-surface border-b border-default overflow-hidden h-20 flex items-center relative z-10">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="animate-marquee flex items-center gap-12 px-4">
        {/* First set */}
        {displayBanners.map((banner, index) => (
          <div 
            key={`${banner.id}-${index}`} 
            className="flex-shrink-0 h-12 w-auto transition-all duration-300"
          >
            <img
              src={banner.image_url}
              alt={banner.alt_text || 'Partner logo'}
              className="h-full w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            />
          </div>
        ))}
        
        {/* Duplicate set for seamless loop is handled by the map above with multiple concatenations */}
      </div>
    </div>
  );
}