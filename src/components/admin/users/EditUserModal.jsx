import React, { useState, useEffect } from "react";
import { useTranslation } from "@/components/i18n/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditUserModal({ isOpen, onClose, user, onSave, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "user",
    subscription_status: "free"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        role: user.role || "user",
        subscription_status: user.subscription_status || "free"
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('admin.editUser')}</DialogTitle>
          <p className="text-sm text-secondary">
            {t('admin.editUserDesc', { email: user?.email })}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">{t('admin.fullName')}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{t('admin.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled // Email should not be editable
            />
          </div>

          <div>
            <Label htmlFor="role">{t('admin.role')}</Label>
            <Select value={formData.role} onValueChange={(v) => handleInputChange("role", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t('user.user')}</SelectItem>
                <SelectItem value="editor">{t('user.editor')}</SelectItem>
                <SelectItem value="admin">{t('user.admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subscription_status">{t('admin.subscriptionStatus')}</Label>
            <Select value={formData.subscription_status} onValueChange={(v) => handleInputChange("subscription_status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">{t('user.free')}</SelectItem>
                <SelectItem value="subscriber">{t('user.subscriber')}</SelectItem>
                <SelectItem value="premium">{t('user.premium')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="btn-primary">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}