# Progressive Web App

Contains a [Next.js](https://nextjs.org/) project bootstrapped with [pnpm](https://pnpm.io/) and [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The `admin` page contains an API Platform Admin project (refer to its [documentation](https://api-platform.com/docs/admin)).

You can also generate your web app here by using the API Platform Client Generator (refer to its [documentation](https://api-platform.com/docs/client-generator/nextjs/)).

## Configuration

Set `NEXT_PUBLIC_API_ENTRYPOINT` to point the PWA to the correct API URL. When this variable is not provided, the admin UI automatically targets `${window.location.origin}/api`. The value may include or omit trailing slashes; the `/api` prefix is ensured automatically.

## Saudi routes demo

The `/trips` page provides a demo flow that lists transport stations across major Saudi cities and generates bidirectional routes. For QA:

1. Open `/trips` and choose **Riyadh** as the origin and **Jeddah** as the destination from the dropdowns.
2. Pick any listed trip to reveal the booking summary on the right-hand panel.
3. Confirm the displayed operator, stations, timing, and fare to validate the final-step experience.
