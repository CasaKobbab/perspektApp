import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export default function FeaturedSection({ articles, topicColors }) {
  if (articles.length === 0) return null;

  const mainFeatured = articles[0];
  const sideFeatured = articles.slice(1, 3);

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Star className="w-6 h-6 text-yellow-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Fremhevet</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Featured Article */}
          <Link to={createPageUrl(`Article?id=${mainFeatured.id}`)} className="group">
            <div className="relative overflow-hidden rounded-xl bg-gray-900">
              {mainFeatured.featured_image && (
                <img
                  src={mainFeatured.featured_image}
                  alt={mainFeatured.image_alt || mainFeatured.title}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={`${topicColors[mainFeatured.topic]} border-0`}>
                    {mainFeatured.topic?.charAt(0).toUpperCase() + mainFeatured.topic?.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-200">
                    <Clock className="w-4 h-4 mr-1" />
                    {mainFeatured.reading_time || 5} min
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold font-serif mb-3 group-hover:text-blue-200 transition-colors">
                  {mainFeatured.title}
                </h3>
                {mainFeatured.dek && (
                  <p className="text-gray-200 text-lg leading-relaxed line-clamp-2">
                    {mainFeatured.dek}
                  </p>
                )}
                <div className="flex items-center mt-4 text-sm text-gray-300">
                  <span className="font-medium">{mainFeatured.author_name}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {format(new Date(mainFeatured.published_date || mainFeatured.created_date), "d. MMMM", { locale: nb })}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side Featured Articles */}
          <div className="space-y-6">
            {sideFeatured.map((article) => (
              <Link 
                key={article.id} 
                to={createPageUrl(`Article?id=${article.id}`)}
                className="flex gap-4 group"
              >
                {article.featured_image && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.featured_image}
                      alt={article.image_alt || article.title}
                      className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${topicColors[article.topic]}`}
                    >
                      {article.topic?.charAt(0).toUpperCase() + article.topic?.slice(1)}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.reading_time || 5} min
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-2 font-serif">
                    {article.title}
                  </h4>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>{article.author_name}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(new Date(article.published_date || article.created_date), "d. MMM", { locale: nb })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}