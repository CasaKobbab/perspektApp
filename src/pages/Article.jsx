import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
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
        const [articleData, currentUser] = await Promise.all([
        Article.filter({ id: articleId }, null, 1).then((results) => results[0]),
        User.me().catch(() => null)]
        );

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

        const canReadArticle = checkAccess(articleData, currentUser);
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

  const checkAccess = (article, user) => {
    if (article.access_level === 'free') return true;
    if (user?.subscription_status === 'subscriber' || user?.subscription_status === 'premium') return true;
    if (article.access_level === 'metered' && (!user || (user.articles_read || 0) < 3)) return true;
    return false;
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
      <article className="bg-white">
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
              <div className="flex items-center text-sm text-gray-500">
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

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-serif leading-tight mb-6">
              {article.title}
            </h1>

            {article.dek &&
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
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
                    <p className="font-semibold text-gray-900 hover:text-blue-600">{article.author_name}</p> {/* Added hover effect */}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {format(new Date(article.published_date || article.created_date), "d. MMMM yyyy, HH:mm", { locale: getLocaleForDateFns(currentLocale) })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('twitter')} className="bg-background text-slate-50 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10">

                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('facebook')} className="bg-background text-slate-50 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10">

                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('copy')} className="bg-background text-slate-50 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10">

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
            <p className="text-sm text-gray-500 mt-2 italic">{article.image_alt}</p>
            }
            </div>
          }
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="prose prose-lg max-w-none">
            {canRead ?
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.body?.replace(/\n/g, '<br />')
              }} /> :


            <div className="relative">
                <div
                className="text-gray-800 leading-relaxed mb-8"
                dangerouslySetInnerHTML={{
                  __html: article.excerpt || article.body?.substring(0, 1500) + '...'
                }} />

                
                <div className="bg-gradient-to-t from-white to-transparent absolute inset-x-0 bottom-0 h-32 pointer-events-none" />
                
                <Card className="bg-blue-50 border-blue-200 text-center p-8 mt-16">
                  <CardContent>
                    <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {article.access_level === 'premium' ?
                    t('article.premiumContent') :
                    t('article.limitedAccess')
                    }
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {article.access_level === 'premium' ?
                    t('article.premiumDescription') :
                    t('article.limitedDescription')
                    }
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link to={createPageUrl("Subscribe")}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          {t('article.subscribeNow')}
                        </Button>
                      </Link>
                      {!user &&
                    <Button
                      variant="outline"
                      onClick={async () => await User.login()}>

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
                <div className="card-surface p-8 rounded-lg mt-16">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                        <img src={author.avatar_url || 'https://via.placeholder.com/96'} alt={author.name} className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 object-cover flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold uppercase text-gray-500">{t('authors.writtenBy')}</p>
                            <h3 className="text-2xl font-bold text-slate-300 mb-2 font-serif">{author.name}</h3>
                            <p className="text-slate-100 mb-4">{author.bio}</p>
                            <Link to={createPageUrl(`Author?slug=${author.slug}`)}>
                                <Button variant="link" className="text-red-400 p-0 text-sm font-medium underline-offset-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:underline h-auto hover:text-blue-800">{t('authors.viewAllArticles')} →</Button>
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