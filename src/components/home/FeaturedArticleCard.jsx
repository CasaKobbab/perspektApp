import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl, getTopicKey } from "@/components/i18n/translations";
import { Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function FeaturedArticleCard({ article, topicColors, user }) {
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const canReadArticle = () => {
    if (article.access_level === 'free') return true;
    if (user?.subscription_status === 'subscriber' || user?.subscription_status === 'premium') return true;
    if (article.access_level === 'metered' && (!user || (user.articles_read || 0) < 3)) return true;
    return false;
  };

  const getLocaleForDateFns = (localeString) => {
    switch (localeString) {
      case 'en': return enUS;
      case 'nb': return nb;
      default: return nb;
    }
  };

  return (
    <article className="card-surface rounded-2xl overflow-hidden shadow-md mb-12 group border border-default">
      {article.featured_image && (
        <Link to={createPageUrl(`Article?id=${article.id}`)} className="block relative aspect-video overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-40" />
          <img 
            src={article.featured_image} 
            alt={article.image_alt || article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-4 left-4 z-20">
             <Badge className={`${topicColors[article.topic]} shadow-sm`}>
                {t(getTopicKey(article.topic))}
             </Badge>
          </div>
        </Link>
      )}

      <div className="p-8">
        <Link to={createPageUrl(`Article?id=${article.id}`)}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading leading-tight group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:via-teal-400 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {article.title}
          </h2>
        </Link>

        {article.dek && (
          <p className="text-lg text-secondary leading-relaxed mb-6">
            {article.dek}
          </p>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-default">
          <div className="flex items-center text-sm text-secondary">
             <img 
              src={article.author_avatar_url || 'https://via.placeholder.com/24'} 
              alt={article.author_name} 
              className="w-8 h-8 rounded-full mr-3 object-cover ring-2 ring-accent/20" 
            />
            <span className="font-medium text-primary mr-3">{article.author_name}</span>
            <span className="w-1 h-1 rounded-full bg-muted mr-3"></span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{article.reading_time || 5} {t('common.readingTime')}</span>
             <span className="w-1 h-1 rounded-full bg-muted mx-3"></span>
            <span>
              {format(new Date(article.published_date || article.created_date), "d. MMMM", { locale: getLocaleForDateFns(currentLocale) })}
            </span>
          </div>
          
           {!canReadArticle() && (
            <Link to={createPageUrl("Subscribe")}>
              <Button size="sm" className="btn-gradient text-white border-none">
                {t('article.subscribeToRead')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}