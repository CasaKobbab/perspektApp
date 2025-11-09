import React, { useState, useEffect } from "react";
import { AuthorProfile, Article, User } from "@/entities/all";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { Link } from "react-router-dom";
import ArticleCard from "../components/home/ArticleCard";
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";

export default function AuthorPage() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
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
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');

      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        const [authorData, currentUser] = await Promise.all([
          AuthorProfile.filter({ slug: slug }).then(res => res[0]),
          User.me().catch(() => null)
        ]);
        
        if (authorData) {
          setAuthor(authorData);
          const authorArticles = await Article.filter(
            { author_profile_id: authorData.id, status: 'published', locale: currentLocale },
            '-published_date'
          );
          setArticles(authorArticles);
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading author data:", error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [currentLocale]);
  
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
      <div className="min-h-screen flex items-center justify-center bg-paper-white dark:bg-slate-ink">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nordic-sea"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Author not found</h1>
          <Link to={createPageUrl('Authors')}>
            <p className="text-nordic-sea hover:underline mt-2">Back to all authors</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={createPageUrl('Authors')} className="flex items-center text-secondary hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('authors.viewAllArticles')}
        </Link>
        
        {/* Author Header */}
        <div className="card-surface rounded-xl p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                <img src={author.avatar_url || 'https://via.placeholder.com/128'} alt={author.name} className="w-32 h-32 rounded-full mr-0 md:mr-8 mb-6 md:mb-0 object-cover flex-shrink-0" />
                <div>
                    <h1 className="text-4xl font-bold text-primary font-serif">{author.name}</h1>
                    <p className="text-secondary mt-4 text-lg max-w-2xl">{author.bio}</p>
                    <div className="flex justify-center md:justify-start items-center space-x-4 mt-6">
                        {author.social_links?.twitter && <a href={author.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary"><Twitter /></a>}
                        {author.social_links?.linkedin && <a href={author.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary"><Linkedin /></a>}
                        {author.social_links?.website && <a href={author.social_links.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary"><LinkIcon /></a>}
                    </div>
                </div>
            </div>
        </div>

        {/* Articles Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                topicColors={topicColors}
                user={user}
                showImage={true}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-secondary text-lg">{t('common.noArticlesFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}