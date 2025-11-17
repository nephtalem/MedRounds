"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  Building2,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Ward 3",
    href: "/wards/ward-3",
    icon: Building2,
  },
  {
    label: "Ward 4",
    href: "/wards/ward-4",
    icon: Building2,
  },
  {
    label: "ICU",
    href: "/wards/icu",
    icon: Building2,
  },
];

const mobileAccountItems = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800/60 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 h-[72px] md:h-[97px]">
        {/* Left section: mobile menu + title */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[80%] max-w-xs dark:bg-slate-900 dark:border-slate-800">
                <SheetHeader className="p-4 pb-3 text-left">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-base font-bold text-gray-900 dark:text-gray-100">
                        MedRounds
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        Medical Rounds
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <nav className="px-4 pb-4 space-y-4">
                  <div>
                    <p className="px-1 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Navigation
                    </p>
                    <div className="space-y-1">
                      {mobileNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm dark:shadow-blue-500/10"
                                : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                              )}
                            />
                            <span>{item.label}</span>
                            {isActive && (
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="dark:bg-slate-800" />

                  <div>
                    <p className="px-1 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Account
                    </p>
                    <div className="space-y-1">
                      {mobileAccountItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm dark:shadow-blue-500/10"
                                : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                              )}
                            />
                            <span>{item.label}</span>
                            {isActive && (
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="dark:bg-slate-800" />

                  {/* User summary + sign out */}
                  <div className="mt-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 p-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-md dark:shadow-blue-500/30">
                      {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user?.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="inline-flex items-center justify-center rounded-lg bg-gray-200 dark:bg-slate-700 px-2 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Title Section */}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <button className="hidden xs:flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </button>

          {/* CTA Button */}
          {action && (
            <Button
              asChild
              size="default"
              className={cn(
                "hidden sm:inline-flex shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 gap-2"
              )}
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
