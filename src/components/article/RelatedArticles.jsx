
import React, { useState, useEffect } from "react";
import { Article } from "@/entities/Article";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export default function RelatedArticles({ currentArticle }) {
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRelatedArticles = async () => {
      setIsLoading(true);
      try {
        // Get articles from same topic, excluding current article
        const related = await Article.filter(
          { 
            topic: currentArticle.topic,
            status: 'published'
          }, 
          '-published_date', 
          6
        );
        
        setRelatedArticles(related.filter(article => article.id !== currentArticle.id).slice(0, 3));
      } catch (error) {
        console.error('Error loading related articles:', error);
      }
      setIsLoading(false);
    };

    if (currentArticle) {
      loadRelatedArticles();
    }
  }, [currentArticle]);

  const topicColors = {
    nyheter: "bg-red-100 text-red-800",
    mening: "bg-blue-100 text-blue-800", 
    kultur: "bg-purple-100 text-purple-800",
    teknologi: "bg-green-100 text-green-800",
    økonomi: "bg-yellow-100 text-yellow-800",
    sport: "bg-orange-100 text-orange-800"
  };

  if (isLoading || relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">
            Relaterte artikler
          </h2>
          <Link 
            to={createPageUrl(`Topics?filter=${currentArticle.topic}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
          >
            Se alle fra {currentArticle.topic}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {relatedArticles.map((article) => (
            <Link
              key={article.id}
              to={createPageUrl(`Article?id=${article.id}`)}
              className="group"
            >
              <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                {article.featured_image && (
                  <div className="aspect-video overflow-hidden rounded-t-xl">
                    <img
                      src={article.featured_image}
                      alt={article.image_alt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={topicColors[article.topic] || "bg-gray-100 text-gray-800"}>
                      {article.topic?.charAt(0).toUpperCase() + article.topic?.slice(1)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.reading_time || 5} min
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-2 font-serif mb-2">
                    {article.title}
                  </h3>

                  {article.dek && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {article.dek}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{article.author_name}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(new Date(article.published_date || article.created_date), "d. MMM", { locale: nb })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
