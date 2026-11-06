// Full-page navigation, kept in its own module so tests can mock it
// (jsdom doesn't allow replacing window.location)
export const redirectTo = (url: string) => window.location.assign(url);
