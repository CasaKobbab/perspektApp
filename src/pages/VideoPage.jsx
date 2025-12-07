import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "@/entities/Video";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function VideoPage() {
  const navigate = useNavigate();
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  useEffect(() => {
    const loadVideo = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get("id");

      if (!videoId) {
        navigate(createPageUrl("Home"));
        return;
      }

      setIsLoading(true);
      try {
        const videos = await Video.filter({ id: videoId }, null, 1);
        const fetchedVideo = videos[0];
        
        if (fetchedVideo) {
          setVideo(fetchedVideo);
        } else {
          setVideo(null);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
      setIsLoading(false);
    };
    loadVideo();
  }, [navigate]);

  const getLocaleForDateFns = (localeString) => {
    switch (localeString) {
      case 'en': return enUS;
      case 'nb': return nb;
      default: return nb;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('video.videoNotFound')}</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))}>{t('video.goToHomepage')}</Button>
        </div>
      </div>
    );
  }

  // Function to extract video ID from YouTube/Vimeo URLs
  const getEmbeddedVideoUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1].split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    } else {
      return url;
    }
  };

  const embeddedUrl = getEmbeddedVideoUrl(video.video_url);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-transparent hover:text-emerald-600 dark:hover:text-emerald-400 pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('nav.back')}
        </Button>

        <div className="space-y-6">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
                src={embeddedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title={video.title}
            ></iframe>
            </div>

            <div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('video.publishedOn')} {format(new Date(video.published_date || video.created_date), "d. MMMM yyyy", { locale: getLocaleForDateFns(currentLocale) })}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {video.title}
                </h1>

                {video.description && (
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p>{video.description}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}