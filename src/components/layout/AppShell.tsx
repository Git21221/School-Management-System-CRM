import React, { useEffect, useRef, useState } from "react";
import { User, Student } from "@/types";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppShellProps {
  user: User;
  current: string;
  unreadCount: number;
  students: Student[];
  onNavigate: (id: string) => void;
  onShowProfile: () => void;
  onShowLogout: () => void;
  children: React.ReactNode;
}

export function AppShell({
  user,
  current,
  unreadCount,
  students,
  onNavigate,
  onShowProfile,
  onShowLogout,
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;
    container.scrollTo({ top: 0, behavior: "auto" });
  }, [current]);

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:static md:z-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <AppSidebar
          active={current}
          onNavigate={onNavigate}
          notifCount={unreadCount}
          onClose={() => setSidebarOpen(false)}
          onLogout={onShowLogout}
          user={user}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AppHeader
          user={user}
          current={current}
          unreadCount={unreadCount}
          students={students}
          onNavigate={onNavigate}
          onOpenSidebar={() => setSidebarOpen(true)}
          onShowProfile={onShowProfile}
          onShowLogout={onShowLogout}
        />

        {/* Page content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
