// app/api/auth/student/signup/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      mobile,
      dob,
      classType,
      course,
      level,
    } = await request.json();

    // ---------- BASIC VALIDATION ----------
    if (!name || !email || !password || !mobile || !dob || !classType || !course || !level) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    // ---------- CHECK IF EMAIL ALREADY EXISTS ----------
    const { data: existing, error: existingError } = await supabase
      .from('student_list')
      .select('id')
      .eq('email', trimmedEmail)
      .limit(1);

    if (existingError) {
      console.error('Supabase existing check error:', existingError);
      return NextResponse.json(
        { message: 'Error checking existing student' },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // ---------- GENERATE REG_NO (required, NOT NULL) ----------
    // Simple example: current timestamp in ms
    const regNo = Date.now(); // fits in BIGINT

    // ---------- INSERT NEW STUDENT ----------
    const { data, error } = await supabase
      .from('student_list')
      .insert([
        {
          reg_no: regNo,
          name: name.trim(),
          dob,                         // "YYYY-MM-DD" string is fine for date
          email: trimmedEmail,
          phone: mobile.trim(),
          class_type: classType,       // matches column name
          course,
          level,
          password,                    // plain text as you wanted
          status: 'active',
          fees: null,                  // or 0 if you prefer
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { message: 'Failed to create account' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        student: data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Student signup error:', err);
    return NextResponse.json(
      { message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
