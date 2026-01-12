"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  BookOpen,
  GraduationCap,
  Globe,
  ShoppingBag, 
  IndianRupee,
  Newspaper,
  Info ,

// <-- Added import
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";
import { useAuth } from "../context/AuthContext";

export  default function Navbar() {
  const router = useRouter();
  const { student: ctxUser, setStudent } = useAuth?.() ?? {};
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  // teacherUser holds server-cookie-based teacher/coach session (legacy)
  const [teacherUser, setTeacherUser] = useState(null);
  const [checkingLegacy, setCheckingLegacy] = useState(false);

  // Sync NextAuth session into AuthContext (students)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      try {
        setStudent?.(session.user);
        localStorage.setItem("studentSession", JSON.stringify(session.user));
      } catch (e) {}
    } else if (status === "unauthenticated") {
      setStudent?.(null);
      try {
        localStorage.removeItem("studentSession");
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user]);

  // Detect legacy teacher/coach cookie session
  useEffect(() => {
    let mounted = true;

    if (session?.user?.role === "teacher" || session?.user?.role === "coach") return;

    (async () => {
      setCheckingLegacy(true);
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (
            data?.user &&
            (data.user.role === "teacher" || data.user.role === "coach")
          ) {
            const name =
              [data.user.firstName, data.user.middleName, data.user.lastName]
                .filter(Boolean)
                .join(" ") ||
              data.user.name ||
              data.user.email;

            setTeacherUser({
              ...data.user,
              name,
            });
          }
        }
      } catch (err) {
        console.error("legacy auth check failed", err);
      } finally {
        if (mounted) setCheckingLegacy(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session]);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      if (teacherUser) {
        await fetch("/api/auth/teacher/logout", {
          method: "POST",
          credentials: "include",
        }).catch(() => {});
        setTeacherUser(null);
      }

      await signOut({ redirect: false });
      setStudent?.(null);
      localStorage.removeItem("studentSession");
      router.push("/");
    } catch (err) {
      console.error("logout failed", err);
      router.push("/");
    }
  };

  // Decide which user to show
  const nextAuthUser = session?.user ?? null;
  const isNextAuthTeacher =
    nextAuthUser?.role === "teacher" || nextAuthUser?.role === "coach";
  const user = isNextAuthTeacher ? nextAuthUser : teacherUser ?? (ctxUser || null);

  // Helpers
  const getUserInitials = () => {
    if (!user || !user.name) return "AZ";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const studentNavItems = [
    { label: "My Learning", icon: BookOpen, href: "/dashboard/student" },
  ];

  const teacherNavItems = [
    { label: "Dashboard", icon: BookOpen, href: "/dashboard/teacher" },
  ];

  const getNavItems = () => {
    if (isNextAuthTeacher || teacherUser) return teacherNavItems;
    return studentNavItems;
  };

  const avatarRing = "ring-blue-600 ring-offset-2";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
     <nav className="hidden lg:flex items-center gap-3 flex-nowrap">
        {/* Logo link based on role / auth */}
        <Link
          href={
            user
              ? isNextAuthTeacher || teacherUser
                ? "/dashboard/teacher"
                : "/dashboard/student"
              : "/"
          }
          className="flex items-center space-x-2"
        >
          <Image
            src="/Azroute.jpeg" // MUST match exact file name
            alt="Azroute Logo"
            width={140}
            height={40}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">

{/* 👤 ABOUT US Button */}
<Button
  variant="ghost"
  asChild
  className="font-medium text-gray-700 hover:text-blue-600"
>
  <Link href="/about" className="flex items-center">
    <Info className="h-4 w-4 mr-2" />
    About Us
  </Link>
</Button>

          <Button
            variant="ghost"
            asChild
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            <Link href="/explore" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Explore
            </Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            <Link href="/teachers" className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Our Coaches
            </Link>
          </Button>

          {/* 🟢 Coach on Azroute:
              - shows ONLY when no user (student/coach) is logged in
              - includes an icon */}
          {!user && (
            <>
              <Button
                variant="ghost"
                asChild
                className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Link href="/auth/teacher/login" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Coach on Azroute
                </Link>
              </Button>

              {/* 💰 FEES STRUCTURE Button */}
<Button
  variant="ghost"
  asChild
  className="font-medium text-gray-700 hover:text-blue-600"
>
  <Link href="/fees-structure" className="flex items-center">
   <IndianRupee className="h-4 w-4 mr-2" />

    Fees Structure
  </Link>
</Button>

              {/* 🛍 SHOP Button */}
              <Button
                variant="ghost"
                asChild
                className="font-medium text-gray-700 hover:text-blue-600"
              >
                <Link href="/shop" className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop
                </Link>
              </Button>
           


  
  {/* 📰 NEWS & BLOGS Button */}
<Button
  variant="ghost"
  asChild
  className="font-medium text-gray-700 hover:text-blue-600"
>
  <Link href="/news-blogs" className="flex items-center">
    <Newspaper className="h-4 w-4 mr-2" />
    News & Blogs
  </Link>
</Button>




</>
 )}
        </div>


        <div className="flex items-center space-x-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center space-x-2 hover:bg-gray-100/80" variant="ghost">
                  <Avatar className={`h-8 w-8 ring ${avatarRing}`}>
                    {user?.image ? (
                      <AvatarImage src={user.image} alt={user.name} />
                    ) : (
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="p-4">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                {getNavItems().map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-3" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="font-medium text-gray-700 hover:text-blue-600"
                onClick={() => router.push("/auth/student/login")}
              >
                Log In
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
                onClick={() => router.push("/auth/student/signup")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
