
import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { Link } from "react-router-dom";
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
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    setSelectedTopic(filter);
  }, []);

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
      <div className="min-h-screen bg-paper-white dark:bg-slate-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-primary font-serif mb-4">{t('nav.topics')}</h1>
            <p className="text-secondary text-lg">
              {t('topics.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic) =>
            <Link
              key={topic.slug}
              to={createPageUrl(`Topics?filter=${topic.slug}`)}
              className="group">

                <div className={`${topic.bgColor} rounded-xl p-8 transition-all duration-200 hover:scale-105 hover:shadow-lg`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg ${topic.color.replace('hover:', '')} flex items-center justify-center mr-4`}>
                      <topic.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-slate-900 text-xl font-bold">{topic.name}</h2>
                  </div>
                  <p className="text-slate-900 mb-4">{topic.description}</p>
                  <div className="flex items-center text-nordic-sea group-hover:text-slate-ink transition-colors">
                    <span className="text-sky-800 mr-2 font-medium">
                      {t('common.readArticles')}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>);

  }

  // Show articles for selected topic
  const currentTopic = topics.find((t) => t.slug === selectedTopic);

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to={createPageUrl("Topics")} className="text-secondary hover:text-primary mr-4">
              ← {t('nav.topics')}
            </Link>
            <Badge className={topicColors[selectedTopic]}>
              {currentTopic?.name}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-primary font-serif mb-2">
            {currentTopic?.name}
          </h1>
          <p className="text-secondary text-lg">{currentTopic?.description}</p>
        </div>

        {/* Articles Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {articles.length > 0 ?
          articles.map((article) =>
          <ArticleCard
            key={article.id}
            article={article}
            topicColors={topicColors}
            user={user}
            showImage={true} />

          ) :

          <div className="col-span-full text-center py-12">
              <p className="text-secondary text-lg">{t('common.noArticlesFound')}</p>
              <Link to={createPageUrl("Topics")} className="inline-block mt-4">
                <Button variant="outline">
                  ← {t('common.backToTopics')}
                </Button>
              </Link>
            </div>
          }
        </div>
      </div>
    </div>);

}
