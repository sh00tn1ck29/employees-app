import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Employee } from '../../entities/employee/types';
import { formatBirthdayShort, formatPosition } from '../../utils';
import './index.scss';

type Props = {
  emp: Employee;
  showBirthday: boolean;
};

function EmployeeItem({ emp, showBirthday }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const name = `${emp.firstName} ${emp.lastName}`;
  return (
    <button
      type="button"
      className="employee-item"
      onClick={() =>
        navigate({
          pathname: `/employees/${encodeURIComponent(emp.id)}`,
          search: location.search,
        })
      }
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
