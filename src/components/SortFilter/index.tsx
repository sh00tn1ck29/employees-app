import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type SortMode } from '../../entities/employee/types';
import SortModal from '../SortModal';

export default function SortFilter() {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const value = params.get('sortBy');
  const sort: SortMode =
    value === 'alphabet'
      ? 'alphabet'
      : value === 'birthDate'
        ? 'birthday'
        : 'createdDate';

  const selectSort = (selected: SortMode) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (selected === 'createdDate') next.delete('sortBy');
        else
          next.set(
            'sortBy',
            selected === 'birthday' ? 'birthDate' : 'alphabet',
          );
        return next;
      },
      { replace: true },
    );
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`filter__sort-btn${sort !== 'createdDate' ? ' filter__sort-btn--active' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Sort"
      >
        <img className="filter__sort-icon" src="/icons/list.svg" alt="" />
      </button>
      {open && (
        <SortModal
          current={sort}
          onSelect={selectSort}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
