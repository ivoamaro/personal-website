import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get("password");

  if (password === import.meta.env.SITE_PASSWORD) {
    cookies.set("auth", "true", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
    });

    return redirect("/");
  }

  return redirect("/?authError=1");
};
