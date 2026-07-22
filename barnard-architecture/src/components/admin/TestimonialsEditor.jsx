import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const empty = { quote: '', author: '', project: '', sort_order: 0 };

export default function TestimonialsEditor() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => base44.entities.Testimonial.list('sort_order', 100),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects-list'],
    queryFn: () => base44.entities.Project.list('title', 200),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editing && editing !== 'new'
        ? base44.entities.Testimonial.update(editing, data)
        : base44.entities.Testimonial.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(editing === 'new' ? 'Testimonial added' : 'Testimonial updated');
      setEditing(null);
      setForm(empty);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted');
    },
  });

  const startEdit = (t) => {
    setEditing(t.id);
    setForm({ quote: t.quote || '', author: t.author || '', project: t.project || '', sort_order: t.sort_order || 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium tracking-wide text-stone-900">Client Quotes</h2>
        <Button
          onClick={() => { setEditing('new'); setForm(empty); }}
          className="bg-stone-900 hover:bg-stone-800 text-white rounded-none text-xs tracking-wider uppercase h-9 px-5"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Quote
        </Button>
      </div>

      {editing && (
        <div className="bg-white border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-stone-900">{editing === 'new' ? 'New Quote' : 'Edit Quote'}</h3>
            <button onClick={() => { setEditing(null); setForm(empty); }} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Quote</Label>
              <Textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} required rows={4} className="rounded-none" placeholder="Client quote..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Author</Label>
                <Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required className="rounded-none" placeholder="Name" />
              </div>
              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Assign to Project</Label>
                <Select value={form.project || ''} onValueChange={v => setForm({ ...form, project: v })}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Homepage (no project)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Homepage only</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-stone-400 mt-1">If assigned to a project, appears at the bottom of that project page. Otherwise appears on the homepage.</p>
              </div>
              <div>
                <Label className="text-xs tracking-wider uppercase text-stone-500 mb-2 block">Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className="rounded-none w-full" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saveMutation.isPending} className="bg-stone-900 hover:bg-stone-800 text-white rounded-none text-xs tracking-wider uppercase h-10 px-8">
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(empty); }} className="rounded-none text-xs tracking-wider uppercase h-10">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-stone-400 text-sm">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-light text-sm">No quotes yet. Add your first one above.</div>
        ) : (
          testimonials.map(t => (
            <div key={t.id} className="bg-white border border-stone-200 p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-stone-700 text-sm font-light line-clamp-2">"{t.quote}"</p>
                <p className="text-xs text-stone-400 mt-1">{t.author}{t.project ? ` · ${t.project}` : ''}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(t)}>
                  <Pencil className="w-4 h-4 text-stone-400" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (confirm('Delete this quote?')) deleteMutation.mutate(t.id); }}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}