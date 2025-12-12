import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { Video } from "@/entities/Video";
import { SiteSettings } from "@/entities/SiteSettings";
import { Link } from "react-router-dom";
import { useTranslation } from "@/components/i18n/translations";
import { ArrowRight, Star, TrendingUp, Zap, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import ArticleCard from "../components/home/ArticleCard";
import ArticleCardCompact from "../components/home/ArticleCardCompact";
import ArticleCardFeatured from "../components/home/ArticleCardFeatured";
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
  
  // Data States
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [quickReads, setQuickReads] = useState([]);
  const [opinionArticles, setOpinionArticles] = useState([]);
  const [mainFeedArticles, setMainFeedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [siteSettings, setSiteSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred_locale') || 'nb';
    setCurrentLocale(savedLocale);
  }, []);

  useEffect(() => {
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
        // Fetch a large batch of published articles
        const allArticles = await Article.filter({ status: 'published', locale: currentLocale }, '-published_date', 50);
        
        // 1. Identify Featured Article (first one marked featured, or just the latest one)
        let featured = allArticles.find(a => a.featured);
        if (!featured && allArticles.length > 0) {
            featured = allArticles[0];
        }
        setFeaturedArticle(featured);

        const remainingArticles = allArticles.filter(a => a.id !== featured?.id);

        // 2. Quick Reads (Reading time < 4 min)
        const quick = remainingArticles.filter(a => (a.reading_time || 0) < 4).slice(0, 5);
        setQuickReads(quick);

        // 3. Opinion Articles
        const opinions = remainingArticles.filter(a => a.topic === 'opinion').slice(0, 2);
        setOpinionArticles(opinions);

        // 4. Main Feed (Avoid duplicates from Quick/Opinion if possible, but for simplicity we just exclude Quick reads if they are also in main feed? 
        // Actually, user requirement: "Main Feed" is chronological. 
        // Let's just take the remaining articles excluding the featured one for the main feed, 
        // but to ensure variety, let's filter out ones we already used in Opinion if we want unique content? 
        // The prompt says "attempts to avoid duplication".
        const usedIds = new Set([featured?.id, ...quick.map(a => a.id), ...opinions.map(a => a.id)].filter(Boolean));
        
        // Main feed should be substantial
        const main = remainingArticles.filter(a => !usedIds.has(a.id)).slice(0, 8);
        setMainFeedArticles(main);

        // 5. Trending/News (Just some extras for the sidebar)
        const trending = remainingArticles.filter(a => !usedIds.has(a.id) && !main.find(m => m.id === a.id)).slice(0, 3);
        setTrendingArticles(trending);

        // Fetch Videos
        let allVideos = [];
        try {
           allVideos = await Video.filter({ status: 'published', locale: currentLocale }, '-published_date', 3);
        } catch (e) { console.error(e); }
        setVideos(allVideos || []);

        // Fetch User & Settings
        const currentUser = await User.me().catch(() => null);
        const settings = await SiteSettings.list().then(res => res[0] || null).catch(() => null);

        setUser(currentUser);
        setSiteSettings(settings);
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
        <ImageMarquee />

        {/* Hero / Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                    {t('home.title')} <span className="gradient-text">{t('home.titleHighlight')}</span>
                </h1>
                <p className="text-lg text-secondary">{t('home.subtitle')}</p>
            </div>
            <TopicNavigation />
        </section>

        {/* BENTO GRID LAYOUT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {/* 
               Desktop: 12 Column Grid 
               Mobile: Flex Column for specific ordering 
            */}
            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-y-12">
                
                {/* 
                   LEFT COLUMN (Sidebar A) 
                   Desktop: Col 1-3. Row span 2 to stretch down.
                   Mobile Order: 4 (Quick) -> 5 (Videos)
                */}
                <div className="md:col-span-3 md:row-span-2 order-4 md:order-none space-y-8">
                    {/* Quick Reads */}
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-default p-5">
                        <h3 className="font-bold text-primary mb-4 flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-amber-500 fill-current" />
                            Korte lesestunder
                        </h3>
                        <div className="space-y-1">
                            {quickReads.map(article => (
                                <ArticleCardCompact key={article.id} article={article} topicColors={topicColors} />
                            ))}
                        </div>
                    </div>

                    {/* Videos (Moved to bottom of left column) */}
                    <div>
                        <h3 className="font-bold text-primary mb-4 flex items-center px-1">
                             Videoer
                        </h3>
                        <LatestVideos videos={videos} topicColors={topicColors} compact={true} />
                    </div>
                </div>

                {/* 
                   CENTER COLUMN (Main Stage) - Featured Article
                   Desktop: Col 4-9 (Span 6). Row 1.
                   Mobile Order: 1
                */}
                <div className="md:col-span-6 md:row-start-1 order-1 md:order-none">
                     {featuredArticle && (
                         <ArticleCardFeatured article={featuredArticle} topicColors={topicColors} />
                     )}
                </div>

                {/* 
                   RIGHT COLUMN (Sidebar B)
                   Desktop: Col 10-12 (Span 3). Row span 2.
                   Mobile Order: 2 (Newsletter) -> 6? (Opinion)
                */}
                <div className="md:col-span-3 md:row-span-2 order-2 md:order-none space-y-8">
                    {/* Newsletter - High Visibility */}
                    <NewsletterSignup user={user} compact={true} />

                    {/* Opinion Section */}
                    {opinionArticles.length > 0 && (
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-5">
                            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                                <Newspaper className="w-4 h-4 mr-2" />
                                {t('topics.opinion')}
                            </h3>
                            <div className="space-y-1">
                                {opinionArticles.map(article => (
                                    <ArticleCardCompact key={article.id} article={article} topicColors={topicColors} showImage={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trending/Tags */}
                    <div className="card-surface rounded-xl p-5">
                         <h3 className="font-bold text-primary mb-4 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-nordic-sea" />
                            {t('home.popularTopics')}
                         </h3>
                         <div className="flex flex-wrap gap-2">
                             {Object.keys(topicColors).map((topic) => (
                               <Link key={topic} to={`/Topics?filter=${topic}`}>
                                 <Badge variant="secondary" className={`${topicColors[topic]} cursor-pointer`}>
                                   {t(`topics.${topic}`)}
                                 </Badge>
                               </Link>
                             ))}
                         </div>
                    </div>
                </div>

                {/* 
                   CENTER COLUMN (Main Stage) - Main Feed
                   Desktop: Col 4-9 (Span 6). Row 2.
                   Mobile Order: 3
                */}
                <div className="md:col-span-6 md:row-start-2 order-3 md:order-none space-y-8">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-primary">{t('home.latestArticles')}</h3>
                     </div>
                     <div className="space-y-8">
                        {mainFeedArticles.map(article => (
                            <ArticleCard key={article.id} article={article} topicColors={topicColors} user={user} />
                        ))}
                     </div>
                     
                     <div className="text-center pt-8">
                        <Link to="/Latest">
                             <Button variant="outline" className="w-full md:w-auto">
                                 {t('home.seeAll')} <ArrowRight className="ml-2 w-4 h-4" />
                             </Button>
                        </Link>
                     </div>
                </div>

            </div>
        </section>

      </div>
    </div>
  );
}