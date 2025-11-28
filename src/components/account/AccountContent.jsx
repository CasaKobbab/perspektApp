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
      <div className="text-center py-8">
        <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bookmark className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-body mb-3">{t('account.savedArticlesForSubscribers')}</h2>
        <p className="text-secondary mb-8 max-w-md mx-auto text-lg">{t('account.savedArticlesDesc')}</p>
        <Link to={createPageUrl('Subscribe')}>
            <Button className="btn-gradient text-white border-none shadow-md px-8 py-6 text-lg h-auto">
                {t('account.upgradeNow')} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-body mb-6">{t('account.tabs.content')}</h2>
      
      {isLoading ? (
        <p className="text-secondary">{t('common.loading')}</p>
      ) : savedArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {savedArticles.map(article => (
            <ArticleCard key={article.id} article={article} topicColors={topicColors} user={user} showImage={false} />
          ))}
        </div>
      ) : (
        <div className="text-center border-2 border-dashed border-default rounded-xl p-12">
          <Newspaper className="w-16 h-16 text-muted mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-body mb-3">{t('account.noSavedArticles')}</h3>
          <p className="text-secondary mb-8 text-lg">{t('account.noSavedArticlesDesc')}</p>
          <Link to={createPageUrl('Latest')}>
            <Button variant="outline" className="text-body border-default hover:bg-secondary">{t('account.exploreArticles')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}