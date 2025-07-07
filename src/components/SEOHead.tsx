import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Заплањске приче - Блог о традицији и култури Заплањског краја',
  description = 'Блог посвећен чувању и преношењу традиције, културе и прича Заплањског краја. Место где се сусрећу прошлост и садашњост кроз речи наших писаца.',
  image = `${window.location.origin}/ZAPLANJE_1.jpg`,
  url = window.location.href,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = ['Заплање', 'традиција', 'култура', 'Србија', 'наслеђе', 'приче'],
  structuredData
}) => {
  const siteName = 'Заплањске приче';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : "WebSite",
    "name": title,
    "headline": title,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": image,
      "width": 1200,
      "height": 630
    },
    "url": url,
    "inLanguage": "sr-RS",
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "description": "Блог посвећен чувању и преношењу традиције, културе и прича Заплањског краја",
      "url": window.location.origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/favicon.svg`,
        "width": 60,
        "height": 60
      },
      "sameAs": [
        "https://www.facebook.com/zaplanjskeprice",
        "https://www.instagram.com/zaplanjskeprice"
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/posts?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    ...(type === 'article' && {
      "author": {
        "@type": "Person",
        "name": author || siteName
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "keywords": tags.join(', '),
      "articleSection": "Култура и традиција",
      "about": {
        "@type": "Thing",
        "name": "Заплање",
        "description": "Регион у југоисточној Србији познат по богатој традицији и култури"
      }
    })
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags.join(', ')} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Serbian" />
      <meta name="geo.region" content="RS" />
      <meta name="geo.placename" content="Заплање, Србија" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Заплање - традиција и култура српског краја" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="sr_RS" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Facebook specific */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@zaplanjskeprice" />
      <meta name="twitter:creator" content="@zaplanjskeprice" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Заплање - традиција и култура српског краја" />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && (
        <meta property="article:section" content="Култура и традиција" />
      )}
      {type === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#e26d2d" />
      <meta name="msapplication-TileColor" content="#e26d2d" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="sr" href={url} />
      <link rel="alternate" hrefLang="sr-RS" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.pexels.com" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Additional structured data for local business */}
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "name": "Заплање",
            "description": "Регион у југоисточној Србији познат по богатој традицији, култури и природним лепотама",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "42.9",
              "longitude": "22.0"
            },
            "containedInPlace": {
              "@type": "Country",
              "name": "Србија"
            },
            "image": image,
            "url": url
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;