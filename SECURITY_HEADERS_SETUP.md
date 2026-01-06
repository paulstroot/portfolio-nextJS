# Security Headers Setup Guide

This document explains how the Content Security Policy (CSP) and other security headers have been configured for this application.

## Files Created

1. **`next.config.ts`** - Headers configuration (works when NOT using static export)
2. **`src/middleware.ts`** - Middleware for applying headers (works when NOT using static export)
3. **`public/_headers`** - Netlify headers file (for static export on Netlify)
4. **`vercel.json`** - Vercel headers configuration (for static export on Vercel)

## Current Configuration

Your app uses `output: "export"` which creates a static site. With static exports:

- ❌ Headers in `next.config.ts` won't be applied automatically
- ❌ Middleware (`middleware.ts`) won't run
- ✅ You need to configure headers at your hosting provider level

## Hosting Provider Setup

### Option 1: Vercel (Recommended)

If deploying to Vercel, the `vercel.json` file has been created with the security headers. Vercel will automatically apply these headers to all routes.

**No additional action needed** - just deploy!

### Option 2: Netlify

If deploying to Netlify, the `public/_headers` file has been created. Netlify will automatically read this file and apply the headers.

**No additional action needed** - just deploy!

### Option 3: Other Hosting Providers

For other hosting providers (AWS S3 + CloudFront, GitHub Pages, etc.), you'll need to:

1. Check their documentation for setting HTTP headers
2. Configure the same headers manually in their dashboard/config files
3. Use the CSP policy from `vercel.json` or `public/_headers` as a reference

## Content Security Policy Details

The CSP has been configured to allow:

- ✅ **Scripts**: Self-hosted scripts, inline scripts (for Flowbite theme), and `unsafe-eval` (needed for Next.js development/Turbopack)
- ✅ **Styles**: Self-hosted styles and inline styles (needed for Tailwind CSS and Flowbite)
- ✅ **Images**: Self-hosted images, data URIs, and Contentful CDN (`images.ctfassets.net`)
- ✅ **Fonts**: Self-hosted fonts and data URIs
- ✅ **Connections**: Self-hosted API routes and SMTP2GO API (`api.smtp2go.com`)
- ✅ **Frames**: No embedding (`frame-ancestors 'none'`)

## Tightening CSP (Optional)

If you want to tighten the CSP further (remove `unsafe-inline` and `unsafe-eval`):

1. **For production**: Remove `'unsafe-eval'` from `script-src` (only needed for dev)
2. **Use nonces**: Implement nonces for inline scripts/styles (requires server-side rendering)
3. **Remove unsafe-inline**: Use nonces or hashes for inline content

However, this requires significant refactoring and may break Flowbite theme switching functionality.

## Testing

After deployment, verify headers are applied:

```bash
# Check headers
curl -I https://your-domain.com

# Or use browser DevTools:
# Network tab > Select any request > Headers > Response Headers
```

You should see:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## If You Switch Away from Static Export

If you remove `output: "export"` from `next.config.ts`:

1. The headers in `next.config.ts` will work automatically
2. OR you can use `middleware.ts` (which provides more flexibility)
3. Remove the hosting-specific config files (`vercel.json`, `public/_headers`) if not needed

## Troubleshooting

### CSP blocking legitimate resources

If you see CSP violations in the browser console:

1. Check which resource is being blocked
2. Add the necessary source to the appropriate CSP directive
3. Update all header configuration files

### Flowbite theme not working

The theme switching script may need `'unsafe-inline'` in `script-src`. This is already included in the current configuration.

### Images not loading

Ensure `https://images.ctfassets.net` is in the `img-src` directive (already included).

## Additional Security Recommendations

1. **Regularly review CSP**: Use browser DevTools to monitor CSP violations
2. **Use CSP reporting**: Configure `report-uri` or `report-to` to receive violation reports
3. **Keep dependencies updated**: Regularly update Next.js, React, and other dependencies
4. **Monitor Contentful**: Ensure Contentful CMS access is properly secured

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js: Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Next.js: Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [OWASP: Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

