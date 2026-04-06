import type { APIRoute } from 'astro';

const LOOPS_ENDPOINT =
  'https://app.loops.so/api/newsletter-form/b1654a6d00fcb7643d72323b4ad15232';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const email = body.email?.trim();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email is required.' }),
        { status: 400, headers },
      );
    }

    const formBody = `email=${encodeURIComponent(email)}&source=ravoid.com`;

    const res = await fetch(LOOPS_ENDPOINT, {
      method: 'POST',
      body: formBody,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (res.status === 429) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many signups. Please try again in a moment.',
        }),
        { status: 429, headers },
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: data.success ? 200 : 400,
      headers,
    });
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong. Please try again.',
      }),
      { status: 500, headers },
    );
  }
};
