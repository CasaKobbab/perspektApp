import React, { useState, useEffect } from "react";
import { Article, User } from "@/entities/all";
import { useTranslation } from "@/components/i18n/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

import ArticleCard from "../components/home/ArticleCard";

export default function Latest() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("published");

  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');

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
        const [allArticles, currentUser] = await Promise.all([
          Article.filter({ status: 'published', locale: currentLocale }, '-published_date', 50),
          User.me().catch(() => null)
        ]);

        setArticles(allArticles);
        setFilteredArticles(allArticles);
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading articles:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [currentLocale]);

  useEffect(() => {
    let filtered = articles;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.dek?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by topic
    if (selectedTopic !== "all") {
      filtered = filtered.filter(article => article.topic === selectedTopic);
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery, selectedTopic]);

  const topicColors = {
    news: "bg-red-100 text-red-800",
    opinion: "bg-blue-100 text-blue-800",
    culture: "bg-purple-100 text-purple-800",
    technology: "bg-green-100 text-green-800",
    economy: "bg-yellow-100 text-yellow-800",
    sports: "bg-orange-100 text-orange-800"
  };

  const availableTopics = [
    { slug: "news", nameKey: "topics.news" },
    { slug: "opinion", nameKey: "topics.opinion" },
    { slug: "culture", nameKey: "topics.culture" },
    { slug: "technology", nameKey: "topics.technology" },
    { slug: "economy", nameKey: "topics.economy" },
    { slug: "sports", nameKey: "topics.sports" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white dark:bg-slate-ink">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nordic-sea"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-white dark:bg-slate-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">{t('nav.latest')}</h1>
          <p className="text-secondary text-lg">{t('home.latestSubtitle')}</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-ink rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  type="text"
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-warm-sand dark:bg-slate-ink border-theme text-primary"
                />
              </div>
            </div>

            {/* Topic Filter */}
            <div className="md:w-48">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="bg-warm-sand dark:bg-slate-ink border-theme text-primary">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="card-surface">
                  <SelectItem value="all">{t('common.all')} {t('nav.topics')}</SelectItem>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic.slug} value={topic.slug}>
                      {t(topic.nameKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
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