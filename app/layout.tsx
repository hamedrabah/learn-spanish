import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spanish Duel - Learn Spanish with Sword Fighting',
  description: 'Practice Spanish through a Monkey Island-inspired insult sword fighting game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pirata+One&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 