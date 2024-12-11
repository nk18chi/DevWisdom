// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// sentry.client.config.js
Sentry.init({
  dsn: 'https://76d28740317794fba52e02e4e610bb46@o4507949443186688.ingest.us.sentry.io/4508446867128320',

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration(), Sentry.browserTracingIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  tracePropagationTargets: ['localhost', /^\//],
});
