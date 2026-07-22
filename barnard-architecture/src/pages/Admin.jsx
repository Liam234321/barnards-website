import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Upload, X, Image, Home, FileText, MessageSquare } from 'lucide-react';
import SiteContentEditor from '@/components/admin/SiteContentEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProjectList from '@/components/admin/ProjectList';

const CATEGORIES = ['Residential', 'Commercial', 'Cultural', 'Renovation', 'Interior', 'Landscape'];

const emptyProject = {
  title: '', category: '', year: '', location: '',
  description: '', long_description: '', cover_image: '',
  cover_image_orientation: 'landscape',
  gallery_images: [], gallery_image_orientations: [],
  featured: false, sort_order: 0, hidden: false,
};

export default function Admin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user || user.role !== 'admin') {
        base44.auth.redirectToLogin(window.location.href);
      }
    });
  }, []);
  const [tab, setTab] = useState('projects');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [uploading, setUploading] = useState(false);

  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(createPageUrl('Home'));
  };

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => base44.entities.Project.list('-sort_order', 200),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editing && editing !== 'new') {
        return base44.entities.Project.update(editing, data);
      }
      return base44.entities.Project.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success(editing === 'new' ? 'Project created' : 'Project updated');
      setEditing(null);
      setForm(emptyProject);
    },
  });

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (field === 'cover_image') {
      setForm(prev => ({ ...prev, cover_image: file_url }));
    } else {
      setForm(prev => ({
      ...prev,
      gallery_images: [...(prev.gallery_images || []), file_url],
      gallery_image_orientations: [...(prev.gallery_image_orientations || []), 'landscape'],
    }));
    }
    setUploading(false);
  };

  const removeGalleryImage = (index) => {
    setForm(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
      gallery_image_orientations: (prev.gallery_image_orientations || []).filter((_, i) => i !== index),
    }));
  };

  const toggleGalleryOrientation = (index) => {
    setForm(prev => {
      const orientations = [...(prev.gallery_image_orientations || prev.gallery_images.map(() => 'landscape'))];
      orientations[index] = orientations[index] === 'portrait' ? 'landscape' : 'portrait';
      return { ...prev, gallery_image_orientations: orientations };
    });
  };

  const startEdit = (project) => {
    setEditing(project.id);
    setForm({
      title: project.title || '',
      category: project.category || '',
      year: project.year || '',
      location: project.location || '',
      description: project.description || '',
      long_description: project.long_description || '',
      cover_image: project.cover_image || '',
      cover_image_orientation: project.cover_image_orientation || 'landscape',
      gallery_images: project.gallery_images || [],
      gallery_image_orientations: project.gallery_image_orientations || [],
      featured: project.featured || false,
      sort_order: project.sort_order || 0,
      hidden: project.hidden || false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleHome} className="text-stone-400 hover:text-stone-700 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-medium tracking-wide text-stone-900">Site Manager</h1>
          <div className="hidden md:flex items-center gap-1 ml-4 bg-stone-100 p-1">
            <button
              onClick={() => setTab('projects')}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors ${tab === 'projects' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Projects
            </button>
            <button
              onClick={() => setTab('content')}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors ${tab === 'content' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <FileText className="w-3 h-3 inline mr-1" />Text & Images
            </button>
            <button
              onClick={() => setTab('quotes')}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors ${tab === 'quotes' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <MessageSquare className="w-3 h-3 inline mr-1" />Quotes
            </button>
          </div>
        </div>
        {tab === 'projects' && (
          <Button
            onClick={() => { setEditing('new'); setForm(emptyProject); }}
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-none text-xs tracking-wider uppercase h-9 px-5"
          >
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        )}
      </div>
      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b border-stone-200 bg-white">
        <button onClick={() => setTab('projects')} className={`flex-1 py-3 text-xs tracking-wider uppercase ${tab === 'projects' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400'}`}>Projects</button>
        <button onClick={() => setTab('content')} className={`flex-1 py-3 text-xs tracking-wider uppercase ${tab === 'content' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400'}`}>Text & Images</button>
        <button onClick={() => setTab('quotes')} className={`flex-1 py-3 text-xs tracking-wider uppercase ${tab === 'quotes' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400'}`}>Quotes</button>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Site Content Tab */}
        {tab === 'content' && <SiteContentEditor />}

        {/* Quotes Tab */}
        {tab === 'quotes' && <TestimonialsEditor />}

        {/* Projects Tab */}
        {tab === 'projects' && (
        <div>
        {editing && (
          <div className="bg-white border border-stone-200 p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium text-stone-900">
                {editing === 'new' ? 'New Project' : 'Edit Project'}
              </h2>
              <button onClick={() => { setEditing(null); setForm(emptyProject); }} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Title</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="rounded-none" />
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="rounded-none"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Year</Label>
                  <Input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="rounded-none" placeholder="2024" />
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Location</Label>
                  <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="rounded-none" placeholder="New York, NY" />
                </div>
              </div>

              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Short Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-none" rows={2} />
              </div>

              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Full Description</Label>
                <Textarea value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} className="rounded-none" rows={5} />
              </div>

              {/* Cover Image */}
              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Cover Image</Label>
                {form.cover_image ? (
                  <div className="relative w-full max-w-md aspect-video bg-stone-100 overflow-hidden group">
                    <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, cover_image: '' })}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-stone-300 cursor-pointer hover:border-stone-400 transition-colors">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                      <span className="text-xs text-stone-400">Upload cover image</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'cover_image')} />
                  </label>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <Label className="text-xs text-stone-500">Cover orientation:</Label>
                  <div className="flex rounded overflow-hidden border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, cover_image_orientation: 'landscape' })}
                      className={`px-3 py-1.5 text-xs transition-colors ${form.cover_image_orientation !== 'portrait' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-50'}`}
                    >
                      Landscape (2-up)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, cover_image_orientation: 'portrait' })}
                      className={`px-3 py-1.5 text-xs transition-colors ${form.cover_image_orientation === 'portrait' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-50'}`}
                    >
                      Portrait (3-up)
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(form.gallery_images || []).map((img, i) => {
                    const orient = (form.gallery_image_orientations || [])[i] || 'landscape';
                    return (
                      <div key={i} className="relative aspect-square bg-stone-100 overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleGalleryOrientation(i)}
                          className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] tracking-wider uppercase py-1 opacity-0 group-hover:opacity-100 transition-opacity text-center"
                        >
                          {orient === 'portrait' ? '↕ Portrait (3-up)' : '↔ Landscape (2-up)'}
                        </button>
                      </div>
                    );
                  })}
                  <label className="flex items-center justify-center aspect-square border-2 border-dashed border-stone-300 cursor-pointer hover:border-stone-400 transition-colors">
                    <div className="text-center">
                      <Image className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                      <span className="text-[10px] text-stone-400">Add</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'gallery')} />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} />
                <Label className="text-sm text-stone-600">Featured on homepage</Label>
              </div>

              {uploading && <p className="text-xs text-stone-400">Uploading image...</p>}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saveMutation.isPending || uploading} className="bg-stone-900 hover:bg-stone-800 text-white rounded-none text-xs tracking-wider uppercase h-10 px-8">
                  {saveMutation.isPending ? 'Saving...' : 'Save Project'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(emptyProject); }} className="rounded-none text-xs tracking-wider uppercase h-10">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Project list */}
        <ProjectList projects={projects} isLoading={isLoading} onEdit={startEdit} />
        </div>)}
      </div>
    </div>
  );
}