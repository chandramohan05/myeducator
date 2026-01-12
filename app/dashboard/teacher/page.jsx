"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, Book } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function TeacherDashboard() {
  const router = useRouter();

  const [coach, setCoach] = useState({ name: null, specialty: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [studentsTotal, setStudentsTotal] = useState(0);
  const [recentDemoClasses, setRecentDemoClasses] = useState([]);

  const [todayClasses, setTodayClasses] = useState([]);

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        /* Demo classes */
        let demos = [];
        const demoResp = await fetch("/api/teacher/demo-classes", { credentials: "include" });
        if (demoResp.ok) {
          const demoJson = await demoResp.json();
          demos = (demoJson || []).map(d => ({
            ...d,
            participants_count: d.registrations_count ?? d.participants_count ?? 0,
          }));
          setRecentDemoClasses(demos);
        }

        /* Profile */
        const profileResp = await fetch("/api/teacher/profile", { credentials: "include" });
        if (profileResp.ok) {
          const pjson = await profileResp.json();
          setCoach({
            name: pjson.name ?? null,
            specialty: pjson.specialty ?? null,
          });
        }

        /* Courses */
        const coursesResp = await fetch("/api/teacher/courses", { credentials: "include" });
        if (coursesResp.ok) {
          const coursesJson = await coursesResp.json();
          setCourses(coursesJson.courses || []);
        }

        /* Live classes */
        let live = [];
        const liveResp = await fetch("/api/teacher/liveclasses", { credentials: "include" });
        if (liveResp.ok) {
          const liveJson = await liveResp.json();
          live = liveJson.classes || [];
        }

        /* Merge demo + live */
        const ids = new Set(live.map(c => String(c.id)));
        const merged = [...live];
        demos.forEach(d => {
          if (!ids.has(String(d.id))) merged.push(d);
        });

        setLiveClasses(merged);
        setTodayClasses(merged.filter(c => isToday(c.date)));

        /* Students */
        const studentsResp = await fetch("/api/teacher/students", { credentials: "include" });
        if (studentsResp.ok) {
          const studentsJson = await studentsResp.json();
          setStudentsTotal(Number(studentsJson.total ?? (studentsJson.students?.length ?? 0)));
        }

      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">

    


      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {coach.name ?? "Coach"} !!
          </h2>
          <p className="text-muted-foreground">Time to shape champions.</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Book className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/dashboard/teacher/liveclasses")}>
              View Live Classes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/teacher/courses")}>
              View Courses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
  {/* TODAY CLASS ALERT */}
     {todayClasses.length > 0 && (
  <div className="flex items-center justify-between rounded-xl border bg-emerald-600 px-6 py-4">
    
    <div className="flex items-start gap-3">
      {/* Icon */}
      <div className="mt-1 text-yellow-300">🔔</div>

      <div>
        {/* Title */}
        <p className="text-sm font-semibold text-white">
          Today’s Class
        </p>

        {/* Subtitle */}
        <p className="text-sm text-emerald-100">
          {todayClasses[0].title} • {todayClasses[0].time}
          {todayClasses[0].duration && (
            <span className="ml-2 rounded bg-white px-2 py-0.5 text-xs font-medium text-emerald-700">
              {todayClasses[0].duration} 
            </span>
          )}
        </p>
      </div>
    </div>

    {/* Join button */}
  <Button
      size="sm"
      className="rounded-full"
      onClick={() =>
        window.open(todayClasses[0].meet_link || "#", "_blank")
      }
    >
      Join
    </Button>

  </div>
)}
      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Assigned Courses</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Live Classes</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveClasses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Demo Classes</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDemoClasses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsTotal}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned courses */}
      <Card>
        <CardHeader><CardTitle>Your Courses</CardTitle></CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-sm">No courses assigned.</p>
          ) : (
            <ul className="divide-y">
              {courses.map(c => (
                <li key={c.id} className="py-3">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Demo classes */}
      <Card>
        <CardHeader><CardTitle>Recent Demo Classes</CardTitle></CardHeader>
        <CardContent>
          {recentDemoClasses.length > 0 ? (
            <ul className="divide-y">
              {recentDemoClasses.map(c => (
                <li key={c.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.date} • {c.time ?? "—"}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => window.open(c.meet_link || "#", "_blank")}>
                    Join
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No demo classes found.</p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming classes */}
      <Card>
        <CardHeader><CardTitle>Upcoming Classes</CardTitle></CardHeader>
        <CardContent>
          {liveClasses.length > 0 ? (
            <ul className="divide-y">
              {liveClasses.map(c => (
                <li key={c.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.date} • {c.time ?? "—"}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => window.open(c.meet_link || "#", "_blank")}>
                    Join
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming live classes.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
