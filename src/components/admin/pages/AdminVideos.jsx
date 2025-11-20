import React, { useState, useEffect } from "react";
import { Video } from "@/entities/Video";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Play } from "lucide-react";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";

export default function AdminVideos({ user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    duration: "",
    topic: "news",
    status: "draft",
    locale: currentLocale,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const videoList = await Video.list("-created_date");
      setVideos(videoList);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
    setIsLoading(false);
  };

  const extractYouTubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const generateThumbnailUrl = (videoUrl) => {
    const youtubeId = extractYouTubeId(videoUrl);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return "";
  };

  const handleOpenModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description || "",
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url || "",
        duration: video.duration || "",
        topic: video.topic,
        status: video.status,
        locale: video.locale,
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        duration: "",
        topic: "news",
        status: "draft",
        locale: currentLocale,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVideo(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate thumbnail for YouTube videos
    if (field === "video_url") {
      const thumbnailUrl = generateThumbnailUrl(value);
      if (thumbnailUrl) {
        setFormData(prev => ({ ...prev, thumbnail_url: thumbnailUrl }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const videoData = {
      ...formData,
      published_date: formData.status === 'published' && !editingVideo?.published_date 
        ? new Date().toISOString() 
        : editingVideo?.published_date
    };

    try {
      if (editingVideo) {
        await Video.update(editingVideo.id, videoData);
      } else {
        await Video.create(videoData);
      }
      loadVideos();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving video:", error);
      alert(t('admin.saveError'));
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm(currentLocale === 'nb' ? 'Er du sikker på at du vil slette denne videoen?' : 'Are you sure you want to delete this video?')) {
      try {
        await Video.delete(videoId);
        loadVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
        alert(t('admin.deleteError'));
      }
    }
  };

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    published: "bg-green-200 text-green-800",
    archived: "bg-red-200 text-red-800",
  };

  const topicColors = {
    news: "bg-red-100 text-red-800",
    opinion: "bg-blue-100 text-blue-800",
    culture: "bg-purple-100 text-purple-800",
    technology: "bg-green-100 text-green-800",
    economy: "bg-yellow-100 text-yellow-800",
    sports: "bg-orange-100 text-orange-800",
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
          <h1 className="text-3xl font-bold text-primary">
            {currentLocale === 'nb' ? 'Videoadministrasjon' : 'Video Management'}
          </h1>
          <p className="text-secondary mt-1">
            {currentLocale === 'nb' ? 'Administrer videoer på plattformen.' : 'Manage videos on the platform.'}
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          {currentLocale === 'nb' ? 'Ny video' : 'New Video'}
        </Button>
      </div>

      <div className="card-surface rounded-lg">
        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow className="border-theme">
              <TableHead className="text-primary">{t('admin.title')}</TableHead>
              <TableHead className="text-primary">{t('admin.topic')}</TableHead>
              <TableHead className="text-primary">{t('admin.status')}</TableHead>
              <TableHead className="text-primary">{t('common.language')}</TableHead>
              <TableHead className="text-primary">{t('admin.publishedDate')}</TableHead>
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
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <TableRow key={video.id} className="block md:table-row mb-4 md:mb-0 border border-theme md:border-b-0 rounded-lg md:rounded-none p-4 md:p-0 bg-white dark:bg-slate-ink md:bg-transparent hover:bg-warm-sand dark:hover:bg-slate-ink shadow-sm md:shadow-none">
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0 font-medium text-primary">
                    <span className="md:hidden text-secondary font-normal">{t('admin.title')}</span>
                    {video.title}
                  </TableCell>
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0">
                    <span className="md:hidden text-secondary font-normal">{t('admin.topic')}</span>
                    <Badge className={topicColors[video.topic]}>
                      {t(`topics.${video.topic}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0">
                    <span className="md:hidden text-secondary font-normal">{t('admin.status')}</span>
                    <Badge className={statusColors[video.status]}>
                      {t(`common.${video.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0">
                    <span className="md:hidden text-secondary font-normal">{t('common.language')}</span>
                    <Badge variant="outline" className="border-theme text-secondary">
                      {video.locale?.toUpperCase() || 'NB'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0 text-secondary">
                    <span className="md:hidden text-secondary font-normal">{t('admin.publishedDate')}</span>
                    {video.published_date
                      ? format(new Date(video.published_date), "d. MMM yyyy", { 
                          locale: getLocaleForDateFns(currentLocale) 
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="block md:table-cell py-2 md:py-4 md:text-right">
                    {/* Mobile Actions */}
                    <div className="md:hidden flex flex-col gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(video.video_url, '_blank')}
                        className="w-full justify-start"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {currentLocale === 'nb' ? 'Se video' : 'Watch Video'}
                      </Button>
                      {canEdit && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleOpenModal(video)}
                          className="w-full justify-start"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('common.edit')}
                        </Button>
                      )}
                      {canDelete && (
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDelete(video.id)}
                          className="w-full justify-start"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('common.delete')}
                        </Button>
                      )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:block">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-secondary hover:text-primary">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="card-surface">
                          <DropdownMenuItem 
                            onClick={() => window.open(video.video_url, '_blank')}
                            className="text-secondary hover:text-primary hover:bg-warm-sand dark:hover:bg-slate-ink"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {currentLocale === 'nb' ? 'Se video' : 'Watch Video'}
                          </DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem 
                              onClick={() => handleOpenModal(video)}
                              className="text-secondary hover:text-primary hover:bg-warm-sand dark:hover:bg-slate-ink"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(video.id)} 
                              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-secondary">
                  {currentLocale === 'nb' ? 'Ingen videoer funnet.' : 'No videos found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Video Form Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="card-surface max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {editingVideo 
                ? (currentLocale === 'nb' ? 'Rediger video' : 'Edit Video')
                : (currentLocale === 'nb' ? 'Ny video' : 'New Video')
              }
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title" className="text-primary">{t('admin.title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-surface border-default text-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="video_url" className="text-primary">
                  {currentLocale === 'nb' ? 'YouTube URL' : 'YouTube URL'}
                </Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => handleInputChange("video_url", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-surface border-default text-primary"
                  required
                />
                <p className="text-xs text-secondary mt-1">
                  {currentLocale === 'nb' 
                    ? 'Lim inn YouTube-lenken. Miniatyrbildet genereres automatisk.' 
                    : 'Paste the YouTube link. Thumbnail will be generated automatically.'}
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-primary">
                  {currentLocale === 'nb' ? 'Beskrivelse' : 'Description'}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-surface border-default text-primary"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-primary">
                    {currentLocale === 'nb' ? 'Varighet' : 'Duration'}
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="5:23"
                    className="bg-surface border-default text-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="topic" className="text-primary">{t('admin.topic')}</Label>
                  <Select value={formData.topic} onValueChange={(v) => handleInputChange("topic", v)}>
                    <SelectTrigger className="bg-surface border-default text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-default">
                      <SelectItem value="news" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('topics.news')}</SelectItem>
                      <SelectItem value="opinion" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('topics.opinion')}</SelectItem>
                      <SelectItem value="culture" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('topics.culture')}</SelectItem>
                      <SelectItem value="technology" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('topics.technology')}</SelectItem>
                      <SelectItem value="economy" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('topics.economy')}</SelectItem>
                      <SelectItem value="sports" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('topics.sports')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-primary">{t('admin.status')}</Label>
                  <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                    <SelectTrigger className="bg-surface border-default text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-default">
                      <SelectItem value="draft" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.draft')}</SelectItem>
                      <SelectItem value="published" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.published')}</SelectItem>
                      <SelectItem value="archived" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.archived')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="locale" className="text-primary">{t('common.language')}</Label>
                  <Select value={formData.locale} onValueChange={(v) => handleInputChange("locale", v)}>
                    <SelectTrigger className="bg-surface border-default text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-default">
                      <SelectItem value="nb" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">Norsk</SelectItem>
                      <SelectItem value="en" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.thumbnail_url && (
                <div>
                  <Label className="text-primary">
                    {currentLocale === 'nb' ? 'Forhåndsvisning' : 'Preview'}
                  </Label>
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Video thumbnail" 
                    className="w-full h-48 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal} className="border-default text-secondary">
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-600">
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}