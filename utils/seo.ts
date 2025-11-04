import type { Metadata } from 'next';

import { siteConfig } from '@/config/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  icons?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  icons,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
}: SEOProps): Metadata {
  // Convert keywords array to comma-separated string if it exists
  const keywordsString = keywords ? keywords.join(', ') : undefined;
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

  return {
    title: metaTitle,
    description: metaDescription,
    icons: icons || siteConfig.icons,
    applicationName: siteConfig.name,
    authors: author ? [{ name: author }] : [{ name: siteConfig.name }],
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      type: type,
      locale: 'vi_VN',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@laminvietnam',
      site: '@laminvietnam',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Add keywords to the other property as per Next.js Metadata API
    ...(keywordsString && {
      other: {
        keywords: keywordsString,
      },
    }),
  };
}
