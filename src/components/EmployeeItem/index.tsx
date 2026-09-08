import { memo } from 'react';
import { type Employee } from '../../entities/employee/types';
import {
  formatBirthdayShort,
  formatPosition,
  getEmployeeName,
} from '../../utils';
import './index.scss';

interface Props {
  emp: Employee;
  showBirthday: boolean;
  onSelect: (employee: Employee) => void;
}

function EmployeeItem({ emp, showBirthday, onSelect }: Props) {
  const name = getEmployeeName(emp);
  return (
    <button
      type="button"
      className="employee-item"
      onClick={() => onSelect(emp)}
    >
      <img
        className="employee-item__avatar"
        src={emp.avatarUrl}
        alt={name}
        loading="lazy"
        decoding="async"
      />
      <div className="employee-item__info">
        <p className="employee-item__name">
          {name}
          <span className="employee-item__tag">{emp.tag ?? ''}</span>
        </p>
        <p className="employee-item__dept">{formatPosition(emp.position)}</p>
      </div>
      {showBirthday && (
        <span className="employee-item__birthday">
          {formatBirthdayShort(emp.birthDate)}
        </span>
      )}
    </button>
  );
}

export default memo(EmployeeItem);
