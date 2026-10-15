import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmployeeFilter from '../../components/EmployeeFilter';
import EmployeeList from '../../components/EmployeeList';
import EmployeeSkeleton from '../../components/EmployeeSkeleton';
import ErrorState from '../../components/ErrorState';
import NoEmployeesFound from '../../components/NoEmployeesFound';
import { getEmployees } from '../../entities/employee/gateways';
import {
  type Employee,
  type EmployeeListEntry,
} from '../../entities/employee/types';
import { getBirthDateValue, getBirthYear } from '../../utils';
import './index.scss';

export default function EmployeesPage() {
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo<EmployeeListEntry[]>(() => {
    const query = (searchParams.get('searchText') ?? '').trim().toLowerCase();
    const position = searchParams.get('position')?.toUpperCase();
    const showBirthday = searchParams.get('sortBy') === 'birthDate';
    const list = employees
      .filter(
        (employee) =>
          (!position || position === 'ALL' || employee.position === position) &&
          (!query ||
            [
              employee.firstName,
              employee.lastName,
              employee.email,
              employee.tag ?? '',
            ].some((value) => value.toLowerCase().includes(query))),
      )
      .sort((a, b) => {
        switch (searchParams.get('sortBy')) {
          case 'alphabet':
            return a.firstName.localeCompare(b.firstName);
          case 'birthDate':
            return (
              getBirthDateValue(a.birthDate) - getBirthDateValue(b.birthDate)
            );
          default:
            return a.createdDate - b.createdDate;
        }
      });

    return list.map((employee, index) => ({
      employee,
      showBirthday,
      dividerYear:
        showBirthday &&
        (index === 0 ||
          getBirthYear(employee.birthDate) !==
            getBirthYear(list[index - 1].birthDate))
          ? getBirthYear(employee.birthDate)
          : undefined,
    }));
  }, [employees, searchParams]);

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
        <EmployeeList employees={filtered} />
      )}
    </div>
  );
}
