import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EmployeeProfile from '../../components/EmployeeProfile';
import ErrorState from '../../components/ErrorState';
import ProfileLoader from '../../components/ProfileLoader';
import { getEmployee } from '../../entities/employee/gateways';
import { type Employee } from '../../entities/employee/types';

export default function EmployeeProfilePage() {
  const { employeeId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEmployee = useCallback(async () => {
    try {
      setEmployee(await getEmployee(employeeId));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    getEmployee(employeeId)
      .then(setEmployee)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [employeeId]);

  const retryLoading = () => {
    setLoading(true);
    setError(false);
    void loadEmployee();
  };

  if (loading) return <ProfileLoader />;

  if (error || !employee) {
    return <ErrorState onRetry={retryLoading} />;
  }

  return (
    <EmployeeProfile
      emp={employee}
      onBack={() => navigate({ pathname: '/', search: location.search })}
    />
  );
}
