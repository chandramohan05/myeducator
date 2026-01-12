// app/dashboard/student/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import { Skeleton } from "../../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { ProfileImage } from "../../../components/profile/ProfileImage";
import ProfileEditForm from "../../../components/profile/ProfileEditForm";
import { Card } from "../../../components/ui/card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // redirect to login if not signed in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/student/login");
    }
  }, [status, router]);

  // load student_list row by session email
  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      try {
        setLoading(true);
        const email = session?.user?.email;
        if (!email) throw new Error("No email in session");

        const { data, error } = await supabase
          .from("student_list")
          .select("*")
          .eq("email", email)
          .single();

        if (error) throw error;

        const normalized = {
          id: data.id,
          reg_no: data.reg_no ?? null,
          Student_name: data.name ?? "",
          dob: data.dob ?? null,
          email: data.email ?? null,
          mobile: data.phone ?? null,
          location: data.place ?? null,
          class_type: data.class_type ?? null,
          group_name: data.group_name ?? null,
          course: data.course ?? null,
          level: data.level ?? null,
          avatar: data.avatar ?? null,
          bio: data.bio ?? null,
          fide_id: data.fide_id ?? null,
          aicf_id: data.aicf_id ?? null,
          state_id_classical: data.state_id_classical ?? null,
          state_id_rapid: data.state_id_rapid ?? null,
          state_id_blitz: data.state_id_blitz ?? null,
          lichess_id: data.lichess_id ?? null,
          chesscom_id: data.chesscom_id ?? null,
        };

        setProfile(normalized);
      } catch (err) {
        console.error("Failed to load profile from student_list:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session, status]);

  // update handler
  const handleProfileUpdate = async (formData) => {
    if (!profile?.id) {
      throw new Error("No profile row loaded");
    }

    try {
      setLoading(true);

      // map UI keys -> DB columns
      const payload = {};
      if (typeof formData.Student_name !== "undefined") payload.name = formData.Student_name;
      if (typeof formData.email !== "undefined") payload.email = formData.email;
      if (typeof formData.mobile !== "undefined") payload.phone = formData.mobile;
      if (typeof formData.location !== "undefined") payload.place = formData.location;
      if (typeof formData.bio !== "undefined") payload.bio = formData.bio;
      if (typeof formData.course !== "undefined") payload.course = formData.course;
      if (typeof formData.level !== "undefined") payload.level = formData.level;

      // Chess IDs
      if (typeof formData.fide_id !== "undefined") payload.fide_id = formData.fide_id;
      if (typeof formData.aicf_id !== "undefined") payload.aicf_id = formData.aicf_id;
      if (typeof formData.state_id_classical !== "undefined") payload.state_id_classical = formData.state_id_classical;
      if (typeof formData.state_id_rapid !== "undefined") payload.state_id_rapid = formData.state_id_rapid;
      if (typeof formData.state_id_blitz !== "undefined") payload.state_id_blitz = formData.state_id_blitz;
      if (typeof formData.lichess_id !== "undefined") payload.lichess_id = formData.lichess_id;
      if (typeof formData.chesscom_id !== "undefined") payload.chesscom_id = formData.chesscom_id;

      // support avatar via profile object: { profile: { avatar: url } }
      if (formData?.profile?.avatar) {
        payload.avatar = formData.profile.avatar;
      }
      if (formData.avatar) {
        payload.avatar = formData.avatar;
      }

      if (Object.keys(payload).length === 0) {
        return profile;
      }

      const { data, error } = await supabase
        .from("student_list")
        .update(payload)
        .eq("id", profile.id)
        .select()
        .single();

      if (error) throw error;

      // normalize returned row and update local state
      const normalized = {
        id: data.id,
        reg_no: data.reg_no ?? null,
        Student_name: data.name ?? "",
        dob: data.dob ?? null,
        email: data.email ?? null,
        mobile: data.phone ?? null,
        location: data.place ?? null,
        class_type: data.class_type ?? null,
        group_name: data.group_name ?? null,
        course: data.course ?? null,
        level: data.level ?? null,
        avatar: data.avatar ?? null,
        bio: data.bio ?? null,
        fide_id: data.fide_id ?? null,
        aicf_id: data.aicf_id ?? null,
        state_id_classical: data.state_id_classical ?? null,
        state_id_rapid: data.state_id_rapid ?? null,
        state_id_blitz: data.state_id_blitz ?? null,
        lichess_id: data.lichess_id ?? null,
        chesscom_id: data.chesscom_id ?? null,
      };

      setProfile(normalized);
      return normalized;
    } catch (err) {
      console.error("Failed to update student_list:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) return null;

  // Build a user object expected by ProfileImage/ProfileEditForm
  const userForUI = {
    id: profile.id,
    Student_name: profile.Student_name,
    email: profile.email,
    mobile: profile.mobile,
    location: profile.location,
    bio: profile.bio,
    course: profile.course,
    level: profile.level,
    fide_id: profile.fide_id,
    aicf_id: profile.aicf_id,
    state_id_classical: profile.state_id_classical,
    state_id_rapid: profile.state_id_rapid,
    state_id_blitz: profile.state_id_blitz,
    lichess_id: profile.lichess_id,
    chesscom_id: profile.chesscom_id,
    profile: { avatar: profile.avatar },
    initials:
      (profile.Student_name && profile.Student_name.split(" ").map((s) => s[0]).slice(0, 2).join("")) ||
      (profile.email && profile.email[0]?.toUpperCase()) ||
      "NA",
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-6">
        <ProfileImage user={userForUI} onUpdate={async (p) => await handleProfileUpdate({ profile: p.profile })} />
        <div>
          <h1 className="text-2xl font-bold">{userForUI.Student_name}</h1>
          <p className="text-muted-foreground">{userForUI.email}</p>
          <p className="text-sm">{userForUI.mobile || "No contact number"}</p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <ProfileEditForm
        user={{
          Student_name: profile.Student_name,
          email: profile.email,
          mobile: profile.mobile,
          location: profile.location,
          bio: profile.bio,
          fide_id: profile.fide_id,
          aicf_id: profile.aicf_id,
          state_id_classical: profile.state_id_classical,
          state_id_rapid: profile.state_id_rapid,
          state_id_blitz: profile.state_id_blitz,
          lichess_id: profile.lichess_id,
          chesscom_id: profile.chesscom_id,
        }}
        onSubmit={async (formData) => {
          return handleProfileUpdate(formData);
        }}
      />
    </div>
  );
}