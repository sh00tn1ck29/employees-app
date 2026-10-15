import moment from 'moment';

const parseBirthDate = (value: string) =>
  moment(value, 'DD.MM.YYYY', 'en', true);

export function getBirthDateValue(dateStr: string): number {
  return parseBirthDate(dateStr).valueOf();
}

export function getBirthYear(dateStr: string): number {
  return parseBirthDate(dateStr).year();
}

export function getAge(dateStr: string): number {
  return moment().diff(parseBirthDate(dateStr), 'years');
}

export function formatBirthDate(dateStr: string): string {
  return parseBirthDate(dateStr).format('D MMM YYYY');
}

export function formatBirthdayShort(dateStr: string): string {
  return parseBirthDate(dateStr).format('D MMM');
}

export function formatPosition(position: string, plural = false): string {
  const normalized = position.toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return plural && !label.endsWith('s') ? `${label}s` : label;
}
