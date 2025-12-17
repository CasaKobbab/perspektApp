import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl, getTopicKey } from "@/components/i18n/translations";
import { Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function ArticleCard({ article, topicColors, user, showImage = true }) {
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

  const primaryTopic = article.topics?.[0] || article.topic;

  return (
    <article className="card-surface rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-default">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Link to={createPageUrl(`Topics?filter=${primaryTopic}`)}>
            <Badge className={`${topicColors[primaryTopic] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"} transition-colors`}>
              {t(getTopicKey(primaryTopic))}
            </Badge>
          </Link>
          {/* Optional: Show +X more topics if multiple */}
          {article.topics?.length > 1 && (
             <span className="text-xs text-muted-foreground">+{article.topics.length - 1}</span>
          )}
          <div className="flex items-center text-sm text-secondary">
            <Clock className="w-4 h-4 mr-1" />
            {article.reading_time || 5} {t('common.readingTime')}
          </div>
          {article.access_level !== 'free' && (
            <div className="flex items-center text-sm text-accent">
              <Lock className="w-4 h-4 mr-1" />
              {t(`common.${article.access_level}`)}
            </div>
          )}
        </div>

        {showImage && article.featured_image && (
          <Link to={createPageUrl(`Article?id=${article.id}`)} className="block mb-6">
            <img 
              src={article.featured_image} 
              alt={article.image_alt || article.title}
              className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-sm"
              style={{
                objectPosition: `${article.image_focus_x ?? 50}% ${article.image_focus_y ?? 50}%`
              }}
            />
          </Link>
        )}

        <Link to={createPageUrl(`Article?id=${article.id}`)}>
          <h2 className="text-xl font-bold text-primary mb-3 font-heading group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:via-teal-400 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {article.dek && (
          <p className="text-secondary text-base leading-relaxed mb-4 line-clamp-2">
            {article.dek}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between pt-4 border-t border-default">
          <div className="flex items-center text-sm text-secondary w-full sm:w-auto">
            <img 
              src={article.author_avatar_url || 'https://via.placeholder.com/24'} 
              alt={article.author_name} 
              className="w-6 h-6 rounded-full mr-2 object-cover ring-2 ring-accent/20" 
            />
            {article.author_id ? (
              <Link to={createPageUrl(`AuthorProfile?id=${article.author_id}`)} className="font-medium text-primary hover:text-accent transition-colors">
                {article.author_name}
              </Link>
            ) : (
              <span className="font-medium text-primary">{article.author_name}</span>
            )}
            <span className="mx-2 text-muted">•</span>
            <span>
              {format(new Date(article.published_date || article.created_date), "d. MMMM", { locale: getLocaleForDateFns(currentLocale) })}
            </span>
          </div>

          {!canReadArticle() && (
            <Link to={createPageUrl("Subscribe")} className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border-none">
                {t('article.subscribeToRead')} <Lock className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}