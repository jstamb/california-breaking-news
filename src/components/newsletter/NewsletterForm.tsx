'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NewsletterFormProps {
  variant?: 'default' | 'minimal' | 'hero';
  className?: string;
}

export function NewsletterForm({ variant = 'default', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: firstName || undefined }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
        setFirstName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (variant === 'hero') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white ${className}`}>
        <h3 className="text-2xl font-bold mb-2">Stay Informed</h3>
        <p className="text-blue-100 mb-6">
          Get the latest California news delivered to your inbox every week.
        </p>

        {status === 'success' ? (
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
            <p className="font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-[2] px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
            {status === 'error' && (
              <p className="text-red-300 text-sm text-center">{message}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={className}>
        {status === 'success' ? (
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            />
            <Button type="submit" disabled={status === 'loading'} size="sm">
              {status === 'loading' ? '...' : 'Join'}
            </Button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-xs mt-1">{message}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      {status === 'success' ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <p className="text-green-700 dark:text-green-400 font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:border-primary bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:border-primary bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full uppercase font-bold text-xs"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
          {status === 'error' && (
            <p className="text-red-500 text-xs">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
