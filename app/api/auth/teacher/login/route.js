export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();

  // Example only (normally NextAuth handles auth)
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
}


