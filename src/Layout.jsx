import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation, LOCALE_LABELS, createPageUrl } from "@/components/i18n/translations";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import {
  Home,
  FileText,
  Users,
  Bookmark,
  User,
  Settings,
  Search,
  Menu,
  X,
  Globe,
  Sun,
  Moon } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { User as UserEntity } from "@/entities/User";

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [currentLocale, setCurrentLocale] = useState('nb');
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    const initializeLocale = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);

        const savedLocale = localStorage.getItem('preferred_locale');
        const browserLang = navigator.language?.split('-')[0];
        const preferredLocale = currentUser.preferred_locale ||
        savedLocale || (
        browserLang === 'en' ? 'en' : 'nb');

        setCurrentLocale(preferredLocale);
      } catch (error) {
        const savedLocale = localStorage.getItem('preferred_locale');
        const browserLang = navigator.language?.split('-')[0];
        const preferredLocale = savedLocale || (browserLang === 'en' ? 'en' : 'nb');

        setCurrentLocale(preferredLocale);
      }
    };

    initializeLocale();
  }, []);

  const changeLocale = async (newLocale) => {
    if (newLocale === currentLocale) return;

    setCurrentLocale(newLocale);
    localStorage.setItem('preferred_locale', newLocale);

    if (user) {
      try {
        await UserEntity.updateMyUserData({ preferred_locale: newLocale });
      } catch (error) {
        console.error('Failed to update user locale preference:', error);
      }
    }

    window.dispatchEvent(new CustomEvent('localeChanged', { detail: newLocale }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/Search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigationItems = [
  { name: t('nav.home'), href: "/Home", icon: Home },
  { name: t('nav.latest'), href: "/Latest", icon: FileText },
  { name: t('nav.topics'), href: "/Topics", icon: Bookmark },
  { name: t('nav.authors'), href: "/Authors", icon: Users }];


  return (
    <div className="min-h-screen bg-primary text-body transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        :root {
          /* Light theme colors */
          --pure-white: #FFFFFF;
          --off-white: #FAFAFA;
          --light-gray: #F5F5F5;
          --border-light: #E0E0E0;
          --text-dark: #1A1A1A;
          --text-gray: #666666;
          
          /* Dark theme colors */
          --pure-black: #000000;
          --dark-surface: #0A0A0A;
          --text-white: #FFFFFF;
          --text-light-gray: #AFAFAF;
          
          /* Accent colors (work in both themes) */
          --mint-green: #4FC3A0;
          --aqua-green: #69D6C1;
          --bright-mint: #52E3A4;
          --dark-mint: #3DAF8A;
          
          /* Light mode defaults */
          --bg-primary: var(--pure-white);
          --bg-secondary: var(--off-white);
          --bg-surface: var(--light-gray);
          --bg-accent: var(--mint-green);
          --bg-accent-hover: var(--dark-mint);
          
          --text-primary: var(--text-dark);
          --text-secondary: var(--text-gray);
          --text-muted: #999999;
          --text-on-accent: var(--pure-white);
          
          --border-color: var(--border-light);
          --border-accent: var(--mint-green);
          
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .dark {
          /* Dark mode overrides */
          --bg-primary: var(--pure-black);
          --bg-secondary: var(--dark-surface);
          --bg-surface: #1A1A1A;
          --bg-accent: var(--mint-green);
          --bg-accent-hover: var(--bright-mint);
          
          --text-primary: var(--text-white);
          --text-secondary: var(--text-light-gray);
          --text-muted: #808080;
          --text-on-accent: var(--pure-black);
          
          --border-color: #2A2A2A;
          --border-accent: var(--aqua-green);
          
          --shadow-sm: 0 1px 2px rgba(255, 255, 255, 0.05);
          --shadow-md: 0 4px 6px rgba(255, 255, 255, 0.07);
          --shadow-lg: 0 10px 15px rgba(255, 255, 255, 0.1);
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* Utility classes */
        .bg-primary { background-color: var(--bg-primary); }
        .bg-secondary { background-color: var(--bg-secondary); }
        .bg-surface { background-color: var(--bg-surface); }
        .bg-accent { background-color: var(--bg-accent); }
        
        .text-body { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        .text-on-accent { color: var(--text-on-accent); }
        
        .border-default { border-color: var(--border-color); }
        .border-accent { border-color: var(--border-accent); }
        
        /* Gradient utilities */
        .gradient-text {
          background: linear-gradient(135deg, var(--mint-green) 0%, var(--aqua-green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, var(--mint-green) 0%, var(--aqua-green) 100%);
        }
        
        .gradient-border {
          border: 2px solid transparent;
          background-image: linear-gradient(var(--bg-primary), var(--bg-primary)), 
                            linear-gradient(135deg, var(--mint-green), var(--aqua-green));
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        
        /* Button styles */
        .btn-gradient {
          background: linear-gradient(135deg, var(--mint-green) 0%, var(--aqua-green) 100%);
          color: var(--text-on-accent);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-gradient:hover {
          background: linear-gradient(135deg, var(--bright-mint) 0%, var(--mint-green) 100%);
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
        }
        
        /* Card styles */
        .card-surface {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }
        
        .card-surface:hover {
          box-shadow: var(--shadow-md);
        }
        
        /* Navigation */
        .nav-surface {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }
        
        .nav-link {
          color: var(--text-secondary);
          transition: all 0.2s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--text-primary);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--mint-green), var(--aqua-green));
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-duration: 200ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Header */}
      <header className="nav-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/Home" className="flex items-center space-x-3 group">
              <div className="relative w-8 h-8">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/6279cd9dc_perspektfavicon.png" 
                  alt="Perspekt Logo" 
                  className="w-8 h-8 rounded-lg transition-transform group-hover:scale-105 block dark:hidden" 
                />
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/6c1690234_faviconperspektblack.png" 
                  alt="Perspekt Logo" 
                  className="w-8 h-8 rounded-lg transition-transform group-hover:scale-105 hidden dark:block" 
                />
              </div>
              <span className="text-2xl font-bold gradient-text hidden md:block">Perspekt</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) =>
              <Link
                key={item.name}
                to={item.href}
                className="nav-link font-medium">
                  {item.name}
                </Link>
              )}
            </nav>

            {/* Search & User Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-secondary hover:text-body">
                {theme === 'dark' ?
                <Sun className="w-5 h-5" /> :
                <Moon className="w-5 h-5" />
                }
              </Button>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex items-center text-secondary hover:text-body">
                    <Globe className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="card-surface">
                  <DropdownMenuItem onClick={() => changeLocale('nb')}>
                    <span className={currentLocale === 'nb' ? 'font-semibold gradient-text' : 'text-secondary'}>
                      🇳🇴 {LOCALE_LABELS.nb}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLocale('en')}>
                    <span className={currentLocale === 'en' ? 'font-semibold gradient-text' : 'text-secondary'}>
                      🇬🇧 {LOCALE_LABELS.en}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search */}
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    type="text"
                    placeholder={t('nav.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-surface border-default focus:border-accent" />
                </div>
              </form>

              {/* User Menu */}
              {user ?
              <div className="flex items-center space-x-4">
                  <Link
                  to="/Account"
                  className="flex items-center space-x-2 text-sm nav-link">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{user.full_name}</span>
                  </Link>
                  {(user.role === 'admin' || user.role === 'editor') &&
                <Link to="/Admin">
                      <Button variant="outline" size="sm" className="border-accent text-body hover:bg-accent hover:text-on-accent">
                        <Settings className="w-4 h-4 mr-2" />
                        {t('nav.admin')}
                      </Button>
                    </Link>
                }
                </div> :
              <div className="flex items-center space-x-2">
                  <Link to="/Subscribe">
                    <Button size="sm" className="btn-gradient font-semibold">
                      {t('nav.subscribe')}
                    </Button>
                  </Link>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => await UserEntity.login()}
                  className="text-secondary hover:text-body">
                    {t('nav.login')}
                  </Button>
                </div>
              }

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-secondary hover:text-body"
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen &&
          <div className="md:hidden border-t border-default py-4">
              <div className="space-y-4">
                {navigationItems.map((item) =>
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-3 px-4 py-2 text-sm font-medium nav-link rounded-lg"
                onClick={() => setIsMenuOpen(false)}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
              )}
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                    type="text"
                    placeholder={t('nav.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-surface border-default" />
                  </div>
                </form>
              </div>
            </div>
          }
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-default mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-8 h-8">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/6279cd9dc_perspektfavicon.png" 
                    alt="Perspekt Logo" 
                    className="w-8 h-8 rounded-lg block dark:hidden" 
                  />
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c87ff5923f3448855aec56/6c1690234_faviconperspektblack.png" 
                    alt="Perspekt Logo" 
                    className="w-8 h-8 rounded-lg hidden dark:block" 
                  />
                </div>
                <span className="text-xl font-bold gradient-text">Perspekt</span>
              </div>
              <p className="text-secondary mb-6 max-w-md">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-secondary hover:text-body transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-secondary hover:text-body transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-secondary hover:text-body transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-body">{t('footer.content')}</h3>
              <ul className="space-y-2 text-secondary">
                <li><Link to="/Latest" className="hover:text-body transition-colors">{t('nav.latest')}</Link></li>
                <li><Link to="/Topics" className="hover:text-body transition-colors">{t('nav.topics')}</Link></li>
                <li><Link to="/Authors" className="hover:text-body transition-colors">{t('nav.authors')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-body">{t('footer.subscription')}</h3>
              <ul className="space-y-2 text-secondary">
                <li><Link to="/Subscribe" className="hover:text-body transition-colors">{t('nav.subscribe')}</Link></li>
                <li><Link to="/Account" className="hover:text-body transition-colors">{t('nav.account')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-default mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary text-sm">
              © 2025 Perspekt. {t('footer.rights')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to={currentLocale === 'nb' ? '/Privacy' : `/${currentLocale}/Privacy`} className="text-secondary hover:text-body text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to={currentLocale === 'nb' ? '/Terms' : `/${currentLocale}/Terms`} className="text-secondary hover:text-body text-sm transition-colors">
                {t('footer.terms')}
              </Link>
              <a href="#" className="text-secondary hover:text-body text-sm transition-colors">
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>);
}

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </ThemeProvider>);
}