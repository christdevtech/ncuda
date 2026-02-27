'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Calendar, BarChart3, Settings, Home, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/announcements', label: 'Announcements', icon: Bell },
    { href: '/members', label: 'Members', icon: Users },
    { href: '/events', label: 'Events & Projects', icon: Calendar },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="bg-emerald-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-white text-emerald-900 rounded-full flex items-center justify-center font-black">N</div>
                NCUDA
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-white text-white'
                        : 'border-transparent text-emerald-100 hover:border-emerald-300 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu could go here */}
    </nav>
  );
}
