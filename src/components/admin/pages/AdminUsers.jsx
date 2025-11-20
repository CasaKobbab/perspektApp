import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { useTranslation } from "@/components/i18n/translations";
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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import EditUserModal from "../users/EditUserModal";

export default function AdminUsers({ user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Only admins can see users
    if (user?.role === 'admin') {
      loadUsers();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userList = await User.list("-created_date");
      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (userId) => {
    if (window.confirm(t('admin.deleteUserConfirm'))) {
      try {
        await User.delete(userId);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  
  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedData) => {
    if (!editingUser) return;
    try {
      await User.update(editingUser.id, updatedData);
      setIsModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const getLocaleForDateFns = (localeString) => {
    return localeString === 'en' ? enUS : nb;
  };

  const roleColors = {
    admin: "bg-red-200 text-red-800",
    editor: "bg-yellow-200 text-yellow-800",
    user: "bg-gray-200 text-gray-800",
  };

  const subscriptionColors = {
    premium: "bg-indigo-200 text-indigo-800",
    subscriber: "bg-blue-200 text-blue-800",
    free: "bg-green-200 text-green-800",
  };
  
  if (user?.role !== 'admin') {
      return (
          <div>
              <h1 className="text-3xl font-bold text-primary">{t('admin.userManagement')}</h1>
              <p className="text-secondary mt-1">{t('admin.noAccessDesc')}</p>
          </div>
      );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('admin.userManagement')}</h1>
          <p className="text-secondary mt-1">{t('admin.userManagementDescLive')}</p>
        </div>
      </div>

      <div className="card-surface rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-theme">
              <TableHead className="text-primary">{t('admin.fullName')}</TableHead>
              <TableHead className="text-primary">{t('admin.email')}</TableHead>
              <TableHead className="text-primary">{t('admin.role')}</TableHead>
              <TableHead className="text-primary">{t('admin.subscriptionStatus')}</TableHead>
              <TableHead className="text-primary">{t('admin.registeredOn')}</TableHead>
              <TableHead className="text-right text-primary">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-secondary">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.id} className="border-theme hover:bg-warm-sand dark:hover:bg-slate-ink">
                  <TableCell className="font-medium text-primary">{u.full_name}</TableCell>
                  <TableCell className="text-secondary">{u.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[u.role]}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={subscriptionColors[u.subscription_status]}>
                      {t(`user.${u.subscription_status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-secondary">
                    {format(new Date(u.created_date), "d. MMM yyyy", { locale: getLocaleForDateFns(currentLocale) })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-secondary hover:text-primary" disabled={u.id === user.id}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="card-surface">
                        <DropdownMenuItem 
                          onClick={() => handleEdit(u)}
                          className="text-secondary hover:text-primary hover:bg-warm-sand dark:hover:bg-slate-ink"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('admin.editUser')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(u.id)} 
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-secondary">
                  {t('admin.noUsersFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {editingUser && (
        <EditUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={editingUser}
          onSave={handleSave}
          currentLocale={currentLocale}
        />
      )}
    </div>
  );
}