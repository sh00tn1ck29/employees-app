import { useSearchParams } from 'react-router-dom';
import { formatPosition } from '../../utils';

const positions = [
  'All',
  'DESIGNER',
  'ANALYST',
  'MANAGER',
  'DEVELOPER',
  'RECRUITER',
];

export default function PositionFilter() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('position')?.toUpperCase() ?? 'All';

  const selectPosition = (value: string) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value === 'All') next.delete('position');
        else next.set('position', value.toLowerCase());
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div
      className="filter__tabs"
      role="tablist"
      aria-label="Employee positions"
    >
      {positions.map((position) => (
        <button
          type="button"
          key={position}
          role="tab"
          aria-selected={selected === position}
          className={`filter__tab${selected === position ? ' filter__tab--active' : ''}`}
          onClick={() => selectPosition(position)}
        >
          {position === 'All' ? position : formatPosition(position, true)}
        </button>
      ))}
    </div>
  );
}
