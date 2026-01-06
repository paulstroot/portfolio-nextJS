import { NextResponse } from "next/server";

/**
 * Middleware to add security headers
 *
 * Note: This middleware will only work if you're NOT using static export (output: "export").
 * If you're using static export, configure these headers at your hosting provider level.
 *
 * For Vercel: Add headers in vercel.json
 * For Netlify: Add headers in _headers file or netlify.toml
 * For other providers: Check their documentation for setting security headers
 */
export function middleware() {
  const response = NextResponse.next();

  // Content Security Policy
  // Adjust based on your needs - you may need to relax some policies for Flowbite/theme switching
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // 'unsafe-eval' for Next.js dev, 'unsafe-inline' for Flowbite theme script
    "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' for Tailwind CSS and Flowbite
    "img-src 'self' data: https://images.ctfassets.net", // Contentful images
    "font-src 'self' data:",
    "connect-src 'self' https://api.smtp2go.com", // SMTP2GO API for contact form
    "frame-ancestors 'none'",
  ].join("; ");

  // Set security headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
