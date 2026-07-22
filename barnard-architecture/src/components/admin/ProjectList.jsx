import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Image, GripVertical, Star, ChevronUp, ChevronDown, EyeOff, Eye } from 'lucide-react';

export default function ProjectList({ projects, isLoading, onEdit }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState([]);

  // Keep local list in sync with server data, sorted by sort_order descending
  useEffect(() => {
    if (projects) {
      const sorted = [...projects].sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));
      setItems(sorted);
    }
  }, [projects]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project deleted');
    },
  });

  const toggleFeatured = (project) => {
    const updated = { ...project, featured: !project.featured };
    updateMutation.mutate({ id: project.id, data: { featured: updated.featured } });
    toast.success(updated.featured ? 'Added to homepage' : 'Removed from homepage');
  };

  const toggleHidden = (project) => {
    const updated = { ...project, hidden: !project.hidden };
    updateMutation.mutate({ id: project.id, data: { hidden: updated.hidden } });
    toast.success(updated.hidden ? 'Hidden from portfolio' : 'Visible on portfolio');
  };

  const move = (index, direction) => {
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    // Swap positions in the array
    const next = [...items];
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];

    // Reassign sort_order based on position (high number = first)
    const total = next.length;
    const updated = next.map((item, i) => ({ ...item, sort_order: total - i }));
    setItems(updated);

    // Persist only the two affected items
    updateMutation.mutate({ id: updated[index].id, data: { sort_order: updated[index].sort_order } });
    updateMutation.mutate({ id: updated[swapIndex].id, data: { sort_order: updated[swapIndex].sort_order } });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white border border-stone-200 p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400 font-light">
        <p>No projects yet. Create your first one above.</p>
      </div>
    );
  }

  const featuredCount = items.filter(p => p.featured).length;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-xs text-stone-400 font-light">
          Drag rows up/down to change display order. Order applies to both Portfolio and Homepage.
        </p>
        <p className="text-xs text-stone-400">
          <Star className="w-3 h-3 inline text-amber-500 mr-1" />
          {featuredCount} featured on homepage
        </p>
      </div>

      {items.map((project, index) => (
        <div
          key={project.id}
          className="bg-white border border-stone-200 flex items-center gap-3 px-3 py-3 hover:bg-stone-50 transition-colors group"
        >
          {/* Reorder arrows */}
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="text-stone-300 hover:text-stone-600 disabled:opacity-20 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              className="text-stone-300 hover:text-stone-600 disabled:opacity-20 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Position badge */}
          <span className="text-xs text-stone-300 w-4 text-center flex-shrink-0">{index + 1}</span>

          {/* Thumbnail */}
          <div className="w-16 h-11 bg-stone-100 flex-shrink-0 overflow-hidden">
            {project.cover_image ? (
              <img src={project.cover_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-4 h-4 text-stone-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-stone-900 text-sm truncate">{project.title}</p>
            <p className="text-xs text-stone-400 truncate">
              {[project.category, project.year, project.location].filter(Boolean).join(' · ')}
            </p>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-stone-500 font-medium hidden sm:block">Homepage</span>
            <Switch
              checked={!!project.featured}
              onCheckedChange={() => toggleFeatured(project)}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleHidden(project)} title={project.hidden ? 'Show on portfolio' : 'Hide from portfolio'}>
              {project.hidden ? <Eye className="w-3.5 h-3.5 text-stone-400" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(project)}>
              <Pencil className="w-3.5 h-3.5 text-stone-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (confirm('Delete this project?')) deleteMutation.mutate(project.id);
              }}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}