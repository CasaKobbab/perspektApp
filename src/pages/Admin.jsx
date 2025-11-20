import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import AdminLayout from "../components/admin/AdminLayout";
import AdminArticles from "../components/admin/pages/AdminArticles";
import AdminUsers from "../components/admin/pages/AdminUsers";
import AdminTopics from "../components/admin/pages/AdminTopics";
import AdminAuthors from "../components/admin/pages/AdminAuthors";
import AdminSettings from "../components/admin/pages/AdminSettings";
import AdminVideos from "../components/admin/pages/AdminVideos"; // New import
import { ShieldAlert, FileText, Video, Users, BookOpen, UserRound, Settings } from "lucide-react"; // Added new icons
import { Button } from "@/components/ui/button";

export default function Admin() {
  const navigate = useNavigate();
  const [currentLocale, setCurrentLocale] = useState('nb');
  const { t } = useTranslation(currentLocale);

  // Effect to initialize locale from localStorage on mount
  useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');
  }, []);

  // Effect to listen for locale changes and update state
  useEffect(() => {
    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState("articles");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
          setUser(null);
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        setUser(null);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "articles":
        return <AdminArticles user={user} currentLocale={currentLocale} />;
      case "videos": // New case for videos
        return <AdminVideos user={user} currentLocale={currentLocale} />;
      case "users":
        return <AdminUsers user={user} currentLocale={currentLocale} />;
      case "topics":
        return <AdminTopics user={user} currentLocale={currentLocale} />;
      case "authors":
        return <AdminAuthors user={user} currentLocale={currentLocale} />;
      case "settings":
        return <AdminSettings user={user} currentLocale={currentLocale} />;
      default:
        // New default case rendering a dashboard of cards
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => setActivePage('articles')}
              className="card-surface p-6 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent">

              <FileText className="w-12 h-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-primary">{t('admin.articleManagement')}</h2>
              <p className="text-secondary">{t('admin.articleManagementDesc')}</p>
            </div>

            <div
              onClick={() => setActivePage('videos')}
              className="card-surface p-6 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent">

              <Video className="w-12 h-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-primary">
                {t('admin.videoManagement')}
              </h2>
              <p className="text-secondary">
                {t('admin.videoManagementDesc')}
              </p>
            </div>

            <div
              onClick={() => setActivePage('users')}
              className="card-surface p-6 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent">

              <Users className="w-12 h-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-primary">{t('admin.userManagement')}</h2>
              <p className="text-secondary">{t('admin.userManagementDesc')}</p>
            </div>

            <div
              onClick={() => setActivePage('topics')}
              className="card-surface p-6 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent">

              <BookOpen className="w-12 h-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-primary">{t('admin.topicManagement')}</h2>
              <p className="text-secondary">{t('admin.topicManagementDesc')}</p>
            </div>

            <div
              onClick={() => setActivePage('authors')}
              className="card-surface p-6 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent">

              <UserRound className="w-12 h-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-primary">{t('admin.authorManagement')}</h2>
              <p className="text-secondary">{t('admin.authorManagementDesc')}</p>
            </div>

            <div
              onClick={() => setActivePage('settings')}
              className="card-surface p-6 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-accent">

              <Settings className="w-12 h-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-primary">{t('admin.settingsManagement')}</h2>
              <p className="text-secondary">{t('admin.settingsManagementDesc')}</p>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center p-8 card-surface rounded-lg shadow-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">{t('admin.noAccess')}</h1>
          <p className="text-secondary mb-6">{t('admin.noAccessDesc')}</p>
          <Link to={createPageUrl("Home")}>
            <Button>{t('admin.goToHomepage')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activePage={activePage} setActivePage={setActivePage} user={user} currentLocale={currentLocale}>
      {renderContent()}
    </AdminLayout>
  );
}