import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { Link, useLocation } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  MessageSquare,
  Palette,
  Cpu,
  TrendingUp,
  Trophy,
  ArrowRight } from
"lucide-react";

import ArticleCard from "../components/home/ArticleCard";

export default function Topics() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
    // Get filter from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const filter = urlParams.get('filter');
    setSelectedTopic(filter);
  }, [location.search]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [currentUser] = await Promise.all([
        User.me().catch(() => null)]
        );

        let articleFilter = { status: 'published', locale: currentLocale };
        if (selectedTopic) {
          articleFilter.topic = selectedTopic;
        }

        const allArticles = await Article.filter(articleFilter, '-published_date', 30);

        setArticles(allArticles);
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading articles:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [currentLocale, selectedTopic]);

  const topicColors = {
    news: "bg-red-100 text-red-800",
    opinion: "bg-blue-100 text-blue-800",
    culture: "bg-purple-100 text-purple-800",
    technology: "bg-green-100 text-green-800",
    economy: "bg-yellow-100 text-yellow-800",
    sports: "bg-orange-100 text-orange-800"
  };

  const topics = [
  {
    name: t('topics.news'),
    slug: "news",
    icon: Newspaper,
    color: "hover:bg-red-50 hover:text-red-700",
    bgColor: "bg-red-100",
    description: t('topics.newsDescription')
  },
  {
    name: t('topics.opinion'),
    slug: "opinion",
    icon: MessageSquare,
    color: "hover:bg-blue-50 hover:text-blue-700",
    bgColor: "bg-blue-100",
    description: t('topics.opinionDescription')
  },
  {
    name: t('topics.culture'),
    slug: "culture",
    icon: Palette,
    color: "hover:bg-purple-50 hover:text-purple-700",
    bgColor: "bg-purple-100",
    description: t('topics.cultureDescription')
  },
  {
    name: t('topics.technology'),
    slug: "technology",
    icon: Cpu,
    color: "hover:bg-green-50 hover:text-green-700",
    bgColor: "bg-green-100",
    description: t('topics.technologyDescription')
  },
  {
    name: t('topics.economy'),
    slug: "economy",
    icon: TrendingUp,
    color: "hover:bg-yellow-50 hover:text-yellow-700",
    bgColor: "bg-yellow-100",
    description: t('topics.economyDescription')
  },
  {
    name: t('topics.sports'),
    slug: "sports",
    icon: Trophy,
    color: "hover:bg-orange-50 hover:text-orange-700",
    bgColor: "bg-orange-100",
    description: t('topics.sportsDescription')
  }];


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white dark:bg-slate-ink">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nordic-sea"></div>
      </div>);

  }

  // If no specific topic is selected, show all topics
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
        {/* Ambient Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {t('nav.topics')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              {t('topics.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => (
              <Link
                key={topic.slug}
                to={createPageUrl(`Topics?filter=${topic.slug}`)}
                className="group relative"
              >
                <div className="h-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.3)] hover:border-teal-500/50 flex flex-col">
                  
                  {/* Icon */}
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <topic.icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-cyan-500 transition-all">
                    {topic.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Button/Link */}
                  <div className="flex items-center text-teal-600 dark:text-teal-400 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="mr-2">{t('common.readArticles')}</span>
                    <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>);
  }

  // Show articles for selected topic
  const currentTopic = topics.find((t) => t.slug === selectedTopic);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to={createPageUrl("Topics")} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-500 mb-6 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            {t('nav.topics')}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 backdrop-blur-md">
                    {currentTopic?.name}
                 </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-gray-900 dark:text-white">
                {currentTopic?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                {currentTopic?.description}
              </p>
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
            <div className="col-span-full py-20 text-center bg-white/40 dark:bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">{t('common.noArticlesFound')}</p>
              <Link to={createPageUrl("Topics")}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-full px-8">
                  {t('common.backToTopics')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>);

}