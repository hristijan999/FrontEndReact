// src/hooks/useMerch.js
import { useQuery } from '@tanstack/react-query';
import { fetchAll } from '../api/Eshop.ts';

export function useFetchAll(page = 0, size = 6) {
    return useQuery({
        queryKey: ['merch', 'all', page, size],
        queryFn: () => fetchAll(page, size).then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });
}
