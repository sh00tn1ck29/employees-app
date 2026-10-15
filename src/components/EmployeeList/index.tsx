import { memo } from 'react';
import { type EmployeeListEntry } from '../../entities/employee/types';
import EmployeeItem from '../EmployeeItem';
import './index.scss';

type Props = {
  employees: EmployeeListEntry[];
};

function EmployeeList({ employees }: Props) {
  return (
    <ul className="employee-list">
      {employees.map(({ employee, showBirthday, dividerYear }) => (
        <li key={employee.id} className="employee-list__item">
          {dividerYear !== undefined && (
            <p className="date-divider">{dividerYear}</p>
          )}
          <EmployeeItem emp={employee} showBirthday={showBirthday} />
        </li>
      ))}
    </ul>
  );
}

export default memo(EmployeeList);
