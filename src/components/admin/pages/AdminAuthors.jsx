import React, { useState, useEffect } from "react";
import { AuthorProfile } from "@/entities/AuthorProfile";
import { useTranslation } from "@/components/i18n/translations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import AuthorFormModal from "../authors/AuthorFormModal";

export default function AdminAuthors({ user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    setIsLoading(true);
    try {
      const authorList = await AuthorProfile.list("-created_date");
      setAuthors(authorList);
    } catch (error) {
      console.error("Error loading authors:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    await loadAuthors();
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (authorId) => {
    if (window.confirm(t('admin.deleteAuthorConfirm'))) {
      try {
        await AuthorProfile.delete(authorId);
        loadAuthors();
      } catch (error) {
        console.error("Error deleting author:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('admin.authorManagement')}</h1>
          <p className="text-secondary mt-1">{t('admin.authorManagementDesc')}</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300" 
          onClick={handleNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.newAuthor')}
        </Button>
      </div>

      <div className="card-surface rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-theme">
              <TableHead className="w-20"></TableHead>
              <TableHead className="text-primary">{t('admin.fullName')}</TableHead>
              <TableHead className="text-primary">{t('admin.linkedUser')}</TableHead>
              <TableHead className="text-right text-primary">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center py-10 text-secondary">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : authors.length > 0 ? (
              authors.map((author) => (
                <TableRow key={author.id} className="border-theme hover:bg-warm-sand dark:hover:bg-slate-ink">
                  <TableCell>
                    <img src={author.avatar_url || 'https://via.placeholder.com/40'} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                  </TableCell>
                  <TableCell className="font-medium text-primary">{author.name}</TableCell>
                  <TableCell className="text-secondary">{author.user_id ? t('admin.linkedUser') : t('admin.notLinked')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(author)} className="text-secondary hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(author.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-secondary">
                  {t('admin.noAuthorsFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {isModalOpen && (
        <AuthorFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          author={editingAuthor}
          onSave={handleSave}
          currentLocale={currentLocale}
        />
      )}
    </div>
  );
}