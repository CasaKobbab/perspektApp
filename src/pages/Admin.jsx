
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
import { ShieldAlert } from "lucide-react";
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
      case "users":
        return <AdminUsers user={user} currentLocale={currentLocale} />;
      case "topics":
        return <AdminTopics user={user} currentLocale={currentLocale} />;
      case "authors":
        return <AdminAuthors user={user} currentLocale={currentLocale} />;
      case "settings":
        return <AdminSettings user={user} currentLocale={currentLocale} />;
      default:
        return <AdminArticles user={user} currentLocale={currentLocale} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.noAccess')}</h1>
          <p className="text-gray-600 mb-6">{t('admin.noAccessDesc')}</p>
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
