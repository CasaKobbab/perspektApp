import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Newspaper, 
  MessageSquare, 
  Palette, 
  Cpu, 
  TrendingUp, 
  Trophy 
} from "lucide-react";

export default function TopicNavigation() {
  const topics = [
    { name: "Nyheter", slug: "nyheter", icon: Newspaper, color: "hover:bg-red-50 hover:text-red-700" },
    { name: "Mening", slug: "mening", icon: MessageSquare, color: "hover:bg-blue-50 hover:text-blue-700" },
    { name: "Kultur", slug: "kultur", icon: Palette, color: "hover:bg-purple-50 hover:text-purple-700" },
    { name: "Teknologi", slug: "teknologi", icon: Cpu, color: "hover:bg-green-50 hover:text-green-700" },
    { name: "Økonomi", slug: "økonomi", icon: TrendingUp, color: "hover:bg-yellow-50 hover:text-yellow-700" },
    { name: "Sport", slug: "sport", icon: Trophy, color: "hover:bg-orange-50 hover:text-orange-700" },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-4 space-x-8 scrollbar-hide">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              to={createPageUrl(`Topics?filter=${topic.slug}`)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${topic.color} group`}
            >
              <topic.icon className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700 group-hover:font-semibold">
                {topic.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}