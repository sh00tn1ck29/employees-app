import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import EmployeeFilter from '../../components/EmployeeFilter';
import EmployeeList from '../../components/EmployeeList';
import EmployeeSkeleton from '../../components/EmployeeSkeleton';
import ErrorState from '../../components/ErrorState';
import NoEmployeesFound from '../../components/NoEmployeesFound';
import { getEmployees } from '../../entities/employee/gateways';
import { type Employee, type SortMode } from '../../entities/employee/types';
import { getBirthDateValue } from '../../utils';
import './index.scss';

export default function EmployeesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('searchText') ?? '';
  const position = searchParams.get('position')?.toUpperCase() ?? 'All';
  const sortParam = searchParams.get('sortBy');
  const sort: SortMode =
    sortParam === 'alphabet'
      ? 'alphabet'
      : sortParam === 'birthDate'
        ? 'birthday'
        : 'createdDate';
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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
      <EmployeeFilter />
      {loading ? (
        <EmployeeSkeleton />
      ) : error ? (
        <ErrorState />
      ) : filtered.length === 0 ? (
        <NoEmployeesFound />
      ) : (
        <EmployeeList employees={filtered} sort={sort} onSelect={openProfile} />
      )}
    </div>
  );
}
