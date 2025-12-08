import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Share2,
  Bookmark,
  Lock,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin, // Added Linkedin import
  Link as LinkIcon } from
"lucide-react";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation, createPageUrl, getTopicKey } from "@/components/i18n/translations";

import PaywallModal from "../components/article/PaywallModal";
import RelatedArticles from "../components/article/RelatedArticles";
import { AuthorProfile } from "@/entities/AuthorProfile"; // Added AuthorProfile import

export default function ArticlePage() {
  const navigate = useNavigate();
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

  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null); // Added author state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [canRead, setCanRead] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const articleId = urlParams.get('id');

      if (!articleId) {
        navigate(createPageUrl("Home"));
        return;
      }

      setIsLoading(true);
      try {
        // Use server-side function to fetch article with redaction logic
        const [articleResponse, currentUser] = await Promise.all([
          base44.functions.invoke('getArticle', { id: articleId }),
          User.me().catch(() => null)
        ]);

        const articleData = articleResponse.data?.article;
        const isRestricted = articleResponse.data?.is_restricted;

        if (!articleData) {
          navigate(createPageUrl("Home"));
          return;
        }

        if (articleData.author_profile_id) {
          try {
            const authorData = await AuthorProfile.get(articleData.author_profile_id);
            setAuthor(authorData);
          } catch (authorError) {
            console.error("Error loading author profile:", authorError);
            setAuthor(null);
          }
        } else {
          setAuthor(null);
        }

        setArticle(articleData);
        setUser(currentUser);

        // Determine client-side access (combining server restriction + local metered logic)
        const canReadServer = !isRestricted;
        const meteredAllowed = checkMeteredAccess(articleData, currentUser);
        
        const canReadArticle = canReadServer && meteredAllowed;
        setCanRead(canReadArticle);

        if (!canReadArticle && articleData.access_level !== 'free') {
          setShowPaywall(true);
        }

        // Track article read for metered articles
        if (canReadArticle && articleData.access_level === 'metered' && currentUser) {
          // Only increment if the user isn't logged in or hasn't read this article before this month
          // This logic could be more sophisticated (e.g., check last_read_reset and current month)
          if (!currentUser.last_read_reset || new Date(currentUser.last_read_reset).getMonth() !== new Date().getMonth()) {
            await User.updateMyUserData({
              articles_read: 1,
              last_read_reset: new Date().toISOString().split('T')[0] // Reset month counter
            });
          } else {
            await User.updateMyUserData({
              articles_read: (currentUser.articles_read || 0) + 1
            });
          }
        }

      } catch (error) {
        console.error('Error loading article:', error);
        navigate(createPageUrl("Home"));
      }
      setIsLoading(false);
    };

    loadArticle();
  }, [currentLocale, navigate]);

  const checkMeteredAccess = (article, user) => {
    // Logic for metered articles (server passes full body, client enforces count)
    if (article.access_level === 'metered') {
      if (user?.subscription_status === 'subscriber' || user?.subscription_status === 'premium' || user?.subscription_status === 'active') return true;
      if (!user || (user.articles_read || 0) < 3) return true;
      return false;
    }
    return true; // For free or premium, server 'isRestricted' flag handles it, so we return true here
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = article.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        // Could show toast notification here
        break;
    }
  };

  const topicColors = {
    news: "bg-red-100 text-red-800",
    opinion: "bg-blue-100 text-blue-800",
    culture: "bg-purple-100 text-purple-800",
    technology: "bg-green-100 text-green-800",
    economy: "bg-yellow-100 text-yellow-800",
    sports: "bg-orange-100 text-orange-800"
  };

  const getLocaleForDateFns = (localeString) => {
    switch (localeString) {
      case 'en':return enUS;
      case 'nb':return nb;
      default:return nb;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>);

  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('article.articleNotFound')}</h1>
          <Link to={createPageUrl("Home")}>
            <Button>{t('article.goToHomepage')}</Button>
          </Link>
        </div>
      </div>);

  }

  return (
    <>
      <article className="bg-primary min-h-screen">
        {/* Article Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-4">

            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.back')}
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link to={createPageUrl(`Topics?filter=${article.topic}`)}> {/* Wrapped Badge with Link */}
                <Badge className={topicColors[article.topic] || "bg-gray-100 text-gray-800"}>
                  {t(getTopicKey(article.topic))}
                </Badge>
              </Link>
              <div className="flex items-center text-sm text-muted">
                <Clock className="w-4 h-4 mr-1" />
                {article.reading_time || 5} {t('common.readingTime')}
              </div>
              {article.access_level !== 'free' &&
              <div className="flex items-center text-sm text-yellow-600">
                  <Lock className="w-4 h-4 mr-1" />
                  {t(`common.${article.access_level}`)}
                </div>
              }
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-primary font-serif leading-tight mb-6">
              {article.title}
            </h1>

            {article.dek &&
            <p className="text-xl text-secondary leading-relaxed mb-8">
                {article.dek}
              </p>
            }

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to={createPageUrl(`Author?slug=${author?.slug}`)}> {/* Wrapped author avatar with Link */}
                  <img
                    src={article.author_avatar_url || 'https://via.placeholder.com/48'} // Used article.author_avatar_url
                    alt={article.author_name}
                    className="w-12 h-12 bg-gray-200 rounded-full object-cover mr-4" />

                </Link>
                <div>
                  <Link to={createPageUrl(`Author?slug=${author?.slug}`)}> {/* Wrapped author name with Link */}
                    <p className="font-semibold text-primary hover:text-accent">{article.author_name}</p> {/* Added hover effect */}
                  </Link>
                  <p className="text-sm text-secondary">
                    {format(new Date(article.published_date || article.created_date), "d. MMMM yyyy, HH:mm", { locale: getLocaleForDateFns(currentLocale) })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare('twitter')} 
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare('facebook')} 
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare('copy')} 
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {article.featured_image &&
          <div className="mb-8">
              <img
              src={article.featured_image}
              alt={article.image_alt || article.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl" />

              {article.image_alt &&
            <p className="text-sm text-muted mt-2 italic">{article.image_alt}</p>
            }
            </div>
          }
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="prose prose-lg dark:prose-invert max-w-none text-primary">
            {canRead ?
            <div
              className="text-primary leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.body?.replace(/\n/g, '<br />')
              }} /> :


            <div className="relative">
                <div
                className="text-primary leading-relaxed mb-8"
                dangerouslySetInnerHTML={{
                  __html: article.excerpt || article.body?.substring(0, 1500) + '...'
                }} />

                
                <div className="bg-gradient-to-t from-paper-white dark:from-slate-ink to-transparent absolute inset-x-0 bottom-0 h-32 pointer-events-none" />
                
                <Card className="card-surface text-center p-8 mt-16 border-accent/20 shadow-lg">
                  <CardContent>
                    <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-body mb-4 font-serif">
                      {article.access_level === 'premium' ?
                    t('article.premiumContent') :
                    t('article.limitedAccess')
                    }
                    </h3>
                    <p className="text-secondary mb-8 text-lg">
                      {article.access_level === 'premium' ?
                    t('article.premiumDescription') :
                    t('article.limitedDescription')
                    }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to={createPageUrl("Subscribe")}>
                        <Button className="btn-gradient text-white border-none shadow-md px-8 py-6 h-auto text-lg font-semibold">
                          {t('article.subscribeNow')}
                        </Button>
                      </Link>
                      {!user &&
                    <Button
                      variant="outline"
                      onClick={async () => await User.login()}
                      className="border-default text-body hover:bg-secondary px-8 py-6 h-auto text-lg font-semibold">

                          {t('nav.login')}
                        </Button>
                    }
                    </div>
                  </CardContent>
                </Card>
              </div>
            }
          </div>
        </div>

        {/* Author Bio Box */}
        {canRead && author &&
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="card-surface p-8 rounded-lg mt-16 border border-default shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                        <img src={author.avatar_url || 'https://via.placeholder.com/96'} alt={author.name} className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 object-cover flex-shrink-0 shadow-sm border border-default" />
                        <div>
                            <p className="text-sm font-semibold uppercase text-accent mb-2">{t('authors.writtenBy')}</p>
                            <h3 className="text-2xl font-bold text-body mb-2 font-serif">{author.name}</h3>
                            <p className="text-secondary mb-4">{author.bio}</p>
                            <Link to={createPageUrl(`Author?slug=${author.slug}`)}>
                                <Button variant="link" className="text-accent hover:text-accent-hover p-0 h-auto font-medium text-base hover:no-underline">{t('authors.viewAllArticles')} →</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        }

        {/* Related Articles */}
        {canRead && <RelatedArticles currentArticle={article} />}
      </article>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        article={article}
        user={user} />

    </>);

}