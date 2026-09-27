import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/ui/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PRAGATI — AI-Assisted Scholarship & Fellowship Management System',
  description: 'Common Workflow Infrastructure & Configurable Scheme Architecture for Scheduled Tribes Scholarships (Ministry of Tribal Affairs / SIH26239).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
