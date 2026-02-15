import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ramadanfreshbox.in'), // Update with your actual domain
  title: {
    default: "Ramzan Fresh Box - Fresh Iftar Boxes Delivered in Hyderabad",
    template: "%s | Ramzan Fresh Box"
  },
  description: "Order premium Iftar boxes with fresh fruits delivered before Maghrib in Hyderabad. Support your community through donations and sponsorships. Ramadan 2026 delivery service.",
  keywords: [
    "Iftar box Hyderabad",
    "Ramadan fresh fruits",
    "Ramzan food delivery Hyderabad",
    "Iftar delivery Hyderabad",
    "Fresh fruit box Ramadan",
    "Donate Iftar Hyderabad",
    "Sponsor Iftar meals",
    "Ramadan charity Hyderabad",
    "Maghrib delivery",
    "Islamic food service Hyderabad",
    "Ramadan 2026 Hyderabad",
    "Iftar box near me",
    "Fresh fruits for Iftar",
    "Ramadan meal delivery",
    "Halal food delivery Hyderabad"
  ],
  authors: [{ name: "Ramzan Fresh Box" }],
  creator: "Ramzan Fresh Box",
  publisher: "Ramzan Fresh Box",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  themeColor: "#10b981",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ramadanfreshbox.in',
    title: 'Ramzan Fresh Box - Fresh Iftar Boxes Delivered in Hyderabad',
    description: 'Order premium Iftar boxes with fresh fruits delivered before Maghrib in Hyderabad. Support your community through donations and sponsorships during Ramadan 2026.',
    siteName: 'Ramzan Fresh Box',
    images: [
      {
        url: '/og-image.png', // Create an Open Graph image
        width: 1200,
        height: 630,
        alt: 'Ramzan Fresh Box - Premium Iftar Delivery Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ramzan Fresh Box - Fresh Iftar Boxes Delivered in Hyderabad',
    description: 'Order premium Iftar boxes with fresh fruits delivered before Maghrib. Support your community through donations and sponsorships.',
    images: ['/og-image.png'], // Same image as Open Graph
    creator: '@ramadanfreshbox', // Update with your Twitter handle
  },
  alternates: {
    canonical: 'https://ramadanfreshbox.in',
  },
  category: 'Food & Beverage',
  classification: 'Food Delivery Service',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'Ramzan Fresh Box',
    description: 'Premium Iftar boxes with fresh fruits delivered before Maghrib in Hyderabad',
    url: 'https://ramadanfreshbox.in',
    logo: 'https://ramadanfreshbox.in/logo.png',
    image: 'https://ramadanfreshbox.in/og-image.png',
    telephone: '+91-8309644110', 
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.385044,
      longitude: 78.486671,
    },
    servesCuisine: 'Halal, Fresh Fruits, Iftar Meals',
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: 'Hyderabad',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Iftar Boxes',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '4 Fruit Iftar Box',
            description: 'Choose any 4 fresh fruits',
            offers: {
              '@type': 'Offer',
              price: '199',
              priceCurrency: 'INR',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '6 Fruit Iftar Box',
            description: 'Choose any 6 fresh fruits',
            offers: {
              '@type': 'Offer',
              price: '299',
              priceCurrency: 'INR',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '8 Fruit Iftar Box',
            description: 'Choose any 8 fresh fruits',
            offers: {
              '@type': 'Offer',
              price: '399',
              priceCurrency: 'INR',
            },
          },
        },
      ],
    },
  }

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
