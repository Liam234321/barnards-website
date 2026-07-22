import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Mail, MapPin, Phone, Linkedin } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', project_type: '' });
  const [sending, setSending] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email && !form.phone) {
      setContactError('Please provide at least an email or phone number.');
      return;
    }
    setContactError('');
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'andrew@barnards.net.au',
      subject: `New inquiry from ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nProject Type: ${form.project_type}\n\nMessage:\n${form.message}`
    });
    toast.success('Message sent. We\'ll be in touch soon.');
    setForm({ name: '', email: '', phone: '', message: '', project_type: '' });
    setSending(false);
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-stone-900 italic max-w-3xl leading-snug">
            
            Let's start a conversation.
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-start pt-2">
            
            <p className="text-stone-700 font-light leading-relaxed mb-12">I’m passionate about design and construction and could discuss it at length. Whether you’re planning a new home, designing an office space, or simply exploring ideas, I’d be happy to talk to you about what you have got in mind.


            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">Email</p>
                  <p className="text-stone-700 font-light">andrew@barnards.net.au</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">Phone</p>
                  <p className="text-stone-700 font-light">0426 238 132</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                 <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                 <div>
                   <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">Studio</p>
                   <p className="text-stone-700 font-light">Yarraville, Victoria, Australia</p>
                   <p className="text-stone-700 font-light">Newcastle, NSW, Australia</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <Linkedin className="w-5 h-5 text-stone-400 mt-0.5" />
                 <div>
                   <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">LinkedIn</p>
                   <a href="https://www.linkedin.com/in/andrewbarnard2/" target="_blank" rel="noopener noreferrer" className="text-stone-700 font-light hover:text-stone-900 transition-colors">Andrew Barnard</a>
                 </div>
               </div>
              </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-2 block">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="border-stone-200 rounded-none h-12 focus:border-stone-900 focus:ring-0 font-light"
                  placeholder="Your name" />
                
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-2 block">Email <span className="normal-case text-stone-300">(or phone)</span></label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setContactError(''); }}
                  className="border-stone-200 rounded-none h-12 focus:border-stone-900 focus:ring-0 font-light"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-2 block">Phone <span className="normal-case text-stone-300">(or email)</span></label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); setContactError(''); }}
                  className="border-stone-200 rounded-none h-12 focus:border-stone-900 focus:ring-0 font-light"
                  placeholder="Your phone number" />
                {contactError && <p className="text-red-500 text-xs mt-2">{contactError}</p>}
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-2 block">Message</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={6}
                  className="border-stone-200 rounded-none focus:border-stone-900 focus:ring-0 font-light resize-none"
                  placeholder="Tell us about your project..." />
                
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-none text-xs tracking-[0.25em] uppercase">
                
                {sending ? 'Sending...' :
                <span className="flex items-center gap-2">Send Message <Send className="w-4 h-4" /></span>
                }
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>);

}