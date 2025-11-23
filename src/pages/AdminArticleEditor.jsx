import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Article } from "@/entities/Article"; // Specific import for Article
import { User } from "@/entities/User"; // Specific import for User
import { AuthorProfile } from "@/entities/AuthorProfile"; // NEW: Import AuthorProfile entity
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react"; // NEW: Import Loader2 for saving state
import { UploadFile } from "@/integrations/Core"; // NEW: Import UploadFile integration

// Simple UUID generator function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

export default function AdminArticleEditor() {
  const navigate = useNavigate();
  const location = useLocation(); // Keep useLocation for consistency, though outline uses window.location.search
  const [currentLocale, setCurrentLocale] = React.useState('nb');
  const { t } = useTranslation(currentLocale);

  React.useEffect(() => {
    setCurrentLocale(localStorage.getItem('preferred_locale') || 'nb');

    const handleLocaleChange = (event) => {
      setCurrentLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  const [article, setArticle] = useState({
    title: "",
    dek: "",
    body: "",
    excerpt: "",
    author_profile_id: "", // NEW: Field for author profile ID
    author_name: "", // Kept, likely for denormalized display or fallback
    author_avatar_url: "", // NEW: Field for author avatar URL
    topic: "news", // Use language-agnostic slug
    tags: [],
    featured_image: "",
    image_alt: "",
    status: "draft",
    access_level: "free",
    featured: false,
    locale: currentLocale, // Default to current locale
    translation_group_id: generateUUID(), // Generate a new UUID for new articles
    original_article_id: null
  });
  const [isFetching, setIsFetching] = useState(true); // Renamed from isLoading for initial fetch
  const [isSaving, setIsSaving] = useState(false); // NEW: For save operation
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = React.useRef(null);
  const [currentUser, setCurrentUser] = useState(null); // Renamed from user in outline to currentUser for consistency
  const [authors, setAuthors] = useState([]); // NEW: State to store author profiles
  const articleId = new URLSearchParams(location.search).get("id");
  const quillRef = React.useRef(null); // NEW: Create a ref for the Quill editor

  // Available topics with language-agnostic keys
  const availableTopics = [
    { slug: "news", nameKey: "topics.news" },
    { slug: "opinion", nameKey: "topics.opinion" },
    { slug: "culture", nameKey: "topics.culture" },
    { slug: "technology", nameKey: "topics.technology" },
    { slug: "economy", nameKey: "topics.economy" },
    { slug: "sports", nameKey: "topics.sports" }
  ];


  useEffect(() => {
    const loadInitialData = async () => {
      setIsFetching(true);
      try {
        const user = await User.me();
        setCurrentUser(user);

        const authorProfiles = await AuthorProfile.list();
        setAuthors(authorProfiles);

        if (articleId) {
          const existingArticle = await Article.filter({ id: articleId }, null, 1).then((res) => res[0]);
          if (existingArticle) {
            setArticle({
              ...existingArticle,
              tags: existingArticle.tags || [],
              locale: existingArticle.locale || currentLocale,
              translation_group_id: existingArticle.translation_group_id || generateUUID(),
              author_profile_id: existingArticle.author_profile_id || "",
              author_name: existingArticle.author_name || "",
              author_avatar_url: existingArticle.author_avatar_url || ""
            });
          }
        } else {
          // For a new article, create a fresh state object based on defaults and user data
          // This avoids depending on the previous 'article' state
          const initialArticleState = {
            title: "",
            dek: "",
            body: "",
            excerpt: "",
            author_profile_id: "",
            author_name: user.full_name, // Fallback to current user's name
            author_avatar_url: "",
            topic: "news",
            tags: [],
            featured_image: "",
            image_alt: "",
            status: "draft",
            access_level: "free",
            featured: false,
            locale: currentLocale,
            translation_group_id: generateUUID(),
            original_article_id: null
          };

          if (user.author_profile_id) {
            const author = authorProfiles.find((a) => a.id === user.author_profile_id);
            if (author) {
              initialArticleState.author_profile_id = author.id;
              initialArticleState.author_name = author.name;
              initialArticleState.author_avatar_url = author.avatar_url;
            }
          }
          setArticle(initialArticleState);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        navigate(createPageUrl("Admin"));
      } finally {
        setIsFetching(false);
      }
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, currentLocale]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      setArticle((prev) => ({ ...prev, featured_image: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t('admin.saveError'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setArticle((prev) => ({ ...prev, featured_image: "" }));
  };

  // NEW: Custom handler for the Quill editor's image button
  const imageHandler = React.useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // You can show a loading state here if you want
        try {
          const res = await UploadFile({ file });
          const fileUrl = res.file_url;

          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", fileUrl);
          quill.setSelection(range.index + 1);
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Image upload failed. Please try again.");
        }
        // Hide loading state here
      }
    };
  }, []);

  // NEW: Configuration for the Quill editor's modules and formats
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ 'list': "ordered" }, { 'list': "bullet" }],
        [{ 'indent': "-1" }, { 'indent': "+1" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent",
    "link", "image", "video",
  ];

  // Handler for standard input fields (title, dek, featured_image, image_alt)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for ReactQuill body editor
  const handleBodyChange = (value) => {
    setArticle((prev) => ({ ...prev, body: value }));
  };

  // Handler for Select components (topic, status, access_level, locale)
  // And Switch component (featured)
  const handleSelectOrSwitchChange = (field, value) => {
    setArticle((prev) => ({ ...prev, [field]: value }));
  };

  // NEW: Handler for Author profile selection
  const handleAuthorChange = (authorId) => {
    if (authorId === "no-author") {
      // Handle the "no author" selection
      setArticle((prev) => ({
        ...prev,
        author_profile_id: "",
        author_name: "",
        author_avatar_url: ""
      }));
    } else {
      const selectedAuthor = authors.find((a) => a.id === authorId);
      if (selectedAuthor) {
        setArticle((prev) => ({
          ...prev,
          author_profile_id: selectedAuthor.id,
          author_name: selectedAuthor.name,
          author_avatar_url: selectedAuthor.avatar_url
        }));
      }
    }
  };


  const handleSubmit = async (e) => {// Renamed from handleSave to handleSubmit
    e.preventDefault();
    setIsSaving(true); // Start saving

    const articleData = { ...article };
    if (!articleData.published_date && articleData.status === 'published') {
      articleData.published_date = new Date().toISOString();
    }
    // Estimate reading time (words per minute)
    // Remove HTML tags from body for word count
    const plainTextBody = articleData.body.replace(/<[^>]+>/g, '');
    const words = plainTextBody.split(/\s+/).filter((word) => word.length > 0).length;
    articleData.reading_time = Math.ceil(words / 200);

    // Ensure author_profile_id is sent, even if it's an empty string
    if (articleData.author_profile_id === "") {
      articleData.author_profile_id = null; // Store as null if not selected
    }


    try {
      if (articleId) {
        await Article.update(articleId, articleData);
      } else {
        await Article.create(articleData);
      }
      navigate(createPageUrl("Admin"));
    } catch (error) {
      console.error("Error saving article:", error);
      alert(t('admin.saveError'));
    } finally {
      setIsSaving(false); // End saving
    }
  };

  if (isFetching) {
    return <div className="flex justify-center items-center h-screen">{t('admin.loadingEditor')}</div>;
  }

  const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  return (
    <div className="max-w-5xl mx-auto p-8 card-surface rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(createPageUrl("Admin"))} className="text-secondary hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToOverview')}
          </Button>
          <h1 className="text-3xl font-bold text-primary">
            {articleId ? t('admin.editArticle') : t('admin.newArticle')}
          </h1>
          <div></div>
        </div>

        <div className="space-y-6">
          <div className="mb-6">
            <Label htmlFor="title" className="block text-lg font-semibold mb-2 text-primary">{t('admin.title')}</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleInputChange}
              className="text-2xl bg-surface border-default text-primary p-4"
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="dek" className="block text-lg font-semibold mb-2 text-primary">{t('admin.ingress')}</Label>
            <Textarea
              id="dek"
              name="dek"
              value={article.dek || ""}
              onChange={handleInputChange}
              className="bg-surface border-default text-primary p-4"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="body" className="block text-lg font-semibold mb-2 text-primary">{t('admin.bodyText')}</Label>
            <div className="bg-surface rounded-md border border-default">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={article.body}
                onChange={handleBodyChange}
                modules={modules}
                formats={formats}
              />
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="bg-surface p-6 rounded-lg border border-default mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary">{t('admin.metadata')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="author" className="font-semibold text-primary">{t('admin.author')}</Label>
              <Select onValueChange={handleAuthorChange} value={article.author_profile_id || "no-author"}>
                <SelectTrigger className="bg-surface border-default text-primary">
                  <SelectValue placeholder={t('admin.selectAuthor')} />
                </SelectTrigger>
                <SelectContent className="bg-surface border-default">
                  <SelectItem key="no-author" value="no-author" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">
                    {t('admin.noAuthor')}
                  </SelectItem>
                  {authors.map((author) =>
                    <SelectItem key={author.id} value={author.id} className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">
                      <div className="flex items-center gap-2">
                        <img
                          src={author.avatar_url || 'https://via.placeholder.com/24'}
                          alt={author.name}
                          className="w-6 h-6 rounded-full object-cover" />

                        <span>{author.name}</span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="topic" className="font-semibold text-primary">{t('admin.topic')}</Label>
              <Select value={article.topic} onValueChange={(v) => handleSelectOrSwitchChange("topic", v)}>
                <SelectTrigger className="bg-surface border-default text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-default">
                  {availableTopics.map((topic) =>
                    <SelectItem key={topic.slug} value={topic.slug} className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">
                      {t(topic.nameKey)}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="font-semibold text-primary">{t('admin.status')}</Label>
              <Select value={article.status} onValueChange={(v) => handleSelectOrSwitchChange("status", v)}>
                <SelectTrigger className="bg-surface border-default text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-default">
                  <SelectItem value="draft" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.draft')}</SelectItem>
                  <SelectItem value="in_review" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.inReview')}</SelectItem>
                  {canPublish && <SelectItem value="published" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.published')}</SelectItem>}
                  {canPublish && <SelectItem value="archived" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.archived')}</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="access_level" className="font-semibold text-primary">{t('admin.accessLevel')}</Label>
              <Select value={article.access_level} onValueChange={(v) => handleSelectOrSwitchChange("access_level", v)} disabled={!canPublish}>
                <SelectTrigger className="bg-surface border-default text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-default">
                  <SelectItem value="free" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.free')}</SelectItem>
                  <SelectItem value="metered" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.metered')}</SelectItem>
                  <SelectItem value="premium" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">{t('common.premium')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tags" className="font-semibold text-primary">{t('admin.tags')}</Label>
              <Input
                id="tags"
                name="tags"
                value={article.tags.join(", ")}
                onChange={(e) => handleSelectOrSwitchChange("tags", e.target.value.split(",").map((t) => t.trim()))}
                className="bg-surface border-default text-primary"
              />
              <p className="text-sm text-secondary mt-1">{t('admin.tagsHint')}</p>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="featured_image" className="font-semibold text-primary">{t('admin.featuredImage')}</Label>
              <Input
                id="featured_image"
                name="featured_image"
                value={article.featured_image}
                onChange={handleInputChange}
                className="bg-surface border-default text-primary"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="image_alt" className="font-semibold text-primary">{t('admin.imageAlt')}</Label>
              <Input
                id="image_alt"
                name="image_alt"
                value={article.image_alt}
                onChange={handleInputChange}
                className="bg-surface border-default text-primary"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={article.featured}
                onCheckedChange={(c) => handleSelectOrSwitchChange("featured", c)}
                disabled={!canPublish}
              />
              <Label htmlFor="featured" className="text-primary">{t('common.featuredOnHomepage')}</Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="locale" className="font-semibold text-primary">{t('common.language')}</Label>
              <Select value={article.locale} onValueChange={(v) => handleSelectOrSwitchChange("locale", v)}>
                <SelectTrigger className="bg-surface border-default text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-default">
                  <SelectItem value="nb" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">Norsk</SelectItem>
                  <SelectItem value="en" className="text-primary hover:bg-warm-sand dark:hover:bg-slate-ink">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="translation_group_id" className="font-semibold text-primary">{t('admin.translationGroup')}</Label>
              <Input
                id="translation_group_id"
                name="translation_group_id"
                value={article.translation_group_id}
                onChange={handleInputChange}
                placeholder={generateUUID()}
                className="bg-surface border-default text-primary"
              />
              <p className="text-sm text-secondary mt-1">
                {currentLocale === 'nb' ? 'Unik ID som grupperer alle oversettelser av denne artikkelen.' : 'Unique ID that groups all translations of this article.'}
              </p>
            </div>
            {article.original_article_id &&
              <div className="md:col-span-2">
                <Label htmlFor="original_article_id" className="font-semibold text-primary">{t('admin.originalArticle')}</Label>
                <Input
                  id="original_article_id"
                  value={article.original_article_id}
                  readOnly
                  className="bg-surface border-default text-secondary"
                />
              </div>
            }
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.saveArticle')}
          </Button>
        </div>
      </form>
    </div>
  );
}