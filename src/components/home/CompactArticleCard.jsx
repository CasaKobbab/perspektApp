import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl, getTopicKey } from "@/components/i18n/translations";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function CompactArticleCard({ article, topicColors }) {
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
    <article className="group mb-6 last:mb-0 border-b border-default pb-4 last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <Link to={createPageUrl(`Topics?filter=${article.topic}`)}>
          <Badge variant="outline" className={`${topicColors[article.topic]?.replace('bg-', 'text-').replace('text-', 'border-') || "text-gray-600 border-gray-300"} text-[10px] px-1.5 py-0 h-5`}>
            {t(getTopicKey(article.topic))}
          </Badge>
        </Link>
        <span className="text-xs text-secondary flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {article.reading_time || 5} min
        </span>
      </div>
      
      <Link to={createPageUrl(`Article?id=${article.id}`)}>
        <h3 className="text-base font-bold text-primary font-serif leading-snug group-hover:text-accent transition-colors">
          {article.title}
        </h3>
      </Link>
      
      <div className="mt-2 text-xs text-secondary">
        {format(new Date(article.published_date || article.created_date), "d. MMM", { locale: getLocaleForDateFns(currentLocale) })}
        <span className="mx-1">•</span>
        <span>{article.author_name}</span>
      </div>
    </article>
  );
}