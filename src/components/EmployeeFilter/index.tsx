import { useRef, useState } from 'react';
import { useEmployeeFilters } from '../../entities/employee/hooks';
import { type SortMode } from '../../entities/employee/types';
import { formatPosition } from '../../utils';
import SortModal from '../SortModal';
import './index.scss';

const listIcon = '/icons/list.svg';
const searchIcon = '/icons/search.svg';
const positions = [
  'All',
  'DESIGNER',
  'ANALYST',
  'MANAGER',
  'DEVELOPER',
  'RECRUITER',
];

export default function EmployeeFilter() {
  const { query, position, sort, updateFilters } = useEmployeeFilters();
  const [searching, setSearching] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    updateFilters({ query: '' });
    setSearching(false);
    inputRef.current?.blur();
  };

  const handleSort = (value: SortMode) => {
    updateFilters({ sort: value });
    setShowSort(false);
  };

  return (
    <>
      <div className="filter">
        <h1 className="filter__title">Search</h1>

        <div className="filter__search-row">
          <div className="filter__input">
            <img
              className="filter__search-icon"
              src={searchIcon}
              alt="Search"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter name, tag, email..."
              value={query}
              onChange={(event) => updateFilters({ query: event.target.value })}
              onFocus={() => setSearching(true)}
            />
            <button
              type="button"
              className={`filter__sort-btn${sort !== 'createdDate' ? ' filter__sort-btn--active' : ''}`}
              onClick={() => setShowSort(true)}
              aria-label="Sort"
            >
              <img className="filter__sort-icon" src={listIcon} alt="" />
            </button>
          </div>
          {searching && (
            <button
              type="button"
              className="filter__cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>

        <div
          className="filter__tabs"
          role="tablist"
          aria-label="Employee positions"
        >
          {positions.map((item) => (
            <button
              type="button"
              key={item}
              role="tab"
              aria-selected={position === item}
              className={`filter__tab${position === item ? ' filter__tab--active' : ''}`}
              onClick={() => updateFilters({ position: item })}
            >
              {item === 'All' ? item : formatPosition(item, true)}
            </button>
          ))}
        </div>
      </div>

      {showSort && (
        <SortModal
          current={sort}
          onSelect={handleSort}
          onClose={() => setShowSort(false)}
        />
      )}
    </>
  );
}
