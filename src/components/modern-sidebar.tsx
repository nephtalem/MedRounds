"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Building2,
  User,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
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

const accountItems = [
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

export function ModernSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden md:flex md:fixed md:left-0 md:top-0 h-screen w-64 bg-white dark:bg-[#0B1120] border-r border-gray-200 dark:border-slate-800/60 flex-col transition-colors shadow-xl dark:shadow-2xl dark:shadow-black/50">
      {/* Logo & Brand */}
      <div className="px-6 h-[97px] border-b border-gray-200 dark:border-slate-800/60 flex items-center bg-gradient-to-b from-transparent dark:to-slate-900/20">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/50 group-hover:shadow-blue-500/60 dark:group-hover:shadow-blue-400/70 group-hover:scale-105 transition-all duration-300">
            <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              MedRounds
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Medical Rounds</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-modern">
        <div className="space-y-1">
          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-500/20 dark:to-blue-600/10 text-blue-700 dark:text-blue-400 shadow-sm dark:shadow-blue-500/10 border border-blue-100 dark:border-blue-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-blue-300 hover:border hover:border-gray-100 dark:hover:border-slate-700/50"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                  )}
                  strokeWidth={2}
                />
                <span className={cn(isActive && "font-semibold")}>{item.label}</span>
                {isActive && (
                  <>
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Account Section */}
        <div className="pt-6 space-y-1">
          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Account
          </p>
          {accountItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-500/20 dark:to-blue-600/10 text-blue-700 dark:text-blue-400 shadow-sm dark:shadow-blue-500/10 border border-blue-100 dark:border-blue-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-blue-300 hover:border hover:border-gray-100 dark:hover:border-slate-700/50"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                  )}
                  strokeWidth={2}
                />
                <span className={cn(isActive && "font-semibold")}>{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-slate-800/60 p-4 space-y-3 bg-gradient-to-t from-gray-50/50 dark:from-slate-900/30">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Theme
          </span>
          <ThemeToggle />
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/30 hover:bg-gray-100 dark:hover:bg-slate-700/40 transition-all duration-200 border border-transparent dark:border-slate-700/30 dark:hover:border-slate-600/50 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold text-sm shadow-md dark:shadow-blue-500/30 group-hover:shadow-lg dark:group-hover:shadow-blue-500/50 transition-all">
            {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
              user?.email?.[0]?.toUpperCase() ||
              "U"}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group/btn"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/btn:text-red-600 dark:group-hover/btn:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}
