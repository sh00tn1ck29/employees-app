import { useLayoutEffect, useRef, useState } from 'react';
import { type SortMode } from '../../entities/employee/types';
import { formatPosition } from '../../utils';
import './index.scss';

const listIcon = '/icons/list.svg';
const searchIcon = '/icons/search.svg';

interface Props {
  query: string;
  dept: string;
  sort: SortMode;
  positions: string[];
  onQueryChange: (q: string) => void;
  onDeptChange: (d: string) => void;
  onSortOpen: () => void;
}

export default function EmployeeFilter({
  query,
  dept,
  sort,
  positions,
  onQueryChange,
  onDeptChange,
  onSortOpen,
}: Props) {
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const tabs = tabsRef.current;
      const activeTab = tabRefs.current.get(dept);
      if (!tabs || !activeTab) return;
      const tabsRect = tabs.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      const left = tabRect.left - tabsRect.left + tabs.scrollLeft;
      const width = tabRect.width;
      setIndicator((current) =>
        current.left === left && current.width === width
          ? current
          : { left, width },
      );
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [dept, positions]);

  const handleCancel = () => {
    onQueryChange('');
    setSearching(false);
    inputRef.current?.blur();
  };

  return (
    <div className="filter">
      <h1 className="filter__title">Search</h1>

      <div className="filter__search-row">
        <div className="filter__input">
          <img className="filter__search-icon" src={searchIcon} alt="Search" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter name, tag, email..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setSearching(true)}
          />
          <button
            type="button"
            className={`filter__sort-btn${sort !== 'createdDate' ? ' filter__sort-btn--active' : ''}`}
            onClick={onSortOpen}
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
        ref={tabsRef}
        className="filter__tabs"
        role="tablist"
        aria-label="Employee positions"
      >
        {positions.map((d) => (
          <button
            type="button"
            key={d}
            ref={(node) => {
              if (node) tabRefs.current.set(d, node);
              else tabRefs.current.delete(d);
            }}
            role="tab"
            aria-selected={dept === d}
            className={`filter__tab${dept === d ? ' filter__tab--active' : ''}`}
            onClick={() => onDeptChange(d)}
          >
            {d === 'All' ? d : formatPosition(d, true)}
          </button>
        ))}
        <span
          className="filter__tab-indicator"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />
      </div>
    </div>
  );
}
