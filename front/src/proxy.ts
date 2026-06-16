import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export const proxy = (request: NextRequest) => {

  return createMiddleware(routing)(request);
};

export const config = {
  matcher: '/((?!_next|favicon\\.ico|api/|.*\\.[a-zA-Z0-9]+$).*)',
};
