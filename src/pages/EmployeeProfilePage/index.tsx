import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EmployeeProfile from '../../components/EmployeeProfile';
import ErrorState from '../../components/ErrorState';
import { getEmployeeById } from '../../entities/employee/gateways';
import { type Employee } from '../../entities/employee/types';

export default function EmployeeProfilePage() {
  const { employeeId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEmployeeById(employeeId)
      .then(setEmployee)
      .catch(() => setError(true));
  }, [employeeId]);

  if (error) return <ErrorState />;
  if (!employee) return null;

  return (
    <EmployeeProfile
      emp={employee}
      onBack={() => navigate({ pathname: '/', search: location.search })}
    />
  );
}
