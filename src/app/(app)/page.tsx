'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { useSession } from 'next-auth/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-24 py-16">
        {/* Notice */}
        <div className="w-full max-w-2xl mb-10 rounded-xl border border-yellow-300/40 bg-yellow-100/90 p-4 text-sm text-yellow-900 shadow-md">
          <strong>Demo Notice:</strong> Email service is not configured yet. <br />
          Use <strong>akashsharmaf15@gmail.com</strong> / <strong>123456</strong> to try the app.
        </div>

        {/* Heading */}
        <section className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Anonymous Feedback,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
              Honest Opinions
            </span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-gray-300">
            Share and receive feedback without fear. Your identity stays hidden, always.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="rounded-2xl px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button size="lg" className="rounded-2xl px-8">
                  Get Started
                </Button>
              </Link>
            )}
           
          </div>
        

        </section>
        <section className="mt-20 w-full max-w-xl">
          <h2 className="text-center text-2xl font-semibold mb-6">
            What People Are Saying
          </h2>
          <Carousel plugins={[Autoplay({ delay: 2500 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="bg-white text-black rounded-2xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                      <Mail className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-6 text-sm text-gray-400">
        © 2026 True Feedback · Built with ❤️ by Akash Sharma
      </footer>
    </div>
  );
}
