/**
 * Sanitizes HTML content for rich text email bodies.
 * Removes script tags, style blocks, iframes, malicious protocols (e.g., javascript:),
 * and event handlers (e.g., onclick, onerror) while preserving formatting tags.
 *
 * @param {string} html - Raw HTML from composer
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== "string") return "";

  let sanitized = html;

  // 1. Remove script tags and their content
  sanitized = sanitized.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");

  // 2. Remove other risky tags (iframe, object, embed, applet, head, meta, link, style)
  sanitized = sanitized.replace(
    /<(iframe|object|embed|applet|meta|link|style)[^>]*>([\s\S]*?)<\/\1>/gi,
    "",
  );
  sanitized = sanitized.replace(
    /<(iframe|object|embed|applet|meta|link|style)[^>]*>/gi,
    "",
  );

  // 3. Remove javascript: or data: protocols in href attributes
  sanitized = sanitized.replace(
    /href\s*=\s*["']\s*(javascript|data):[^"']*["']/gi,
    'href="#"',
  );

  // 4. Remove event handlers (any attribute starting with 'on')
  sanitized = sanitized.replace(
    /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
    "",
  );

  return sanitized;
};
