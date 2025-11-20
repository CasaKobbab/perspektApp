import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import {
  FileText,
  Video,
  Users,
  Bookmark,
  Settings,
  Edit3,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";

export default function AdminLayout({ children, activePage, setActivePage, user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  
  const navigationItems = [
    { name: t('admin.articles'), slug: "articles", icon: FileText, roles: ["admin", "editor"] },
    { name: currentLocale === 'nb' ? 'Videoer' : 'Videos', slug: "videos", icon: Video, roles: ["admin", "editor"] },
    { name: t('admin.authors'), slug: "authors", icon: Edit3, roles: ["admin", "editor"] },
    { name: t('admin.users'), slug: "users", icon: Users, roles: ["admin"] },
    { name: t('admin.topics'), slug: "topics", icon: Bookmark, roles: ["admin", "editor"] },
    { name: t('admin.settings'), slug: "settings", icon: Settings, roles: ["admin"] },
  ];
  
  const handleLogout = async () => {
    await UserEntity.logout();
    window.location.href = createPageUrl("Home");
  }

  return (
    <div className="min-h-screen flex bg-paper-white dark:bg-slate-ink">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-ink text-paper-white flex flex-col">
        <div className="p-4 border-b border-warm-sand">
          <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-nordic-sea to-laks rounded-lg flex items-center justify-center">
              <span className="text-paper-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold font-serif">Perspekt</span>
          </Link>
          <p className="text-xs text-warm-sand mt-1">{t('admin.title')}</p>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigationItems.map((item) => (
            item.roles.includes(user.role) && (
              <button
                key={item.name}
                onClick={() => setActivePage(item.slug)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activePage === item.slug
                    ? "bg-nordic-sea text-paper-white"
                    : "text-warm-sand hover:bg-nordic-sea hover:text-paper-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            )
          ))}
        </nav>
        
        <div className="px-2 py-4 border-t border-warm-sand">
          <Link to={createPageUrl("Home")} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-warm-sand hover:bg-nordic-sea hover:text-paper-white transition-colors">
            <Home className="w-4 h-4" />
            <span>{t('nav.backToSite')}</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-warm-sand hover:bg-nordic-sea hover:text-paper-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 bg-paper-white dark:bg-slate-ink">
        {children}
      </main>
    </div>
  );
}