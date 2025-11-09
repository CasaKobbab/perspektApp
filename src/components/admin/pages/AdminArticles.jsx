
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Article } from "@/entities/Article";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function AdminArticles({ user, currentLocale }) {
  const navigate = useNavigate();
  const { t } = useTranslation(currentLocale);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const articleList = await Article.list("-created_date");
      setArticles(articleList);
    } catch (error) {
      console.error("Error loading articles:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (articleId) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
      try {
        await Article.delete(articleId);
        loadArticles();
      } catch (error) {
        console.error("Error deleting article:", error);
        alert(t('admin.deleteError'));
      }
    }
  };

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    in_review: "bg-yellow-200 text-yellow-800",
    published: "bg-green-200 text-green-800",
    archived: "bg-red-200 text-red-800",
  };

  const accessColors = {
    free: "bg-blue-200 text-blue-800",
    metered: "bg-purple-200 text-purple-800",
    premium: "bg-indigo-200 text-indigo-800",
  };

  const getLocaleForDateFns = (localeString) => {
    switch (localeString) {
      case 'en': return enUS;
      case 'nb': return nb;
      default: return nb;
    }
  };
  
  const canEdit = user.role === 'admin' || user.role === 'editor';
  const canDelete = user.role === 'admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('admin.articleManagement')}</h1>
          <p className="text-secondary mt-1">{t('admin.articleManagementDesc')}</p>
        </div>
        <Link to={createPageUrl("AdminArticleEditor")}>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.newArticle')}
          </Button>
        </Link>
      </div>

      <div className="card-surface rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-theme">
              <TableHead className="text-primary">{t('admin.title')}</TableHead>
              <TableHead className="text-primary">{t('admin.author')}</TableHead>
              <TableHead className="text-primary">{t('admin.status')}</TableHead>
              <TableHead className="text-primary">{t('admin.access')}</TableHead>
              <TableHead className="text-primary">{t('common.language')}</TableHead>
              <TableHead className="text-primary">{t('admin.publishedDate')}</TableHead>
              <TableHead className="text-right text-primary">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-secondary">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id} className="border-theme hover:bg-warm-sand dark:hover:bg-slate-ink">
                  <TableCell className="font-medium text-primary">{article.title}</TableCell>
                  <TableCell className="text-secondary">{article.author_name}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[article.status]}>
                      {t(`common.${article.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={accessColors[article.access_level]}>
                      {t(`common.${article.access_level}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-theme text-secondary">
                      {article.locale?.toUpperCase() || 'NB'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-secondary">
                    {article.published_date
                      ? format(new Date(article.published_date), "d. MMM yyyy", { 
                          locale: getLocaleForDateFns(currentLocale) 
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-secondary hover:text-primary">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="card-surface">
                        <DropdownMenuItem 
                          onClick={() => navigate(createPageUrl(`Article?id=${article.id}`))}
                          className="text-secondary hover:text-primary hover:bg-warm-sand dark:hover:bg-slate-ink"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t('common.preview')}
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem 
                            onClick={() => navigate(createPageUrl(`AdminArticleEditor?id=${article.id}`))}
                            className="text-secondary hover:text-primary hover:bg-warm-sand dark:hover:bg-slate-ink"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem 
                            onClick={() => handleDelete(article.id)} 
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-secondary">
                  {t('common.noArticlesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
