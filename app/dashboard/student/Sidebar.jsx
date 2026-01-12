"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Video,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  CreditCard,
} from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "../../context/AuthContext";
import { ChessKnight } from "../../components/icons/ChessKnight";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { student } = useAuth();
  const pathname = usePathname();
  const [imgFailed, setImgFailed] = useState(false);

  // 👇 Parents Meet enabled
  const [openMenus, setOpenMenus] = useState({ "parents meet": true });

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/student" },
    { icon: BookOpen, label: "My Course", href: "/dashboard/student/courses" },
    { icon: BookOpen, label: "Tournament Performance", href: "/dashboard/student/tournament" },
    { icon: BarChart3, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: BookOpen, label: "Home Work & Assignments", href: "/dashboard/student/homework" },
    { icon: BookOpen, label: "Study Plan", href: "/dashboard/student/studyplan" },
    { icon: BookOpen, label: "Tournament Recommendations", href: "/dashboard/student/tournament-recommendations" },
    { icon: BarChart3, label: "Course Progress", href: "/dashboard/student/progress" },
    { icon: BarChart3, label: "Progress Tracker", href: "/dashboard/student/tracker" },
    { icon: Video, label: "Free Demo Class", href: "/dashboard/student/demo-class" },
    { icon: Video, label: "Compensation Scheduled", href: "/dashboard/student/compensation" },
    { icon: CalendarClock, label: "Schedule", href: "/dashboard/student/schedule" },
    { icon: CreditCard, label: "Payment", href: "/dashboard/student/Payment" },

    // ✅ Parents Meet DROPDOWN Added Here
    {
      icon: CalendarClock,
      label: "Parents Meet",
      href: "/dashboard/student/parents-meet",
      children: [
        { label: "View List", href: "/dashboard/student/parents-meet/list" },
        { label: "Add Date", href: "/dashboard/student/parents-meet/add" },
      ],
    },
  ];

  const getUserInitials = () => {
    if (!student?.Student_name && !student?.name) return "";
    const name = student?.Student_name || student?.name;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const avatarSrc = (avatarValue) => {
    if (!avatarValue) return null;
    if (
      avatarValue.startsWith("data:") ||
      avatarValue.startsWith("http://") ||
      avatarValue.startsWith("https://")
    ) {
      return avatarValue;
    }
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";
    return `${base}/storage/v1/object/public/assests/${encodeURIComponent(avatarValue)}`;
  };

  React.useEffect(() => {
    setImgFailed(false);
  }, [student?.avatar]);

  const toggleMenu = (key) => {
    setOpenMenus((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div
      className={`relative min-h-screen bg-white border-r shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border rounded-full p-1.5 shadow-md hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.children && item.children.length > 0) {
              const key = item.label.toLowerCase();
              const isOpen = openMenus[key];
              const activeChild = item.children.some((c) => pathname.startsWith(c.href));

              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleMenu(key)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg ${
                      activeChild
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </button>

                  {isOpen && !isCollapsed && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-3 py-2 rounded text-sm ${
                              pathname === child.href
                                ? "bg-primary text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/dashboard/student/profile"
          className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100"
        >
          {student ? (
            <>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {student.avatar && !imgFailed ? (
                  <img
                    src={avatarSrc(student.avatar)}
                    alt={student.Student_name || student.name || "avatar"}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {getUserInitials()}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {student.Student_name || student.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{student.email}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton className="w-8 h-8 rounded-full" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              )}
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
