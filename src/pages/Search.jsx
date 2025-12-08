import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { useLocation, Link } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import ArticleCard from "../components/home/ArticleCard";

export default function Search() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const q = urlParams.get('q') || "";
    setQuery(q);
  }, [location.search]);

  useEffect(() => {
    const loadData = async () => {
      if (!query) {
        setIsLoading(false);
        setArticles([]);
        return;
      }

      setIsLoading(true);
      try {
        const currentUser = await User.me().catch(() => null);
        setUser(currentUser);

        // Fetch a batch of published articles for the current locale
        // Since backend search isn't available, we fetch recent ones and filter client-side
        // This is a trade-off for the prototype
        const allArticles = await Article.filter(
          { status: 'published', locale: currentLocale },
          '-published_date',
          100
        );

        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        const filteredArticles = allArticles.filter(article => {
          const title = (article.title || "").toLowerCase();
          const body = (article.body || "").toLowerCase();
          const dek = (article.dek || "").toLowerCase();
          
          // Check if ALL search terms are present in either title, dek, or body
          // This creates an "AND" behavior for multi-word queries
          return searchTerms.every(term => 
            title.includes(term) || 
            body.includes(term) || 
            dek.includes(term)
          );
        });

        setArticles(filteredArticles);
      } catch (error) {
        console.error('Error searching articles:', error);
        setArticles([]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [query, currentLocale]);

  const topicColors = {
    news: "bg-red-100 text-red-800",
    opinion: "bg-blue-100 text-blue-800",
    culture: "bg-purple-100 text-purple-800",
    technology: "bg-green-100 text-green-800",
    economy: "bg-yellow-100 text-yellow-800",
    sports: "bg-orange-100 text-orange-800"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <SearchIcon className="w-8 h-8 mr-3 text-emerald-600" />
                {t('nav.search')}: "{query}"
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                {articles.length} {articles.length === 1 ? t('authors.articles').slice(0, -1) : t('authors.articles')} {t('common.noArticlesFound').replace('Ingen artikler funnet.', 'funnet')}
            </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                topicColors={topicColors}
                user={user}
                showImage={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('common.noArticlesFound')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Prøv å søke etter noe annet, eller utforsk våre emner.
            </p>
            <Link to={createPageUrl("Topics")}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
                {t('nav.topics')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}