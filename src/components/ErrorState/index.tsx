import './index.scss';

const errorIcon = '/icons/error.svg';

export default function ErrorState() {
  return (
    <div className="error-state">
      <img className="error-state__icon" src={errorIcon} alt="" />
      <p className="error-state__title">Unexpected error occurred...</p>
      <p className="error-state__message">Try again later</p>
    </div>
  );
}
