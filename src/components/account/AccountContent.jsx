import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '@/entities/Article';
import { createPageUrl } from '@/components/i18n/translations';
import { Button } from '@/components/ui/button';
import { Bookmark, Newspaper, ArrowRight } from 'lucide-react';
import ArticleCard from '../home/ArticleCard';

export default function AccountContent({ user, t }) {
  const [savedArticles, setSavedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (user.subscription_status === 'free' || !user.saved_article_ids || user.saved_article_ids.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        // This is a simplified fetch. In a real app with many IDs, you might need a dedicated endpoint.
        const allArticles = await Article.list('-created_date', 500); // Fetch a large number to filter from
        const filtered = allArticles.filter(article => user.saved_article_ids.includes(article.id));
        setSavedArticles(filtered);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      }
      setIsLoading(false);
    };

    fetchSavedArticles();
  }, [user.saved_article_ids, user.subscription_status]);
  
  const topicColors = {
    news: "bg-red-100 text-red-800",
    opinion: "bg-blue-100 text-blue-800",
    culture: "bg-purple-100 text-purple-800",
    technology: "bg-green-100 text-green-800",
    economy: "bg-yellow-100 text-yellow-800",
    sports: "bg-orange-100 text-orange-800"
  };

  if (user.subscription_status === 'free') {
    return (
      <div className="text-center">
        <Bookmark className="w-12 h-12 text-nordic-sea mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">{t('account.savedArticlesForSubscribers')}</h2>
        <p className="text-secondary mb-6 max-w-md mx-auto">{t('account.savedArticlesDesc')}</p>
        <Link to={createPageUrl('Subscribe')}>
            <Button className="btn-primary">
                {t('account.upgradeNow')} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">{t('account.tabs.content')}</h2>
      
      {isLoading ? (
        <p>{t('common.loading')}</p>
      ) : savedArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {savedArticles.map(article => (
            <ArticleCard key={article.id} article={article} topicColors={topicColors} user={user} showImage={false} />
          ))}
        </div>
      ) : (
        <div className="text-center border-2 border-dashed border-theme rounded-xl p-8">
          <Newspaper className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">{t('account.noSavedArticles')}</h3>
          <p className="text-secondary mb-6">{t('account.noSavedArticlesDesc')}</p>
          <Link to={createPageUrl('Latest')}>
            <Button variant="outline">{t('account.exploreArticles')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}