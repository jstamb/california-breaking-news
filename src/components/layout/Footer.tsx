'use client';

import Link from 'next/link';
import { Facebook, Twitter, Youtube } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

const SITE_NAME = 'California Breaking News';

const CATEGORIES = [
  { name: 'Local News', path: '/category/local%20news' },
  { name: 'Politics', path: '/category/politics' },
  { name: 'Business', path: '/category/business' },
  { name: 'Sports', path: '/category/sports' },
  { name: 'Entertainment', path: '/category/entertainment' },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide border-b-2 border-black dark:border-white inline-block pb-1 mb-2 dark:text-white">
              About Us
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-serif">
              {SITE_NAME} brings you the best California news, magazine features, and community
              updates. We are dedicated to truth and integrity in journalism.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="text-xs font-bold uppercase text-primary hover:underline"
              >
                Read More &raquo;
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wide border-b-2 border-black dark:border-white inline-block pb-1 mb-4 dark:text-white">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((item) => (
                <li
                  key={item.name}
                  className="border-b border-dashed border-gray-200 dark:border-zinc-800 pb-2 last:border-0"
                >
                  <Link
                    href={item.path}
                    className="flex justify-between items-center group"
                  >
                    <span className="group-hover:text-primary transition-colors text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wide border-b-2 border-black dark:border-white inline-block pb-1 mb-4 dark:text-white">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get weekly California news delivered to your inbox!
            </p>
            <NewsletterForm variant="default" />
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wide border-b-2 border-black dark:border-white inline-block pb-1 mb-4 dark:text-white">
              Connect
            </h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm group">
                <span className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center group-hover:opacity-90">
                  <Facebook className="w-4 h-4" />
                </span>
                <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  Facebook
                </span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm group">
                <span className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center group-hover:opacity-90">
                  <Twitter className="w-4 h-4" />
                </span>
                <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  Twitter
                </span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm group">
                <span className="w-8 h-8 rounded-full bg-[#cd201f] text-white flex items-center justify-center group-hover:opacity-90">
                  <Youtube className="w-4 h-4" />
                </span>
                <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  Youtube
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#111] text-gray-400 py-6 text-center text-sm border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
