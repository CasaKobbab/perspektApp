import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { createPageUrl, useTranslation } from "@/components/i18n/translations";
import { 
  Newspaper, 
  MessageSquare, 
  Palette, 
  Cpu, 
  TrendingUp, 
  Trophy 
} from "lucide-react";

function TopicItem({ topic, t }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link
      to={createPageUrl(`Topics?filter=${topic.slug}`)}
      className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${topic.color} group overflow-hidden`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0 rounded-xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, rgba(79, 195, 160, 0.6), transparent 80%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "2px",
        }}
      />
      <topic.icon className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform relative z-20" />
      <span className="font-medium text-primary group-hover:font-semibold relative z-20">
        {t(`topics.${topic.slug}`)}
      </span>
    </Link>
  );
}

export default function TopicNavigation() {
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    // Get current locale from localStorage
    const savedLocale = localStorage.getItem('preferred_locale') || 'nb';
    setCurrentLocale(savedLocale);

    // Listen for locale changes
    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const topics = [
    { slug: "news", icon: Newspaper, color: "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400" },
    { slug: "opinion", icon: MessageSquare, color: "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-400" },
    { slug: "culture", icon: Palette, color: "hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-400" },
    { slug: "technology", icon: Cpu, color: "hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/30 dark:hover:text-green-400" },
    { slug: "economy", icon: TrendingUp, color: "hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400" },
    { slug: "sports", icon: Trophy, color: "hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950/30 dark:hover:text-orange-400" },
  ];

  return (
    <section className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex overflow-x-auto py-4 space-x-8 scrollbar-hide">
          {topics.map((topic) => (
            <TopicItem key={topic.slug} topic={topic} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}