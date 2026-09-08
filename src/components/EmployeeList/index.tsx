import { memo } from 'react';
import { type Employee, type SortMode } from '../../entities/employee/types';
import { getBirthYear } from '../../utils';
import DateDivider from '../DateDivider';
import EmployeeItem from '../EmployeeItem';
import './index.scss';

interface Props {
  employees: Employee[];
  sort: SortMode;
  onSelect: (emp: Employee) => void;
}

function EmployeeList({ employees, sort, onSelect }: Props) {
  const showBirthday = sort === 'birthday';

  if (sort !== 'birthday') {
    return (
      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp.id} className="employee-list__item">
            <EmployeeItem emp={emp} showBirthday={false} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    );
  }

  const birthYears = employees.map((employee) =>
    getBirthYear(employee.birthDate),
  );

  return (
    <ul className="employee-list">
      {employees.map((emp, index) => {
        const year = birthYears[index];
        const showDivider = index === 0 || year !== birthYears[index - 1];

        return (
          <li key={emp.id} className="employee-list__item">
            {showDivider && <DateDivider year={year} />}
            <EmployeeItem
              emp={emp}
              showBirthday={showBirthday}
              onSelect={onSelect}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default memo(EmployeeList);
