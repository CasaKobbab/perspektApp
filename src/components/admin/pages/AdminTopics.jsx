import React, { useState, useEffect } from 'react';
import { useTranslation } from "@/components/i18n/translations";
import { Topic } from '@/entities/Topic';
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
import { Plus, Edit, Trash2 } from "lucide-react";
import TopicFormModal from '../topics/TopicFormModal';

export default function AdminTopics({ user, currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setIsLoading(true);
    try {
      const topicList = await Topic.list("-created_date");
      setTopics(topicList);
    } catch (error) {
      console.error("Error loading topics:", error);
    }
    setIsLoading(false);
  };
  
  const handleSave = () => {
    setIsModalOpen(false);
    setEditingTopic(null);
    loadTopics();
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic? This cannot be undone.')) {
      try {
        await Topic.delete(topicId);
        loadTopics();
      } catch (error) {
        console.error("Error deleting topic:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('admin.topicManagement')}</h1>
          <p className="text-secondary mt-1">Create, edit, and manage content topics.</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300" 
          onClick={handleNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Topic
        </Button>
      </div>

      <div className="card-surface rounded-lg">
        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow className="border-theme">
              <TableHead className="text-primary">Name</TableHead>
              <TableHead className="text-primary">Slug</TableHead>
              <TableHead className="text-primary">Status</TableHead>
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
            ) : topics.length > 0 ? (
              topics.map((topic) => (
                <TableRow key={topic.id} className="block md:table-row mb-4 md:mb-0 border border-theme md:border-b-0 rounded-lg md:rounded-none p-4 md:p-0 card-surface md:bg-transparent hover:bg-secondary/50 shadow-sm md:shadow-none">
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0 font-medium text-primary">
                    <span className="md:hidden text-secondary font-normal">Name</span>
                    <Badge className={topic.color_class}>{topic.name}</Badge>
                  </TableCell>
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0 text-secondary font-mono text-sm">
                    <span className="md:hidden text-secondary font-normal font-sans">Slug</span>
                    {topic.slug}
                  </TableCell>
                  <TableCell className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-theme md:border-b-0">
                    <span className="md:hidden text-secondary font-normal">Status</span>
                    <Badge variant={topic.is_active ? 'default' : 'outline'} className={topic.is_active ? 'bg-green-200 text-green-800' : 'border-theme'}>
                      {topic.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="block md:table-cell py-2 md:py-4 md:text-right">
                    {/* Mobile Actions */}
                    <div className="md:hidden flex flex-col gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleEdit(topic)}
                        className="w-full justify-start"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDelete(topic.id)}
                        className="w-full justify-start"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:block">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)} className="text-secondary hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-secondary">
                  No topics found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TopicFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={editingTopic}
        onSave={handleSave}
        currentLocale={currentLocale}
      />
    </div>
  );
}