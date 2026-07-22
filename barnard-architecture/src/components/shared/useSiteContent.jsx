import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Returns a map of key -> content record, plus isLoading
export function useSiteContent() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => base44.entities.SiteContent.list(),
  });

  const map = {};
  data.forEach(item => { map[item.key] = item; });
  return { ...map, _isLoading: isLoading };
}