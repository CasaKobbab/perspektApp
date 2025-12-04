import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { Video } from "@/entities/Video";
import { SiteSettings } from "@/entities/SiteSettings";
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
import ImageMarquee from "../components/home/ImageMarquee";
import { AuroraButton } from "../components/ui/AuroraButton";
import { SpotlightBackground } from "../components/ui/SpotlightBackground";
import { TiltCard } from "../components/ui/TiltCard";

export default function Home() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
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
        
        // Fetch site settings
        const settings = await SiteSettings.list().then(res => res[0] || null).catch(() => null);

        setArticles(allArticles);
        setVideos(allVideos);
        setFeaturedArticles(allArticles.filter((article) => article.featured).slice(0, 3));
        setUser(currentUser);
        setSiteSettings(settings);
        
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
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink transition-colors duration-300 relative overflow-hidden">
      <SpotlightBackground />
      <div className="relative z-10">
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

            {/* Partner Slider */}
            <ImageMarquee />

            {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="text-center lg:text-left order-1">
            <h1 className="text-primary mb-6 font-serif text-4xl lg:text-6xl leading-tight font-bold">
              {t('home.title')}
              <span className="uppercase gradient-text lg:block lg:mt-2"> {t('home.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-secondary mb-8 leading-relaxed font-medium">
              {t('home.subtitle')}
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link to="/Subscribe" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-semibold px-8 shadow-lg h-12 text-lg border-none w-full">
                    {t('home.startSubscription')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white px-8 shadow-lg h-12 text-lg transition-colors w-full sm:w-auto"
                  onClick={async () => await User.login()}
                >
                  {t('nav.login')}
                </Button>
              </div>
            ) : (
              <div className="max-w-md mx-auto lg:mx-0">
                <p className="text-primary text-xl mb-6 font-semibold">{t('home.welcomeBack')}, {user.full_name}!</p>
                <Link to="/Latest" className="w-full sm:w-auto block">
                  <AuroraButton className="w-full sm:w-auto px-8 py-4 h-auto text-lg text-white font-bold">
                    {t('home.readLatestArticles')}
                    <ArrowRight className="ml-2 w-5 h-5 inline-block" />
                  </AuroraButton>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Image */}
          <div className="order-2 relative flex items-center justify-center perspective-1000">
            <TiltCard className="w-full">
              <img 
                src={siteSettings?.hero_image_light || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/9fa10a590_GeneratedImageNovember202025-4_06PM.png"} 
                alt="Perspekt Light Theme" 
                className="w-full h-full object-cover rounded-2xl shadow-xl dark:hidden pointer-events-none"
              />
              <img 
                src={siteSettings?.hero_image_dark || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/f16872292_GeneratedImageNovember202025-4_01PM.png"} 
                alt="Perspekt Dark Theme" 
                className="w-full h-full object-cover rounded-2xl shadow-xl hidden dark:block pointer-events-none"
              />
            </TiltCard>
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
    </div>
  );
}