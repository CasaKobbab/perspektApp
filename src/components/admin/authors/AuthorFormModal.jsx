import React, { useState, useEffect } from "react";
import { AuthorProfile } from "@/entities/AuthorProfile";
import { User } from "@/entities/User";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose } from
"@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/components/i18n/translations";
import { UploadFile } from "@/integrations/Core";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";

// Helper to generate slug from name
const generateSlug = (name) => {
  return name.
  toLowerCase().
  replace(/[^a-z0-9\s-]/g, "") // Remove special chars
  .replace(/\s+/g, "-") // Replace spaces with -
  .replace(/-+/g, "-"); // Replace multiple - with single -
};

export default function AuthorFormModal({ isOpen, onClose, author, onSave, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    bio: "",
    avatar_url: "",
    social_links: { twitter: "", linkedin: "", facebook: "", instagram: "", website: "" },
    user_id: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || "",
        slug: author.slug || "",
        bio: author.bio || "",
        avatar_url: author.avatar_url || "",
        social_links: author.social_links || { twitter: "", linkedin: "", website: "" },
        user_id: author.user_id || ""
      });
    } else {
      setFormData({
        name: "", slug: "", bio: "", avatar_url: "",
        social_links: { twitter: "", linkedin: "", facebook: "", instagram: "", website: "" }, user_id: ""
      });
    }
  }, [author]);

  useEffect(() => {
    async function fetchUsers() {
      const userList = await User.list();
      setUsers(userList);
    }
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value }
    }));
  };

  const handleUserLinkChange = (userId) => {
    setFormData((prev) => ({ ...prev, user_id: userId }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      setFormData((prev) => ({ ...prev, avatar_url: result.file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (author) {
        await AuthorProfile.update(author.id, formData);
      } else {
        await AuthorProfile.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving author:", error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] card-surface">
        <DialogHeader>
          <DialogTitle>{author ? t('admin.editAuthor') : t('admin.newAuthor')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-primary">{t('admin.fullName')}</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right text-primary">{t('admin.authorSlug')}</Label>
            <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right text-primary">{t('admin.authorBio')}</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="col-span-3" />
          </div>

          <div className="border-t border-border my-4 pt-4">
             <h4 className="text-sm font-medium mb-4 text-center">Social Media</h4>
             <div className="space-y-1">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="twitter" className="text-right text-primary">Twitter / X</Label>
                  <Input id="twitter" name="twitter" placeholder="https://x.com/username" value={formData.social_links?.twitter || ""} onChange={handleSocialChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linkedin" className="text-right text-primary">LinkedIn</Label>
                  <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/username" value={formData.social_links?.linkedin || ""} onChange={handleSocialChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facebook" className="text-right text-primary">Facebook</Label>
                  <Input id="facebook" name="facebook" placeholder="https://facebook.com/username" value={formData.social_links?.facebook || ""} onChange={handleSocialChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instagram" className="text-right text-primary">Instagram</Label>
                  <Input id="instagram" name="instagram" placeholder="https://instagram.com/username" value={formData.social_links?.instagram || ""} onChange={handleSocialChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right text-primary">Website</Label>
                  <Input id="website" name="website" placeholder="https://example.com" value={formData.social_links?.website || ""} onChange={handleSocialChange} className="col-span-3" />
                </div>
             </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right text-primary">{t('admin.authorAvatar')}</Label>
            <div className="col-span-3 flex items-center gap-4">
              {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : formData.avatar_url && <img src={formData.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />}
              <Input id="avatar" type="file" onChange={handleImageUpload} className="flex-1" />
            </div>
          </div>
          
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary">{t('admin.linkToUser')}</Label>
            <Select onValueChange={handleUserLinkChange} value={formData.user_id || ""}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('admin.notLinked')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>{t('admin.notLinked')}</SelectItem>
                {users.map((user) =>
                <SelectItem key={user.id} value={user.id}>{user.full_name} ({user.email})</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('common.cancel')}</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0">

              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('admin.saveAuthor')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}