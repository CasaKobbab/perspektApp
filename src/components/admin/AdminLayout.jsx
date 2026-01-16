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
  Menu,
  X,
  Code,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";

export default function AdminLayout({ children, activePage, setActivePage, user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const navigationItems = [
    { name: t('admin.articles'), slug: "articles", icon: FileText, roles: ["admin", "editor"] },
    { name: currentLocale === 'nb' ? 'Videoer' : 'Videos', slug: "videos", icon: Video, roles: ["admin", "editor"] },
    { name: t('admin.authors'), slug: "authors", icon: Edit3, roles: ["admin", "editor"] },
    { name: t('admin.users'), slug: "users", icon: Users, roles: ["admin"] },
    { name: t('admin.topics'), slug: "topics", icon: Bookmark, roles: ["admin", "editor"] },
    { name: "Banners", slug: "banners", icon: FileText, roles: ["admin", "editor"] },
    { name: t('admin.settings'), slug: "settings", icon: Settings, roles: ["admin"] },
    { name: t('admin.scriptSettings') || "Scripts", slug: "scripts", icon: Code, roles: ["admin"] },
    { name: "Analytics", slug: "analytics", icon: TrendingUp, roles: ["admin", "editor"] },
    ];
  
  const handleLogout = async () => {
    await UserEntity.logout();
    window.location.href = createPageUrl("Home");
  }

  return (
    <div className="min-h-screen flex bg-primary relative">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-surface border-b border-default text-primary flex items-center px-4 z-40">
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 mr-2">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-bold font-serif">Perspekt Admin</span>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-default text-primary flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-default flex justify-between items-center">
          <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-mint-green to-aqua-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-serif text-primary">Perspekt</span>
              <span className="text-xs text-secondary">{t('admin.title')}</span>
            </div>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1 text-secondary hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            item.roles.includes(user.role) && (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.slug);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activePage === item.slug
                    ? "bg-accent text-text-on-accent"
                    : "text-secondary hover:bg-secondary hover:text-primary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            )
          ))}
        </nav>
        
        <div className="px-2 py-4 border-t border-default">
          <Link to={createPageUrl("Home")} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-secondary hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            <span>{t('nav.backToSite')}</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-secondary hover:text-primary transition-colors">
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 bg-primary pt-20 lg:pt-10">
        {children}
      </main>
    </div>
  );
}