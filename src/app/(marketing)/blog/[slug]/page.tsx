'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const blogContent = {
  'qr-codes-im-restaurant': {
    title: 'QR-Codes im Restaurant: Die digitale Revolution der Speisekarte',
    date: '2024-01-15',
    readTime: '5 Min',
    category: 'Gastronomie',
    content: `
      <p>Die Gastronomie hat sich in den letzten Jahren stark digitalisiert, und QR-Codes spielen dabei eine zentrale Rolle. Von kontaktlosen Speisekarten bis hin zu digitalen Zahlungssystemen – QR-Codes revolutionieren die Art und Weise, wie Restaurants mit ihren Gästen interagieren.</p>
      
      <h2>Vorteile für Restaurants</h2>
      <ul>
        <li>Kostenersparnis durch digitale Speisekarten</li>
        <li>Einfache Aktualisierung von Preisen und Angeboten</li>
        <li>Hygienische, kontaktlose Lösung</li>
        <li>Mehrsprachige Menüs ohne zusätzliche Druckkosten</li>
      </ul>
      
      <h2>Vorteile für Gäste</h2>
      <ul>
        <li>Schneller Zugriff auf aktuelle Informationen</li>
        <li>Detaillierte Produktbeschreibungen und Allergeninformationen</li>
        <li>Einfache Bestellung und Bezahlung</li>
        <li>Personalisierte Empfehlungen</li>
      </ul>
      
      <p>Die Implementierung von QR-Codes in Ihrem Restaurant ist einfacher als Sie denken. Mit QR Master können Sie in wenigen Minuten professionelle QR-Codes erstellen, die perfekt zu Ihrem Branding passen.</p>
    `,
  },
  'dynamische-vs-statische-qr-codes': {
    title: 'Dynamische vs. Statische QR-Codes: Was ist der Unterschied?',
    date: '2024-01-10',
    readTime: '3 Min',
    category: 'Grundlagen',
    content: `
      <p>Bei der Erstellung von QR-Codes stehen Sie vor der Wahl zwischen statischen und dynamischen Codes. Beide haben ihre Vor- und Nachteile, und die richtige Wahl hängt von Ihrem spezifischen Anwendungsfall ab.</p>
      
      <h2>Statische QR-Codes</h2>
      <p>Statische QR-Codes enthalten die Informationen direkt im Code selbst. Einmal erstellt, können sie nicht mehr geändert werden.</p>
      <ul>
        <li>Kostenlos und unbegrenzt nutzbar</li>
        <li>Funktionieren für immer ohne Server</li>
        <li>Ideal für permanente Informationen</li>
        <li>Keine Tracking-Möglichkeiten</li>
      </ul>
      
      <h2>Dynamische QR-Codes</h2>
      <p>Dynamische QR-Codes verweisen auf eine URL, die Sie jederzeit ändern können.</p>
      <ul>
        <li>Inhalt kann nachträglich geändert werden</li>
        <li>Detaillierte Scan-Statistiken</li>
        <li>Kürzere, sauberere QR-Codes</li>
        <li>Perfekt für Marketing-Kampagnen</li>
      </ul>
      
      <p>Mit QR Master können Sie beide Arten von QR-Codes erstellen und verwalten. Unsere Plattform bietet Ihnen die Flexibilität, die Sie für Ihre Projekte benötigen.</p>
    `,
  },
  'qr-code-marketing-strategien': {
    title: 'QR-Code Marketing-Strategien für 2024',
    date: '2024-01-05',
    readTime: '7 Min',
    category: 'Marketing',
    content: `
      <p>QR-Codes sind zu einem unverzichtbaren Werkzeug im modernen Marketing geworden. Hier sind die effektivsten Strategien für 2024.</p>
      
      <h2>1. Personalisierte Kundenerlebnisse</h2>
      <p>Nutzen Sie dynamische QR-Codes, um personalisierte Landingpages basierend auf Standort, Zeit oder Kundenverhalten zu erstellen.</p>
      
      <h2>2. Social Media Integration</h2>
      <p>Verbinden Sie QR-Codes mit Ihren Social-Media-Kampagnen für nahtlose Cross-Channel-Erlebnisse.</p>
      
      <h2>3. Event-Marketing</h2>
      <p>Von Tickets bis zu Networking – QR-Codes machen Events interaktiver und messbar.</p>
      
      <h2>4. Loyalty-Programme</h2>
      <p>Digitale Treuekarten und Rabattaktionen lassen sich perfekt mit QR-Codes umsetzen.</p>
      
      <h2>5. Analytics und Optimierung</h2>
      <p>Nutzen Sie die Tracking-Funktionen, um Ihre Kampagnen kontinuierlich zu verbessern.</p>
      
      <p>Mit QR Master haben Sie alle Tools, die Sie für erfolgreiches QR-Code-Marketing benötigen. Starten Sie noch heute mit Ihrer ersten Kampagne!</p>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogContent[slug as keyof typeof blogContent];

  if (!post) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-xl text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="info">{post.category}</Badge>
                <span className="text-gray-500">{post.readTime}</span>
                <span className="text-gray-500">{post.date}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
            </header>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 p-8 bg-primary-50 rounded-xl text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to create your QR codes?
              </h2>
              <p className="text-gray-600 mb-6">
                Start creating professional QR codes with advanced tracking and analytics.
              </p>
              <Link href="/dashboard">
                <Button size="lg">Get Started Free</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}