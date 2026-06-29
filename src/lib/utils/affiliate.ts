// Affiliate link helpers — enforces the non-negotiable Amazon Associates rules
// from homestem-code-spec.md §6. Tracking ID is fixed per the project.
export const AMAZON_TAG = "homeandstem-20";

// rel value required on every affiliate link.
export const AFFILIATE_REL = "nofollow noopener sponsored";

// Append the Associates tracking tag to an Amazon URL. Idempotent: if a tag is
// already present it is replaced with ours. Non-Amazon URLs are returned as-is.
export function withAffiliateTag(url: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!/(^|\.)amazon\./i.test(u.hostname)) return url;
    u.searchParams.set("tag", AMAZON_TAG);
    return u.toString();
  } catch {
    // Not an absolute URL — fall back to a simple query append.
    const [base, hash = ""] = url.split("#");
    const sep = base.includes("?") ? "&" : "?";
    const tagged = /[?&]tag=/.test(base)
      ? base.replace(/([?&]tag=)[^&]*/, `$1${AMAZON_TAG}`)
      : `${base}${sep}tag=${AMAZON_TAG}`;
    return hash ? `${tagged}#${hash}` : tagged;
  }
}
