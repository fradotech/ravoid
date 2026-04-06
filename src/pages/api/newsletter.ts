import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type");
  let email: string | null = null;

  if (contentType?.includes("application/json")) {
    const body = await request.json();
    email = body.email?.trim();
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const body = await request.text();
    const params = new URLSearchParams(body);
    email = params.get("email")?.trim() || null;
  } else {
    const data = await request.formData();
    email = (data.get("email") as string)?.trim();
  }

  if (!email) {
    return new Response(JSON.stringify({ message: "Email required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer b1654a6d00fcb7643d72323b4ad15232`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source: "ravoid.com" }),
  });

  const loopsData = await res.json();
  
  if (res.ok) {
    return new Response(JSON.stringify({ success: true, message: "Successfully subscribed!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: false, message: loopsData.message || "Failed, please try again." }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
