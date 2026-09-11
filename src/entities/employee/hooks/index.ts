import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type SortMode } from '../types';

type FilterUpdates = Partial<{
  query: string;
  position: string;
  sort: SortMode;
}>;

export function useEmployeeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get('sortBy');

  const updateFilters = useCallback(
    (updates: FilterUpdates) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);

          if ('query' in updates) {
            if (updates.query) nextParams.set('searchText', updates.query);
            else nextParams.delete('searchText');
          }

          if ('position' in updates) {
            if (updates.position && updates.position !== 'All') {
              nextParams.set('position', updates.position.toLowerCase());
            } else {
              nextParams.delete('position');
            }
          }

          if ('sort' in updates) {
            if (updates.sort === 'alphabet')
              nextParams.set('sortBy', 'alphabet');
            else if (updates.sort === 'birthday')
              nextParams.set('sortBy', 'birthDate');
            else nextParams.delete('sortBy');
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    query: searchParams.get('searchText') ?? '',
    position: searchParams.get('position')?.toUpperCase() ?? 'All',
    sort: (sortParam === 'alphabet'
      ? 'alphabet'
      : sortParam === 'birthDate'
        ? 'birthday'
        : 'createdDate') as SortMode,
    updateFilters,
  };
}
