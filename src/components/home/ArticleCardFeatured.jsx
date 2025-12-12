import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl, getTopicKey } from "@/components/i18n/translations";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function ArticleCardFeatured({ article, topicColors }) {
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
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

  if (!article) return null;

  return (
    <article className="relative group rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px] flex flex-col justify-end">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={article.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"} 
          alt={article.image_alt || article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge className={`${topicColors[article.topic]} border-none`}>
            {t(getTopicKey(article.topic))}
          </Badge>
          <span className="text-gray-300 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {article.reading_time || 5} min
          </span>
        </div>

        <Link to={createPageUrl(`Article?id=${article.id}`)}>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 font-serif leading-tight group-hover:underline decoration-accent underline-offset-4 decoration-2">
            {article.title}
          </h2>
        </Link>

        {article.dek && (
          <p className="text-gray-300 text-lg mb-4 line-clamp-2 max-w-2xl">
            {article.dek}
          </p>
        )}

        <div className="flex items-center justify-between">
           <div className="flex items-center text-sm text-gray-300">
              <span className="font-medium text-white">{article.author_name}</span>
              <span className="mx-2">•</span>
              <span>{format(new Date(article.published_date || article.created_date), "d. MMMM", { locale: getLocaleForDateFns(currentLocale) })}</span>
           </div>
           
           <Link to={createPageUrl(`Article?id=${article.id}`)}>
             <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0">
                {t('common.readArticles')} <ArrowRight className="ml-2 w-4 h-4" />
             </Button>
           </Link>
        </div>
      </div>
    </article>
  );
}