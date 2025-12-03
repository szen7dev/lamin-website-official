import { siteConfig } from '@/config/siteConfig';

// Organization Schema
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/Lamin_Logo_Colored.png`,
    description: siteConfig.description,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '1800646970',
      email: 'contact.laminpharma@gmail.com',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese'],
    },
    sameAs: [
      siteConfig.links.facebook,
      siteConfig.links.instagram,
      siteConfig.links.twitter,
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
      addressLocality: 'Hải Âu 2.17, Vinhome Ocean Park, Xã Kiêu Kỵ, Huyện Gia Lâm, Thành phố Hà Nội',
    },
  };
}

// Website Schema
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Product Schema
interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  brand?: string;
  sku?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: {
    value: number;
    count: number;
  };
}

export function getProductSchema({
  name,
  description,
  image,
  price,
  currency = 'VND',
  brand = siteConfig.name,
  sku,
  availability = 'InStock',
  rating,
}: ProductSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
    },
  };

  if (sku) {
    schema.sku = sku;
  }

  if (rating && rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
    };
  }

  return schema;
}

// Article/Blog Schema
interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export function getArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = siteConfig.name,
  url,
}: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/Lamin_Logo_Colored.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Local Business Schema (for physical stores)
interface LocalBusinessSchemaProps {
  name: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  phone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
}

export function getLocalBusinessSchema({
  name,
  address,
  phone,
  coordinates,
  openingHours,
}: LocalBusinessSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: 'VN',
    },
    url: siteConfig.url,
  };

  if (phone) {
    schema.telephone = phone;
  }

  if (coordinates) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };
  }

  if (openingHours && openingHours.length > 0) {
    schema.openingHoursSpecification = openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours,
    }));
  }

  return schema;
}
