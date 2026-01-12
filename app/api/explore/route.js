// app/api/explore/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ------- FORMATTERS -------

function formatCourseData(course) {
  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: null, // you can add a thumbnail column later
    price: Number(course.price ?? 0),
    discountedPrice: null,
    level: course.level,
    category: null,
    rating: 0,
    totalRatings: 0,
    enrolledStudents: 0,
    totalDuration: 0,
    totalLessons: Array.isArray(course.videos) ? course.videos.length : 0,
    featured: false,
    teacher: {
      name: course.coach_name || "Azroute Coach",
      profileImage: "/logo.png",
      department: null,
    },
    lastUpdated: course.updated_at,
    language: null,
    requirements: null,
    objectives: null,
    tags: null,
    status: course.status,
  };
}

function formatEventData(event) {
  if (!event) return null;

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    thumbnail: null,
    type: event.type,
    category: null,
    startDate: event.date,
    endDate: event.date,
    timeZone: null,
    location: event.location,
    capacity: null,
    featured: false,
    registrationCount: 0,
    maximumRegistrations: null,
    currentRegistrations: null,
    ticketTiers: null,
    teacher: null,
    agenda: null,
    speakers: null,
    prerequisites: null,
    resources: null,
    status: "active",
    registrationDeadline: null,
    isRefundable: false,
    refundPolicy: null,
    certificateProvided: false,
  };
}

// ------- SORT HELPERS -------

function getCourseSort(sortType) {
  switch (sortType) {
    case "newest":
      return { column: "created_at", ascending: false };
    case "price-low":
      return { column: "price", ascending: true };
    case "price-high":
      return { column: "price", ascending: false };
    case "rating":
      // no rating column yet – fallback to created_at
      return { column: "created_at", ascending: false };
    case "popular":
    default:
      return { column: "created_at", ascending: false };
  }
}

function getEventSort(sortType) {
  // student_events has only "date" – we sort using that
  switch (sortType) {
    case "newest":
      return { column: "date", ascending: false };
    case "startDate":
      return { column: "date", ascending: true };
    case "popular":
    default:
      return { column: "date", ascending: true };
  }
}

// ------- ROUTE HANDLER -------

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || "courses";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const filters = {
      search: searchParams.get("search"),
      category: searchParams.get("category"),
      level: searchParams.get("level"),
      eventType: searchParams.get("eventType"),
      timeframe: searchParams.get("timeframe"),
      sort: searchParams.get("sort") || (type === "courses" ? "popular" : "startDate"),
    };

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // ------- COURSES -------
    if (type === "courses") {
      let query = supabase
        .from("course")
        .select("*", { count: "exact" })
        .eq("status", "active");

      if (filters.search) {
        const s = filters.search;
        query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%`);
      }

      if (filters.level && filters.level !== "all") {
        query = query.eq("level", filters.level);
      }

      // category filter skipped – no category column in your table

      const sort = getCourseSort(filters.sort);
      if (sort?.column) {
        query = query.order(sort.column, { ascending: sort.ascending });
      }

      const { data: rows, error, count } = await query.range(from, to);

      if (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const items = (rows || []).map(formatCourseData);

      return NextResponse.json({
        items,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((count || 0) / limit),
          totalItems: count || 0,
        },
      });
    }

    // ------- EVENTS (student_events) -------
    let query = supabase
      .from("student_events")
      .select("*", { count: "exact" });

    if (filters.search) {
      const s = filters.search;
      query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%`);
    }

    if (filters.eventType && filters.eventType !== "all") {
      query = query.eq("type", filters.eventType);
    }

    const today = new Date().toISOString().slice(0, 10);

    if (filters.timeframe === "upcoming") {
      query = query.gte("date", today);
    } else if (filters.timeframe === "past") {
      query = query.lt("date", today);
    }

    const sort = getEventSort(filters.sort);
    if (sort?.column) {
      query = query.order(sort.column, { ascending: sort.ascending });
    }

    const { data: rows, error, count } = await query.range(from, to);

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items = (rows || []).map(formatEventData);

    return NextResponse.json({
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
      },
    });
  } catch (err) {
    console.error("Error in explore API:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
