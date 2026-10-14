import { useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

type Props = { children: ReactNode };

export default function SearchFilter({ children }: Props) {
  const [params, setParams] = useSearchParams();
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateQuery = (value: string) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set('searchText', value);
        else next.delete('searchText');
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="filter__search-row">
      <div className="filter__input">
        <img
          className="filter__search-icon"
          src="/icons/search.svg"
          alt="Search"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter name, tag, email..."
          value={params.get('searchText') ?? ''}
          onChange={(event) => updateQuery(event.target.value)}
          onFocus={() => setSearching(true)}
        />
        {children}
      </div>
      {searching && (
        <button
          type="button"
          className="filter__cancel"
          onClick={() => {
            updateQuery('');
            setSearching(false);
            inputRef.current?.blur();
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
