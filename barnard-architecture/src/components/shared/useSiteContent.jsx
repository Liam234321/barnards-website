import siteContent from '@/data/site-content.json';

// Returns a map of key -> content record
export function useSiteContent() {
  const map = {};
  siteContent.forEach(item => { map[item.key] = item; });
  return { ...map, _isLoading: false };
}
