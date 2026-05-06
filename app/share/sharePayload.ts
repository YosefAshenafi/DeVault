import type { SharePayload } from '../types/resource';

const URL_RE = /(https?:\/\/[^\s]+)/i;

function firstUrl(text: string): string | null {
  const m = text.match(URL_RE);
  return m?.[1]?.replace(/[),.;]+$/, '') ?? null;
}

function titleFromText(text: string, url: string | null): string {
  const withoutUrl = url ? text.replace(url, ' ').trim() : text.trim();
  const line = withoutUrl.split(/\r?\n/)[0]?.trim() ?? '';
  if (line.length > 0 && line.length <= 200) return line;
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return 'Shared link';
    }
  }
  return 'New resource';
}

/**
 * Normalize Android/iOS share text into URL + title guess.
 */
export function parseShareText(text: string | undefined | null): SharePayload | null {
  if (!text?.trim()) return null;
  const raw = text.trim();
  const url = firstUrl(raw);
  if (!url) return null;
  return {
    url,
    titleGuess: titleFromText(raw, url),
    rawText: raw,
  };
}

/**
 * Deep link: devault://add?url=...&title=...
 */
export function parseShareDeepLink(linkUrl: string): SharePayload | null {
  try {
    const u = new URL(linkUrl);
    if (u.protocol !== 'devault:') return null;
    const urlParam = u.searchParams.get('url');
    if (!urlParam) return null;
    const decoded = decodeURIComponent(urlParam);
    const titleParam = u.searchParams.get('title');
    return {
      url: decoded,
      titleGuess: titleParam ? decodeURIComponent(titleParam) : titleFromText(decoded, decoded),
    };
  } catch {
    return null;
  }
}
