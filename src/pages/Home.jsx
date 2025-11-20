import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { Video } from "@/entities/Video";
import { Link } from "react-router-dom";
import { useTranslation } from "@/components/i18n/translations";
import { Clock, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import ArticleCard from "../components/home/ArticleCard";
import FeaturedSection from "../components/home/FeaturedSection";
import TopicNavigation from "../components/home/TopicNavigation";
import NewsletterSignup from "../components/home/NewsletterSignup";
import LatestVideos from "../components/home/LatestVideos";

export default function Home() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current locale from localStorage
    const savedLocale = localStorage.getItem('preferred_locale') || 'nb';
    setCurrentLocale(savedLocale);
  }, []);

  useEffect(() => {
    // Listen for locale changes
    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch articles with locale filter
        const allArticles = await Article.filter({ status: 'published', locale: currentLocale }, '-published_date', 20);
        
        // Fetch videos - first try with locale, if empty try without locale filter
        let allVideos = [];
        try {
          allVideos = await Video.filter({ status: 'published', locale: currentLocale }, '-published_date', 4);
          
          // If no videos found for current locale, try fetching all published videos
          if (!allVideos || allVideos.length === 0) {
            console.log(`No videos found for locale: ${currentLocale}, fetching all published videos`);
            allVideos = await Video.filter({ status: 'published' }, '-published_date', 4);
          }
        } catch (videoError) {
          console.error('Error loading videos:', videoError);
          // Try fetching all published videos as fallback
          try {
            allVideos = await Video.filter({ status: 'published' }, '-published_date', 4);
          } catch (fallbackError) {
            console.error('Error loading videos (fallback):', fallbackError);
            allVideos = [];
          }
        }

        // Fetch current user
        const currentUser = await User.me().catch(() => null);

        setArticles(allArticles);
        setVideos(allVideos);
        setFeaturedArticles(allArticles.filter((article) => article.featured).slice(0, 3));
        setUser(currentUser);
        
        console.log('Loaded videos:', allVideos);
      } catch (error) {
        console.error('Error loading data:', error);
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

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink transition-colors duration-300">
      <style>
        {`
            @keyframes slow-zoom {
                from {
                    transform: scale(1);
                }
                to {
                    transform: scale(1.05);
                }
            }
        `}
      </style>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nordic-sea via-slate-ink to-nordic-sea text-paper-white">
        <div
          className="absolute inset-0 bg-no-repeat bg-center opacity-5"
          style={{
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/5b1079ffe_IBSTuwaygKBsfuzb7Ls7W.jpg)',
            animation: 'slow-zoom 40s infinite alternate ease-in-out'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[#a59e9c] mb-6 font-serif lg:text-6xl leading-tight">
              {t('home.title')}
              <span className="bg-gradient-to-r from-warm-sand to-laks bg-clip-text text-transparent"> {t('home.titleHighlight')}</span>
            </h1>
            <p className="text-xl lg:text-2xl text-warm-sand mb-8 leading-relaxed">
              {t('home.subtitle')}
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/Subscribe">
                  <Button size="lg" className="bg-paper-white text-nordic-sea hover:bg-warm-sand font-semibold px-8">
                    {t('home.startSubscription')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-paper-white text-paper-white hover:bg-paper-white hover:text-nordic-sea px-8"
                  onClick={async () => await User.login()}
                >
                  {t('nav.login')}
                </Button>
              </div>
            ) : (
              <div className="bg-paper-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <p className="text-warm-sand mb-4">{t('home.welcomeBack')}, {user.full_name}!</p>
                <Link to="/Latest">
                  <Button className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    {t('home.readLatestArticles')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Topic Navigation */}
      <TopicNavigation />

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <FeaturedSection articles={featuredArticles} topicColors={topicColors} />
      )}

      {/* Latest Articles Grid with 3 columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary font-serif mb-2">{t('home.latestArticles')}</h2>
          <p className="text-secondary">{t('home.latestSubtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Latest Videos - Left Column */}
          <div className="lg:col-span-3">
            <LatestVideos videos={videos} topicColors={topicColors} />
          </div>

          {/* Main Content - Center Column */}
          <div className="lg:col-span-6">
            <div className="space-y-8">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  topicColors={topicColors}
                  user={user}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Newsletter Signup */}
            <NewsletterSignup user={user} />

            {/* Trending Topics */}
            <div className="card-surface rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
                <TrendingUp className="w-5 h-5 mr-2 text-nordic-sea" />
                {t('home.popularTopics')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(topicColors).map((topic) => (
                  <Link key={topic} to={`/Topics?filter=${topic}`}>
                    <Badge
                      variant="secondary"
                      className={`${topicColors[topic]} cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      {t(`topics.${topic}`)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Subscription CTA */}
            {!user && (
              <div className="card-surface rounded-lg p-6 text-center bg-gradient-to-br from-warm-sand to-laks dark:from-slate-ink dark:to-nordic-sea">
                <Star className="w-8 h-8 text-nordic-sea dark:text-laks mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">{t('home.getAccess')}</h3>
                <p className="text-sm text-secondary mb-4">
                  {t('home.subscribeSupport')}
                </p>
                <Link to="/Subscribe">
                  <Button size="sm" className="btn-primary w-full">
                    {t('home.seePrices')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}