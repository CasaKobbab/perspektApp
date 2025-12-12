import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl, getTopicKey } from "@/components/i18n/translations";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function ArticleCardCompact({ article, topicColors, showImage = false }) {
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

  return (
    <div className="group border-b border-default pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <div className="flex gap-3">
        {showImage && article.featured_image && (
           <Link to={createPageUrl(`Article?id=${article.id}`)} className="flex-shrink-0 w-20 h-20">
             <img 
               src={article.featured_image} 
               alt={article.image_alt || article.title}
               className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity"
             />
           </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${topicColors[article.topic] || "bg-gray-100 text-gray-800"}`}>
               {t(getTopicKey(article.topic))}
             </span>
             <span className="text-xs text-secondary flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.reading_time || 5} min
             </span>
          </div>
          <Link to={createPageUrl(`Article?id=${article.id}`)}>
            <h3 className="text-sm font-bold text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-1">
              {article.title}
            </h3>
          </Link>
          <div className="text-xs text-secondary">
             {format(new Date(article.published_date || article.created_date), "d. MMMM", { locale: getLocaleForDateFns(currentLocale) })}
          </div>
        </div>
      </div>
    </div>
  );
}