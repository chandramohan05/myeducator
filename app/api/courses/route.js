import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false }
});

export async function GET() {
  try {
    // fetch from CORRECT Supabase table: public.course
    const { data, error } = await supabase
      .from('course')
      .select('id, title, description, level, price, status, coach_name');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      courses: data
    });

  } catch (err) {
    console.error('courses list error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
