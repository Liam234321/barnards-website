import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  {
    key: 'hero',
    label: 'Homepage Hero',
    description: 'Controls the full-screen opening section of the website.',
    fields: [
      { name: 'heading', label: 'Main Title (e.g. Barnard)', type: 'input' },
      { name: 'subheading', label: 'Tagline (below title)', type: 'input' },
      { name: 'image_url', label: 'Hero Background Image', type: 'image', hint: 'This is the full-screen background photo shown on the homepage. Upload your main hero image here.' },
    ],
  },
  {
    key: 'philosophy',
    label: 'Homepage Philosophy',
    description: 'The quote and paragraph shown in the centre of the homepage.',
    fields: [
      { name: 'heading', label: 'Quote / Heading', type: 'input' },
      { name: 'body', label: 'Body Text', type: 'textarea' },
    ],
  },
  {
    key: 'cta',
    label: 'Homepage Call to Action',
    description: 'The banner at the bottom of the homepage with a button linking to Contact.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'input' },
      { name: 'subheading', label: 'Button Label', type: 'input' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    description: 'Controls the footer text, contact info, LinkedIn link, and copyright line.',
    fields: [
      { name: 'body', label: 'Tagline (left column text)', type: 'textarea', hint: 'e.g. "Thoughtful design for meaningful spaces."' },
      { name: 'subheading', label: 'LinkedIn URL', type: 'input', hint: 'Paste your LinkedIn profile URL — the LinkedIn logo will appear automatically. Leave blank to hide.' },
      { name: 'heading', label: 'Contact Email (right column)', type: 'input', hint: 'e.g. andrew@barnards.net.au' },
      { name: 'stat1_value', label: 'Copyright Line', type: 'input', hint: 'e.g. "Barnard Architecture 2024" — leave blank for auto year.' },
    ],
  },
  {
    key: 'about',
    label: 'About Page',
    description: 'All text and the portrait photo shown on the About page.',
    fields: [
      { name: 'heading', label: 'Page Headline', type: 'input' },
      { name: 'subheading', label: 'Architect Name / Subtitle', type: 'input' },
      { name: 'image_url', label: 'Portrait Photo', type: 'image' },
      { name: 'body', label: 'Bio Paragraph 1', type: 'textarea' },
      { name: 'body2', label: 'Bio Paragraph 2', type: 'textarea' },
      { name: 'body3', label: 'Bio Paragraph 3', type: 'textarea' },
      { name: 'stat1_value', label: 'Stat 1 Value (e.g. 10+)', type: 'input' },
      { name: 'stat1_label', label: 'Stat 1 Label (e.g. Years)', type: 'input' },
      { name: 'stat2_value', label: 'Stat 2 Value', type: 'input' },
      { name: 'stat2_label', label: 'Stat 2 Label', type: 'input' },
      { name: 'stat3_value', label: 'Stat 3 Value', type: 'input' },
      { name: 'stat3_label', label: 'Stat 3 Label', type: 'input' },
    ],
  },
];

function SectionEditor({ section, record, onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(null);

  // Sync record into form when opened
  const handleOpen = () => {
    setForm(record ? { ...record } : {});
    setOpen(true);
  };

  const handleUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(fieldName);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, [fieldName]: file_url }));
    setUploading(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(section.key, form, record?.id);
    setOpen(false);
  };

  return (
    <div className="bg-white border border-stone-200">
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-colors"
      >
        <div>
          <span className="text-sm font-medium text-stone-900">{section.label}</span>
          {section.description && <p className="text-xs text-stone-400 font-light mt-0.5">{section.description}</p>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 border-t border-stone-100 pt-5">
          {section.fields.map(field => (
            <div key={field.name}>
              <Label className="text-xs tracking-wider uppercase text-stone-500 mb-1 block">{field.label}</Label>
              {field.hint && <p className="text-xs text-stone-400 font-light mb-2">{field.hint}</p>}
              {field.type === 'textarea' ? (
                <Textarea
                  value={form[field.name] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="rounded-none"
                  rows={3}
                />
              ) : field.type === 'image' ? (
                <div className="flex items-center gap-3">
                  {form[field.name] ? (
                    <div className="relative w-32 h-20 bg-stone-100 overflow-hidden flex-shrink-0 group">
                      <img src={form[field.name]} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, [field.name]: '' }))}
                        className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 cursor-pointer border border-dashed border-stone-300 hover:border-stone-500 transition-colors px-4 py-2">
                    <Upload className="w-4 h-4 text-stone-400" />
                    <span className="text-xs text-stone-500">
                      {uploading === field.name ? 'Uploading...' : form[field.name] ? 'Replace' : 'Upload Image'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, field.name)} />
                  </label>
                </div>
              ) : (
                <Input
                  value={form[field.name] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="rounded-none"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-stone-900 hover:bg-stone-800 text-white rounded-none text-xs tracking-wider uppercase h-9 px-6">
              Save
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-none text-xs h-9">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function SiteContentEditor() {
  const queryClient = useQueryClient();

  const { data: records = [] } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => base44.entities.SiteContent.list(),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ key, data, existingId }) => {
      if (existingId) {
        return base44.entities.SiteContent.update(existingId, { key, ...data });
      }
      return base44.entities.SiteContent.create({ key, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast.success('Content saved');
    },
  });

  const recordMap = {};
  records.forEach(r => { recordMap[r.key] = r; });

  return (
    <div>
      <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-4">Site Text & Images</p>
      <div className="space-y-2">
        {SECTIONS.map(section => (
          <SectionEditor
            key={section.key}
            section={section}
            record={recordMap[section.key]}
            onSave={(key, data, existingId) => saveMutation.mutate({ key, data, existingId })}
          />
        ))}
      </div>
    </div>
  );
}