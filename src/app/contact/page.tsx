'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResponseMessage(data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setResponseMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setResponseMessage('Network error. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a news tip, question, or feedback? We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">Email</h3>
              <a href="mailto:contact@californiabreakingnews.com" className="text-sm text-muted-foreground hover:text-primary">
                contact@californiabreakingnews.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">(555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">California, USA</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <Send className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Message Sent!</h3>
              <p className="text-green-600 dark:text-green-500">{responseMessage}</p>
              <Button
                onClick={() => setStatus('idle')}
                variant="outline"
                className="mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 dark:border-zinc-700"
                >
                  <option value="">Select a subject</option>
                  <option value="News Tip">News Tip</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Advertising">Advertising</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 dark:border-zinc-700 resize-none"
                  placeholder="Your message..."
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{responseMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full md:w-auto px-8 py-3 font-bold"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
