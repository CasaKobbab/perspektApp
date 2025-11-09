
import React, { useState, useEffect } from "react";
import { AuthorProfile } from "@/entities/AuthorProfile";
import { Article } from "@/entities/Article";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit3 } from "lucide-react";

export default function AuthorsPage() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [authors, setAuthors] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => setCurrentLocale(event.detail);
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [authorProfiles, allArticles] = await Promise.all([
          AuthorProfile.list("-created_date"),
          Article.filter({ status: 'published', locale: currentLocale }, '-published_date', 1000)
        ]);

        const authorStats = authorProfiles.reduce((acc, author) => {
          const authorArticles = allArticles.filter(a => a.author_profile_id === author.id);
          acc[author.id] = {
            article_count: authorArticles.length,
            latest_article: authorArticles.length > 0 ? authorArticles[0] : null,
          };
          return acc;
        }, {});
        
        setAuthors(authorProfiles.filter(a => authorStats[a.id]?.article_count > 0));
        setStats(authorStats);

      } catch (error) {
        console.error('Error loading authors data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [currentLocale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white dark:bg-slate-ink">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nordic-sea"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">{t('nav.authors')}</h1>
          <p className="text-secondary text-lg">{t('authors.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.length > 0 ? (
            authors.map((author) => (
              <div key={author.id} className="card-surface rounded-xl p-6 flex flex-col">
                <div className="flex-grow">
                  <div className="flex items-center mb-4">
                    <img src={author.avatar_url || 'https://via.placeholder.com/80'} alt={author.name} className="w-20 h-20 rounded-full mr-6 object-cover" />
                    <div>
                      <h2 className="text-2xl font-bold text-primary font-serif">{author.name}</h2>
                      <p className="text-secondary">{stats[author.id]?.article_count} {t('authors.articles')}</p>
                    </div>
                  </div>
                  <p className="text-secondary mb-4 line-clamp-3">{author.bio}</p>
                </div>
                
                {stats[author.id]?.latest_article && (
                  <div className="bg-warm-sand dark:bg-slate-ink rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-muted uppercase mb-2">{t('authors.latestArticle')}</p>
                    <Link to={createPageUrl(`Article?id=${stats[author.id].latest_article.id}`)} className="font-semibold text-primary hover:text-nordic-sea line-clamp-2">
                      {stats[author.id].latest_article.title}
                    </Link>
                  </div>
                )}

                <Link to={createPageUrl(`Author?slug=${author.slug}`)} className="mt-auto">
                  <Button variant="outline" className="w-full border-theme text-secondary hover:bg-warm-sand dark:hover:bg-slate-ink">
                    {t('authors.viewAllArticles')} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-secondary text-lg">{t('authors.noAuthorsFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
