'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

const SITE_NAME = 'California Breaking News';

const CATEGORIES = [
  'Local News',
  'Politics',
  'Business',
  'Sports',
  'Entertainment',
  'Technology',
];

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  ...CATEGORIES.map((c) => ({ name: c, path: `/category/${encodeURIComponent(c.toLowerCase())}` })),
  { name: 'About', path: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Top Bar - hidden on mobile */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-xs py-2 text-muted-foreground dark:text-zinc-400">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>{currentDate}</div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Mid Bar - Logo */}
      <header className="bg-white dark:bg-zinc-900 py-6 md:py-8 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="hidden md:block w-1/4">
            {/* Social Icons */}
            <div className="flex space-x-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#3b5998] hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#1da1f2] hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#e1306c] hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#cd201f] hover:text-white transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex flex-col items-center group">
              <h2 className="text-[1.75rem] font-black tracking-tighter uppercase text-black dark:text-white group-hover:opacity-80 transition-opacity text-center">
                {SITE_NAME}
              </h2>
              <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground mt-1">
                Voice of the Golden State
              </span>
            </Link>
          </div>
          <div className="w-1/4 flex justify-end items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Sticky */}
      <div className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 border-t-2 border-t-black dark:border-t-white shadow-sm hidden md:block transition-colors duration-300">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center">
            <ul className="flex flex-wrap justify-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block px-5 py-4 text-sm font-bold uppercase tracking-wide border-b-2 border-transparent hover:border-primary transition-colors ${
                      pathname === item.path
                        ? 'text-primary border-primary'
                        : 'text-gray-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-lg fixed top-[89px] left-0 right-0 z-40 transition-colors duration-300">
          <nav className="flex flex-col p-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`py-3 px-4 text-sm font-bold uppercase border-b border-gray-100 dark:border-zinc-800 last:border-0 ${
                  pathname === item.path
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-zinc-300'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
