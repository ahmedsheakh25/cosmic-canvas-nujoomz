/**
 * Domain-based routing utilities for subdomain support
 */

export interface DomainRouteConfig {
  hostname: string;
  defaultRoute: string;
  allowedRoutes?: string[];
}

const DOMAIN_ROUTES: DomainRouteConfig[] = [
  {
    hostname: 'orbit.ofspace.com',
    defaultRoute: '/admin',
    allowedRoutes: ['/admin']
  },
  {
    hostname: 'nujmooz.ofspace.studio',
    defaultRoute: '/',
    allowedRoutes: ['/', '/mobile-nujmooz']
  },
  {
    hostname: 'www.ofspace.studio',
    defaultRoute: '/landing',
    allowedRoutes: ['/landing', '/', '/admin', '/mobile-nujmooz', '/knowledge-base']
  },
  {
    hostname: 'ofspace.studio',
    defaultRoute: '/landing',
    allowedRoutes: ['/landing', '/', '/admin', '/mobile-nujmooz', '/knowledge-base']
  }
];

export const getDomainRouteConfig = (hostname?: string): DomainRouteConfig | null => {
  if (!hostname) {
    // Default for development
    return {
      hostname: 'localhost',
      defaultRoute: '/',
      allowedRoutes: ['/landing', '/', '/admin', '/mobile-nujmooz', '/knowledge-base']
    };
  }

  return DOMAIN_ROUTES.find(config => config.hostname === hostname) || null;
};

export const getDefaultRouteForDomain = (hostname?: string): string => {
  const config = getDomainRouteConfig(hostname);
  return config?.defaultRoute || '/';
};

export const isRouteAllowedForDomain = (hostname: string, route: string): boolean => {
  const config = getDomainRouteConfig(hostname);
  if (!config) return true; // Allow all routes for unknown domains
  
  return !config.allowedRoutes || config.allowedRoutes.includes(route);
};

export const getCurrentHostname = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname;
};

export const shouldRedirectToDomainDefault = (hostname: string, currentPath: string): boolean => {
  const config = getDomainRouteConfig(hostname);
  if (!config) return false;
  
  // If current path is not allowed for this domain, redirect to default
  if (config.allowedRoutes && !config.allowedRoutes.includes(currentPath)) {
    return true;
  }
  
  return false;
};