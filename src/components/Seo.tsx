import { Helmet } from "react-helmet-async";
import { SITE } from "@/lib/site";

type SeoProps = {
  title: string;
  description?: string;
  /** Path starting with / e.g. /codes */
  canonicalPath?: string;
  /** Absolute URL */
  image?: string;
  /** A single JSON-LD object or an array of objects */
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
};

export default function Seo({
  title,
  description,
  canonicalPath,
  image,
  jsonLd,
  noindex,
}: SeoProps) {
  const canonicalUrl = canonicalPath ? `${SITE.url}${canonicalPath}` : undefined;
  const ogImage = image || SITE.ogImage;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {/* Social */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:type" content="website" />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      {jsonLdArray.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
