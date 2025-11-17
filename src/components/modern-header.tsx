"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function ModernHeader({ title, subtitle, action }: ModernHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-8 h-[97px]">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* CTA Button */}
          {action && (
            <Button
              asChild
              size="default"
              className="shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 gap-2"
            >
              <Link href={action.href}>
                {action.icon}
                {action.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
