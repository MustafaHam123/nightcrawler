// Copyright © Todd Agriscience, Inc. All rights reserved.

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import posthog from 'posthog-js';
import { PostHogProvider } from './providers';

vi.mock('posthog-js', () => ({ default: { init: vi.fn() } }));
vi.mock('@posthog/react', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('PostHogProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', undefined);
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', undefined);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it.each([undefined, '', '   '])(
    'renders the application without initializing analytics for key %j',
    (key) => {
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', key);

      render(
        <PostHogProvider>
          <main>Application content</main>
        </PostHogProvider>
      );

      expect(screen.getByRole('main')).toHaveTextContent('Application content');
      expect(posthog.init).not.toHaveBeenCalled();
    }
  );

  it('initializes configured analytics with the existing cookieless settings', () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');

    render(<PostHogProvider>Application content</PostHogProvider>);

    expect(posthog.init).toHaveBeenCalledExactlyOnceWith('phc_test_key', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'always',
      defaults: '2025-05-24',
      cookieless_mode: 'always',
    });
  });

  it('uses the configured analytics host', () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://analytics.example.com');

    render(<PostHogProvider>Application content</PostHogProvider>);

    expect(posthog.init).toHaveBeenCalledExactlyOnceWith(
      'phc_test_key',
      expect.objectContaining({ api_host: 'https://analytics.example.com' })
    );
  });
});
