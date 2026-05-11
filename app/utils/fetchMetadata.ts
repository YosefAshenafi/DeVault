export type PageMetadata = {
  title?: string;
  thumbnailUrl?: string;
  description?: string;
  siteName?: string;
  favicon?: string;
};

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractYoutubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] ?? null;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const m = u.pathname.match(/\/shorts\/([^/]+)/);
      if (m?.[1]) return m[1];
    }
  } catch {
    return null;
  }
  return null;
}

function youtubeThumb(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function matchMetaName(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`,
    'i',
  );
  const m = html.match(re);
  if (m?.[1]) return decodeHtmlEntities(m[1]);
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["'][^>]*>`,
    'i',
  );
  const m2 = html.match(re2);
  return m2?.[1] ? decodeHtmlEntities(m2[1]) : null;
}

function matchFavicon(html: string, baseUrl: string): string | null {
  const re = /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["'][^>]*>/i;
  const re2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["'][^>]*>/i;
  const href = html.match(re)?.[1] ?? html.match(re2)?.[1];
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function matchMeta(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["'][^>]*>`,
    'i',
  );
  const m = html.match(re);
  if (m?.[1]) return decodeHtmlEntities(m[1]);
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${prop}["'][^>]*>`,
    'i',
  );
  const m2 = html.match(re2);
  return m2?.[1] ? decodeHtmlEntities(m2[1]) : null;
}

function matchTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m?.[1]) return null;
  return decodeHtmlEntities(stripTags(m[1]));
}

/**
 * Best-effort Open Graph / title fetch. Fails soft on network or parse errors.
 */
export async function fetchPageMetadata(url: string, timeoutMs = 12_000): Promise<PageMetadata> {
  const yt = youtubeThumb(url);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'DeVault/1.0 (+https://devault.app)',
      },
    });
    if (!res.ok) {
      return yt ? { thumbnailUrl: yt } : {};
    }
    const html = await res.text();
    const ogTitle = matchMeta(html, 'og:title');
    const ogImage = matchMeta(html, 'og:image');
    const ogDescription = matchMeta(html, 'og:description');
    const ogSiteName = matchMeta(html, 'og:site_name');
    const metaDescription = matchMetaName(html, 'description');
    const docTitle = matchTitle(html);
    const title = (ogTitle ?? docTitle)?.trim();
    const thumbnailUrl = ogImage?.trim() || yt || undefined;
    const description = (ogDescription ?? metaDescription)?.trim() || undefined;
    const siteName = ogSiteName?.trim() || undefined;
    const favicon = matchFavicon(html, url) || undefined;
    return {
      ...(title ? { title } : {}),
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      ...(description ? { description } : {}),
      ...(siteName ? { siteName } : {}),
      ...(favicon ? { favicon } : {}),
    };
  } catch {
    return yt ? { thumbnailUrl: yt } : {};
  } finally {
    clearTimeout(t);
  }
}
