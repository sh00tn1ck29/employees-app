import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeFilter from '../../components/EmployeeFilter';
import EmployeeList from '../../components/EmployeeList';
import EmployeeSkeleton from '../../components/EmployeeSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import SortModal from '../../components/SortModal';
import { getEmployees } from '../../entities/employee/gateways';
import { type Employee, type SortMode } from '../../entities/employee/types';
import { getBirthDateValue } from '../../utils';
import './index.scss';

const POSITIONS = [
  'All',
  'DESIGNER',
  'ANALYST',
  'MANAGER',
  'DEVELOPER',
  'RECRUITER',
];

function readFilters(search: string) {
  const params = new URLSearchParams(search);
  const requestedSort = params.get('sortBy');
  const sort: SortMode =
    requestedSort === 'alphabet' || requestedSort === 'birthDate'
      ? requestedSort === 'birthDate'
        ? 'birthday'
        : requestedSort
      : 'createdDate';
  const requestedPosition = params.get('position');

  return {
    query: params.get('searchText') ?? '',
    position: requestedPosition ? requestedPosition.toUpperCase() : 'All',
    sort,
  };
}

export default function EmployeesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, position, sort } = useMemo(
    () => readFilters(location.search),
    [location.search],
  );
  const [showSort, setShowSort] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEmployees = useCallback(async () => {
    try {
      setEmployees(await getEmployees());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const retryLoading = () => {
    setLoading(true);
    setError(false);
    void loadEmployees();
  };

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(location.search);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      navigate({ pathname: '/', search: params.toString() }, { replace: true });
    },
    [location.search, navigate],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = employees.filter(
      (employee) => position === 'All' || employee.position === position,
    );

    if (normalizedQuery) {
      list = list.filter((employee) =>
        [
          employee.firstName,
          employee.lastName,
          employee.email,
          employee.tag ?? '',
        ].some((value) => value.toLowerCase().includes(normalizedQuery)),
      );
    }

    if (sort === 'birthday') {
      return list
        .map((employee) => ({
          employee,
          birthDateValue: getBirthDateValue(employee.birthDate),
        }))
        .sort((a, b) => a.birthDateValue - b.birthDateValue)
        .map(({ employee }) => employee);
    }

    return [...list].sort((a, b) => {
      if (sort === 'alphabet') return a.firstName.localeCompare(b.firstName);
      return a.createdDate - b.createdDate;
    });
  }, [employees, position, query, sort]);

  const openProfile = useCallback(
    (employee: Employee) => {
      navigate({
        pathname: `/employees/${encodeURIComponent(employee.id)}`,
        search: location.search,
      });
    },
    [location.search, navigate],
  );

  return (
    <div className="app">
      <EmployeeFilter
        query={query}
        dept={position}
        sort={sort}
        positions={POSITIONS}
        onQueryChange={(value) =>
          updateSearchParams({ searchText: value || null })
        }
        onDeptChange={(value) =>
          updateSearchParams({
            position: value === 'All' ? null : value.toLowerCase(),
          })
        }
        onSortOpen={() => setShowSort(true)}
      />
      {loading ? (
        <EmployeeSkeleton />
      ) : error ? (
        <ErrorState onRetry={retryLoading} />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <EmployeeList employees={filtered} sort={sort} onSelect={openProfile} />
      )}
      {showSort && (
        <SortModal
          current={sort}
          onSelect={(value) => {
            updateSearchParams({
              sortBy:
                value === 'createdDate'
                  ? null
                  : value === 'birthday'
                    ? 'birthDate'
                    : value,
            });
            setShowSort(false);
          }}
          onClose={() => setShowSort(false)}
        />
      )}
    </div>
  );
}
