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
import CompactArticleCard from "../components/home/CompactArticleCard";
import FeaturedArticleCard from "../components/home/FeaturedArticleCard";
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
        
        // Fetch videos - get locale specific ones first, then fill with general ones
        let allVideos = [];
        try {
          const limit = 4;
          // First try to get videos for current locale
          let localizedVideos = await Video.filter({ status: 'published', locale: currentLocale }, '-published_date', limit);
          if (!localizedVideos) localizedVideos = [];
          
          // If we don't have enough videos, fetch general ones to fill the gap
          if (localizedVideos.length < limit) {
            const generalVideos = await Video.filter({ status: 'published' }, '-published_date', limit);
            
            // Create a map of existing video IDs to avoid duplicates
            const existingIds = new Set(localizedVideos.map(v => v.id));
            
            // Add general videos that aren't already in the list until we reach the limit
            for (const video of (generalVideos || [])) {
              if (!existingIds.has(video.id) && localizedVideos.length < limit) {
                localizedVideos.push(video);
                existingIds.add(video.id);
              }
            }
          }
          allVideos = localizedVideos;
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

      {/* Magazine Layout Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN (Sidebar A) - cols-3 */}
          <div className="lg:col-span-3 order-3 lg:order-1 space-y-12">
            {/* Quick Reads */}
            {articles.filter(a => (a.reading_time || 0) <= 3).length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-accent/20">
                  <Clock className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-lg text-primary tracking-wide uppercase text-sm">Quick Reads</h3>
                </div>
                <div>
                  {articles
                    .filter(a => (a.reading_time || 0) <= 3)
                    .slice(0, 3)
                    .map(article => (
                      <CompactArticleCard key={article.id} article={article} topicColors={topicColors} />
                    ))}
                </div>
              </div>
            )}

            {/* Latest Videos */}
            <div className="pt-4">
               <LatestVideos videos={videos} topicColors={topicColors} />
            </div>
          </div>

          {/* CENTER COLUMN (Main Stage) - cols-6 */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            {/* Featured Story */}
            {articles.length > 0 && (
              <FeaturedArticleCard 
                article={featuredArticles[0] || articles[0]} 
                topicColors={topicColors} 
                user={user} 
              />
            )}

            {/* Latest Publications Stream */}
            <div className="mt-12">
              <div className="flex items-center space-x-2 mb-8">
                <div className="h-1 w-6 bg-accent rounded-full"></div>
                <h3 className="font-bold text-xl text-primary font-serif italic">Latest Publications</h3>
              </div>
              <div className="space-y-8">
                {articles
                  .filter(a => a.id !== (featuredArticles[0]?.id || articles[0]?.id))
                  .slice(0, 5)
                  .map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      topicColors={topicColors}
                      user={user}
                      showImage={true}
                    />
                  ))}
              </div>
               <div className="mt-8 text-center">
                  <Link to="/Latest">
                    <Button variant="outline" className="w-full border-default hover:bg-surface">
                      {t('home.seeAll')} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar B) - cols-3 */}
          <div className="lg:col-span-3 order-2 lg:order-3 space-y-12">
             {/* Subscription CTA */}
             {!user ? (
               <div className="card-surface rounded-xl p-6 text-center bg-gradient-to-br from-warm-sand/30 to-laks/30 dark:from-slate-ink dark:to-nordic-sea/20 border border-accent/20 shadow-lg">
                <Star className="w-10 h-10 text-accent mx-auto mb-4 animate-pulse" />
                <h3 className="font-bold text-xl text-primary mb-3 font-serif">{t('home.getAccess')}</h3>
                <p className="text-sm text-secondary mb-6 leading-relaxed">
                  {t('home.subscribeSupport')}
                </p>
                <Link to="/Subscribe">
                  <Button className="btn-gradient w-full font-bold shadow-md transform hover:-translate-y-0.5 transition-transform">
                    {t('home.startSubscription')}
                  </Button>
                </Link>
              </div>
             ) : (
                <div className="card-surface rounded-xl p-6 border border-default shadow-sm">
                   <h3 className="font-bold text-lg text-primary mb-2">Welcome, {user.full_name}</h3>
                   <p className="text-sm text-secondary mb-4">You have full access to all our premium content.</p>
                   <Link to="/Account">
                      <Button variant="outline" size="sm" className="w-full">My Account</Button>
                   </Link>
                </div>
             )}

            {/* Opinion Cluster */}
            {articles.filter(a => a.topic === 'opinion').length > 0 && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between mb-4 pb-2 border-b border-default">
                    <h3 className="font-bold text-lg text-primary tracking-wide uppercase text-sm">{t('topics.opinion')}</h3>
                    <Link to="/Topics?filter=opinion" className="text-xs text-accent hover:underline">View All</Link>
                 </div>
                 {articles
                    .filter(a => a.topic === 'opinion' && a.id !== (featuredArticles[0]?.id || articles[0]?.id))
                    .slice(0, 2)
                    .map(article => (
                       <CompactArticleCard key={article.id} article={article} topicColors={topicColors} />
                    ))}
              </div>
            )}

             {/* News Cluster */}
             {articles.filter(a => a.topic === 'news').length > 0 && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between mb-4 pb-2 border-b border-default">
                    <h3 className="font-bold text-lg text-primary tracking-wide uppercase text-sm">{t('topics.news')}</h3>
                    <Link to="/Topics?filter=news" className="text-xs text-accent hover:underline">View All</Link>
                 </div>
                 {articles
                    .filter(a => a.topic === 'news' && a.id !== (featuredArticles[0]?.id || articles[0]?.id))
                    .slice(0, 2)
                    .map(article => (
                       <CompactArticleCard key={article.id} article={article} topicColors={topicColors} />
                    ))}
              </div>
            )}
            
            {/* Newsletter */}
            <div className="pt-4 border-t border-default">
               <h3 className="font-bold text-lg text-primary mb-4 tracking-wide uppercase text-sm">Newsletter</h3>
               <NewsletterSignup user={user} minimal={true} />
            </div>

          </div>
        </div>
      </section>
      </div>
    </div>
  );
}