import PositionFilter from '../PositionFilter';
import SearchFilter from '../SearchFilter';
import SortFilter from '../SortFilter';
import './index.scss';

export default function EmployeeFilter() {
  return (
    <div className="filter">
      <h1 className="filter__title">Search</h1>
      <SearchFilter>
        <SortFilter />
      </SearchFilter>
      <PositionFilter />
    </div>
  );
}
