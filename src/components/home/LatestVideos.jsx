import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Video as VideoIcon } from "lucide-react";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function LatestVideos({ videos, topicColors }) {
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');

    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const getLocaleForDateFns = (localeString) => {
    switch (localeString) {
      case 'en': return enUS;
      case 'nb': return nb;
      default: return nb;
    }
  };

  // Always show the section, even if empty
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-primary font-serif mb-4 flex items-center gap-2">
        <VideoIcon className="w-5 h-5 text-nordic-sea" />
        {currentLocale === 'nb' ? 'Siste videoer' : 'Latest Videos'}
      </h3>
      
      {!videos || videos.length === 0 ? (
        <div className="card-surface rounded-lg p-6 text-center">
          <VideoIcon className="w-12 h-12 mx-auto mb-3 text-secondary opacity-50" />
          <p className="text-secondary text-sm">
            {currentLocale === 'nb' ? 'Ingen videoer tilgjengelig ennå.' : 'No videos available yet.'}
          </p>
        </div>
      ) : (
        videos.map((video) => (
          <Link to={createPageUrl(`VideoPage?id=${video.id}`)} key={video.id}>
            <Card className="card-surface overflow-hidden group cursor-pointer hover:shadow-md transition-all h-full">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={video.thumbnail_url || 'https://via.placeholder.com/400x225/1a1a1a/ffffff?text=Video'} 
                    alt={video.title}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-nordic-sea ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                      {video.duration}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${topicColors[video.topic] || 'bg-gray-100 text-gray-800'} text-xs`}>
                      {video.topic ? t(`topics.${video.topic}`) : 'Video'}
                    </Badge>
                    {video.published_date && (
                      <span className="text-xs text-secondary">
                        {format(new Date(video.published_date), "d. MMM", { locale: getLocaleForDateFns(currentLocale) })}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-primary text-sm line-clamp-2 group-hover:text-accent transition-colors">
                    {video.title}
                  </h4>
                  
                  {video.description && (
                    <p className="text-xs text-secondary mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}