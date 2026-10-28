// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect } from 'react';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from '@posthog/react';

/** Provides analytics when a PostHog key is configured. */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (!key?.trim()) {
      return;
    }

    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'always',
      defaults: '2025-05-24',
      cookieless_mode: 'always',
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
