import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { slugify } from "@/lib/slugify";

const SERVICE_RENAMES: Record<string, string> = { batterijopslag: "thuisbatterij", renovaties: "verduurzaming" };
const serviceSlug = (s: string) => SERVICE_RENAMES[s] ?? slugify(s);

function redirect(request: NextRequest, pathname: string, search: Record<string, string | null> = {}) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  for (const [k, v] of Object.entries(search)) if (v) url.searchParams.set(k, v);
  return NextResponse.redirect(url, 308);
}

/** Old URLs from the static-export site, all permanently redirected. */
function legacyRedirect(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const bare = en ? pathname.slice(3) || "/" : pathname;
  const prefix = en ? "/en" : "";

  // ?lang=en on any page → /en/...
  if (searchParams.get("lang") === "en" && !en) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url, 308);
  }
  if (searchParams.has("lang")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    return NextResponse.redirect(url, 308);
  }

  // /product?name=X → /aanbod/<slug> (the product page resolves renamed products)
  if (bare === "/product" || bare === "/product/") {
    const name = searchParams.get("name");
    return redirect(request, name ? `${prefix}/aanbod/${slugify(name)}` : `${prefix}/aanbod`);
  }

  // /aanbod?dienst=X → the service page
  if ((bare === "/aanbod" || bare === "/aanbod/") && searchParams.get("dienst")) {
    return redirect(request, `${prefix}/diensten/${serviceSlug(searchParams.get("dienst")!)}`);
  }

  // /contact?service=X&product=Y → the quote wizard, prefilled
  if ((bare === "/contact" || bare === "/contact/") && (searchParams.get("service") || searchParams.get("product"))) {
    const service = searchParams.get("service");
    const product = searchParams.get("product");
    return redirect(request, `${prefix}/offerte`, {
      dienst: service ? serviceSlug(service) : null,
      product: product ? slugify(product) : null,
      variant: searchParams.get("size"),
    });
  }
  return null;
}

/** Keep the Supabase session fresh for the admin and send signed-out visitors to the login page. */
async function adminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  const isPublicAdminPage = request.nextUrl.pathname.startsWith("/admin/login") || request.nextUrl.pathname.startsWith("/admin/auth");
  if (!data?.claims && !isPublicAdminPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    if (request.nextUrl.pathname !== "/admin") url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) return adminSession(request);

  const legacy = legacyRedirect(request);
  if (legacy) return legacy;

  // /nl/... is never public: Dutch lives at the root.
  if (pathname === "/nl" || pathname.startsWith("/nl/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  // Dutch: serve /x from the [lang]=nl route.
  const url = request.nextUrl.clone();
  url.pathname = `/nl${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|brand/|images/|favicon|icon|apple-icon|manifest|robots.txt|sitemap.xml|opengraph-image|.*\\.[a-zA-Z0-9]{2,5}$).*)"],
};
