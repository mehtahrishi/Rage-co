'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const COOKIE_CONSENT_KEY = 'rage_cookie_consent';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given.
    // This runs only on the client-side.
    if (localStorage.getItem(COOKIE_CONSENT_KEY) !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in local storage
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 z-50"
        >
          <Card className="w-[350px] shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                <span>Cookie Consent</span>
              </CardTitle>
              <CardDescription>
                We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="link" asChild className="p-0">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </Button>
              <Button onClick={handleAccept}>Accept</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
